<?php
/**
 * Tells the Next site to drop its cache when something is published.
 *
 * Next holds WordPress responses under cache tags and only revalidates when
 * told. The endpoint checks the shared secret and does nothing else, so a
 * missed call costs a stale page, not correctness. Failures are logged, not
 * surfaced: no editor should see a save fail because Vercel had a bad minute.
 *
 * Contract (src/app/api/revalidate/route.ts): POST, header
 * x-revalidate-secret, JSON body { post_type, slug }. slug may be null.
 */

defined( 'ABSPATH' ) || exit;

/** Types WordPress uses for its own bookkeeping. Never worth a round trip. */
const BRIO_IGNORED_POST_TYPES = array(
	'attachment',
	'revision',
	'nav_menu_item',
	'custom_css',
	'customize_changeset',
	'oembed_cache',
	'user_request',
	'wp_block',
	'wp_global_styles',
	'wp_navigation',
	'wp_template',
	'wp_template_part',
	'acf-field',
	'acf-field-group',
	'acf-post-type',
	'acf-taxonomy',
	'acf-ui-options-page',
);

/**
 * Fires on publish, update and unpublish (trash included). wp_after_insert_post
 * rather than save_post: that one runs before SCF writes its fields, so Next
 * could refetch the old values.
 */
add_action( 'wp_after_insert_post', function ( int $post_id, WP_Post $post, bool $update, ?WP_Post $before ): void {
	$was_live = $before && 'publish' === $before->post_status;
	if ( 'publish' !== $post->post_status && ! $was_live ) {
		return;
	}
	if ( in_array( $post->post_type, BRIO_IGNORED_POST_TYPES, true ) ) {
		return;
	}
	if ( wp_is_post_autosave( $post ) || wp_is_post_revision( $post ) ) {
		return;
	}

	brio_revalidate( $post->post_type, brio_live_slug( $post ) );
}, 10, 4 );

/**
 * A permanent delete that skips the trash also skips wp_after_insert_post.
 * Anything deleted from the trash was already revalidated when it was
 * trashed, so only a post that was still live needs a call here.
 */
add_action( 'deleted_post', function ( int $id, WP_Post $post ): void {
	if ( 'publish' !== $post->post_status ) {
		return;
	}
	if ( in_array( $post->post_type, BRIO_IGNORED_POST_TYPES, true ) ) {
		return;
	}
	brio_revalidate( $post->post_type, brio_live_slug( $post ) );
}, 10, 2 );

/**
 * The slug the page was served under. Trashing renames `foo` to
 * `foo__trashed` before the hooks fire; the meta WordPress leaves behind is
 * the reliable source, and the suffix strip covers a permanent delete.
 */
function brio_live_slug( WP_Post $post ): ?string {
	$desired = get_post_meta( $post->ID, '_wp_desired_post_slug', true );
	if ( is_string( $desired ) && '' !== $desired ) {
		return $desired;
	}
	return preg_replace( '/__trashed(-\d+)?$/', '', $post->post_name ) ?: null;
}

/** The options page is not a post. 'site-settings' matches the Next tag. */
add_action( 'acf/save_post', function ( $post_id ): void {
	if ( 'options' === $post_id ) {
		brio_revalidate( 'site-settings', null );
	}
}, 20 );

/** Categories are wayfinding on the blog index; a rename must reach it. */
foreach ( array( 'created_category', 'edited_category', 'delete_category' ) as $hook ) {
	add_action( $hook, fn() => brio_revalidate( 'post', null ) );
}

/**
 * Queues a call for the end of the request. Saving a post trips several
 * hooks at once and the block editor saves in two requests, so calls are
 * keyed and sent once each, after the editor already has their response.
 */
function brio_revalidate( string $post_type, ?string $slug ): void {
	if ( ! defined( 'BRIO_REVALIDATE_SECRET' ) || ! brio_site_url() ) {
		return;
	}

	static $queue = null;
	if ( null === $queue ) {
		$queue = array();
		// Late, so every other shutdown hook has written its output first.
		add_action( 'shutdown', function () use ( &$queue ): void {
			brio_send_revalidations( $queue );
		}, PHP_INT_MAX );
	}

	$queue[ $post_type . '|' . (string) $slug ] = array(
		'post_type' => $post_type,
		'slug'      => $slug,
	);
}

/**
 * Fire and forget. On PHP-FPM (Plesk's default) the response goes back to
 * the browser before the first request leaves, so a slow or dead Vercel
 * never holds up a save. Without FPM the save waits at most the timeout.
 */
function brio_send_revalidations( array $payloads ): void {
	if ( ! $payloads ) {
		return;
	}

	if ( function_exists( 'fastcgi_finish_request' ) ) {
		fastcgi_finish_request();
	} elseif ( function_exists( 'litespeed_finish_request' ) ) {
		litespeed_finish_request();
	}

	foreach ( $payloads as $key => $payload ) {
		$response = wp_remote_post( brio_site_url() . '/api/revalidate', array(
			'timeout' => 3,
			'headers' => array(
				'Content-Type'        => 'application/json',
				'x-revalidate-secret' => BRIO_REVALIDATE_SECRET,
			),
			'body'    => wp_json_encode( $payload ),
		) );

		if ( is_wp_error( $response ) ) {
			error_log( sprintf( '[brio] revalidate failed for %s: %s', $key, $response->get_error_message() ) );
			continue;
		}

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code < 200 || $code >= 300 ) {
			error_log( sprintf( '[brio] revalidate returned %d for %s', $code, $key ) );
		}
	}
}
