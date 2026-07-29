// Rappod E-Commerce App Script

document.addEventListener('DOMContentLoaded', () => {
  // 0. Hero Title Letter-by-Letter Animation Setup
  function initHeroTitleLetterAnimations() {
    const heroTitles = document.querySelectorAll('.hero-title-center');

    heroTitles.forEach((title) => {
      let globalCharIndex = 0;

      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text) return document.createTextNode('');

          const fragment = document.createDocumentFragment();
          const tokens = text.split(/(\s+)/);

          tokens.forEach((token) => {
            if (!token) return;
            if (/^\s+$/.test(token)) {
              fragment.appendChild(document.createTextNode(token));
            } else {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'hero-word';

              for (const char of token) {
                const letterSpan = document.createElement('span');
                letterSpan.className = 'hero-letter';
                letterSpan.style.setProperty('--letter-idx', globalCharIndex);
                letterSpan.textContent = char;
                wordSpan.appendChild(letterSpan);
                globalCharIndex++;
              }
              fragment.appendChild(wordSpan);
            }
          });

          return fragment;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'br') {
            return node.cloneNode(true);
          }
          const clone = node.cloneNode(false);
          node.childNodes.forEach((child) => {
            clone.appendChild(processNode(child));
          });
          return clone;
        }
        return node.cloneNode(true);
      }

      const newFragment = document.createDocumentFragment();
      const nodeArray = Array.from(title.childNodes);
      nodeArray.forEach((child) => {
        newFragment.appendChild(processNode(child));
      });

      title.innerHTML = '';
      title.appendChild(newFragment);
    });
  }

  // Split title letters on load
  initHeroTitleLetterAnimations();

  // 1. Hero Slider
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startSlideShow();
    });
  });

  // Mobile Touch Swipe Support for Hero Slider
  const heroSliderContainer = document.querySelector('.hero-slider-container');
  if (heroSliderContainer) {
    let touchStartX = 0;
    let touchEndX = 0;

    heroSliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          showSlide(currentSlide + 1);
        } else {
          showSlide(currentSlide - 1);
        }
        startSlideShow();
      }
    }, { passive: true });
  }

  startSlideShow();

  // 1.2 Offer Ad Banner Image Carousel Slider (Auto-Sliding, No UI Buttons/Dots)
  const offerSlides = document.querySelectorAll('.offer-slide');
  const offerCardContainer = document.querySelector('.offer-banner-card');
  let currentOfferSlide = 0;
  let offerSlideInterval;

  if (offerSlides.length > 0) {
    function showOfferSlide(index) {
      offerSlides.forEach((slide) => slide.classList.remove('active'));
      currentOfferSlide = (index + offerSlides.length) % offerSlides.length;
      offerSlides[currentOfferSlide].classList.add('active');
    }

    function nextOfferSlide() {
      showOfferSlide(currentOfferSlide + 1);
    }

    function prevOfferSlide() {
      showOfferSlide(currentOfferSlide - 1);
    }

    function startOfferSlideShow() {
      stopOfferSlideShow();
      offerSlideInterval = setInterval(nextOfferSlide, 4500);
    }

    function stopOfferSlideShow() {
      if (offerSlideInterval) clearInterval(offerSlideInterval);
    }

    if (offerCardContainer) {
      offerCardContainer.addEventListener('mouseenter', stopOfferSlideShow);
      offerCardContainer.addEventListener('mouseleave', startOfferSlideShow);

      // Touch swipe gesture support for mobile
      let touchStartX = 0;
      let touchEndX = 0;

      offerCardContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      offerCardContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 35) {
          if (swipeDistance < 0) {
            nextOfferSlide();
          } else {
            prevOfferSlide();
          }
          startOfferSlideShow();
        }
      }, { passive: true });
    }

    startOfferSlideShow();
  }

  // 1.5 Interactive Parallax & Cursor Sparkle Trail for Hero
  const heroSection = document.querySelector('.hero-slider-container');
  if (heroSection) {
    // A. Parallax Effect
    const parallaxElements = [
      { selector: '.hero-svg-paper-plane', speed: 0.04 },
      { selector: '.hero-svg-wave-left', speed: -0.015 },
      { selector: '.hero-svg-sparkle-topright', speed: 0.025 },
      { selector: '.hero-svg-blob-bottomright', speed: -0.01 },
      { selector: '.hero-sushi-sticker', speed: 0.03 },
      { selector: '.hero-svg-doodles-center', speed: 0.05 },
      { selector: '.hero-svg-ribbon-left', speed: 0.02 }
    ];

    function resetHeroParallax() {
      if (!heroSection) return;
      parallaxElements.forEach((item) => {
        const el = heroSection.querySelector(item.selector);
        if (el) {
          el.style.setProperty('--mx', '0px');
          el.style.setProperty('--my', '0px');
        }
      });
    }

    heroSection.addEventListener('mousemove', (e) => {
      // Disable mouse pointer effects on small screens (width <= 991px)
      if (window.innerWidth <= 991) {
        resetHeroParallax();
        return;
      }

      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      parallaxElements.forEach((item) => {
        const el = heroSection.querySelector(item.selector);
        if (el) {
          const mx = x * item.speed;
          const my = y * item.speed;
          el.style.setProperty('--mx', `${mx}px`);
          el.style.setProperty('--my', `${my}px`);
        }
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      resetHeroParallax();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 991) {
        resetHeroParallax();
      }
    });

    // B. Sparkle Trail Generator
    let lastSparkleTime = 0;
    const sparkleColors = ['#E85D75', '#F4A261', '#254E7A', '#D7E9F4', '#FFF4CC'];

    heroSection.addEventListener('mousemove', (e) => {
      // Disable sparkle particles on small screens
      if (window.innerWidth <= 991) return;

      const now = Date.now();
      if (now - lastSparkleTime < 50) return; // rate limit: 1 sparkle per 50ms
      lastSparkleTime = now;

      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Double check bounds
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const sparkle = document.createElement('div');
      sparkle.className = 'hero-sparkle-particle';

      const shapes = ['★', '✦', '✧', '♥', '●', '✚'];
      sparkle.innerText = shapes[Math.floor(Math.random() * shapes.length)];

      const size = Math.random() * 12 + 12; // 12px to 24px
      const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.fontSize = `${size}px`;
      sparkle.style.color = color;

      const vx = (Math.random() - 0.5) * 80;
      const vy = (Math.random() - 0.8) * 80 - 30; // float upwards

      sparkle.style.setProperty('--vx', `${vx}px`);
      sparkle.style.setProperty('--vy', `${vy}px`);

      heroSection.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    });
  }

  // 2. Countdown Timer
  // Set target date (e.g., 282 days from now, as per reference screenshot, or standard 10 days rolling)
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 10); // 10 days countdown from current local time

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
      document.querySelector('.countdown-days').innerText = '00';
      document.querySelector('.countdown-hours').innerText = '00';
      document.querySelector('.countdown-minutes').innerText = '00';
      document.querySelector('.countdown-seconds').innerText = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.querySelector('.countdown-days').innerText = String(days).padStart(2, '0') + 'd';
    document.querySelector('.countdown-hours').innerText = String(hours).padStart(2, '0') + 'h';
    document.querySelector('.countdown-minutes').innerText = String(minutes).padStart(2, '0') + 'm';
    document.querySelector('.countdown-seconds').innerText = String(seconds).padStart(2, '0') + 's';
  }

  if (document.querySelector('.countdown-days')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 3. Product Database
  const productsDB = {
    1: { id: 1, title: 'Iconic Marking Washi Tape', price: 89.00, img: 'assets/cat_washi.png', rating: 5, oldPrice: 99.00, category: 'washi' },
    2: { id: 2, title: 'Index Pastel Sticky Notes', price: 110.00, img: 'assets/cat_memo.png', rating: 5, oldPrice: 150.00, category: 'memo' },
    3: { id: 3, title: 'Kawaii Holidays Gel Pens', price: 19.90, img: 'assets/cat_pencil.png', rating: 5, oldPrice: null, category: 'pencils' },
    4: { id: 4, title: 'Glue Tape Roller Set', price: 29.00, img: 'assets/cat_sticker.png', rating: 4, oldPrice: null, category: 'sticker' },
    5: { id: 5, title: 'Candy Color Tape Roll', price: 14.90, img: 'assets/hero_pastel_combo.png', rating: 5, oldPrice: 19.90, category: 'washi' },
    6: { id: 6, title: 'Campus Key Ring Planner', price: 200.00, img: 'assets/banner_notebook.png', rating: 5, oldPrice: null, category: 'memo' },
    7: { id: 7, title: 'Origin Weekly Planner', price: 110.00, img: 'assets/cat_memo.png', rating: 5, oldPrice: 160.00, category: 'memo' },
    8: { id: 8, title: 'Official Slim Kawaii Diary', price: 150.00, img: 'assets/hero_stickers.png', rating: 4, oldPrice: null, category: 'memo' },
    9: { id: 9, title: 'Cat Paw Correction Tape', price: 200.00, img: 'assets/cat_sticker.png', rating: 5, oldPrice: 250.00, category: 'sticker' },
    10: { id: 10, title: 'Watercolor Paper Pack', price: 100.00, img: 'assets/cat_memo.png', rating: 5, oldPrice: 150.00, category: 'memo' },
    11: { id: 11, title: 'Mildliner Double-Ended Markers', price: 79.00, img: 'assets/banner_gelpen.png', rating: 5, oldPrice: 95.00, category: 'pencils' },
    12: { id: 12, title: 'Pastel Hardcover Journal', price: 149.00, img: 'assets/banner_notebook.png', rating: 5, oldPrice: 175.00, category: 'memo' },
    13: { id: 13, title: 'Retro Color Highlighter Set', price: 35.00, img: 'assets/cat_pencil.png', rating: 5, oldPrice: null, category: 'pencils' },
    14: { id: 14, title: 'Deco Sticker Collector Album', price: 45.00, img: 'assets/hero_stickers.png', rating: 5, oldPrice: 55.00, category: 'sticker' },
    15: { id: 15, title: 'Aesthetic Kawaii Desk Kit', price: 120.00, img: 'assets/hero_pastel_combo.png', rating: 5, oldPrice: 140.00, category: 'memo' }
  };

  // 4. Quick View Modal
  const quickViewOverlay = document.getElementById('quickViewOverlay');
  const qvCloseBtn = document.getElementById('qvCloseBtn');
  const qvCloseModalBtn = document.getElementById('qvCloseModalBtn');
  const qvImg = document.getElementById('qvImg');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');
  const qvDesc = document.getElementById('qvDesc');

  function openQuickView(productId) {
    const product = productsDB[productId];
    if (!product) return;

    qvImg.src = product.img;
    qvTitle.innerText = product.title;
    qvPrice.innerText = `$${product.price.toFixed(2)}`;
    qvDesc.innerText = `Explore this beautiful premium ${product.title} for your desk space. Made with high quality materials and decorated with cute stationery art to boost your study motivation.`;

    quickViewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeQuickView() {
    quickViewOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  // Bind Quick View triggers
  document.body.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.quick-view-trigger');
    if (qvBtn) {
      const pId = parseInt(qvBtn.getAttribute('data-id'));
      openQuickView(pId);
    }
  });

  if (qvCloseBtn) qvCloseBtn.addEventListener('click', closeQuickView);
  if (qvCloseModalBtn) qvCloseModalBtn.addEventListener('click', closeQuickView);
  if (quickViewOverlay) {
    quickViewOverlay.addEventListener('click', (e) => {
      if (e.target === quickViewOverlay) closeQuickView();
    });
  }

  // 5. Category Tabs Filtering
  const tabLinks = document.querySelectorAll('.tab-link-custom');
  const productCards = document.querySelectorAll('.best-sellers-grid .col-md-3, .best-sellers-grid .col-lg-2-4');

  tabLinks.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      tabLinks.forEach((l) => l.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      productCards.forEach((card) => {
        const itemCat = card.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        alert(`Thank you for subscribing to Rappod Newsletter! 💖 We've sent a 10% coupon code to: ${emailInput.value}`);
        emailInput.value = '';
      }
    });
  }

  // 7. Horizontal Carousel Sliders (Categories, Featured, Brands, New Arrivals & Reviews) with Auto-Slide
  const carouselConfigs = [
    {
      name: 'Category Carousel',
      selector: '.category-carousel-container',
      interval: 4000
    },
    {
      name: 'Featured Products Carousel',
      selector: '.featured-products-section .carousel-scroll-container',
      interval: 3500
    },
    {
      name: 'Brands Carousel',
      selector: '.brand-carousel-container',
      interval: 2500
    },
    {
      name: 'New Arrivals Carousel',
      selector: '.new-arrivals-section .carousel-scroll-container',
      interval: 3000
    },
    {
      name: 'Reviews Carousel',
      selector: '.testimonial-carousel-container',
      interval: 5000
    }
  ];

  carouselConfigs.forEach(config => {
    const container = document.querySelector(config.selector);
    if (!container) return;

    const wrapper = container.parentElement;
    const prevBtn = wrapper ? wrapper.querySelector('.carousel-ctrl-prev') : null;
    const nextBtn = wrapper ? wrapper.querySelector('.carousel-ctrl-next') : null;
    let autoSlideInterval = null;
    let autoResumeTimeout = null;
    let isUserInteracting = false;

    function getScrollStep() {
      if (container.firstElementChild) {
        const style = window.getComputedStyle(container);
        const gap = parseFloat(style.gap) || 0;
        return container.firstElementChild.offsetWidth + gap;
      }
      return 300; // fallback
    }

    function scrollNext() {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const scrollStep = getScrollStep();

      // If we are at the end, scroll back to 0
      if (container.scrollLeft >= maxScrollLeft - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Find nearest current snapped index and go to next
        const currentIndex = Math.round(container.scrollLeft / scrollStep);
        container.scrollTo({ left: (currentIndex + 1) * scrollStep, behavior: 'smooth' });
      }
    }

    function scrollPrev() {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const scrollStep = getScrollStep();

      // If we are at the start, wrap to the end
      if (container.scrollLeft <= 15) {
        container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
      } else {
        // Find nearest current snapped index and go to previous
        const currentIndex = Math.round(container.scrollLeft / scrollStep);
        container.scrollTo({ left: (currentIndex - 1) * scrollStep, behavior: 'smooth' });
      }
    }

    function clearAutoResumeTimer() {
      if (autoResumeTimeout) {
        clearTimeout(autoResumeTimeout);
        autoResumeTimeout = null;
      }
    }

    function startAutoSlide() {
      clearAutoResumeTimer();
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        if (!isUserInteracting) {
          scrollNext();
        }
      }, config.interval);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    function resumeAutoSlideAfterDelay(delay = Math.max(Math.floor(config.interval / 2), 1500)) {
      clearAutoResumeTimer();
      stopAutoSlide();
      autoResumeTimeout = setTimeout(() => {
        isUserInteracting = false;
        startAutoSlide();
      }, delay);
    }

    function handleManualInteraction() {
      isUserInteracting = true;
      resumeAutoSlideAfterDelay();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        scrollPrev();
        isUserInteracting = false;
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        scrollNext();
        isUserInteracting = false;
        startAutoSlide();
      });
    }

    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => {
        isUserInteracting = true;
        stopAutoSlide();
      });
      wrapper.addEventListener('mouseleave', () => {
        isUserInteracting = false;
        startAutoSlide();
      });
    }

    container.addEventListener('wheel', handleManualInteraction, { passive: true });
    container.addEventListener('touchstart', handleManualInteraction, { passive: true });
    container.addEventListener('touchmove', handleManualInteraction, { passive: true });
    container.addEventListener('pointerdown', handleManualInteraction);
    container.addEventListener('keydown', handleManualInteraction);

    // Start auto slide on load
    startAutoSlide();
  });

  // 8. Animated Counters for About Us Section
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    let animated = false;
    const animateCounters = () => {
      statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-count') || '0');
        const suffix = stat.getAttribute('data-suffix') || '';
        const decimals = parseInt(stat.getAttribute('data-decimals') || '0');
        let current = 0;
        const duration = 3800; // Slower counting duration (reduced speed)
        const stepTime = 30;   // Smooth step interval
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.innerText = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;
        }, stepTime);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.2 });

    const aboutSection = document.querySelector('.about-us-section');
    if (aboutSection) observer.observe(aboutSection);
  }

  // 9. Global Modern & Minimal Scroll Reveal Animation Observer
  const elementsToReveal = document.querySelectorAll(
    '.categories-section, .featured-products-section, .brands-section, .choose-us-section, .new-arrivals-section, .testimonials-section, .contact-cta-section, .newsletter-section, .category-card, .product-card, .choose-card, .testimonial-card'
  );

  elementsToReveal.forEach((el, idx) => {
    el.classList.add('reveal-on-scroll');
    if (el.classList.contains('category-card') || el.classList.contains('product-card') || el.classList.contains('choose-card') || el.classList.contains('testimonial-card')) {
      const delayIndex = (idx % 4) + 1;
      el.classList.add(`reveal-delay-${delayIndex}`);
    }
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // 10. Smart Autohide Navbar (Fixed on Scroll Up, Hidden on Scroll Down)
  const mainHeader = document.querySelector('.main-header');
  if (mainHeader) {
    let lastScrollTop = 0;
    const scrollThreshold = 5;

    // Dynamically adjust body top padding to match navbar height for seamless layout
    const updateHeaderHeight = () => {
      const h = mainHeader.offsetHeight;
      if (h > 0) {
        document.body.style.paddingTop = `${h}px`;
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    window.addEventListener('scroll', () => {
      const currentScrollTop = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);

      // Prevent jitter on minor scroll movement
      if (Math.abs(lastScrollTop - currentScrollTop) <= scrollThreshold) return;

      const headerHeight = mainHeader.offsetHeight || 80;

      if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight) {
        // Scrolling DOWN -> Hide Header (Navbar not shown)
        mainHeader.classList.add('nav-hidden');
        mainHeader.classList.remove('nav-fixed');
      } else if (currentScrollTop < lastScrollTop) {
        // Scrolling UP -> Fixed Header (Show navbar at top)
        mainHeader.classList.remove('nav-hidden');
        mainHeader.classList.add('nav-fixed');
      }

      // Always show header when scrolled back to the top of the page
      if (currentScrollTop <= 10) {
        mainHeader.classList.remove('nav-hidden');
        mainHeader.classList.remove('nav-fixed');
      }

      lastScrollTop = currentScrollTop;
    }, { passive: true });
  }

  // 10.5 Hero Search Bar Functionality & Slide Sync
  const searchForms = document.querySelectorAll('.hero-search-form');
  const searchInputs = document.querySelectorAll('.search-title-input');
  const customDropdowns = document.querySelectorAll('.custom-dropdown-container');

  // Sync inputs across slides
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      searchInputs.forEach(otherInput => {
        if (otherInput !== input) otherInput.value = e.target.value;
      });
    });
    // Pause slideshow on focus
    input.addEventListener('focus', stopSlideShow);
    input.addEventListener('blur', startSlideShow);
  });

  // Custom Dropdown Toggle, Close, Option Select & Slide Sync
  customDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.custom-dropdown-trigger');
    const options = dropdown.querySelectorAll('.custom-dropdown-menu li');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentSearchBar = dropdown.closest('.hero-search-bar');
      // Close other dropdowns
      customDropdowns.forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('open');
          const otherSearchBar = other.closest('.hero-search-bar');
          if (otherSearchBar) otherSearchBar.classList.remove('dropdown-open');
        }
      });
      dropdown.classList.toggle('open');
      if (dropdown.classList.contains('open')) {
        if (parentSearchBar) parentSearchBar.classList.add('dropdown-open');
        stopSlideShow();
      } else {
        if (parentSearchBar) parentSearchBar.classList.remove('dropdown-open');
        startSlideShow();
      }
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.innerText;

        // Sync selection across all slides
        customDropdowns.forEach(otherDropdown => {
          const otherInput = otherDropdown.querySelector('.search-category-value');
          const otherLabel = otherDropdown.querySelector('.selected-category-label');
          const otherOptions = otherDropdown.querySelectorAll('.custom-dropdown-menu li');

          if (otherInput) otherInput.value = value;
          if (otherLabel) otherLabel.innerText = text;
          
          otherOptions.forEach(opt => {
            if (opt.getAttribute('data-value') === value) {
              opt.classList.add('active');
            } else {
              opt.classList.remove('active');
            }
          });
        });

        dropdown.classList.remove('open');
        const parentSearchBar = dropdown.closest('.hero-search-bar');
        if (parentSearchBar) parentSearchBar.classList.remove('dropdown-open');
        startSlideShow();
      });
    });
  });

  // Close custom dropdowns when clicking outside
  document.addEventListener('click', () => {
    customDropdowns.forEach(dropdown => {
      if (dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        const parentSearchBar = dropdown.closest('.hero-search-bar');
        if (parentSearchBar) parentSearchBar.classList.remove('dropdown-open');
        startSlideShow();
      }
    });
  });

  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = form.querySelector('.search-title-input').value.toLowerCase().trim();
      const category = form.querySelector('.search-category-value').value;

      // Filter all product cards on the page (both Featured and New Arrivals)
      const allProductCards = document.querySelectorAll('.product-card-wrapper');
      let matchCount = 0;

      allProductCards.forEach(card => {
        const titleEl = card.querySelector('.product-title');
        const titleText = titleEl ? titleEl.innerText.toLowerCase() : '';
        
        // Find product ID from quick-view trigger
        const trigger = card.querySelector('[data-id]');
        const pId = trigger ? parseInt(trigger.getAttribute('data-id')) : null;
        const product = pId ? productsDB[pId] : null;
        const productCategory = product ? product.category : '';

        const matchesTitle = titleText.includes(query);
        const matchesCategory = !category || productCategory === category;

        if (matchesTitle && matchesCategory) {
          card.style.display = 'block';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (matchCount > 0) {
        // Scroll to featured products section smoothly to show results
        const featuredSection = document.getElementById('featured-products');
        if (featuredSection) {
          featuredSection.scrollIntoView({ behavior: 'smooth' });
          // Highlight that we filtered the products
          const sectionTitle = featuredSection.querySelector('.section-title');
          if (sectionTitle) {
            sectionTitle.innerHTML = `Search Results <span class="small text-muted">(${matchCount} found)</span>`;
          }
        }
      } else {
        alert(`No stationery items match "${query}" in this category! 🎀 Try another search.`);
        // Reset filter
        allProductCards.forEach(card => card.style.display = 'block');
      }
    });
  });

  // 11. Minimal & Modern Page Loader Fade-Out
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('fade-out');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 650);
    }, 500);
  }

  // 12. Mobile Navigation Drawer Interactive Toggle & Accessibility
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function openMobileMenu() {
    if (!mobileNavDrawer || !mobileNavOverlay || !mobileNavToggle) return;
    mobileNavDrawer.classList.add('active');
    mobileNavOverlay.classList.add('active');
    mobileNavToggle.classList.add('active');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileNavDrawer || !mobileNavOverlay || !mobileNavToggle) return;
    mobileNavDrawer.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    mobileNavToggle.classList.remove('active');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileNavDrawer.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      mobileNavItems.forEach((link) => link.classList.remove('active'));
      item.classList.add('active');
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // 13. Auto Pop Image Modal (Triggers 5 Seconds After Full Page Load, Auto Closes After 30 Seconds)
  const autoPopupOverlay = document.getElementById('auto-popup-overlay');
  const autoPopupCloseBtn = document.getElementById('autoPopupCloseBtn');
  const popupOpenDelay = 5000;

  if (autoPopupOverlay) {
    let autoCloseTimer = null;

    function openAutoPopup() {
      autoPopupOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // Auto close modal 30 seconds (30000ms) after opening
      autoCloseTimer = setTimeout(closeAutoPopup, 30000);
    }

    function closeAutoPopup() {
      autoPopupOverlay.classList.remove('active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
      }
    }

    // Schedule popup after page is fully loaded
    if (document.readyState === 'complete') {
      setTimeout(openAutoPopup, popupOpenDelay);
    } else {
      window.addEventListener('load', () => {
        setTimeout(openAutoPopup, popupOpenDelay);
      });
    }

    if (autoPopupCloseBtn) {
      autoPopupCloseBtn.addEventListener('click', closeAutoPopup);
    }

    autoPopupOverlay.addEventListener('click', (e) => {
      if (e.target === autoPopupOverlay) {
        closeAutoPopup();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && autoPopupOverlay.classList.contains('active')) {
        closeAutoPopup();
      }
    });
  }

  // 14. WhatsApp Floating Card Close Handler
  const waCardCloseBtn = document.getElementById('waCardCloseBtn');
  const whatsappTopCard = document.getElementById('whatsappTopCard');
  if (waCardCloseBtn && whatsappTopCard) {
    waCardCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      whatsappTopCard.style.opacity = '0';
      whatsappTopCard.style.transform = 'translateY(10px)';
      whatsappTopCard.style.pointerEvents = 'none';
      setTimeout(() => {
        whatsappTopCard.style.display = 'none';
      }, 300);
    });
  }
});

