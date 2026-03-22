// Navbar toggle + scroll hide/show
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

const updateNavbarVisibility = () => {
  if (!navbar) return;

  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;
  const menuOpen = navMenu?.classList.contains('active');

  // Always show at the very top or when menu is open
  if (currentY <= 0 || menuOpen) {
    navbar.classList.add('nav-visible');
    navbar.classList.remove('nav-hidden');
    lastScrollY = currentY;
    return;
  }

  // Show on scroll down, hide on scroll up
  if (delta > 2) {
    navbar.classList.add('nav-visible');
    navbar.classList.remove('nav-hidden');
  } else if (delta < -2) {
    navbar.classList.add('nav-hidden');
    navbar.classList.remove('nav-visible');
  }

  lastScrollY = currentY;
};

if (navbar) {
  navbar.classList.add('nav-visible');
  window.addEventListener('scroll', updateNavbarVisibility, { passive: true });
}

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  updateNavbarVisibility();
});

// Close menu when a link is clicked
document.querySelectorAll(".nav-menu a").forEach(n => n.addEventListener("click", () => {
    navMenu.classList.remove("active");
}));

// Dropdown hover functionality
const dropdown = document.querySelector(".dropdown");
const dropdownContent = document.querySelector(".dropdown-content");

if (dropdown && dropdownContent) {
    dropdown.addEventListener("mouseenter", () => {
        dropdownContent.style.display = "block";
    });

    dropdown.addEventListener("mouseleave", () => {
        dropdownContent.style.display = "none";
    });
}

const slides = document.querySelectorAll('.carousel-item');
const thumbs = document.querySelectorAll('.thumb');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let currentIdx = 0;

function showSlide(n) {
    slides[currentIdx].classList.remove('active');
    thumbs[currentIdx].classList.remove('active');
    
    currentIdx = (n + slides.length) % slides.length;
    
    slides[currentIdx].classList.add('active');
    thumbs[currentIdx].classList.add('active');
}

nextBtn.addEventListener('click', () => showSlide(currentIdx + 1));
prevBtn.addEventListener('click', () => showSlide(currentIdx - 1));

thumbs.forEach((t, i) => {
    t.addEventListener('click', () => showSlide(i));
});
// Inline zoom with square cursor + side preview (no CSS file changes)
const heroContainer = document.querySelector('.hero-container');
const mainCarousel = document.querySelector('.main-carousel');
const carouselImages = document.querySelectorAll('.main-carousel .carousel-item img');
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
const shouldDisableZoom = () => window.matchMedia('(max-width: 1024px)').matches;

let zoomLens = null;
let zoomPreview = null;

const ensureZoomElements = () => {
  if (!heroContainer || !mainCarousel || shouldDisableZoom()) return false;

  if (!zoomLens) {
    zoomLens = document.createElement('div');
    zoomLens.style.position = 'absolute';
    zoomLens.style.width = '140px';
    zoomLens.style.height = '140px';
    zoomLens.style.border = '1.5px solid #2b3990';
    zoomLens.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
    zoomLens.style.background = 'rgba(255,255,255,0.15)';
    zoomLens.style.pointerEvents = 'none';
    zoomLens.style.display = 'none';
    zoomLens.style.zIndex = '1500';
    zoomLens.style.borderRadius = '4px';
    mainCarousel.style.position = mainCarousel.style.position || 'relative';
    mainCarousel.appendChild(zoomLens);
  }

  if (!zoomPreview) {
    zoomPreview = document.createElement('div');
    zoomPreview.style.position = 'absolute';
    zoomPreview.style.top = '10px';
    zoomPreview.style.width = '240px';
    zoomPreview.style.height = '240px';
    zoomPreview.style.border = '1px solid #e5e7eb';
    zoomPreview.style.borderRadius = '12px';
    zoomPreview.style.boxShadow = '0 12px 30px rgba(0,0,0,0.18)';
    zoomPreview.style.backgroundRepeat = 'no-repeat';
    zoomPreview.style.backgroundPosition = 'center';
    zoomPreview.style.display = 'none';
    zoomPreview.style.zIndex = '1600';
    zoomPreview.style.overflow = 'hidden';
    zoomPreview.style.backgroundColor = '#fff';
    heroContainer.style.position = heroContainer.style.position || 'relative';
    heroContainer.appendChild(zoomPreview);
  }

  return zoomLens && zoomPreview;
};

