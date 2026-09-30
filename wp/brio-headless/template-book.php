<?php
/**
 * Template Name: Book
 *
 * Nothing renders this. It exists so the page can be tagged in Page
 * Attributes, which is what selects the Book field group. Binding a field
 * group to a page ID instead would break on the staging clone.
 */

defined( 'ABSPATH' ) || exit;

require get_template_directory() . '/index.php';
