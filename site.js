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
          { label: 'Joint Session', href: href('case-studies/joint-ai-chat.html') },
          { label: 'Ledger + Bulwork', href: href('case-studies/ledger-bulwork.html') },
          { label: 'NemoH Routing Research', href: href('case-studies/nemoh-routing.html') }
        ]
      },
    {
      label: 'Physical computing & wearables',
      href: `${href('datascience.html')}#physical-computing`,
      items: [
        { label: 'Jacket Link', href: href('case-studies/jacket-link.html') },
        { label: 'WearabLLM', href: href('case-studies/wearabllm.html') },
        { label: 'Pixel Chase', href: href('case-studies/pixel-chase.html') }
      ]
    },
    {
      label: 'Data & interaction',
      href: `${href('datascience.html')}#data-interaction`,
      items: [
        { label: 'Scatter Lab', href: href('case-studies/pca-workbench.html') },
        { label: 'Vat Lexicon', href: href('bot-lexicon-portal.html') },
        { label: 'Rate My Professor Analysis', href: href('capstone.html') },
        { label: 'Movie Ratings Hypothesis Testing', href: href('project1.html') }
      ]
    },
    {
      label: 'Creative & artistic work',
      href: `${href('datascience.html')}#creative-work`,
      items: [
        { label: 'Poetry Graph', href: 'https://poetry-graph.vercel.app/workspace.html', external: true },
        { label: 'Catch-Fall', href: href('p5js.html') },
        { label: 'Photography', href: href('photography.html') }
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

  const practiceSelector = document.querySelector('[data-practice-selector]');
  const desktopEvidence = document.querySelector('[data-home-evidence]');
  const mobileEvidence = document.querySelector('[data-home-evidence-mobile]');

  if (practiceSelector && desktopEvidence && mobileEvidence) {
    const practiceTopics = [...practiceSelector.querySelectorAll('[data-practice]')];
    const practiceEvidence = {
      systems: {
        label: 'Systems',
        skills: ['Python & service design', 'SQLite / FTS retrieval', 'Auth & realtime state'],
        projects: [
          { label: 'Unified Memory Hub', href: href('case-studies/memory-hub.html') },
          { label: 'Joint Session', href: href('case-studies/joint-ai-chat.html') },
          { label: 'Ledger + Bulwork', href: href('case-studies/ledger-bulwork.html') }
        ]
      },
      research: {
        label: 'Research',
        skills: ['Representation engineering', 'Mechanistic interpretability', 'Routing & activation analysis'],
        projects: [
          { label: 'NemoH Routing Research', href: href('case-studies/nemoh-routing.html') }
        ]
      },
      interfaces: {
        label: 'Interfaces',
        skills: ['React interface design', 'Physical computing', 'Interactive visualization'],
        projects: [
          { label: 'Jacket Link', href: href('case-studies/jacket-link.html') },
          { label: 'WearabLLM', href: href('case-studies/wearabllm.html') },
          { label: 'Ledger + Bulwork', href: href('case-studies/ledger-bulwork.html') },
          { label: 'Vat Lexicon', href: href('bot-lexicon-portal.html') }
        ]
      },
      analysis: {
        label: 'Data analysis',
        skills: ['PCA & clustering', 'Statistical modeling', 'Experimental design'],
        projects: [
          { label: 'Scatter Lab', href: href('case-studies/pca-workbench.html') },
          { label: 'Rate My Professor Analysis', href: href('capstone.html') },
          { label: 'Movie Ratings Hypothesis Testing', href: href('project1.html') }
        ]
      }
    };
    let activeTopic = null;
    let pinnedTopic = null;

    const evidenceMarkup = (topic) => {
      const evidence = practiceEvidence[topic];
      const skills = evidence.skills.map((skill) => `<li>${skill}</li>`).join('');
      const projects = evidence.projects.map((project) => `<li><a href="${project.href}">${project.label} <span aria-hidden="true">→</span></a></li>`).join('');
      return `
        <p class="home-evidence__eyebrow">In practice</p>
        <h2 class="home-evidence__title">${evidence.label}</h2>
        <div class="home-evidence__columns">
          <section class="home-evidence__column" aria-label="Skills">
            <p class="home-evidence__label">Skills</p>
            <ul class="home-evidence__list">${skills}</ul>
          </section>
          <section class="home-evidence__column home-evidence__projects" aria-label="Projects">
            <p class="home-evidence__label">Projects</p>
            <ul class="home-evidence__list">${projects}</ul>
          </section>
        </div>`;
    };

    const renderEvidence = () => {
      const visible = Boolean(activeTopic);
      const content = visible ? evidenceMarkup(activeTopic) : '';
      [desktopEvidence, mobileEvidence].forEach((panel) => {
        panel.classList.toggle('is-visible', visible);
        panel.setAttribute('aria-hidden', String(!visible));
        if (visible) panel.innerHTML = content;
      });
      practiceTopics.forEach((topicButton) => {
        const topic = topicButton.dataset.practice;
        topicButton.classList.toggle('is-active', topic === activeTopic);
        topicButton.setAttribute('aria-expanded', String(topic === activeTopic));
        topicButton.setAttribute('aria-pressed', String(topic === pinnedTopic));
      });
      if (visible) {
        const activeButton = practiceTopics.find((topicButton) => topicButton.dataset.practice === activeTopic);
        if (activeButton) activeButton.insertAdjacentElement('afterend', mobileEvidence);
      }
    };

    const previewEvidence = (topic) => {
      if (pinnedTopic) return;
      activeTopic = topic;
      renderEvidence();
    };

    const clearEvidence = () => {
      if (pinnedTopic) return;
      activeTopic = null;
      renderEvidence();
    };

    practiceTopics.forEach((topicButton) => {
      const topic = topicButton.dataset.practice;
      topicButton.addEventListener('pointerenter', () => previewEvidence(topic));
      topicButton.addEventListener('pointerleave', () => {
        if (document.activeElement !== topicButton) clearEvidence();
      });
      topicButton.addEventListener('focus', () => previewEvidence(topic));
      topicButton.addEventListener('blur', () => {
        window.setTimeout(() => {
          const focus = document.activeElement;
          if (!pinnedTopic && !practiceSelector.contains(focus) && !desktopEvidence.contains(focus)) clearEvidence();
        }, 0);
      });
      topicButton.addEventListener('click', () => {
        if (pinnedTopic === topic) {
          pinnedTopic = null;
          activeTopic = null;
          renderEvidence();
          return;
        }
        pinnedTopic = topic;
        activeTopic = topic;
        renderEvidence();
      });
    });

    document.addEventListener('click', (event) => {
      if (!pinnedTopic) return;
      if (!practiceSelector.contains(event.target) && !desktopEvidence.contains(event.target)) {
        pinnedTopic = null;
        activeTopic = null;
        renderEvidence();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !activeTopic) return;
      pinnedTopic = null;
      activeTopic = null;
      renderEvidence();
    });
  }

  const zoomableImages = [
    ...document.querySelectorAll('body.site-page .case-media img, body.site-page .portal-visual img')
  ];

  if (zoomableImages.length) {
    const mediaModal = document.createElement('div');
    mediaModal.className = 'media-modal';
    mediaModal.hidden = true;
    mediaModal.setAttribute('aria-hidden', 'true');
    mediaModal.innerHTML = `
      <div class="media-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="media-modal-caption" tabindex="-1">
        <button class="media-modal__close" type="button" aria-label="Close enlarged image">Close <span aria-hidden="true">×</span></button>
        <figure class="media-modal__figure">
          <img class="media-modal__image" src="" alt="">
          <figcaption id="media-modal-caption" class="media-modal__caption"></figcaption>
        </figure>
      </div>`;
    document.body.append(mediaModal);

    const closeButton = mediaModal.querySelector('.media-modal__close');
    const modalImage = mediaModal.querySelector('.media-modal__image');
    const modalCaption = mediaModal.querySelector('.media-modal__caption');
    let opener = null;

    const closeMediaModal = () => {
      if (mediaModal.hidden) return;
      mediaModal.hidden = true;
      mediaModal.setAttribute('aria-hidden', 'true');
      body.classList.remove('has-media-modal');
      if (opener) opener.focus();
    };

    const openMediaModal = (image) => {
      opener = image;
      modalImage.src = image.currentSrc || image.src;
      modalImage.alt = image.alt;
      const caption = image.closest('figure')?.querySelector('figcaption')?.textContent?.trim();
      modalCaption.textContent = caption || image.alt || 'Enlarged project image';
      mediaModal.hidden = false;
      mediaModal.setAttribute('aria-hidden', 'false');
      body.classList.add('has-media-modal');
      closeButton.focus();
    };

    zoomableImages.forEach((image) => {
      const label = image.alt ? `Enlarge image: ${image.alt}` : 'Enlarge project image';
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-haspopup', 'dialog');
      image.setAttribute('aria-label', label);
      image.addEventListener('click', () => openMediaModal(image));
      image.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openMediaModal(image);
      });
    });

    closeButton.addEventListener('click', closeMediaModal);
    mediaModal.addEventListener('click', (event) => {
      if (event.target === mediaModal) closeMediaModal();
    });
    mediaModal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      closeButton.focus();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMediaModal();
    });
  }

  const diagramButtons = [...document.querySelectorAll('[data-diagram-src]')];

  if (diagramButtons.length) {
    const diagramModal = document.createElement('div');
    diagramModal.className = 'diagram-modal';
    diagramModal.hidden = true;
    diagramModal.setAttribute('aria-hidden', 'true');
    diagramModal.innerHTML = `
      <div class="diagram-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="diagram-modal-caption" tabindex="-1">
        <button class="media-modal__close" type="button" aria-label="Close enlarged diagram">Close <span aria-hidden="true">×</span></button>
        <iframe class="diagram-modal__frame" src="" title=""></iframe>
        <p id="diagram-modal-caption" class="diagram-modal__caption"></p>
      </div>`;
    document.body.append(diagramModal);

    const closeDiagramButton = diagramModal.querySelector('.media-modal__close');
    const diagramFrame = diagramModal.querySelector('.diagram-modal__frame');
    const diagramCaption = diagramModal.querySelector('.diagram-modal__caption');
    let diagramOpener = null;

    const closeDiagramModal = () => {
      if (diagramModal.hidden) return;
      diagramModal.hidden = true;
      diagramModal.setAttribute('aria-hidden', 'true');
      diagramFrame.src = '';
      body.classList.remove('has-diagram-modal');
      if (diagramOpener) diagramOpener.focus();
    };

    const openDiagramModal = (button) => {
      diagramOpener = button;
      const figure = button.closest('figure');
      diagramFrame.src = button.dataset.diagramSrc;
      diagramFrame.title = button.getAttribute('aria-label')?.replace('Open the ', '').replace(' in full screen', '') || 'Enlarged diagram';
      diagramCaption.textContent = figure?.querySelector('figcaption')?.textContent?.trim() || 'Enlarged project diagram';
      diagramModal.hidden = false;
      diagramModal.setAttribute('aria-hidden', 'false');
      body.classList.add('has-diagram-modal');
      closeDiagramButton.focus();
    };

    diagramButtons.forEach((button) => {
      button.addEventListener('click', () => openDiagramModal(button));
    });

    closeDiagramButton.addEventListener('click', closeDiagramModal);
    diagramModal.addEventListener('click', (event) => {
      if (event.target === diagramModal) closeDiagramModal();
    });
    diagramModal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      closeDiagramButton.focus();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDiagramModal();
    });
  }
})();