const hideZoom = () => {
  if (zoomLens) zoomLens.style.display = 'none';
  if (zoomPreview) zoomPreview.style.display = 'none';
};

const attachZoom = (img) => {
  if (!ensureZoomElements() || !isFinePointer) return;
  const lensSize = 140;

  const move = (e) => {
    if (shouldDisableZoom()) {
      hideZoom();
      return;
    }

    const parent = img.closest('.carousel-item');
    if (!parent?.classList.contains('active')) {
      hideZoom();
      return;
    }

    const imgRect = img.getBoundingClientRect();
    const carRect = mainCarousel.getBoundingClientRect();
    const heroRect = heroContainer.getBoundingClientRect();

    let x = e.clientX - imgRect.left - lensSize / 2;
    let y = e.clientY - imgRect.top - lensSize / 2;

    x = Math.max(0, Math.min(x, imgRect.width - lensSize));
    y = Math.max(0, Math.min(y, imgRect.height - lensSize));

    zoomLens.style.display = 'block';
    zoomPreview.style.display = 'block';

    zoomLens.style.left = `${x + (imgRect.left - carRect.left)}px`;
    zoomLens.style.top = `${y + (imgRect.top - carRect.top)}px`;

  // Position preview over the heading/title area (to the right of carousel)
  const previewLeft = (carRect.width + 32);
  zoomPreview.style.left = `${previewLeft}px`;
  zoomPreview.style.top = `80px`;

    const previewW = parseFloat(zoomPreview.style.width);
    const previewH = parseFloat(zoomPreview.style.height);
    const scaleX = previewW / lensSize;
    const scaleY = previewH / lensSize;

    zoomPreview.style.backgroundImage = `url(${img.src})`;
    zoomPreview.style.backgroundSize = `${imgRect.width * scaleX}px ${imgRect.height * scaleY}px`;
    zoomPreview.style.backgroundPosition = `-${x * scaleX}px -${y * scaleY}px`;
  };

  const enter = (e) => {
    if (!isFinePointer || e.pointerType === 'touch' || shouldDisableZoom()) return;
    const parent = img.closest('.carousel-item');
    if (!parent?.classList.contains('active')) return;
    move(e);
  };

  const leave = () => hideZoom();

  img.addEventListener('pointerenter', enter);
  img.addEventListener('pointermove', move);
  img.addEventListener('pointerleave', leave);
};

carouselImages.forEach(attachZoom);

// Image Zoom Functionality
function imageZoom(container) {
    let img = container.querySelector('img');
    let lens = container.querySelector('.img-zoom-lens');
    let result = container.querySelector('.img-zoom-result');

    // Calculate zoom level
    let cx = result.offsetWidth / lens.offsetWidth;
    let cy = result.offsetHeight / lens.offsetHeight;

    // Set background image and size
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    // Move lens and zoom image on mouse move
    lens.addEventListener('mousemove', moveLens);
    img.addEventListener('mousemove', moveLens);

    function moveLens(e) {
        let pos, x, y;
        e.preventDefault();

        // Get cursor position
        pos = getCursorPos(e);
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);

        // Prevent lens from going out of bounds
        if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
        if (x < 0) { x = 0; }
        if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
        if (y < 0) { y = 0; }

        // Set lens position
        lens.style.left = x + "px";
        lens.style.top = y + "px";

        // Update zoom result position
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }

    function getCursorPos(e) {
        let a, x = 0, y = 0;
        e = e || window.event;

        a = img.getBoundingClientRect();
        x = e.pageX - a.left - window.pageXOffset;
        y = e.pageY - a.top - window.pageYOffset;

        return { x: x, y: y };
    }
}

// Initialize zoom for all carousel items
document.querySelectorAll('.img-zoom-container').forEach(container => {
    imageZoom(container);
});

// FAQ Accordion functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Catalogue form submission
const catalogueBtn = document.querySelector('.catalogue-btn');
const catalogueInput = document.querySelector('.catalogue-input');

if (catalogueBtn) {
    catalogueBtn.addEventListener('click', () => {
        const email = catalogueInput.value;
        
        if (email && email.includes('@')) {
            alert(`Thank you! We'll send the catalogue to ${email}`);
            catalogueInput.value = '';
        } else {
            alert('Please enter a valid email address');
        }
    });
    
    // Allow submit on Enter key
    catalogueInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            catalogueBtn.click();
        }
    });
}

