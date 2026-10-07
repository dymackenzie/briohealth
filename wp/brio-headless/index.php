<?php
/**
 * WordPress requires this file for a theme to be valid. inc/headless.php
 * redirects front-end requests before they get here, so reaching it means
 * BRIO_SITE_URL is not set.
 */

defined( 'ABSPATH' ) || exit;

if ( brio_site_url() ) {
	wp_redirect( brio_site_url(), 302 );
	exit;
}

wp_die(
	'This install has no front end of its own. Set BRIO_SITE_URL in wp-config.php.',
	'Brio Headless',
	array( 'response' => 503 )
);
