<?php
/**
 * Post preview, kept working. The lockdown sends every front-end request to
 * the Next site, and Next has no idea about drafts, so previews are rendered
 * here by WordPress: the post's own words, headings, images and links on a
 * readable page. It is deliberately not the live design. The long-term answer
 * is Next draft mode, which needs an application password on Vercel and
 * waits for a staging endpoint.
 */

defined( 'ABSPATH' ) || exit;

function brio_can_preview(): bool {
	if ( ! is_preview() || ! is_user_logged_in() ) {
		return false;
	}
	$id = get_queried_object_id();
	return $id && current_user_can( 'edit_post', $id );
}

function brio_render_preview(): void {
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post ) {
		return;
	}

	the_post();

	$status = get_post_status( $post );
	$label  = 'publish' === $status ? 'Published' : ucfirst( $status );

	?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex, nofollow">
	<title>Preview: <?php echo esc_html( get_the_title() ); ?></title>
	<style>
		:root { --teal: #00919d; --ink: #1c1c1e; --soft: #4a4f50; --grey: #e8eeee; }
		* { box-sizing: border-box; }
		body { margin: 0; background: #fff; color: var(--ink); font: 18px/1.55 ui-sans-serif, system-ui, sans-serif; }
		.bar { background: var(--ink); color: #fff; padding: .7rem 1.25rem; font-size: .9rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
		.bar a { color: inherit; }
		.tag { background: rgb(255 255 255 / .15); border-radius: .5rem; padding: .15rem .6rem; }
		main { max-width: 68ch; margin: 0 auto; padding: 2.5rem 1.25rem 5rem; }
		h1 { font-size: clamp(2rem, 4vw, 2.75rem); line-height: 1.05; letter-spacing: -.02em; margin: 0 0 .5rem; }
		.meta { color: var(--soft); font-size: .95rem; margin-bottom: 2rem; }
		img { max-width: 100%; height: auto; border-radius: .5rem; }
		a { color: #007a85; }
		blockquote { border-left: 2px solid var(--teal); margin: 1.5em 0; padding-left: 1.2em; color: var(--soft); }
		table { width: 100%; border-collapse: collapse; }
		th, td { border-bottom: 1px solid var(--grey); padding: .5em .7em; text-align: left; }
	</style>
	<?php wp_head(); ?>
</head>
<body>
	<div class="bar">
		<strong>Preview</strong>
		<span class="tag"><?php echo esc_html( $label ); ?></span>
		<span>Only you can see this page. It shows your words, not the site design; the live page uses the Brio layout.</span>
		<a href="<?php echo esc_url( get_edit_post_link( $post ) ); ?>">Back to the editor</a>
	</div>
	<main>
		<h1><?php echo esc_html( get_the_title() ); ?></h1>
		<p class="meta"><?php echo esc_html( get_the_date() ); ?></p>
		<?php if ( has_post_thumbnail() ) : ?>
			<p><?php the_post_thumbnail( 'large' ); ?></p>
		<?php endif; ?>
		<?php the_content(); ?>
	</main>
	<?php wp_footer(); ?>
</body>
</html>
	<?php
}
