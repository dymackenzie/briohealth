<?php
/**
 * Post preview, kept working.
 *
 * The lockdown in headless.php sends every front-end request to the Next site,
 * and Next has no idea about drafts — so out of the box, clicking Preview on
 * an unpublished post lands the writer on a 404. That's the one thing that
 * would make this install feel broken to whoever writes the blog, so previews
 * are rendered here instead, by WordPress, exactly as they were written.
 *
 * It is deliberately not a copy of the live design. It is the post's own
 * words, headings, images and links on a readable page, which is what a
 * preview is actually for. Colours and type follow the site so it doesn't feel
 * like a different product.
 *
 * The better long-term answer is Next draft mode: WordPress hands off to
 * /api/preview on the front end, which fetches the draft over the REST API and
 * renders it in the real templates. That needs an application password stored
 * on Vercel, so it waits until there's a staging endpoint to build against.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Anyone who can edit the post gets the preview. Everyone else falls through
 * to the redirect, so a leaked preview URL still gives nothing away.
 */
function brio_can_preview(): bool {
	// is_preview() only, never is_singular() — an editor browsing a published
	// post should land on the real site like everybody else.
	if ( ! is_preview() ) {
		return false;
	}
	if ( ! is_user_logged_in() ) {
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
	<title>Preview — <?php echo esc_html( get_the_title() ); ?></title>
	<style>
		:root { --teal: #006C75; --deep: #003D42; --canvas: #FAF6EF; --ink: #231F20; --muted: #5A6566; }
		* { box-sizing: border-box; }
		body { margin: 0; background: var(--canvas); color: var(--ink);
			font: 16px/1.7 ui-sans-serif, system-ui, -apple-system, sans-serif; }
		.bar { background: var(--deep); color: var(--canvas); padding: .7rem 1.25rem;
			font-size: .85rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
		.bar strong { font-weight: 600; }
		.bar a { color: inherit; }
		.tag { background: rgb(255 255 255 / .15); border-radius: 999px; padding: .15rem .6rem; }
		main { max-width: 42rem; margin: 0 auto; padding: 2.5rem 1.25rem 5rem; }
		h1 { font: 600 clamp(1.8rem, 4vw, 2.6rem)/1.15 ui-serif, Georgia, serif;
			letter-spacing: -.015em; margin: 0 0 .5rem; }
		.meta { color: var(--muted); font-size: .9rem; margin-bottom: 2rem; }
		h2, h3, h4 { font-family: ui-serif, Georgia, serif; line-height: 1.2; margin: 2em 0 .5em; }
		img { max-width: 100%; height: auto; border-radius: .75rem; }
		a { color: var(--teal); }
		blockquote { border-left: 3px solid var(--teal); margin: 1.5em 0; padding-left: 1.2em;
			font-family: ui-serif, Georgia, serif; font-size: 1.15em; }
		pre { overflow-x: auto; }
		table { width: 100%; border-collapse: collapse; }
		th, td { border: 1px solid rgb(35 31 32 / .15); padding: .5em .7em; text-align: left; }
	</style>
	<?php wp_head(); ?>
</head>
<body>
	<div class="bar">
		<strong>Preview</strong>
		<span class="tag"><?php echo esc_html( $label ); ?></span>
		<span>This page is only visible to you. It shows your words, not the
			site design — the live page uses the Brio layout.</span>
		<a href="<?php echo esc_url( get_edit_post_link( $post ) ); ?>">Back to the editor</a>
	</div>

	<main>
		<h1><?php echo esc_html( get_the_title() ); ?></h1>
		<p class="meta">
			<?php echo esc_html( get_the_date() ); ?>
			<?php if ( get_the_author() ) : ?>
				· <?php echo esc_html( get_the_author() ); ?>
			<?php endif; ?>
		</p>

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
