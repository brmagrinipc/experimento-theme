(() => {
  const { createElement: h, useEffect, useMemo, useState } = wp.element;

  const root = document.getElementById('experimento-posts-grid-root');
  if (!root || !window.experimentoPostsGrid) return;

  const apiBase = window.experimentoPostsGrid.root;

  const decodeHtml = (value = '') => {
    const txt = document.createElement('textarea');
    txt.innerHTML = value;
    return txt.value;
  };

  function App() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      Promise.all([
        fetch(`${apiBase}/categories?per_page=100`).then(r => r.json()),
        fetch(`${apiBase}/tags?per_page=100`).then(r => r.json())
      ])
        .then(([cats, tagList]) => {
          setCategories(Array.isArray(cats) ? cats : []);
          setTags(Array.isArray(tagList) ? tagList : []);
        })
        .catch(() => {});
    }, []);

    useEffect(() => {
      const controller = new AbortController();
      const params = new URLSearchParams({
        per_page: '12',
        _embed: '1'
      });
      if (selectedCategory) params.set('categories', selectedCategory);
      if (selectedTag) params.set('tags', selectedTag);
      if (search.trim()) params.set('search', search.trim());

      setLoading(true);
      setError('');
      fetch(`${apiBase}/posts?${params.toString()}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error('Falha ao carregar posts');
          return response.json();
        })
        .then((data) => setPosts(Array.isArray(data) ? data : []))
        .catch((err) => {
          if (err.name !== 'AbortError') setError('Não foi possível carregar os posts agora.');
        })
        .finally(() => setLoading(false));

      return () => controller.abort();
    }, [selectedCategory, selectedTag, search]);

    const selectedCategoryName = useMemo(() => {
      return categories.find((item) => String(item.id) === String(selectedCategory))?.name || '';
    }, [categories, selectedCategory]);

    const selectedTagName = useMemo(() => {
      return tags.find((item) => String(item.id) === String(selectedTag))?.name || '';
    }, [tags, selectedTag]);

    return h('div', { className: 'posts-explorer-app' }, [
      h('div', { className: 'posts-filters', key: 'filters' }, [
        h('label', { className: 'posts-filter posts-filter-search', key: 'search-label' }, [
          h('span', { key: 'search-text' }, 'Buscar'),
          h('input', {
            key: 'search-input',
            type: 'search',
            value: search,
            placeholder: 'Ex.: OpenClaw, WordPress, SEO',
            onChange: (e) => setSearch(e.target.value)
          })
        ]),
        h('label', { className: 'posts-filter', key: 'cat-label' }, [
          h('span', { key: 'cat-text' }, 'Categoria'),
          h('select', {
            key: 'cat-select',
            value: selectedCategory,
            onChange: (e) => setSelectedCategory(e.target.value)
          }, [
            h('option', { value: '', key: 'all-cats' }, 'Todas'),
            ...categories.map((cat) => h('option', { value: cat.id, key: `cat-${cat.id}` }, `${cat.name} (${cat.count})`))
          ])
        ]),
        h('label', { className: 'posts-filter', key: 'tag-label' }, [
          h('span', { key: 'tag-text' }, 'Tag'),
          h('select', {
            key: 'tag-select',
            value: selectedTag,
            onChange: (e) => setSelectedTag(e.target.value)
          }, [
            h('option', { value: '', key: 'all-tags' }, 'Todas'),
            ...tags.map((tag) => h('option', { value: tag.id, key: `tag-${tag.id}` }, `${tag.name} (${tag.count})`))
          ])
        ]),
        h('button', {
          type: 'button',
          className: 'posts-filter-reset',
          key: 'reset',
          onClick: () => {
            setSearch('');
            setSelectedCategory('');
            setSelectedTag('');
          }
        }, 'Limpar filtros')
      ]),
      h('div', { className: 'posts-active-filters', key: 'active-filters' }, [
        selectedCategoryName ? h('span', { className: 'posts-pill', key: 'cat-pill' }, `Categoria: ${selectedCategoryName}`) : null,
        selectedTagName ? h('span', { className: 'posts-pill', key: 'tag-pill' }, `Tag: ${selectedTagName}`) : null,
        search.trim() ? h('span', { className: 'posts-pill', key: 'search-pill' }, `Busca: ${search.trim()}`) : null
      ]),
      loading ? h('div', { className: 'posts-state', key: 'loading' }, 'Carregando posts...') : null,
      error ? h('div', { className: 'posts-state posts-state-error', key: 'error' }, error) : null,
      !loading && !error && posts.length === 0 ? h('div', { className: 'posts-state', key: 'empty' }, 'Nenhum post encontrado para os filtros atuais.') : null,
      h('div', { className: 'posts-grid', key: 'grid' }, posts.map((post) => {
        const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
        const excerpt = decodeHtml(post.excerpt?.rendered || '').trim();
        const title = decodeHtml(post.title?.rendered || 'Sem título');
        const date = new Date(post.date).toLocaleDateString('pt-BR');
        return h('article', { className: 'post-card', key: `post-${post.id}` }, [
          image ? h('a', { href: post.link, className: 'post-card-image-wrap', key: 'image-link' }, [
            h('img', { src: image, alt: title, className: 'post-card-image', loading: 'lazy' })
          ]) : null,
          h('div', { className: 'post-card-body', key: 'body' }, [
            h('div', { className: 'post-card-meta', key: 'meta' }, date),
            h('h3', { className: 'post-card-title', key: 'title' }, [
              h('a', { href: post.link }, title)
            ]),
            h('p', { className: 'post-card-excerpt', key: 'excerpt' }, excerpt || 'Abra o post para ver o conteúdo completo.'),
            h('a', { href: post.link, className: 'post-card-link', key: 'link' }, 'Ler post completo →')
          ])
        ]);
      }))
    ]);
  }

  wp.element.render(h(App), root);
})();
