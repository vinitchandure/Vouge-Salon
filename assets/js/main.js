/**
 * VOGUE SALON - Interactive Editorial Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initHeroSlideshow();
  initAuthModal();
  initServiceMenu();
  initBookingWizard();
  initFranchiseForm();
  initNewsletter();
  initFloatingContact();
  initScrollAnimations();
});

/* ==========================================================================
   THEME TOGGLE SYSTEM (LIGHT ATELIER IS FIRST-VISIT DEFAULT)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('vogue_theme');
  
  // Requirement: Default theme must be light mode on first visit
  const activeTheme = storedTheme ? storedTheme : 'light';
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcon(activeTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('vogue_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Editorial Noir' : 'Ivory Atelier'} Mode`);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;
  if (theme === 'dark') {
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    toggleBtn.setAttribute('title', 'Switch to Ivory Atelier Mode');
    toggleBtn.setAttribute('aria-label', 'Switch to Ivory Atelier Mode');
  } else {
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    toggleBtn.setAttribute('title', 'Switch to Editorial Noir Mode');
    toggleBtn.setAttribute('aria-label', 'Switch to Editorial Noir Mode');
  }
}

/* ==========================================================================
   NAVIGATION & SCROLL (SINGLE-LINE DESKTOP + OFF-CANVAS MOBILE DRAWER)
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerClose = document.getElementById('mobileDrawerClose');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Open / Close System
  function openDrawer() {
    mobileDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Desktop "More" Dropdown Toggle
  const dropdownItem = document.querySelector('.nav-item-dropdown');
  const dropdownBtn = document.querySelector('.nav-dropdown-btn');

  if (dropdownBtn && dropdownItem) {
    dropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdownItem.classList.toggle('open');
      dropdownBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!dropdownItem.contains(e.target)) {
        dropdownItem.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   FULL-SCREEN HERO SLIDESHOW ENGINE
   ========================================================================== */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const panes = document.querySelectorAll('.hero-scene-pane');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const heroSection = document.querySelector('.hero-editorial');

  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = null;
  const AUTO_DELAY = 6500;

  function showSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    panes.forEach((pane, i) => {
      pane.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, AUTO_DELAY);
  }

  function stopAutoplay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  // Next / Prev click handlers
  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    startAutoplay();
  });

  // Dots click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        showSlide(targetIndex);
        startAutoplay();
      }
    });
  });

  // Pause autoplay on user hover / touch
  heroSection?.addEventListener('mouseenter', stopAutoplay);
  heroSection?.addEventListener('mouseleave', startAutoplay);
  heroSection?.addEventListener('touchstart', stopAutoplay, { passive: true });
  heroSection?.addEventListener('touchend', startAutoplay, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Start initial slide
  showSlide(0);
  startAutoplay();
}

/* ==========================================================================
   AUTH MODAL & CLIENT PORTAL (PREVIEW / DEMO)
   ========================================================================== */
function initAuthModal() {
  const modal = document.getElementById('authModal');
  const openButtons = document.querySelectorAll('[data-auth-open]');
  const closeBtn = document.getElementById('closeAuthModal');
  const authForm = document.getElementById('clientAuthForm');
  const authStatus = document.getElementById('authStatusMessage');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.close();
    });
  }

  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneOrEmail = document.getElementById('authIdentifier')?.value.trim();

      if (!phoneOrEmail) {
        showToast('Please enter your phone number or email address', 'error');
        return;
      }

      if (authStatus) {
        authStatus.innerHTML = `
          <div style="padding: 1.2rem; background: var(--champagne); border: 1px solid var(--border-light); border-radius: var(--radius-sm); margin-top: 1rem;">
            <p style="color: var(--gold-dark); font-weight: 700; font-size: 0.9rem; margin-bottom: 0.3rem;">Welcome to VOGUE Privé</p>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">Demo Profile Verified: <strong>${escapeHtml(phoneOrEmail)}</strong></p>
            <p style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">
              ✦ Note: This is an illustrative front-end demonstration. No real user account credentials are stored.
            </p>
          </div>
        `;
      }
      showToast('Client Access Granted (Demo Mode)');
    });
  }
}

/* ==========================================================================
   SERVICE MENU SEARCH & CATEGORY FILTER
   ========================================================================== */
