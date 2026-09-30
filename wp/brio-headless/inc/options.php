<?php
/**
 * Site settings: the things the client changes without calling anyone.
 * Phone, address, hours, the Saturday note, the Jane link, the one CTA
 * label, socials, the announcement bar, the default share image.
 *
 * Lives on an SCF options page, which is not a post, so it gets its own
 * REST route. Next reads it at /wp-json/brio/v1/settings, caches it under
 * the `site-settings` tag, and falls back to src/lib/site.ts field by field.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'acf/init', function (): void {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}

	acf_add_options_page( array(
		'page_title'      => 'Site settings',
		'menu_title'      => 'Site settings',
		'menu_slug'       => 'brio-settings',
		'capability'      => 'manage_options',
		'position'        => 20,
		'icon_url'        => 'dashicons-admin-settings',
		'redirect'        => false,
		'autoload'        => true,
		'updated_message' => 'Settings saved. The website picks them up within a minute.',
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
 * Flat on purpose: it mirrors WPSettings in src/lib/wp/types.ts. An empty
 * field is null, never SCF's false or an empty string, so Next falls back
 * to its own copy for exactly that field.
 */
function brio_settings_response(): WP_REST_Response {
	if ( ! function_exists( 'get_field' ) ) {
		return new WP_REST_Response( array( 'error' => 'Secure Custom Fields is not active.' ), 503 );
	}

	$get  = fn( string $name ) => get_field( $name, 'option' );
	$text = fn( string $name ) => brio_text( $get( $name ) );

	$hours = array();
	foreach ( (array) $get( 'hours' ) as $row ) {
		if ( ! is_array( $row ) || empty( $row['days'] ) ) {
			continue;
		}
		$closed  = ! empty( $row['closed'] );
		$hours[] = array(
			'days'   => array_values( array_filter( (array) $row['days'], 'is_string' ) ),
			'opens'  => $closed ? null : brio_time( $row['opens'] ?? null ),
			'closes' => $closed ? null : brio_time( $row['closes'] ?? null ),
			'closed' => $closed,
		);
	}

	$social = array();
	foreach ( (array) $get( 'social' ) as $row ) {
		$href = is_array( $row ) ? brio_text( $row['url'] ?? null ) : null;
		if ( ! $href ) {
			continue;
		}
		$social[] = array(
			'label' => brio_text( $row['label'] ?? null ) ?? '',
			'href'  => $href,
		);
	}

	// Off unless it is switched on and says something; an empty bar is worse
	// than none.
	$announcement = $get( 'announcement' );
	$announcement = is_array( $announcement ) && ! empty( $announcement['enabled'] ) && brio_text( $announcement['text'] ?? null )
		? array(
			'text' => brio_text( $announcement['text'] ),
			'href' => brio_text( $announcement['url'] ?? null ),
		)
		: null;

	return new WP_REST_Response( array(
		'phone'        => $text( 'phone' ),
		'email'        => $text( 'email' ),
		'address'      => array(
			'street'   => $text( 'address_street' ),
			'locality' => $text( 'address_locality' ),
			'region'   => $text( 'address_region' ),
			'postal'   => $text( 'address_postal' ),
			'country'  => $text( 'address_country' ) ?? 'CA',
		),
		'mapUrl'       => $text( 'map_url' ),
		'bookingUrl'   => $text( 'booking_url' ),
		'ctaLabel'     => $text( 'cta_label' ),
		'hours'        => $hours,
		'saturdayNote' => $text( 'saturday_note' ),
		'social'       => $social,
		'announcement' => $announcement,
		'ogImage'      => brio_image_field( $get( 'og_image' ) ),
	) );
}

/** A trimmed string, or null for anything empty (SCF's false included). */
function brio_text( $value ): ?string {
	if ( ! is_string( $value ) ) {
		return null;
	}
	$value = trim( $value );
	return '' === $value ? null : $value;
}

/**
 * 24-hour "10:00", which is what the JSON-LD and the hours table expect,
 * whatever display format the time picker is set to return.
 */
function brio_time( $value ): ?string {
	$value = brio_text( $value );
	if ( null === $value ) {
		return null;
	}
	$time = date_create_immutable( $value, new DateTimeZone( 'UTC' ) );
	return false === $time ? null : $time->format( 'H:i' );
}

/**
 * SCF image fields come back as an array or an ID depending on the field's
 * return format. Normalise to what next/image wants.
 */
function brio_image_field( $value ): ?array {
	if ( is_numeric( $value ) && function_exists( 'acf_get_attachment' ) ) {
		$value = acf_get_attachment( (int) $value );
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
