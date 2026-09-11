<?php
/**
 * WordPress requires this file for a theme to be valid. Nothing should ever
 * reach it — inc/headless.php redirects front-end requests to the Next site
 * before rendering. If you're looking at this in a browser, that redirect is
 * broken.
 */

defined( 'ABSPATH' ) || exit;

wp_safe_redirect( brio_site_url(), 302 );
exit;