function initServiceMenu() {
  const searchInput = document.getElementById('serviceSearchInput');
  const categoryPills = document.querySelectorAll('.cat-pill');
  const categoryGroups = document.querySelectorAll('.service-category-group');
  const serviceRows = document.querySelectorAll('.menu-item-row');

  if (!serviceRows.length) return;

  // Accordion toggle on category group headers
  categoryGroups.forEach(group => {
    const header = group.querySelector('.category-group-header');
    if (header) {
      function toggleGroup() {
        const isCollapsed = group.classList.toggle('collapsed');
        header.setAttribute('aria-expanded', (!isCollapsed).toString());
        if (!isCollapsed) {
          group.querySelectorAll('.reveal-item').forEach(el => el.classList.add('is-revealed'));
        }
      }

      header.addEventListener('click', toggleGroup);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleGroup();
        }
      });
    }
  });

  function filterMenu() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeCategory = document.querySelector('.cat-pill.active')?.getAttribute('data-category') || 'all';

    let totalMatchCount = 0;

    categoryGroups.forEach(group => {
      const groupCategory = group.getAttribute('data-category');
      const rows = group.querySelectorAll('.menu-item-row');
      let groupMatches = 0;

      const categoryMatches = (activeCategory === 'all' || groupCategory === activeCategory);

      if (!categoryMatches) {
        group.style.display = 'none';
        return;
      }

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const matchesSearch = !searchTerm || text.includes(searchTerm);

        if (matchesSearch) {
          row.style.display = '';
          row.classList.add('is-revealed');
          groupMatches++;
          totalMatchCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (groupMatches > 0) {
        group.style.display = '';
        if (searchTerm) {
          group.classList.remove('collapsed');
          const header = group.querySelector('.category-group-header');
          if (header) header.setAttribute('aria-expanded', 'true');
        }
      } else {
        group.style.display = 'none';
      }
    });

    const noResults = document.getElementById('noServiceResults');
    if (noResults) {
      noResults.style.display = totalMatchCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterMenu);
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterMenu();
    });
  });
}

/* ==========================================================================
   APPOINTMENT BOOKING SYSTEM
   ========================================================================== */
function initBookingWizard() {
  const form = document.getElementById('appointmentBookingForm');
  const serviceSelect = document.getElementById('bookingService');
  const stylistSelect = document.getElementById('bookingStylist');
  const citySelect = document.getElementById('bookingCity');
  const dateInput = document.getElementById('bookingDate');
  const priceDisplay = document.getElementById('bookingEstimatedPrice');
  const durationDisplay = document.getElementById('bookingEstimatedDuration');
  const confirmationModal = document.getElementById('bookingSuccessModal');

  if (!form) return;

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const price = selectedOption.getAttribute('data-price') || '₹1,200';
      const duration = selectedOption.getAttribute('data-duration') || '45 Mins';

      if (priceDisplay) priceDisplay.textContent = price;
      if (durationDisplay) durationDisplay.textContent = duration;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookingName')?.value.trim();
    const phone = document.getElementById('bookingPhone')?.value.trim();
    const service = serviceSelect?.value;
    const city = citySelect?.value || 'Mumbai Flagship Catchment';
    const date = dateInput?.value;
    const time = document.getElementById('bookingTime')?.value;
    const notes = document.getElementById('bookingNotes')?.value.trim();
    const stylist = stylistSelect?.value || 'Next Available Senior Artist';

    if (!name || !phone || !service || !date || !time) {
      showToast('Please fill in all required appointment details.', 'error');
      return;
    }

    if (phone.length < 10) {
      showToast('Please enter a valid 10-digit Indian phone number.', 'error');
      return;
    }

    const bookingRef = 'VG-' + Math.floor(100000 + Math.random() * 900000);

    const summaryElem = document.getElementById('bookingModalSummary');
    if (summaryElem) {
      summaryElem.innerHTML = `
        <div style="background: var(--bg-secondary); padding: 1.1rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); margin: 1rem 0; box-sizing: border-box; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
            <span style="color: var(--text-muted); font-size: 0.82rem;">Demo Reference</span>
            <strong style="color: var(--gold-primary); font-family: var(--font-display);">${bookingRef}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem;">
            <span style="color: var(--text-secondary);">Guest Name</span>
            <strong>${escapeHtml(name)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem;">
            <span style="color: var(--text-secondary);">City / Market</span>
            <strong>${escapeHtml(city)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem;">
            <span style="color: var(--text-secondary);">Service Requested</span>
            <strong style="color: var(--gold-primary);">${escapeHtml(service)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem;">
            <span style="color: var(--text-secondary);">Specialist</span>
            <strong>${escapeHtml(stylist)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
            <span style="color: var(--text-secondary);">Schedule</span>
            <strong>${escapeHtml(date)} at ${escapeHtml(time)}</strong>
          </div>
        </div>
        <p style="font-size: 0.74rem; color: var(--text-muted); font-style: italic; text-align: center;">
          * Demo Notice: This appointment request is simulated for evaluation. To speak with our salon desk directly, connect via phone or WhatsApp at 7758990684.
        </p>
      `;
    }

    const waBookingBtn = document.getElementById('waSendBookingBtn');
    if (waBookingBtn) {
      const waMessage = encodeURIComponent(
        `Hello VOGUE SALON, I am inquiring about an appointment:\n\n` +
        `• Ref: ${bookingRef}\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• City: ${city}\n` +
        `• Service: ${service}\n` +
        `• Specialist: ${stylist}\n` +
        `• Date: ${date} at ${time}\n` +
        (notes ? `• Notes: ${notes}\n` : '') +
        `\nPlease let me know slot availability and consultation options.`
      );
      waBookingBtn.href = `https://wa.me/917758990684?text=${waMessage}`;
    }

    if (confirmationModal) {
      confirmationModal.showModal();
    } else {
      showToast(`Appointment request registered for ${name}! Ref: ${bookingRef}`);
    }

    form.reset();
  });
}

