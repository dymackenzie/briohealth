<?php
/**
 * Site settings — the things the client should be able to change without
 * calling me. Phone, address, hours, socials, the announcement bar.
 *
 * These live on an SCF options page, which isn't a post, so it gets its own
 * REST route. Next reads it at /wp-json/brio/v1/settings and caches it under
 * the `site-settings` tag.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'acf/init', function (): void {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}

	acf_add_options_page( array(
		'page_title' => 'Site settings',
		'menu_title' => 'Site settings',
		'menu_slug'  => 'brio-settings',
		'capability' => 'manage_options',
		'position'   => 20,
		'icon_url'   => 'dashicons-admin-settings',
		'redirect'   => false,
		'autoload'   => true,
		'updated_message' => 'Settings saved. The website will pick them up within a minute.',
	) );
} );

add_action( 'rest_api_init', function (): void {
	register_rest_route( 'brio/v1', '/settings', array(
		'methods'             => WP_REST_Server::READABLE,
		'permission_callback' => '__return_true',
		'callback'            => 'brio_settings_response',
	) );
} );

/**
 * Flat and boring on purpose — it mirrors the `site` object in src/lib/site.ts
 * so swapping the hardcoded constants for this is a straight replacement.
 */
function brio_settings_response(): WP_REST_Response {
	if ( ! function_exists( 'get_field' ) ) {
		return new WP_REST_Response( array( 'error' => 'Secure Custom Fields is not active.' ), 503 );
	}

	$get = fn( string $name ) => get_field( $name, 'option' );

	$hours = array();
	foreach ( (array) $get( 'hours' ) as $row ) {
		if ( empty( $row['days'] ) ) {
			continue;
		}
		$closed = ! empty( $row['closed'] );

		$hours[] = array(
			// A checkbox field, so this is already an array of real day names —
			// the Next side puts them straight into openingHoursSpecification.
			'days'   => array_values( (array) $row['days'] ),
			'opens'  => $closed ? null : ( ( $row['opens'] ?? '' ) ?: null ),
			'closes' => $closed ? null : ( ( $row['closes'] ?? '' ) ?: null ),
			'closed' => $closed,
		);
	}

	$social = array();
	foreach ( (array) $get( 'social' ) as $row ) {
		if ( empty( $row['url'] ) ) {
			continue;
		}
		$social[] = array(
			'label' => $row['label'] ?? '',
			'href'  => $row['url'],
		);
	}

	$announcement = $get( 'announcement' );

	return new WP_REST_Response( array(
		'phone'   => $get( 'phone' ),
		'email'   => $get( 'email' ),
		'address' => array(
			'street'   => $get( 'address_street' ),
			'locality' => $get( 'address_locality' ),
			'region'   => $get( 'address_region' ),
			'postal'   => $get( 'address_postal' ),
			'country'  => $get( 'address_country' ) ?: 'CA',
		),
		'mapUrl'     => $get( 'map_url' ),
		'bookingUrl' => $get( 'booking_url' ),
		'hours'      => $hours,
		'social'     => $social,
		'ogImage'    => brio_image_field( $get( 'og_image' ) ),
		'announcement' => ! empty( $announcement['enabled'] ) ? array(
			'text' => $announcement['text'] ?? '',
			'href' => ( $announcement['url'] ?? '' ) ?: null,
		) : null,
	) );
}

/**
 * SCF image fields come back as a big array or as an ID depending on the
 * field's return format. Normalise to what next/image wants.
 */
function brio_image_field( $value ): ?array {
	if ( is_numeric( $value ) ) {
		$value = acf_get_attachment( $value );
	}
	if ( ! is_array( $value ) || empty( $value['url'] ) ) {
		return null;
	}

	return array(
		'url'    => $value['url'],
		'alt'    => $value['alt'] ?? '',
		'width'  => $value['width'] ?? null,
		'height' => $value['height'] ?? null,
	);
}
