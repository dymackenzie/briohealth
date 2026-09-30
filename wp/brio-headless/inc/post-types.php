<?php
/**
 * Custom post types, registered in code so they are in git. Three shapes
 * from the content model: service, testimonial, faq. Programs and Team are
 * deliberately not here; only build them if the client confirms they exist.
 *
 * Not publicly queryable: WordPress never serves these to a visitor.
 * show_in_rest is what matters; Next reads them at /wp-json/wp/v2/<rest_base>.
 */

defined( 'ABSPATH' ) || exit;

function brio_post_types(): array {
	return array(
		'service'     => array(
			'singular'  => 'Service',
			'plural'    => 'Services',
			'rest_base' => 'services',
			'icon'      => 'dashicons-heart',
			'supports'  => array( 'title', 'excerpt', 'page-attributes' ),
		),
		'testimonial' => array(
			'singular'  => 'Testimonial',
			'plural'    => 'Testimonials',
			'rest_base' => 'testimonials',
			'icon'      => 'dashicons-format-quote',
			// The quote is a field, not the body; the title is a label so the
			// admin list is readable.
			'supports'  => array( 'title', 'page-attributes' ),
		),
		'faq'         => array(
			'singular'  => 'FAQ',
			'plural'    => 'FAQs',
			'rest_base' => 'faqs',
			'icon'      => 'dashicons-editor-help',
			'supports'  => array( 'title', 'page-attributes' ),
		),
	);
}

add_action( 'init', function (): void {
	foreach ( brio_post_types() as $type => $config ) {
		register_post_type( $type, array(
			'labels'              => array(
				'name'               => $config['plural'],
				'singular_name'      => $config['singular'],
				'add_new_item'       => sprintf( 'Add %s', strtolower( $config['singular'] ) ),
				'edit_item'          => sprintf( 'Edit %s', strtolower( $config['singular'] ) ),
				'search_items'       => sprintf( 'Search %s', strtolower( $config['plural'] ) ),
				'not_found'          => sprintf( 'No %s yet', strtolower( $config['plural'] ) ),
				'not_found_in_trash' => sprintf( 'No %s in the trash', strtolower( $config['plural'] ) ),
				'menu_name'          => $config['plural'],
			),
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
 * Slugs are the URL on the Next side (/services/<slug>), so the slug box has
 * to be visible even though WordPress never routes to them.
 */
add_filter( 'is_post_type_viewable', function ( bool $viewable, WP_Post_Type $type ): bool {
	return isset( brio_post_types()[ $type->name ] ) ? true : $viewable;
}, 10, 2 );

/**
 * "View post" for a service points at the Next page. With $leavename the
 * slug stays a %postname% placeholder, which is what makes it editable
 * inline under the title.
 */
add_filter( 'post_type_link', function ( string $url, WP_Post $post, bool $leavename = false ): string {
	if ( 'service' === $post->post_type && brio_site_url() ) {
		return brio_site_url() . '/services/' . ( $leavename ? '%postname%' : $post->post_name );
	}
	return $url;
}, 10, 3 );
