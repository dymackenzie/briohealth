<?php
/**
 * Custom post types, registered in code so they're in git rather than in
 * some plugin's UI.
 *
 * They're not publicly queryable — WordPress never serves these to a visitor.
 * show_in_rest is what matters; the Next front end reads them at
 * /wp-json/wp/v2/<rest_base>.
 *
 * Adding one here is not enough on its own. Next has to know how to render it,
 * and revalidate.php maps the post type name straight through to a cache tag.
 */

defined( 'ABSPATH' ) || exit;

/**
 * The five shapes from the content model. Only `service` and `testimonial`
 * have front-end templates today; the rest are here so the client can start
 * filling them in before those pages exist.
 */
function brio_post_types(): array {
	static $types = null;
	if ( null !== $types ) {
		return $types;
	}

	$types = array(
		'service' => array(
			'singular'  => 'Service',
			'plural'    => 'Services',
			'rest_base' => 'services',
			'icon'      => 'dashicons-heart',
			'supports'  => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
		),
		'program' => array(
			'singular'  => 'Program',
			'plural'    => 'Programs',
			'rest_base' => 'programs',
			'icon'      => 'dashicons-clipboard',
			'supports'  => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
		),
		'team_member' => array(
			'singular'  => 'Team member',
			'plural'    => 'Team',
			'rest_base' => 'team',
			'icon'      => 'dashicons-groups',
			'supports'  => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		),
		'testimonial' => array(
			'singular'  => 'Testimonial',
			'plural'    => 'Testimonials',
			'rest_base' => 'testimonials',
			'icon'      => 'dashicons-format-quote',
			// The quote is a field, not the body — the title is just a label
			// so the admin list is readable.
			'supports'  => array( 'title', 'page-attributes' ),
		),
		'faq' => array(
			'singular'  => 'FAQ',
			'plural'    => 'FAQs',
			'rest_base' => 'faqs',
			'icon'      => 'dashicons-editor-help',
			'supports'  => array( 'title', 'page-attributes' ),
		),
	);

	return $types;
}

add_action( 'init', function (): void {
	foreach ( brio_post_types() as $type => $config ) {
		register_post_type( $type, array(
			'labels' => array(
				'name'               => $config['plural'],
				'singular_name'      => $config['singular'],
				'add_new_item'       => sprintf( 'Add %s', strtolower( $config['singular'] ) ),
				'edit_item'          => sprintf( 'Edit %s', strtolower( $config['singular'] ) ),
				'search_items'       => sprintf( 'Search %s', strtolower( $config['plural'] ) ),
				'not_found'          => sprintf( 'No %s yet', strtolower( $config['plural'] ) ),
				'not_found_in_trash' => sprintf( 'No %s in the trash', strtolower( $config['plural'] ) ),
				'menu_name'          => $config['plural'],
			),

			// public => false, but still editable and still in the API.
			'public'              => false,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'has_archive'         => false,
			'rewrite'             => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'menu_icon'           => $config['icon'],
			'supports'            => $config['supports'],

			'show_in_rest'        => true,
			'rest_base'           => $config['rest_base'],
			'menu_position'       => 21,
		) );
	}
} );

/**
 * Slugs are the URL on the Next side, so they need to be visible and editable
 * even though WordPress itself never routes to them. Without this the slug box
 * is hidden for a non-public post type.
 */
add_filter( 'is_post_type_viewable', function ( bool $viewable, WP_Post_Type $type ): bool {
	return isset( brio_post_types()[ $type->name ] ) ? true : $viewable;
}, 10, 2 );

/**
 * Preview and "View post" would 404 — the front end is a different site and it
 * has no idea about draft content. Point them at the Next page instead.
 */
add_filter( 'post_type_link', function ( string $url, WP_Post $post ): string {
	$paths = array(
		'service' => '/services/',
		'program' => '/programs/',
	);

	if ( isset( $paths[ $post->post_type ] ) ) {
		return brio_site_url() . $paths[ $post->post_type ] . $post->post_name;
	}

	return $url;
}, 10, 2 );