/* ==========================================================================
   FRANCHISE ENQUIRY SYSTEM
   ========================================================================== */
function initFranchiseForm() {
  const form = document.getElementById('franchiseEnquiryForm');
  const modal = document.getElementById('franchiseSuccessModal');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('franchiseName')?.value.trim();
    const phone = document.getElementById('franchisePhone')?.value.trim();
    const email = document.getElementById('franchiseEmail')?.value.trim();
    const city = document.getElementById('franchiseCity')?.value.trim();
    const tier = document.getElementById('franchiseModel')?.value;
    const budget = document.getElementById('franchiseBudget')?.value || 'Demo Range Selected';
    const message = document.getElementById('franchiseMessage')?.value.trim();

    if (!name || !phone || !email || !city) {
      showToast('Please fill in your complete contact and city details.', 'error');
      return;
    }

    const franchiseRef = 'VG-FR-' + Math.floor(1000 + Math.random() * 9000);

    const summaryElem = document.getElementById('franchiseModalSummary');
    if (summaryElem) {
      summaryElem.innerHTML = `
        <div style="background: var(--bg-secondary); padding: 1.4rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); margin: 1.2rem 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
            <span style="color: var(--text-muted); font-size: 0.8rem;">Dossier Code (Demo)</span>
            <strong style="color: var(--gold-primary);">${franchiseRef}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.86rem;">
            <span style="color: var(--text-secondary);">Partner Candidate</span>
            <strong>${escapeHtml(name)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.86rem;">
            <span style="color: var(--text-secondary);">Target City</span>
            <strong style="color: var(--gold-primary);">${escapeHtml(city)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.86rem;">
            <span style="color: var(--text-secondary);">Format Model</span>
            <strong>${escapeHtml(tier || 'Salon & Spa')}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.86rem;">
            <span style="color: var(--text-secondary);">Sample Range</span>
            <strong>${escapeHtml(budget)}</strong>
          </div>
        </div>
        <p style="font-size: 0.74rem; color: var(--text-muted); font-style: italic; text-align: center;">
          * Illustrative Demo Application. Connect with corporate desk via WhatsApp or phone at 7758990684.
        </p>
      `;
    }

    const waFranchiseBtn = document.getElementById('waSendFranchiseBtn');
    if (waFranchiseBtn) {
      const waText = encodeURIComponent(
        `Hello VOGUE SALON Corporate Team,\n\nI have submitted a Franchise Partner Enquiry for ${city}.\n` +
        `• Ref: ${franchiseRef}\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Email: ${email}\n` +
        `• Format: ${tier}\n` +
        `• Range: ${budget}\n` +
        (message ? `• Message: ${message}\n` : '') +
        `\nPlease share the confidential salon franchise prospectus.`
      );
      waFranchiseBtn.href = `https://wa.me/917758990684?text=${waText}`;
    }

    if (modal) {
      modal.showModal();
    } else {
      showToast(`Thank you ${name}. Your franchise enquiry has been recorded.`);
    }

    form.reset();
  });
}

