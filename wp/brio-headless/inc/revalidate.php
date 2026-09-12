<?php
/**
 * Tells the Next site to drop its cache when something is published.
 *
 * Next holds WordPress responses under cache tags and only revalidates when
 * it's told to. Without this hook an editor hits Publish and waits an hour,
 * which is exactly the complaint that gets a headless site torn out again.
 *
 * The endpoint checks the shared secret and does nothing else, so a missed
 * call costs a stale page, not correctness. Failures are logged, not surfaced
 * — no editor should see a save fail because Vercel had a bad minute.
 */

defined( 'ABSPATH' ) || exit;

/** Types WordPress uses for its own bookkeeping. Never worth a round trip. */
const BRIO_IGNORED_POST_TYPES = array(
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
);

/**
 * Fires on publish, on update, and on unpublish — the last one matters as much
 * as the first, since a page pulled down should stop being served.
 */
add_action( 'transition_post_status', function ( string $new, string $old, WP_Post $post ): void {
	if ( 'publish' !== $new && 'publish' !== $old ) {
		return;
	}
	if ( in_array( $post->post_type, BRIO_IGNORED_POST_TYPES, true ) ) {
		return;
	}
	if ( wp_is_post_autosave( $post ) || wp_is_post_revision( $post ) ) {
		return;
	}

	brio_revalidate( $post->post_type, brio_live_slug( $post ) );
}, 10, 3 );

/**
 * Deleting straight out of the trash skips transition_post_status.
 */
add_action( 'deleted_post', function ( int $id, WP_Post $post ): void {
	if ( in_array( $post->post_type, BRIO_IGNORED_POST_TYPES, true ) ) {
		return;
	}

	brio_revalidate( $post->post_type, brio_live_slug( $post ) );
}, 10, 2 );

/**
 * The slug the page was served under, which is not always the slug on the post.
 *
 * Trashing renames `foo` to `foo__trashed` before transition_post_status fires,
 * so the raw name busts a tag nothing was ever cached under and the deleted
 * page keeps being served until its own revalidate window runs out. The meta
 * WordPress leaves behind is the reliable source; the suffix strip covers a
 * permanent delete, where the meta has already gone with the post.
 */
function brio_live_slug( WP_Post $post ): ?string {
	$desired = get_post_meta( $post->ID, '_wp_desired_post_slug', true );
	if ( is_string( $desired ) && '' !== $desired ) {
		return $desired;
	}

	return preg_replace( '/__trashed(-\d+)?$/', '', $post->post_name ) ?: null;
}

/**
 * The options page isn't a post, so it has its own hook. 'site-settings'
 * matches the tag name on the Next side.
 */
add_action( 'acf/save_post', function ( $post_id ): void {
	if ( 'options' === $post_id ) {
		brio_revalidate( 'site-settings', null );
	}
}, 20 );

/**
 * Categories are rendered as wayfinding on the blog index, so a rename or a
 * merge needs to reach the front end too.
 */
foreach ( array( 'created_category', 'edited_category', 'delete_category' ) as $hook ) {
	add_action( $hook, fn() => brio_revalidate( 'post', null ) );
}

function brio_revalidate( string $post_type, ?string $slug ): void {
	if ( ! defined( 'BRIO_REVALIDATE_SECRET' ) ) {
		return;
	}

	// One call per request. Saving a post can trip several of these hooks at
	// once and they'd all bust the same tags.
	static $sent = array();
	$key = $post_type . '|' . (string) $slug;
	if ( isset( $sent[ $key ] ) ) {
		return;
	}
	$sent[ $key ] = true;

	$response = wp_remote_post( brio_site_url() . '/api/revalidate', array(
		'timeout'  => 5,
		'headers'  => array(
			'Content-Type'        => 'application/json',
			'x-revalidate-secret' => BRIO_REVALIDATE_SECRET,
		),
		'body'     => wp_json_encode( array(
			'post_type' => $post_type,
			'slug'      => $slug,
		) ),
	) );

	if ( is_wp_error( $response ) ) {
		error_log( '[brio] revalidate failed: ' . $response->get_error_message() );
		return;
	}

	$code = wp_remote_retrieve_response_code( $response );
	if ( $code < 200 || $code >= 300 ) {
		error_log( sprintf( '[brio] revalidate returned %d for %s', $code, $key ) );
	}
}
