/**
 * VELVET LUXURY FLEET - MAIN JAVASCRIPT CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initThemeToggle();
  initDirectionToggle();
  initMobileNavigation();
  initActivePageNav();
  initBackToTop();
  initToastSystem();
  initFaqAccordion();
});

/* 0. ATTRACTIVE PAGE LOADER */
function initPageLoader() {
  let loader = document.getElementById('page-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <div class="loader-brand">
        <div class="loader-logo-ring">
          <img src="assets/images/logo.png" alt="VELVET Logo" class="loader-logo-img">
        </div>
        <div class="loader-text">VELVET FLEET</div>
        <div class="loader-bar-bg">
          <div class="loader-bar-fill"></div>
        </div>
      </div>
    `;
    document.body.prepend(loader);
  }

  const hideLoader = () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 350);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 1200);
  }
}

/* 1. THEME TOGGLE (LIGHT / DARK MODE) */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  }
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

/* 2. DIRECTION TOGGLE (RTL / LTR) */
function initDirectionToggle() {
  const dirToggleBtn = document.getElementById('dirToggleBtn');
  const savedDir = localStorage.getItem('dir') || 'ltr';

  document.documentElement.setAttribute('dir', savedDir);
  updateDirText(savedDir);

  if (dirToggleBtn) {
    dirToggleBtn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('dir', newDir);
      updateDirText(newDir);
      showToast(`Layout changed to ${newDir.toUpperCase()}`, 'info');
    });
  }
}

function updateDirText(dir) {
  const dirText = document.getElementById('dirText');
  if (dirText) {
    dirText.textContent = dir.toUpperCase();
  }
}

/* 3. MOBILE NAVIGATION & DROPDOWNS */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      const icon = hamburgerBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });
  }

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle current dropdown and close others
        dropdowns.forEach(other => {
          if (other !== dropdown) other.classList.remove('open');
        });
        dropdown.classList.toggle('open');
      });
    }
  });

  // Close dropdowns & mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    if (navMenu && !navMenu.contains(e.target) && hamburgerBtn && !hamburgerBtn.contains(e.target)) {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.querySelector('i').className = 'fas fa-bars';
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023 && navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (hamburgerBtn) hamburgerBtn.querySelector('i').className = 'fas fa-bars';
    }
  });
}

/* 4. ACTIVE PAGE MARKER */
function initActivePageNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      if (link.classList.contains('dropdown-item')) {
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          const trigger = parentDropdown.querySelector('.dropdown-trigger');
          if (trigger) trigger.classList.add('active');
        }
      }
    }
  });
}

/* 5. BACK TO TOP */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* 6. TOAST NOTIFICATIONS */
function initToastSystem() {
  if (!document.getElementById('toastContainer')) {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let iconClass = type === 'success' ? 'fas fa-check-circle text-accent' : 'fas fa-info-circle text-accent';

  toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* 7. FAQ & PROTOCOL ACCORDION DROPDOWN SYSTEM */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const parent = item.closest('.faq-accordion');
        if (parent) {
          parent.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
        }
        item.classList.toggle('open');
      });
    }
  });

  const protocolItems = document.querySelectorAll('.protocol-item');
  protocolItems.forEach(item => {
    const header = item.querySelector('.protocol-header');
    if (header) {
      header.addEventListener('click', () => {
        const parent = item.closest('.protocol-accordion');
        if (parent) {
          parent.querySelectorAll('.protocol-item').forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
        }
        item.classList.toggle('open');
      });
    }
  });
}