/* ==========================================================================
   NEWSLETTER SIGNUP
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value.trim();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast(`Thank you! ${email} has been subscribed to VOGUE Editorial Updates.`);
    form.innerHTML = `
      <div style="padding: 1.2rem; background: rgba(255,255,255,0.15); border-radius: var(--radius-full); color: #fff; font-weight: 600; font-size: 0.95rem;">
        ✓ Welcome to the VOGUE Privé Editorial Circle
      </div>
    `;
  });
}

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--gold-primary); font-size: 1.1rem;">✦</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   COMPACT FLOATING CONCIERGE CONTACT MENU SYSTEM
   ========================================================================== */
function initFloatingContact() {
  const widget = document.getElementById('floatingContactWidget');
  const trigger = document.getElementById('floatingContactTrigger');
  const menu = document.getElementById('floatingContactMenu');

  if (!widget || !trigger || !menu) return;

  function openMenu() {
    menu.removeAttribute('hidden');
    // Force browser reflow to guarantee CSS transition plays
    void menu.offsetWidth;
    widget.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    widget.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    // Wait for smooth fade-out and slide-down transition before adding hidden
    setTimeout(() => {
      if (!widget.classList.contains('is-open')) {
        menu.setAttribute('hidden', '');
      }
    }, 240);
  }

  function toggleMenu() {
    const isOpen = widget.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Toggle on click/tap
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target) && widget.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close when pressing Escape key and return focus to trigger
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      closeMenu();
      trigger.focus();
    }
  });

  // Close menu after clicking an action so user can proceed cleanly
  const menuItems = menu.querySelectorAll('.floating-menu-item');
  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   POLISHED SCROLL & ENTRANCE ANIMATIONS ENGINE
   Choreographed: Headings first -> Text & Images -> Cards one-by-one
   ========================================================================== */
