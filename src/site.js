(() => {
  const track = (eventName, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
  };

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      track(open ? 'menu_open' : 'menu_close');
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => track(element.dataset.track, { href: element.getAttribute('href') || '' }));
  });

  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    const regionSelect = form.querySelector('[data-region-select]');
    const submitButton = form.querySelector('button[type="submit"]');
    const placeField = form.querySelector('[data-place]');
    const status = form.querySelector('[data-form-status]');
    const frame = form.getAttribute('target');
    const endpoints = window.GOWEDDING_FORM_ENDPOINTS || {};

    const updateAction = () => {
      if (!regionSelect) return;
      const key = regionSelect.value;
      const endpointKey = regionSelect.selectedOptions?.[0]?.dataset.form || key;
      if (endpoints[endpointKey]) form.action = endpoints[endpointKey];
      form.dataset.selectedRegion = key;
    };
    updateAction();
    regionSelect?.addEventListener('change', updateAction);

    form.addEventListener('submit', () => {
      updateAction();
      const regionLabel = regionSelect?.selectedOptions?.[0]?.textContent?.trim();
      if (placeField && regionLabel && !placeField.value.includes(regionLabel)) {
        placeField.value = [placeField.value.trim(), regionLabel].filter(Boolean).join(' · ');
      }
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando…';
      }
      if (status) status.textContent = 'Estamos enviando vuestra solicitud…';
      track('lead_form_submit', { region: form.dataset.selectedRegion || 'sin-especificar' });
      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Enviar solicitud';
        }
        if (status) status.textContent = '';
        openModal();
      }, 1300);
    });

    if (frame) {
      const iframe = document.querySelector(`iframe[name="${frame}"]`);
      iframe?.addEventListener('load', () => {
        // Google Forms can fire load after a successful post. The timeout above
        // keeps the feedback reliable even when browsers block cross-origin events.
      });
    }
  });

  const modal = document.querySelector('[data-success-modal]');
  const openModal = () => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    track('lead_form_success');
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };
  window.openGoWeddingModal = openModal;
  window.closeGoWeddingModal = closeModal;
  modal?.querySelectorAll('[data-modal-close]').forEach((element) => element.addEventListener('click', closeModal));
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

  const backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    const toggleBackTop = () => backTop.classList.toggle('visible', window.scrollY > 600);
    window.addEventListener('scroll', toggleBackTop, { passive: true });
    toggleBackTop();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('[data-print]').forEach((button) => button.addEventListener('click', () => window.print()));
})();
