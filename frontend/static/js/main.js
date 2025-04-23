document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const openMenu = document.getElementById("openMenu");
  const closeMenu = document.getElementById("closeMenu");
  const navLinks = document.getElementById("navLinks");

  if (openMenu) {
    openMenu.addEventListener("click", function () {
      navLinks.classList.add("active");
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });
  }

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }

      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Testimonial Slider
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".slider-dots .dot");
  const prevBtn = document.querySelector(".slider-arrow.prev");
  const nextBtn = document.querySelector(".slider-arrow.next");
  let currentSlide = 0;
  let slideInterval;

  // Initialize first slide
  const initializeSlider = () => {
    if (slides.length > 0) {
      slides[0].classList.add("active");
      dots[0].classList.add("active");
    }
  };

  const updateSlides = (newIndex) => {
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = newIndex;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  };

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    updateSlides(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides(newIndex);
  };

  const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, 5000);
  };

  const stopSlideShow = () => {
    clearInterval(slideInterval);
  };

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopSlideShow();
      prevSlide();
      startSlideShow();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopSlideShow();
      nextSlide();
      startSlideShow();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopSlideShow();
      updateSlides(index);
      startSlideShow();
    });
  });

  // Pause slideshow when hovering over testimonials
  const testimonialSection = document.getElementById("testimonials");
  if (testimonialSection) {
    testimonialSection.addEventListener("mouseenter", stopSlideShow);
    testimonialSection.addEventListener("mouseleave", startSlideShow);
  }

  // Initialize slider and start slideshow
  initializeSlider();
  startSlideShow();

  // Animate statistics counter
  function animateCounters() {
    const counters = [
      { id: "cases-resolved", target: 2500 },
      { id: "countries-covered", target: 15 },
      { id: "authorities-partnered", target: 50 },
      { id: "response-time", target: 4 },
    ];

    counters.forEach((counter) => {
      const element = document.getElementById(counter.id);
      if (!element) return;

      const duration = 2000; // 2 seconds animation
      const startTime = performance.now();
      const startValue = 0;
      const increment = counter.target;

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const currentValue = Math.floor(
          progress * (counter.target - startValue)
        );
        element.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = counter.target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Intersection Observer for animation triggers
  const impactSection = document.getElementById("impact");
  if (impactSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(impactSection);
  }

  // Form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Form validation would go here

      // Simulate form submission
      alert(
        `Thank you ${name} for your message. We will get back to you soon!`
      );
      contactForm.reset();
    });
  }

  // Sticky Navbar
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
      navbar.style.padding = "10px 0";
    } else {
      navbar.style.boxShadow = "none";
      navbar.style.padding = "15px 0";
    }
  });

  // Add active class to nav links based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links ul li a");

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);

  // Initialize the Auto-Animating Timeline
  initAutoTimeline();

  function initAutoTimeline() {
    const timelinePoints = document.querySelectorAll(".timeline-point");
    const processDetails = document.querySelectorAll(".process-detail");
    const timelineSection = document.getElementById("how-it-works");

    if (timelinePoints.length === 0) return;

    let currentStep = 1;
    const totalSteps = timelinePoints.length;
    let timelineInterval;
    const stepDuration = 4000; // 4 seconds per step

    // Function to set active step
    function setActiveStep(step) {
      // Update timeline points
      timelinePoints.forEach((point) => {
        const pointStep = parseInt(point.getAttribute("data-step"));
        point.classList.remove("active", "completed");

        if (pointStep === step) {
          point.classList.add("active");
        } else if (pointStep < step) {
          point.classList.add("completed");
        }
      });

      // Update process details with fade effect
      processDetails.forEach((detail) => {
        if (parseInt(detail.getAttribute("data-step")) === step) {
          // Fade out current active detail
          document
            .querySelectorAll(".process-detail.active")
            .forEach((activeDetail) => {
              activeDetail.style.opacity = "0";
              setTimeout(() => {
                activeDetail.classList.remove("active");
                // Fade in new detail
                detail.classList.add("active");
                setTimeout(() => {
                  detail.style.opacity = "1";
                }, 50);
              }, 500);
            });
        }
      });

      // Update current step
      currentStep = step;
    }

    // Function to advance to next step or loop back to the first
    function advanceStep() {
      const nextStep = currentStep < totalSteps ? currentStep + 1 : 1;
      setActiveStep(nextStep);
    }

    // Start the timeline animation when section is visible
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start the animation cycle
            if (!timelineInterval) {
              timelineInterval = setInterval(advanceStep, stepDuration);
            }
          } else {
            // Pause animation when not in view
            clearInterval(timelineInterval);
            timelineInterval = null;
          }
        });
      },
      { threshold: 0.3 }
    );

    if (timelineSection) {
      timelineObserver.observe(timelineSection);
    }

    // Pause animation on hover/touch
    const timelineContainer = document.querySelector(".timeline-container");
    if (timelineContainer) {
      timelineContainer.addEventListener("mouseenter", () => {
        clearInterval(timelineInterval);
        timelineInterval = null;
      });

      timelineContainer.addEventListener("mouseleave", () => {
        if (!timelineInterval) {
          timelineInterval = setInterval(advanceStep, stepDuration);
        }
      });

      // Remove click functionality from timeline points
      // Timeline points are no longer clickable for manual navigation
    }
  }
});