function initScrollAnimations() {
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  // Add progressively enhanced class to document so CSS activates initial reveal states safely
  document.documentElement.classList.add('has-scroll-anim');

  // 1. CHOREOGRAPHY: Headings first (0.04s - 0.08s)
  // Target section headers and category group headers
  const headerContainers = document.querySelectorAll('.section-header, .category-group-header');
  headerContainers.forEach(header => {
    // 1a. Eyebrow tags, categories, badges (first: 0.04s)
    const tags = header.querySelectorAll('.editorial-tag, .section-subtitle, .category-num, .hero-badge');
    tags.forEach((tag, i) => {
      tag.classList.add('reveal-item', 'reveal-heading');
      tag.style.setProperty('--reveal-delay', `${(0.04 + i * 0.03).toFixed(2)}s`);
    });

    // 1b. Main titles and headings (second: 0.08s)
    const titles = header.querySelectorAll('h1, h2, h3, .editorial-title, .section-title, .category-title, .about-title');
    titles.forEach((title, i) => {
      title.classList.add('reveal-item', 'reveal-heading');
      title.style.setProperty('--reveal-delay', `${(0.08 + i * 0.04).toFixed(2)}s`);
    });

    // 2. Text & Subtitle descriptions (next: 0.16s)
    const texts = header.querySelectorAll('p, .section-lead, .category-count');
    texts.forEach((p, i) => {
      p.classList.add('reveal-item', 'reveal-text-image');
      p.style.setProperty('--reveal-delay', `${(0.16 + i * 0.04).toFixed(2)}s`);
    });
  });

  // Editorial showcase grids (About page / split text-image layouts)
  const showcaseGrids = document.querySelectorAll('.editorial-showcase-grid');
  showcaseGrids.forEach(grid => {
    const tags = grid.querySelectorAll('.editorial-tag');
    tags.forEach(t => {
      t.classList.add('reveal-item', 'reveal-heading');
      t.style.setProperty('--reveal-delay', '0.04s');
    });
    const titles = grid.querySelectorAll('h1, h2, h3, .editorial-title');
    titles.forEach(t => {
      t.classList.add('reveal-item', 'reveal-heading');
      t.style.setProperty('--reveal-delay', '0.08s');
    });
    const texts = grid.querySelectorAll('p');
    texts.forEach((p, i) => {
      p.classList.add('reveal-item', 'reveal-text-image');
      p.style.setProperty('--reveal-delay', `${(0.16 + i * 0.04).toFixed(2)}s`);
    });
  });

  // 2b. Section Story / Feature / Philosophy Images (0.20s)
  const sectionImages = document.querySelectorAll(
    '.story-image, .about-image, .featured-image, .philosophy-image, .curation-image, .story-image-wrap, .showcase-banner-frame, .editorial-showcase-grid img'
  );
  sectionImages.forEach((img, i) => {
    img.classList.add('reveal-item', 'reveal-text-image');
    img.style.setProperty('--reveal-delay', `${(0.20 + i * 0.04).toFixed(2)}s`);
  });

  // 3. CARDS & GRID ITEMS: Staggered one by one with a gentle pause between each (0.09s interval)
  const cardContainers = document.querySelectorAll([
    '.service-feature-grid',
    '.service-items-stack',
    '.trust-grid',
    '.testimonials-grid',
    '.reviews-grid',
    '.franchise-grid',
    '.franchise-steps-grid',
    '.curation-grid',
    '.looks-grid',
    '.values-grid',
    '.atelier-grid',
    'div[style*="grid-template-columns"]'
  ].join(','));

  cardContainers.forEach(container => {
    // Check if container is preceded by a section header in the same section
    const parentSection = container.closest('section, .section, .service-category-group');
    const hasHeader = parentSection && parentSection.querySelector('.section-header, .category-group-header, h2, h3');
    
    // If preceded by heading and text, cards start after text/image at 0.26s; if standalone strip, start at 0.08s
    const baseDelay = hasHeader ? 0.26 : 0.08;
    const cards = Array.from(container.children).filter(el => {
      return el.nodeType === 1 && !el.classList.contains('section-header') && !el.classList.contains('category-group-header');
    });

    cards.forEach((card, index) => {
      card.classList.add('reveal-item', 'reveal-card');
      // Gentle pause of 0.09s between each card, capped at 0.78s so visitors don't have to wait
      const cardDelay = Math.min(baseDelay + (index % 6) * 0.09, 0.78);
      card.style.setProperty('--reveal-delay', `${cardDelay.toFixed(2)}s`);
    });
  });

  // 4. Standalone content blocks
  const standaloneBlocks = document.querySelectorAll('.quote-block, .cta-banner, .newsletter-card, .contact-card');
  standaloneBlocks.forEach(block => {
    block.classList.add('reveal-item', 'reveal-text-image');
    block.style.setProperty('--reveal-delay', '0.14s');
  });

  // 5. Gather all reveal items and containers
  const allRevealItems = document.querySelectorAll('.reveal-item');
  if (!allRevealItems.length) return;

  const containersToObserve = [
    ...headerContainers,
    ...showcaseGrids,
    ...cardContainers
  ];

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');

          // If container intersected, trigger all reveal items inside it
          if (entry.target.classList.contains('reveal-container')) {
            const childItems = entry.target.querySelectorAll('.reveal-item');
            childItems.forEach(child => child.classList.add('is-revealed'));
          }

          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    // Mark and observe containers
    containersToObserve.forEach(container => {
      container.classList.add('reveal-container');
      observer.observe(container);
    });

    // Also observe individual items for vertical progressive scrolling
    allRevealItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      // If already in viewport on initial load, reveal immediately
      if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
        item.classList.add('is-revealed');
      } else {
        observer.observe(item);
      }
    });
  } else {
    // Fallback for older browsers
    allRevealItems.forEach(el => el.classList.add('is-revealed'));
  }

  // Dynamic listener for OS reduced-motion preference change
  prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.remove('has-scroll-anim');
      allRevealItems.forEach(el => el.classList.add('is-revealed'));
    } else {
      document.documentElement.classList.add('has-scroll-anim');
    }
  });
}