// Applications Carousel functionality (scroll-based, responsive)
const track = document.getElementById('carouselTrack');
const appsWrapper = document.querySelector('.applications-carousel-wrapper');
const appNextBtn = document.getElementById('appNextBtn');
const appPrevBtn = document.getElementById('appPrevBtn');

function getAppCardStep() {
  if (!track) return 0;
  const firstCard = track.querySelector('.application-card');
  if (!firstCard) return 0;
  const cardRect = firstCard.getBoundingClientRect();
  const styles = getComputedStyle(track);
  const gap = parseFloat(styles.columnGap || styles.gap || 0);
  return cardRect.width + gap;
}

function scrollApplications(dir = 1) {
  if (!track || !appsWrapper) return;
  const step = getAppCardStep();
  if (!step) return;

  const maxScroll = track.scrollWidth - appsWrapper.clientWidth;
  const next = Math.min(Math.max(appsWrapper.scrollLeft + dir * step, 0), maxScroll);
  appsWrapper.scrollTo({ left: next, behavior: 'smooth' });
}

if (track && appNextBtn && appPrevBtn && appsWrapper) {
  appNextBtn.addEventListener('click', () => scrollApplications(1));
  appPrevBtn.addEventListener('click', () => scrollApplications(-1));
}

// Manufacturing Process Tab Functionality
const processTabs = document.querySelectorAll('.process-tab');
const processContents = document.querySelectorAll('.process-content');
const processPrevBtn = document.getElementById('processPrevBtn');
const processNextBtn = document.getElementById('processNextBtn');
const processTabsContainer = document.querySelector('.process-tabs-container');

let currentProcessTab = 0;
const totalTabs = processTabs.length;

// Treat tablet like mobile for single-card flow
const isMobileProcess = () => window.matchMedia('(max-width: 1024px)').matches;

function ensureProcessStepBadges() {
  if (!processTabs.length || !processContents.length) return;
  const total = processTabs.length;

  // Container-level badge (for mobile)
  if (processTabsContainer) {
    let containerBadge = processTabsContainer.querySelector('.process-step-badge-container');
    if (!containerBadge) {
      containerBadge = document.createElement('div');
      containerBadge.className = 'process-step-badge process-step-badge-container';
      processTabsContainer.insertBefore(containerBadge, processTabsContainer.firstChild);
    }
    const label = processTabs[currentProcessTab]?.textContent?.trim() || '';
    containerBadge.textContent = `Step ${currentProcessTab + 1}/${total}: ${label}`;
  }

  // Card-level badges (kept for future use; hidden on mobile)
  processContents.forEach((content, idx) => {
    let badge = content.querySelector('.process-step-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'process-step-badge';
      content.insertBefore(badge, content.firstChild);
    }

    const label = processTabs[idx]?.textContent?.trim() || '';
    badge.textContent = `Step ${idx + 1}/${total}: ${label}`;
  });
}

function applyProcessVisibility() {
  const mobile = isMobileProcess();
  processContents.forEach((content, idx) => {
    if (mobile) {
      content.style.display = idx === currentProcessTab ? 'flex' : 'none';
    } else {
      content.style.display = '';
    }
  });
}

function showProcessTab(index) {
  // Remove active class from all tabs and contents
  processTabs.forEach(tab => tab.classList.remove('active'));
  processContents.forEach(content => content.classList.remove('active'));
  
  // Add active class to current tab and content
  processTabs[index].classList.add('active');
  processContents[index].classList.add('active');
  
  // Scroll tab into view (desktop only)
  if (!isMobileProcess()) {
    processTabs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  applyProcessVisibility();
  ensureProcessStepBadges();
}

// Tab click handlers
processTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    // On mobile we keep single-card flow via arrows; ignore tab clicks there
    if (isMobileProcess()) return;
    currentProcessTab = index;
    showProcessTab(currentProcessTab);
  });
});

// Navigation button handlers
if (processNextBtn) {
  processNextBtn.addEventListener('click', () => {
    currentProcessTab = (currentProcessTab + 1) % totalTabs;
    showProcessTab(currentProcessTab);
  });
}

if (processPrevBtn) {
  processPrevBtn.addEventListener('click', () => {
    currentProcessTab = (currentProcessTab - 1 + totalTabs) % totalTabs;
    showProcessTab(currentProcessTab);
  });
}

// Trust logos carousel (mobile: 3 visible, auto-slide)
const logoGrid = document.querySelector('.logo-grid');
let logoCarouselTimer;

