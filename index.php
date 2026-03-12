<?php
get_header();
if (have_posts()) {
    echo '<main class="site-shell section single-shell">';
    echo '<a class="back-home-link" href="' . esc_url(home_url('/')) . '">← Voltar para a home</a>';
    while (have_posts()) {
        the_post();
        echo '<article>';
        the_title('<h1>', '</h1>');
        the_content();
        echo '</article>';
    }
    echo '</main>';
}
get_footer();
