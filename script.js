// Navbar toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
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
  if (!track) return;
  const step = getAppCardStep();
  if (!step) return;

  const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
  const next = Math.min(Math.max(track.scrollLeft + dir * step, 0), maxScroll);
  track.scrollTo({ left: next, behavior: 'smooth' });
}

if (track && appNextBtn && appPrevBtn) {
  appNextBtn.addEventListener('click', () => scrollApplications(1));
  appPrevBtn.addEventListener('click', () => scrollApplications(-1));
}

// Manufacturing Process Tab Functionality
const processTabs = document.querySelectorAll('.process-tab');
const processContents = document.querySelectorAll('.process-content');
const processPrevBtn = document.getElementById('processPrevBtn');
const processNextBtn = document.getElementById('processNextBtn');

let currentProcessTab = 0;
const totalTabs = processTabs.length;

function showProcessTab(index) {
  // Remove active class from all tabs and contents
  processTabs.forEach(tab => tab.classList.remove('active'));
  processContents.forEach(content => content.classList.remove('active'));
  
  // Add active class to current tab and content
  processTabs[index].classList.add('active');
  processContents[index].classList.add('active');
  
  // Scroll tab into view
  processTabs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

// Tab click handlers
processTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
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