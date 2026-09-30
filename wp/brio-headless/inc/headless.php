<?php
/**
 * Stops WordPress from serving anything to the public. After the cutover
 * this install answers on cms.yourbriohealth.com and its only jobs are
 * wp-admin and wp-json. Anything else goes to the Next site with the path
 * intact; proxy.ts on the other end knows what to do with a bare post slug.
 *
 * REST, wp-admin and wp-login.php never reach template_redirect, so they
 * are untouched by the redirect.
 *
 * Priority 0 so it lands before redirect_canonical, which would otherwise
 * turn /?author=1 into /author/<login>/ and give away a login name.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'template_redirect', function (): void {
	if ( brio_can_preview() ) {
		brio_render_preview();
		exit;
	}

	$site = brio_site_url();
	if ( ! $site ) {
		return; // index.php explains what is missing.
	}

	if ( is_feed() ) {
		wp_redirect( $site . '/blog/rss.xml', 301 );
		exit;
	}

	wp_redirect( $site . ( $_SERVER['REQUEST_URI'] ?? '/' ), 301 );
	exit;
}, 0 );

/** XML-RPC is a login-bruteforce surface and nothing here uses it. */
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'pings_open', '__return_false', 10 );
add_filter( 'wp_headers', function ( array $headers ): array {
	unset( $headers['X-Pingback'] );
	return $headers;
} );

/**
 * REST reads stay public; the front end depends on it. The user list goes:
 * it is a free staff directory for anyone scanning for logins. Single-user
 * reads stay, because _embed needs them for an author name.
 */
add_filter( 'rest_endpoints', function ( array $endpoints ): array {
	if ( is_user_logged_in() ) {
		return $endpoints;
	}
	unset( $endpoints['/wp/v2/users'] );
	return $endpoints;
} );

/**
 * A single-user read still answers anonymously, so it carries the display
 * name and nothing more: the slug is the login name on most installs, and
 * the avatar URL is a hash of the email address.
 */
add_filter( 'rest_prepare_user', function ( WP_REST_Response $response ): WP_REST_Response {
	if ( is_user_logged_in() ) {
		return $response;
	}
	$data = $response->get_data();
	unset( $data['slug'], $data['link'], $data['url'], $data['avatar_urls'] );
	$response->set_data( $data );
	return $response;
} );

remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
add_filter( 'the_generator', '__return_empty_string' );

if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
	define( 'DISALLOW_FILE_EDIT', true );
}

add_action( 'init', function (): void {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
} );

add_filter( 'show_admin_bar', '__return_false' );

/** "Visit site" points at the real site, not at this install. */
add_action( 'admin_bar_menu', function ( WP_Admin_Bar $bar ): void {
	$node = $bar->get_node( 'view-site' );
	if ( $node && brio_site_url() ) {
		$node->href           = brio_site_url();
		$node->meta['target'] = '_blank';
		$bar->add_node( (array) $node );
	}
}, 100 );