function startLogoCarousel() {
  if (!logoGrid) return;

  // Clear any existing timer
  if (logoCarouselTimer) {
    clearInterval(logoCarouselTimer);
    logoCarouselTimer = null;
  }

  // Only run auto-scroll on small screens
  if (window.innerWidth > 900) {
    logoGrid.scrollTo({ left: 0 });
    return;
  }

  const firstItem = logoGrid.querySelector('.logo-item');
  if (!firstItem) return;

  const styles = getComputedStyle(logoGrid);
  const gap = parseFloat(styles.columnGap || styles.gap || 0);
  const step = firstItem.getBoundingClientRect().width + gap;

  logoCarouselTimer = setInterval(() => {
    const maxScroll = logoGrid.scrollWidth - logoGrid.clientWidth;
    const next = logoGrid.scrollLeft + step;

    if (next >= maxScroll - 1) {
      logoGrid.scrollTo({ left: 0, behavior: 'auto' });
    } else {
      logoGrid.scrollTo({ left: next, behavior: 'smooth' });
    }
  }, 2500);
}

startLogoCarousel();
window.addEventListener('resize', startLogoCarousel);

// Testimonials Carousel functionality with touch/swipe support
const testimonialsTrack = document.getElementById('testimonialsTrack');

if (testimonialsTrack) {
  let scrollPosition = 0;
  let isDown = false;
  let startX;
  let touchStartX;
  
  const cardWidth = 340 + 24; // Card width (340px) + gap (24px)
  const maxScroll = () => testimonialsTrack.scrollWidth - testimonialsTrack.parentElement.clientWidth;
  
  // Mouse down event
  testimonialsTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - testimonialsTrack.offsetLeft;
  });
  
  // Mouse leave event
  testimonialsTrack.addEventListener('mouseleave', () => {
    isDown = false;
  });
  
  // Mouse up event
  testimonialsTrack.addEventListener('mouseup', () => {
    isDown = false;
  });
  
  // Mouse move event
  testimonialsTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    
    const x = e.pageX - testimonialsTrack.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust sensitivity
    
    if (scrollPosition - walk >= 0 && scrollPosition - walk <= maxScroll()) {
      scrollPosition -= walk;
      testimonialsTrack.style.transform = `translateX(-${scrollPosition}px)`;
    }
    startX = x;
  });
  
  // Touch start event
  testimonialsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  
  // Touch move event
  testimonialsTrack.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const walk = (touchStartX - touchX) * 1.5;
    
    if (scrollPosition + walk >= 0 && scrollPosition + walk <= maxScroll()) {
      scrollPosition += walk;
      testimonialsTrack.style.transform = `translateX(-${scrollPosition}px)`;
    }
    touchStartX = touchX;
  });
}

// Manufacturing Process Carousel functionality (arrows on each image)
const carouselArrows = document.querySelectorAll('.carousel-arrow');

carouselArrows.forEach(arrow => {
  arrow.addEventListener('click', (e) => {
    const isNext = arrow.classList.contains('next');
    const currentTab = Math.max(0, currentProcessTab);
    
    if (isNext) {
      currentProcessTab = (currentProcessTab + 1) % totalTabs;
    } else {
      currentProcessTab = (currentProcessTab - 1 + totalTabs) % totalTabs;
    }
    
    showProcessTab(currentProcessTab);
  });
});

// Ensure correct visibility on load and when resizing
applyProcessVisibility();
ensureProcessStepBadges();

// Sticky bar for Manufacturing section
const manufacturingSection = document.querySelector('.manufacturing-section');
const manufacturingStickyBar = document.getElementById('manufacturingStickyBar');

const showManufacturingSticky = () => {
  manufacturingStickyBar.classList.add('visible');
  manufacturingStickyBar.setAttribute('aria-hidden', 'false');
};

const hideManufacturingSticky = () => {
  manufacturingStickyBar.classList.remove('visible');
  manufacturingStickyBar.setAttribute('aria-hidden', 'true');
};

