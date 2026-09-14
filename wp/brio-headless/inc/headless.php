<?php
/**
 * Stops WordPress from serving anything to the public.
 *
 * After the cutover this install answers on cms.yourbriohealth.com and its only
 * jobs are wp-admin and wp-json. Anything else gets sent to the Next site with
 * the path intact, so an old bookmark still lands somewhere useful — proxy.ts
 * on the other end knows what to do with a bare post slug.
 *
 * Hooked at priority 0 so it lands before redirect_canonical, which would
 * otherwise turn /?author=1 into /author/<login>/ and give away a login name.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'template_redirect', function (): void {
	// Preview is the one front-end request that has to keep working. Next has
	// no drafts to show, so WordPress renders it. See inc/preview.php.
	if ( brio_can_preview() ) {
		brio_render_preview();
		exit;
	}

	$site = brio_site_url();
	if ( ! $site ) {
		return; // index.php explains what's missing.
	}

	// The feed moved with everything else.
	if ( is_feed() ) {
		wp_redirect( $site . '/blog/rss.xml', 301 );
		exit;
	}

	wp_redirect( $site . ( $_SERVER['REQUEST_URI'] ?? '/' ), 301 );
	exit;
}, 0 );

/**
 * XML-RPC is a login-bruteforce surface and nothing here uses it.
 */
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'pings_open', '__return_false', 10 );
add_filter( 'wp_headers', function ( array $headers ): array {
	unset( $headers['X-Pingback'] );
	return $headers;
} );

/**
 * REST reads stay public — they already are today, and the front end depends
 * on it. What goes is the user list, which is a free staff directory for
 * anyone scanning for logins. Single-user reads stay, because _embed needs
 * them to put an author name on a post.
 */
add_filter( 'rest_endpoints', function ( array $endpoints ): array {
	if ( is_user_logged_in() ) {
		return $endpoints;
	}

	unset( $endpoints['/wp/v2/users'] );
	return $endpoints;
} );

/**
 * Version numbers in the head and the feed tell a scanner exactly which
 * exploits to try.
 */
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
add_filter( 'the_generator', '__return_empty_string' );

/**
 * Editing theme and plugin files through the browser, on the box that also
 * holds the client's patient-facing site. No.
 */
if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
	define( 'DISALLOW_FILE_EDIT', true );
}

/**
 * Nothing renders a front end, so none of the block or emoji CSS is ever used.
 * Saves the admin a few requests too.
 */
add_action( 'init', function (): void {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
} );

/**
 * The admin bar on the front end has nothing to sit on top of.
 */
add_filter( 'show_admin_bar', '__return_false' );

/**
 * Point "Visit site" and the site title at the real site instead of at this
 * install, so nobody in wp-admin ends up in a redirect loop wondering why.
 */
add_filter( 'admin_bar_menu', function ( WP_Admin_Bar $bar ): void {
	$node = $bar->get_node( 'view-site' );
	if ( $node && brio_site_url() ) {
		$node->href = brio_site_url();
		$node->meta['target'] = '_blank';
		$bar->add_node( (array) $node );
	}
}, 100 );
