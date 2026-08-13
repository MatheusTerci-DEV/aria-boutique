Exit code: 0
Wall time: 2.6 seconds
Output:
(function () {
  "use strict";

  const config = window.STORE_CONFIG;
  const products = window.PRODUCTS;
  const storageKeys = {
    cart: "aria-boutique-cart-v1",
    favorites: "aria-boutique-favorites-v1"
  };

  const state = {
    category: "todos",
    query: "",
    sort: "novidades",
    favoritesOnly: false,
    favorites: new Set(readStorage(storageKeys.favorites, [])),
    cart: readStorage(storageKeys.cart, []),
    activeProduct: null,
    lastFocused: null,
    cartLastFocused: null,
    menuLastFocused: null,
    filterLastFocused: null,
    promoLastFocused: null,
    modalScrollY: 0,
    cartScrollY: 0,
    menuScrollY: 0,
    filterScrollY: 0,
    promoScrollY: 0,
    pendingMenuScrollY: null,
    pendingFilterScrollY: null,
    pendingCartScrollY: null,
    pendingModalScrollY: null
  };

  const elements = {
    grid: document.querySelector("#product-grid"),
    empty: document.querySelector("#empty-state"),
    status: document.querySelector("#catalog-status"),
    searchForm: document.querySelector("#search-form"),
    searchInput: document.querySelector("#search-input"),
    sort: document.querySelector("#sort-select"),
    favoritesButton: document.querySelector("#favorites-button"),
    favoritesCount: document.querySelector("#favorites-count"),
    cartButton: document.querySelector("#cart-button"),
    cartCount: document.querySelector("#cart-count"),
    cartDrawer: document.querySelector("#cart-drawer"),
    cartClose: document.querySelector("#cart-close"),
    cartItems: document.querySelector("#cart-items"),
    cartSubtotal: document.querySelector("#cart-subtotal"),
    checkoutButton: document.querySelector("#checkout-button"),
    overlay: document.querySelector("#drawer-overlay"),
    menuToggle: document.querySelector(".menu-toggle"),
    primaryNav: document.querySelector("#primary-nav"),
    menuClose: document.querySelector("#mobile-nav-close"),
    navOverlay: document.querySelector("#nav-overlay"),
    filterOpen: document.querySelector("#filter-open"),
    filterClose: document.querySelector("#filter-close"),
    filterApply: document.querySelector("#filter-apply"),
    filterPanel: document.querySelector("#filter-panel"),
    filterOverlay: document.querySelector("#filter-overlay"),
    filterSummary: document.querySelector("#filter-summary"),
    promo: document.querySelector("#promo-dialog"),
    promoClose: document.querySelector("#promo-close"),
    promoContinue: document.querySelector("#promo-continue"),
    promoWhatsapp: document.querySelector("#promo-whatsapp"),
    modal: document.querySelector("#quick-view"),
    modalClose: document.querySelector("#modal-close"),
    productForm: document.querySelector("#product-options-form"),
    toast: document.querySelector("#toast"),
    clearFilters: document.querySelector("#clear-filters")
  };

  const icons = {
    heart: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/></svg>',
    eye: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    minus: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    plus: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/></svg>'
  };

  function readStorage(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      showToast("NÃ£o foi possÃ­vel salvar a seleÃ§Ã£o neste navegador.");
    }
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  function normalizeText(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  function getVisibleProducts() {
    const query = normalizeText(state.query);
    const visible = products.filter((product) => {
      const matchesCategory = state.category === "todos" || product.category === state.category;
      const searchable = normalizeText(`${product.name} ${product.subtitle} ${product.categoryLabel}`);
      const matchesQuery = !query || searchable.includes(query);
      const matchesFavorites = !state.favoritesOnly || state.favorites.has(product.id);
      return matchesCategory && matchesQuery && matchesFavorites;
    });

    return visible.sort((a, b) => {
      if (state.sort === "menor-preco") return a.price - b.price;
      if (state.sort === "maior-preco") return b.price - a.price;
      return b.order - a.order;
    });
  }

  function renderProducts() {
    const visible = getVisibleProducts();
    elements.grid.innerHTML = visible.map((product, index) => {
      const favorite = state.favorites.has(product.id);
      return `
        <article class="product-card" style="--card-index:${index}">
          <div class="product-media">
            <button class="product-image-button" type="button" data-action="quick-view" data-id="${product.id}" aria-label="VisualizaÃ§Ã£o rÃ¡pida de ${product.name}">
              <img src="${product.image}" alt="${product.alt}" loading="${index > 3 ? "lazy" : "eager"}" style="--object-position:${product.position || "center top"}">
            </button>
            <span class="product-badge">Novo</span>
            <button class="favorite-button${favorite ? " is-favorite" : ""}" type="button" data-action="favorite" data-id="${product.id}" aria-label="${favorite ? "Remover" : "Adicionar"} ${product.name} ${favorite ? "dos" : "aos"} favoritos" aria-pressed="${favorite}">
              ${icons.heart}
            </button>
            <button class="quick-view-trigger" type="button" data-action="quick-view" data-id="${product.id}">${icons.eye}<span>VisualizaÃ§Ã£o rÃ¡pida</span></button>
          </div>
          <div class="product-info">
            <p>${product.categoryLabel}</p>
            <button type="button" data-action="quick-view" data-id="${product.id}">${product.name}</button>
            <span>${formatPrice(product.price)}</span>
            <small>ou ${config.payment.installments}x de ${formatPrice(product.price / config.payment.installments)}</small>
          </div>
        </article>`;
    }).join("");

    elements.empty.hidden = visible.length !== 0;
    elements.status.textContent = `${visible.length} ${visible.length === 1 ? "peÃ§a encontrada" : "peÃ§as encontradas"}${state.favoritesOnly ? " nos favoritos" : ""}.`;
  }

  function setCategory(category) {
    state.category = category;
    state.favoritesOnly = false;
    elements.favoritesButton.setAttribute("aria-pressed", "false");
    document.querySelectorAll(".filter-pill").forEach((button) => {
      const active = button.dataset.category === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateFilterSummary();
    renderProducts();
  }

  function updateFilterSummary() {
    const categoryButton = document.querySelector(`.filter-pill[data-category="${state.category}"]`);
    const selectedOption = elements.sort.options[elements.sort.selectedIndex];
    elements.filterSummary.textContent = `${categoryButton ? categoryButton.textContent : "Todos"} Â· ${selectedOption ? selectedOption.textContent : "Novidades"}`;
  }

  function toggleFavorite(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    if (state.favorites.has(productId)) {
      state.favorites.delete(productId);
      showToast(`${product.name} removido dos favoritos.`);
    } else {
      state.favorites.add(productId);
      showToast(`${product.name} salvo nos favoritos.`);
    }
    saveStorage(storageKeys.favorites, [...state.favorites]);
    updateCounts();
    renderProducts();
  }

  function openQuickView(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    state.activeProduct = product;
    state.lastFocused = document.activeElement;
    state.modalScrollY = state.pendingModalScrollY ?? window.scrollY;
    state.pendingModalScrollY = null;
    lockPage(state.modalScrollY);
    document.querySelector("#quick-view-category").textContent = product.categoryLabel;
    document.querySelector("#quick-view-title").textContent = product.name;
    document.querySelector("#quick-view-price").textContent = formatPrice(product.price);
    document.querySelector("#quick-view-description").textContent = product.description;
    setModalImage(product.gallery[0], product.alt, product.position);

    document.querySelector("#gallery-thumbnails").innerHTML = product.gallery.map((image, index) => `
      <button type="button" class="gallery-thumbnail${index === 0 ? " is-active" : ""}" data-gallery-image="${image}" aria-label="Ver foto ${index + 1} de ${product.name}" aria-pressed="${index === 0}">
        <img src="${image}" alt="">
      </button>`).join("");

    document.querySelector("#size-options").innerHTML = product.sizes.map((size) => `
      <label><input type="radio" name="size" value="${size}" required><span>${size}</span></label>`).join("");

    document.querySelector("#color-options").innerHTML = product.colors.map((color) => `
      <label title="${color.name}"><input type="radio" name="color" value="${color.name}" required><span style="--swatch:${color.value}"></span><em>${color.name}</em></label>`).join("");
    document.querySelector("#selected-color-name").textContent = "Selecione";
    elements.productForm.reset();
    elements.modal.showModal();
    document.body.classList.add("modal-open");
  }

  function setModalImage(src, alt, position = "center top") {
    const image = document.querySelector("#quick-view-image");
    image.src = src;
    image.alt = alt;
    image.style.setProperty("--object-position", position);
  }

  function closeQuickView() {
    if (!elements.modal.open) return;
    elements.modal.close();
    document.body.classList.remove("modal-open");
    state.activeProduct = null;
    unlockPage(state.modalScrollY);
    if (state.lastFocused) state.lastFocused.focus({ preventScroll: true });
  }

  function addToCart(product, size, color) {
    const existing = state.cart.find((item) => item.id === product.id && item.size === size && item.color === color);
    if (existing) existing.quantity += 1;
    else state.cart.push({ id: product.id, size, color, quantity: 1 });
    saveStorage(storageKeys.cart, state.cart);
    updateCart();
    closeQuickView();
    showToast(`${product.name} adicionado Ã  sacola.`);
    openCart();
  }

  function updateCartItem(index, change) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += change;
    if (state.cart[index].quantity <= 0) state.cart.splice(index, 1);
    saveStorage(storageKeys.cart, state.cart);
    updateCart();
  }

  function removeCartItem(index) {
    const item = state.cart[index];
    const product = item && products.find((entry) => entry.id === item.id);
    if (!item) return;
    state.cart.splice(index, 1);
    saveStorage(storageKeys.cart, state.cart);
    updateCart();
    if (product) showToast(`${product.name} removido da sacola.`);
  }

  function getValidCart() {
    return state.cart.map((item, index) => ({ item, product: products.find((product) => product.id === item.id), index })).filter((entry) => entry.product);
  }

  function updateCart() {
    const validCart = getValidCart();
    if (!validCart.length) {
      elements.cartItems.innerHTML = '<div class="cart-empty"><span>Ã</span><h3>Sua sacola estÃ¡ vazia</h3><p>Descubra a curadoria Ãria e salve seus looks preferidos.</p><button class="text-link" type="button" data-cart-action="continue">Ver novidades â†’</button></div>';
    } else {
      elements.cartItems.innerHTML = validCart.map(({ item, product, index }) => `
        <article class="cart-item">
          <img src="${product.image}" alt="">
          <div class="cart-item-copy">
            <div><h3>${product.name}</h3><button type="button" data-cart-action="remove" data-index="${index}" aria-label="Remover ${product.name}">${icons.trash}</button></div>
            <p>Tam. ${item.size} <span>Â·</span> ${item.color}</p>
            <strong>${formatPrice(product.price)}</strong>
            <div class="quantity-control" aria-label="Quantidade de ${product.name}">
              <button type="button" data-cart-action="decrease" data-index="${index}" aria-label="Diminuir quantidade">${icons.minus}</button>
              <span aria-live="polite">${item.quantity}</span>
              <button type="button" data-cart-action="increase" data-index="${index}" aria-label="Aumentar quantidade">${icons.plus}</button>
            </div>
          </div>
        </article>`).join("");
    }

    const subtotal = validCart.reduce((total, { item, product }) => total + product.price * item.quantity, 0);
    elements.cartSubtotal.textContent = formatPrice(subtotal);
    elements.checkoutButton.href = createWhatsAppCheckoutUrl(validCart, subtotal);
    elements.checkoutButton.classList.toggle("is-disabled", !validCart.length);
    elements.checkoutButton.setAttribute("aria-disabled", String(!validCart.length));
    updateCounts();
  }

  function createWhatsAppCheckoutUrl(validCart, subtotal) {
    const lines = ["OlÃ¡! Quero finalizar meu pedido na Ãria Boutique:", ""];
    validCart.forEach(({ item, product }) => {
      lines.push(`â€¢ ${item.quantity}x ${product.name} â€” Tam. ${item.size}, cor ${item.color} â€” ${formatPrice(product.price * item.quantity)}`);
    });
    lines.push("", `Subtotal demonstrativo: ${formatPrice(subtotal)}`, "", "Gostaria de confirmar disponibilidade, entrega e forma de pagamento.");
    try {
      const url = new URL(config.whatsappUrl);
      url.searchParams.set("text", lines.join("\n"));
      return url.toString();
    } catch (error) {
      return config.whatsappUrl;
    }
  }

  function createPromoWhatsAppUrl() {
    try {
      const url = new URL(config.whatsappUrl);
      url.searchParams.set("text", "OlÃ¡! Vi a Sale da Ãria Boutique com atÃ© 50% off e quero conhecer as peÃ§as selecionadas disponÃ­veis.");
      return url.toString();
    } catch (error) {
      return config.whatsappUrl;
    }
  }

  function openPromo() {
    if (!elements.promo || elements.promo.open) return;
    state.promoLastFocused = document.activeElement;
    state.promoScrollY = window.scrollY;
    lockPage(state.promoScrollY);
    elements.promo.showModal();
    document.body.classList.add("promo-open");
    window.setTimeout(() => elements.promo.focus({ preventScroll: true }), 50);
  }

  function closePromo() {
    if (!elements.promo || !elements.promo.open) return;
    elements.promo.close();
    document.body.classList.remove("promo-open");
    unlockPage(state.promoScrollY);
    if (state.promoLastFocused && state.promoLastFocused !== document.body) {
      state.promoLastFocused.focus({ preventScroll: true });
    }
  }

  function updateCounts() {
    const cartQuantity = state.cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    elements.cartCount.textContent = cartQuantity;
    elements.cartButton.setAttribute("aria-label", `Abrir sacola com ${cartQuantity} ${cartQuantity === 1 ? "item" : "itens"}`);
    elements.favoritesCount.textContent = state.favorites.size;
    elements.favoritesCount.setAttribute("aria-label", `${state.favorites.size} favoritos`);
  }

  function openCart() {
    closeMenu();
    closeFilter();
    if (!elements.cartDrawer.classList.contains("is-open")) {
      state.cartLastFocused = document.activeElement;
      state.cartScrollY = state.pendingCartScrollY ?? window.scrollY;
      state.pendingCartScrollY = null;
    }
    elements.cartDrawer.classList.add("is-open");
    elements.cartDrawer.setAttribute("aria-hidden", "false");
    elements.cartButton.setAttribute("aria-expanded", "true");
    elements.overlay.hidden = false;
    document.body.classList.add("drawer-open");
    lockPage(state.cartScrollY);
    window.setTimeout(() => elements.cartClose.focus(), 100);
  }

  function closeCart() {
    const wasOpen = elements.cartDrawer.classList.contains("is-open");
    elements.cartDrawer.classList.remove("is-open");
    elements.cartDrawer.setAttribute("aria-hidden", "true");
    elements.cartButton.setAttribute("aria-expanded", "false");
    elements.overlay.hidden = true;
    document.body.classList.remove("drawer-open");
    if (wasOpen && state.cartLastFocused) state.cartLastFocused.focus({ preventScroll: true });
    if (wasOpen) unlockPage(state.cartScrollY);
  }

  function openMenu() {
    if (navDesktopMedia.matches) return;
    closeCart();
    closeFilter();
    state.menuLastFocused = document.activeElement;
    state.menuScrollY = state.pendingMenuScrollY ?? window.scrollY;
    state.pendingMenuScrollY = null;
    elements.primaryNav.classList.add("is-open");
    elements.primaryNav.setAttribute("aria-hidden", "false");
    elements.primaryNav.inert = false;
    elements.menuToggle.setAttribute("aria-expanded", "true");
    elements.navOverlay.hidden = false;
    document.body.classList.add("nav-open");
    lockPage(state.menuScrollY);
    window.setTimeout(() => elements.menuClose.focus(), 80);
  }

  function closeMenu(restoreFocus = true) {
    const wasOpen = elements.primaryNav.classList.contains("is-open");
    elements.primaryNav.classList.remove("is-open");
    elements.menuToggle.setAttribute("aria-expanded", "false");
    elements.menuToggle.setAttribute("aria-label", "Abrir menu");
    elements.navOverlay.hidden = true;
    document.body.classList.remove("nav-open");
    if (!navDesktopMedia.matches) {
      elements.primaryNav.setAttribute("aria-hidden", "true");
      elements.primaryNav.inert = true;
    }
    if (wasOpen && restoreFocus && state.menuLastFocused) state.menuLastFocused.focus({ preventScroll: true });
    if (wasOpen) unlockPage(state.menuScrollY);
  }

  function toggleMenu() {
    if (elements.primaryNav.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  function openFilter() {
    if (filterDesktopMedia.matches) return;
    closeCart();
    closeMenu();
    state.filterLastFocused = document.activeElement;
    state.filterScrollY = state.pendingFilterScrollY ?? window.scrollY;
    state.pendingFilterScrollY = null;
    elements.filterPanel.classList.add("is-open");
    elements.filterPanel.setAttribute("aria-hidden", "false");
    elements.filterPanel.setAttribute("role", "dialog");
    elements.filterPanel.setAttribute("aria-modal", "true");
    elements.filterPanel.inert = false;
    elements.filterOpen.setAttribute("aria-expanded", "true");
    elements.filterOverlay.hidden = false;
    document.body.classList.add("filter-open");
    lockPage(state.filterScrollY);
    window.setTimeout(() => elements.filterClose.focus(), 80);
  }

  function closeFilter(restoreFocus = true) {
    const wasOpen = elements.filterPanel.classList.contains("is-open");
    elements.filterPanel.classList.remove("is-open");
    elements.filterOpen.setAttribute("aria-expanded", "false");
    elements.filterOverlay.hidden = true;
    document.body.classList.remove("filter-open");
    if (!filterDesktopMedia.matches) {
      elements.filterPanel.setAttribute("aria-hidden", "true");
      elements.filterPanel.setAttribute("role", "dialog");
      elements.filterPanel.setAttribute("aria-modal", "true");
      elements.filterPanel.inert = true;
    }
    if (wasOpen && restoreFocus && state.filterLastFocused) state.filterLastFocused.focus({ preventScroll: true });
    if (wasOpen) unlockPage(state.filterScrollY);
  }

  function syncResponsivePanels() {
    if (navDesktopMedia.matches) {
      closeMenu(false);
      elements.primaryNav.removeAttribute("aria-hidden");
      elements.primaryNav.inert = false;
    } else if (!elements.primaryNav.classList.contains("is-open")) {
      elements.primaryNav.setAttribute("aria-hidden", "true");
      elements.primaryNav.inert = true;
    }

    if (filterDesktopMedia.matches) {
      closeFilter(false);
      elements.filterPanel.removeAttribute("aria-hidden");
      elements.filterPanel.removeAttribute("role");
      elements.filterPanel.removeAttribute("aria-modal");
      elements.filterPanel.inert = false;
    } else if (!elements.filterPanel.classList.contains("is-open")) {
      elements.filterPanel.setAttribute("aria-hidden", "true");
      elements.filterPanel.inert = true;
    }
  }

  function trapFocus(container, event) {
    const focusable = [...container.querySelectorAll('a[href]:not([aria-disabled="true"]), button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function lockPage(position) {
    state.lockedPageY = position;
  }

  function unlockPage(position) {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, position);
    root.style.scrollBehavior = previousBehavior;
  }

  let toastTimer;
  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 3200);
  }

  function applyConfig() {
    document.querySelectorAll('[data-config-link="instagram"]').forEach((link) => { link.href = config.instagramUrl; });
    document.querySelectorAll('[data-config-link="whatsapp"]').forEach((link) => { link.href = config.whatsappUrl; });
    document.querySelectorAll('[data-config-link="maps"]').forEach((link) => { link.href = config.mapsUrl; });
    document.querySelectorAll("[data-config-text]").forEach((node) => {
      const value = node.dataset.configText.split(".").reduce((current, key) => current && current[key], config);
      if (typeof value === "string" || typeof value === "number") node.textContent = value;
    });
    if (elements.promoWhatsapp) elements.promoWhatsapp.href = createPromoWhatsAppUrl();
  }

  const internalLinks = [...document.querySelectorAll('a[href^="#"]')].filter((link) => link.getAttribute("href").length > 1);
  const primaryNavLinks = [...elements.primaryNav.querySelectorAll('a[href^="#"]')];

  function getInternalTarget(link) {
    const id = decodeURIComponent(link.hash.slice(1));
    return id ? document.getElementById(id) : null;
  }

  function updateActiveNavigation(id) {
    primaryNavLinks.forEach((link) => {
      const active = link.hash === `#${id}`;
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function navigateToSection(link) {
    const target = getInternalTarget(link);
    if (!target) return false;
    const id = target.id;
    const desktopScrollTargets = {
      novidades: ".products-heading",
      ocasioes: ".section-heading",
      editorial: ".editorial-copy",
      looks: ".looks-heading",
      loja: ".store-copy"
    };
    const desktopTarget = window.matchMedia("(min-width: 64rem)").matches && desktopScrollTargets[id]
      ? target.querySelector(desktopScrollTargets[id])
      : null;
    const scrollTarget = desktopTarget || target;
    if (link.closest("#primary-nav")) closeMenu(false);
    scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    updateActiveNavigation(id);
    if (window.location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
    return true;
  }

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!getInternalTarget(link)) return;
      event.preventDefault();
      navigateToSection(link);
    });
  });

  function syncActiveNavigation() {
    const headerBottom = document.querySelector(".site-header").getBoundingClientRect().bottom;
    const activationLine = headerBottom + Math.min(160, window.innerHeight * .28);
    let activeTarget = null;
    primaryNavLinks.forEach((link) => {
      const target = getInternalTarget(link);
      if (target && target.getBoundingClientRect().top <= activationLine) activeTarget = target;
    });
    primaryNavLinks.forEach((link) => link.removeAttribute("aria-current"));
    if (activeTarget) updateActiveNavigation(activeTarget.id);
  }

  let navigationFrame;
  function requestNavigationSync() {
    window.cancelAnimationFrame(navigationFrame);
    navigationFrame = window.requestAnimationFrame(syncActiveNavigation);
  }

  window.addEventListener("scroll", requestNavigationSync, { passive: true });
  window.addEventListener("resize", requestNavigationSync);

  window.addEventListener("hashchange", () => {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) updateActiveNavigation(target.id);
  });

  elements.grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    if (trigger.dataset.action === "favorite") toggleFavorite(trigger.dataset.id);
    if (trigger.dataset.action === "quick-view") openQuickView(trigger.dataset.id);
  });
  elements.grid.addEventListener("pointerdown", (event) => {
    if (event.target.closest('[data-action="quick-view"]')) state.pendingModalScrollY = window.scrollY;
  }, true);

  document.querySelectorAll(".filter-pill").forEach((button) => {
    button.addEventListener("click", () => setCategory(button.dataset.category));
  });

  document.querySelectorAll("[data-occasion]").forEach((button) => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.occasion);
      document.querySelector("#novidades").scrollIntoView({ behavior: "smooth" });
    });
  });

  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = elements.searchInput.value;
    state.favoritesOnly = false;
    elements.favoritesButton.setAttribute("aria-pressed", "false");
    renderProducts();
    document.querySelector("#novidades").scrollIntoView({ behavior: "smooth" });
  });

  elements.searchInput.addEventListener("input", () => {
    state.query = elements.searchInput.value;
    renderProducts();
  });

  elements.sort.addEventListener("change", () => {
    state.sort = elements.sort.value;
    updateFilterSummary();
    renderProducts();
  });

  elements.favoritesButton.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    elements.favoritesButton.setAttribute("aria-pressed", String(state.favoritesOnly));
    renderProducts();
    document.querySelector("#novidades").scrollIntoView({ behavior: "smooth" });
    if (state.favoritesOnly && !state.favorites.size) showToast("VocÃª ainda nÃ£o salvou nenhum favorito.");
  });

  elements.clearFilters.addEventListener("click", () => {
    state.query = "";
    elements.searchInput.value = "";
    setCategory("todos");
  });

  elements.cartButton.addEventListener("click", openCart);
  elements.cartButton.addEventListener("pointerdown", () => { state.pendingCartScrollY = window.scrollY; }, true);
  elements.cartClose.addEventListener("click", closeCart);
  elements.overlay.addEventListener("click", closeCart);
  elements.menuToggle.addEventListener("click", toggleMenu);
  elements.menuToggle.addEventListener("pointerdown", () => { state.pendingMenuScrollY = window.scrollY; }, true);
  elements.menuClose.addEventListener("click", () => closeMenu());
  elements.navOverlay.addEventListener("click", () => closeMenu());
  elements.primaryNav.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(false); });
  elements.filterOpen.addEventListener("click", openFilter);
  elements.filterOpen.addEventListener("pointerdown", () => { state.pendingFilterScrollY = window.scrollY; }, true);
  elements.filterClose.addEventListener("click", () => closeFilter());
  elements.filterApply.addEventListener("click", () => closeFilter());
  elements.filterOverlay.addEventListener("click", () => closeFilter());
  elements.promoClose.addEventListener("click", closePromo);
  elements.promoContinue.addEventListener("click", closePromo);
  elements.promo.addEventListener("click", (event) => { if (event.target === elements.promo) closePromo(); });
  elements.promo.addEventListener("cancel", (event) => { event.preventDefault(); closePromo(); });
  elements.modalClose.addEventListener("click", closeQuickView);
  elements.modal.addEventListener("click", (event) => { if (event.target === elements.modal) closeQuickView(); });
  elements.modal.addEventListener("cancel", (event) => { event.preventDefault(); closeQuickView(); });
  elements.modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeQuickView();
    }
  });

  document.querySelector("#gallery-thumbnails").addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-image]");
    if (!button || !state.activeProduct) return;
    setModalImage(button.dataset.galleryImage, state.activeProduct.alt, state.activeProduct.position);
    document.querySelectorAll(".gallery-thumbnail").forEach((thumbnail) => {
      const active = thumbnail === button;
      thumbnail.classList.toggle("is-active", active);
      thumbnail.setAttribute("aria-pressed", String(active));
    });
  });

  document.querySelector("#color-options").addEventListener("change", (event) => {
    document.querySelector("#selected-color-name").textContent = event.target.value;
  });

  elements.productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.activeProduct) return;
    const formData = new FormData(elements.productForm);
    const size = formData.get("size");
    const color = formData.get("color");
    if (!size || !color) {
      showToast("Escolha o tamanho e a cor da peÃ§a.");
      return;
    }
    addToCart(state.activeProduct, size, color);
  });

  elements.cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;
    const index = Number(button.dataset.index);
    if (button.dataset.cartAction === "increase") updateCartItem(index, 1);
    if (button.dataset.cartAction === "decrease") updateCartItem(index, -1);
    if (button.dataset.cartAction === "remove") removeCartItem(index);
    if (button.dataset.cartAction === "continue") {
      closeCart();
      document.querySelector("#novidades").scrollIntoView({ behavior: "smooth" });
    }
  });

  elements.checkoutButton.addEventListener("click", (event) => {
    if (!getValidCart().length) {
      event.preventDefault();
      showToast("Adicione pelo menos uma peÃ§a Ã  sacola.");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && elements.cartDrawer.classList.contains("is-open")) {
      trapFocus(elements.cartDrawer, event);
    } else if (event.key === "Tab" && elements.primaryNav.classList.contains("is-open")) {
      trapFocus(elements.primaryNav, event);
    } else if (event.key === "Tab" && elements.filterPanel.classList.contains("is-open")) {
      trapFocus(elements.filterPanel, event);
    }
    if (event.key === "Escape") {
      closePromo();
      closeQuickView();
      closeCart();
      closeMenu();
      closeFilter();
    }
  });

  const navDesktopMedia = window.matchMedia("(min-width: 70rem)");
  const filterDesktopMedia = window.matchMedia("(min-width: 56rem)");
  navDesktopMedia.addEventListener("change", syncResponsivePanels);
  filterDesktopMedia.addEventListener("change", syncResponsivePanels);
  applyConfig();
  syncResponsivePanels();
  updateFilterSummary();
  renderProducts();
  updateCart();
  window.addEventListener("load", openPromo, { once: true });
})();

