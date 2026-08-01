(() => {
  const body = document.body;
  const nav = document.querySelector('[data-site-nav]');
  if (!nav) return;

  const root = body.dataset.root || '.';
  const prefix = root === '.' ? '' : `${root.replace(/\/+$/, '')}/`;
  const href = (path) => `${prefix}${path}`;
  const current = body.dataset.page || '';

  const workGroups = [
    {
      label: 'AI systems & research',
      href: `${href('datascience.html')}#ai-systems`,
      items: [
        { label: 'Unified Memory Hub', href: href('case-studies/memory-hub.html') },
        { label: 'Joint AI Chat', href: href('case-studies/joint-ai-chat.html') },
        { label: 'Ledger + Bulwork', href: href('case-studies/ledger-bulwork.html') },
        { label: 'PCA Workbench', href: href('case-studies/pca-workbench.html') },
        { label: 'WearabLLM', href: href('case-studies/wearabllm.html') },
        { label: 'NemoH Routing Research', href: href('case-studies/nemoh-routing.html') }
      ]
    },
    {
      label: 'Data & interaction',
      href: `${href('datascience.html')}#data-interaction`,
      items: [
        { label: 'Vat Lexicon', href: href('bot-lexicon-portal.html') },
        { label: 'Poetry Graph', href: 'https://github.com/kaiser-factorial/poetry_graph', external: true }
      ]
    },
    {
      label: 'Other work',
      href: `${href('datascience.html')}#other-work`,
      items: [
        { label: 'Catch-Fall', href: href('p5js.html') },
        { label: 'Photography', href: href('photography.html') },
        { label: 'Rate My Professor', href: href('capstone.html') },
        { label: 'Movie Ratings', href: href('project1.html') }
      ]
    }
  ];

  const navItems = [
    { key: 'about', label: 'About', href: href('about.html') },
    { key: 'resume', label: 'Resume', href: href('resume/Corina-Kaiser-Resume-May-2026.pdf'), external: true },
    { key: 'contact', label: 'Contact', href: href('page1contact.html') }
  ];

  nav.innerHTML = `
    <div class="site-nav__inner">
      <a class="site-brand" href="${href('index.html')}" aria-label="Corina Kaiser home">CK<span aria-hidden="true">.</span></a>
      <button class="site-menu-button" type="button" aria-expanded="false" aria-controls="site-menu">
        <span class="site-menu-button__label">Menu</span>
        <span class="site-menu-button__bars" aria-hidden="true"><i></i><i></i></span>
      </button>
      <div class="site-menu" id="site-menu">
        <div class="site-work-menu${current === 'work' ? ' is-current' : ''}">
          <a class="site-menu__link site-work-menu__all${current === 'work' ? ' is-current' : ''}" href="${href('datascience.html')}"${current === 'work' ? ' aria-current="page"' : ''}>Selected work</a>
          <button class="site-work-menu__toggle" type="button" aria-expanded="false" aria-controls="site-work-dropdown" aria-label="Show selected work projects">
            <span class="site-work-menu__chevron" aria-hidden="true"></span>
          </button>
          <div class="site-work-dropdown" id="site-work-dropdown">
            ${workGroups.map((group) => `
              <section class="site-work-dropdown__group">
                <a class="site-work-dropdown__title" href="${group.href}">${group.label} <span aria-hidden="true">→</span></a>
                <div class="site-work-dropdown__links">
                  ${group.items.map((item) => `<a class="site-work-dropdown__link" href="${item.href}"${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${item.label}${item.external ? ' <span aria-hidden="true">↗</span>' : ''}</a>`).join('')}
                </div>
              </section>
            `).join('')}
          </div>
        </div>
        ${navItems.map((item) => `
          <a class="site-menu__link${current === item.key ? ' is-current' : ''}" href="${item.href}"${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}${current === item.key ? ' aria-current="page"' : ''}>${item.label}${item.external ? '<span aria-hidden="true"> ↗</span>' : ''}</a>
        `).join('')}
        <a class="site-menu__github" href="https://github.com/kaiser-factorial" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  `;

  const menuButton = nav.querySelector('.site-menu-button');
  const menu = nav.querySelector('.site-menu');
  const workMenu = nav.querySelector('.site-work-menu');
  const workToggle = nav.querySelector('.site-work-menu__toggle');
  const closeWorkMenu = () => {
    workToggle.setAttribute('aria-expanded', 'false');
    workMenu.classList.remove('is-open');
  };
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    closeWorkMenu();
  };

  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    nav.classList.toggle('is-open', willOpen);
  });

  workToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = workToggle.getAttribute('aria-expanded') !== 'true';
    workToggle.setAttribute('aria-expanded', String(willOpen));
    workMenu.classList.toggle('is-open', willOpen);
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
})();
