<?php
/**
 * Brio Headless.
 *
 * Everything the Next.js front end needs from WordPress and nothing else:
 * the custom post types, the SCF field groups, the site-settings options
 * page, and the save hook that tells Vercel to drop its cache.
 *
 * Config lives in wp-config.php so it isn't in git:
 *
 *   define( 'BRIO_SITE_URL',          'https://yourbriohealth.com' );
 *   define( 'BRIO_REVALIDATE_SECRET', '...' );   // matches WP_REVALIDATE_SECRET
 */

defined( 'ABSPATH' ) || exit;

define( 'BRIO_THEME_DIR', get_template_directory() );

/**
 * Where the public site lives, or null until the constant is set. No fallback
 * to home_url() — that's this install, so every redirect would loop.
 */
function brio_site_url(): ?string {
	return defined( 'BRIO_SITE_URL' ) ? untrailingslashit( BRIO_SITE_URL ) : null;
}

require_once BRIO_THEME_DIR . '/inc/post-types.php';
require_once BRIO_THEME_DIR . '/inc/options.php';
require_once BRIO_THEME_DIR . '/inc/revalidate.php';
require_once BRIO_THEME_DIR . '/inc/preview.php';
require_once BRIO_THEME_DIR . '/inc/headless.php';

/**
 * Load field groups from acf-json/ and write edits back to it, so the content
 * model stays in git instead of only in the database.
 */
add_filter( 'acf/settings/save_json', fn() => BRIO_THEME_DIR . '/acf-json' );
add_filter( 'acf/settings/load_json', function ( array $paths ): array {
	array_unshift( $paths, BRIO_THEME_DIR . '/acf-json' );
	return $paths;
} );

add_action( 'after_setup_theme', function (): void {
	// The editor still needs these even though we never render a page.
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'caption' ) );
} );

/**
 * Warn in the admin if the pieces this theme depends on aren't there. Easy to
 * miss otherwise — the site just quietly stops updating.
 */
add_action( 'admin_notices', function (): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$missing = array();

	if ( ! function_exists( 'acf_add_options_page' ) ) {
		$missing[] = 'Secure Custom Fields is not active — the page fields and site settings are unavailable.';
	}
	if ( ! defined( 'BRIO_REVALIDATE_SECRET' ) ) {
		$missing[] = 'BRIO_REVALIDATE_SECRET is not defined in wp-config.php — published changes will not appear on the live site until its cache expires.';
	}
	if ( ! defined( 'BRIO_SITE_URL' ) ) {
		$missing[] = 'BRIO_SITE_URL is not defined in wp-config.php.';
	}

	foreach ( $missing as $message ) {
		printf(
			'<div class="notice notice-warning"><p><strong>Brio Headless:</strong> %s</p></div>',
			esc_html( $message )
		);
	}
} );
