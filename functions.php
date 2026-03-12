<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('editor-styles');
    add_theme_support('custom-logo', [
        'height' => 320,
        'width' => 320,
        'flex-height' => true,
        'flex-width' => true,
        'unlink-homepage-logo' => false,
    ]);
});

add_action('wp_enqueue_scripts', function () {
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('experimento-theme-style', get_stylesheet_uri(), [], $version);

    wp_enqueue_script(
        'experimento-posts-grid',
        get_template_directory_uri() . '/assets/posts-grid.js',
        ['wp-element'],
        $version,
        true
    );

    wp_localize_script('experimento-posts-grid', 'experimentoPostsGrid', [
        'root' => esc_url_raw(rest_url('wp/v2')),
        'homeUrl' => esc_url_raw(home_url('/')),
        'nonce' => wp_create_nonce('wp_rest'),
    ]);
});
