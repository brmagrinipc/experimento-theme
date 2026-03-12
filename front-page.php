<?php get_header(); ?>
<div class="site-shell home-shell">
  <section class="hero">
    <?php if (function_exists('the_custom_logo') && has_custom_logo()) : ?>
      <div class="site-logo-wrap"><?php the_custom_logo(); ?></div>
    <?php endif; ?>
    <span class="eyebrow">⚗️ Experimento coletivo no ar</span>
    <h1><?php bloginfo('name'); ?></h1>
    <p><?php bloginfo('description'); ?></p>
    <div class="cta-row">
      <a class="btn btn-primary" href="<?php echo esc_url(admin_url()); ?>">Entrar no painel</a>
      <a class="btn btn-secondary" href="#status">Ver status da instalação</a>
    </div>
    <div class="metrics">
      <div class="metric"><strong>WordPress</strong><span>Instalação dedicada com SSL ativo.</span></div>
      <div class="metric"><strong>Tema próprio</strong><span>Base visual leve e pronta para evoluir.</span></div>
      <div class="metric"><strong>Plugin próprio</strong><span>Funcionalidades iniciais separadas em repositório.</span></div>
    </div>
  </section>

  <?php echo do_blocks('<!-- wp:experimento/posts-explorer {"title":"Explorar posts","description":"Filtre posts por busca, categoria e tag em uma listagem dinâmica alimentada pela REST API do WordPress.","postsPerPage":12,"showSearch":true,"showCategoryFilter":true,"showTagFilter":true} /-->'); ?>

  <section class="section" id="status">
    <span class="badge">Bootstrap inicial</span>
    <h2>Ambiente pronto para crescer</h2>
    <p>O site já sobe com infra dedicada, admins configurados e um plugin customizado para registrar notas públicas do projeto.</p>
    <div class="cards">
      <div class="card">
        <h3>Página inicial</h3>
        <p>Você pode substituir esta landing por blocos, posts, páginas ou qualquer fluxo editorial do WordPress.</p>
      </div>
      <div class="card">
        <h3>Repositórios públicos</h3>
        <p>Tema e plugin ficam versionados separadamente para facilitar evolução, rollback e colaboração.</p>
      </div>
      <div class="card">
        <h3>Status do plugin</h3>
        <div class="experimento-status"><?php echo do_shortcode('[experimento_status]'); ?></div>
      </div>
    </div>
    <div class="footer-note">Experimento • <?php echo esc_html(home_url()); ?></div>
  </section>
</div>
<?php get_footer(); ?>
