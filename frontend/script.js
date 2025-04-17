document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const openMenu = document.getElementById('openMenu');
  const closeMenu = document.getElementById('closeMenu');
  const navLinks = document.getElementById('navLinks');

  if (openMenu) {
      openMenu.addEventListener('click', function() {
          navLinks.classList.add('active');
      });
  }

  if (closeMenu) {
      closeMenu.addEventListener('click', function() {
          navLinks.classList.remove('active');
      });
  }

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();

          // Close mobile menu if open
          if (navLinks.classList.contains('active')) {
              navLinks.classList.remove('active');
          }

          const targetId = this.getAttribute('href');
          
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
              window.scrollTo({
                  top: targetElement.offsetTop - 80,
                  behavior: 'smooth'
              });
          }
      });
  });

  // Testimonial Slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
  }

  // Initialize dots click event
  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          showSlide(index);
      });
  });

  // Auto slide change
  setInterval(() => {
      let nextSlide = currentSlide + 1;
      if (nextSlide >= slides.length) {
          nextSlide = 0;
      }
      showSlide(nextSlide);
  }, 5000);

  // Animate statistics counter
  function animateCounters() {
      const counters = [
          { id: 'cases-resolved', target: 1247 },
          { id: 'countries-covered', target: 27 },
          { id: 'authorities-partnered', target: 52 },
          { id: 'response-time', target: 6 }
      ];

      counters.forEach(counter => {
          const element = document.getElementById(counter.id);
          if (!element) return;

          const duration = 2000; // 2 seconds animation
          const startTime = performance.now();
          const startValue = 0;
          const increment = counter.target;

          function updateCounter(currentTime) {
              const elapsedTime = currentTime - startTime;
              const progress = Math.min(elapsedTime / duration, 1);
              
              const currentValue = Math.floor(progress * (counter.target - startValue));
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
  const impactSection = document.getElementById('impact');
  if (impactSection) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  animateCounters();
                  observer.unobserve(entry.target);
              }
          });
      }, { threshold: 0.2 });

      observer.observe(impactSection);
  }

  // Form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const subject = document.getElementById('subject').value;
          const message = document.getElementById('message').value;
          
          // Form validation would go here
          
          // Simulate form submission
          alert(`Thank you ${name} for your message. We will get back to you soon!`);
          contactForm.reset();
      });
  }

  // Sticky Navbar
  window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
          navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
          navbar.style.padding = '10px 0';
      } else {
          navbar.style.boxShadow = 'none';
          navbar.style.padding = '15px 0';
      }
  });

  // Add active class to nav links based on scroll position
  function updateActiveNavLink() {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-links ul li a');
      
      let current = '';
      
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          
          if (window.scrollY >= (sectionTop - 100)) {
              current = section.getAttribute('id');
          }
      });
      
      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
              link.classList.add('active');
          }
      });
  }
  
  window.addEventListener('scroll', updateActiveNavLink);
});