if (manufacturingSection && manufacturingStickyBar) {
  let manufacturingInView = false;
  let lastManufacturingScrollY = window.scrollY;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          manufacturingInView = true;
          showManufacturingSticky();
        } else {
          manufacturingInView = false;
          hideManufacturingSticky();
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  observer.observe(manufacturingSection);

  const handleManufacturingScroll = () => {
    if (!manufacturingInView) {
      hideManufacturingSticky();
      lastManufacturingScrollY = window.scrollY;
      return;
    }

    const currentY = window.scrollY;
    const delta = currentY - lastManufacturingScrollY;

    if (delta > 2) {
      showManufacturingSticky();
    } else if (delta < -2) {
      hideManufacturingSticky();
    }

    lastManufacturingScrollY = currentY;
  };

  window.addEventListener('scroll', handleManufacturingScroll, { passive: true });
}
window.addEventListener('resize', () => {
  applyProcessVisibility();
  ensureProcessStepBadges();
});

// Specs download modal
const specsBtn = document.querySelector('.specs-download-btn');
const specsModal = document.getElementById('specsModal');
const specsClose = document.querySelector('#specsModal .modal-close');
const specsForm = document.getElementById('specsModalForm');

// Quote modal
const quoteModal = document.getElementById('quoteModal');
const quoteClose = document.querySelector('#quoteModal .modal-close');
const quoteForm = document.getElementById('quoteModalForm');
const quoteOpenButtons = document.querySelectorAll('.btn-primary, .msb-btn');

const openSpecsModal = () => {
  if (!specsModal) return;
  specsModal.classList.add('visible');
  specsModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const emailInput = specsForm?.querySelector('input[name="email"]');
  if (emailInput) emailInput.focus();
};

const closeSpecsModal = () => {
  if (!specsModal) return;
  specsModal.classList.remove('visible');
  specsModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const openQuoteModal = () => {
  if (!quoteModal) return;
  quoteModal.classList.add('visible');
  quoteModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const nameInput = quoteForm?.querySelector('input[name="name"]');
  if (nameInput) nameInput.focus();
};

const closeQuoteModal = () => {
  if (!quoteModal) return;
  quoteModal.classList.remove('visible');
  quoteModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

if (specsBtn && specsModal) {
  specsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSpecsModal();
  });
}

quoteOpenButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openQuoteModal();
  });
});

if (specsClose) {
  specsClose.addEventListener('click', closeSpecsModal);
}

if (quoteClose) {
  quoteClose.addEventListener('click', closeQuoteModal);
}

if (specsModal) {
  specsModal.addEventListener('click', (e) => {
    if (e.target === specsModal) closeSpecsModal();
  });
}

if (quoteModal) {
  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeQuoteModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSpecsModal();
    closeQuoteModal();
  }
});

if (specsForm) {
  specsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = specsForm.querySelector('input[name="email"]').value.trim();
    if (!email) return;
    // Placeholder for submission logic
    alert(`Thanks! We will email the brochure to ${email}.`);
    closeSpecsModal();
    specsForm.reset();
  });
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = quoteForm.querySelector('input[name="name"]').value.trim();
    const email = quoteForm.querySelector('input[name="email"]').value.trim();
    const phone = quoteForm.querySelector('input[name="phone"]').value.trim();
    if (!name || !email || !phone) return;
    alert(`Thanks ${name}! We will reach out shortly.`);
    closeQuoteModal();
    quoteForm.reset();
  });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const company = contactForm.querySelector('input[name="company"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const countryCode = contactForm.querySelector('select[name="countryCode"]').value;
    const phone = contactForm.querySelector('input[name="phone"]').value.trim();
    
    // Basic validation
    if (!name || !email || !phone) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Phone validation (basic - at least 7 digits)
    const phoneRegex = /^\d{7,}$/;
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number');
      return;
    }
    
    // Form submission success message
    alert(`Thank you, ${name}! We've received your request. Our team will contact you at ${email} shortly.`);
    
    // Reset form
    contactForm.reset();
    
    // Optional: Here you would typically send the data to a backend server
    // Example:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name, company, email, countryCode, phone
    //   })
    // })
  });
}

// Footer social media links interaction
const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.style.transform = 'translateY(-2px) scale(1.1)';
  });
  
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = 'translateY(0) scale(1)';
  });
  
  icon.addEventListener('click', (e) => {
    // You can customize this to open actual social media links
    const platform = icon.getAttribute('title');
    console.log(`Navigating to ${platform}`);
    // Example: window.open(`https://www.${platform.toLowerCase()}.com`, '_blank');
  });
});

// Smooth scroll for footer links
const footerLinks = document.querySelectorAll('.footer-links a, .footer-links-bottom a');

footerLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    // Only prevent default for anchor links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});