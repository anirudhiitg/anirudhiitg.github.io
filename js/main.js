/* =============================================
   THE GREEN HABIT FARM — Main JavaScript
   ============================================= */

// === Navbar scroll effect ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// === Mobile menu toggle ===
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger to X
  const spans = toggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// === Intersection Observer — fade-in on scroll ===
const fadeEls = document.querySelectorAll('.habit-card, .product-card, .update-card, .process-step, .hero-card-sm');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  observer.observe(el);
});

// === WhatsApp order helpers ===
// Replace +91XXXXXXXXXX with your actual WhatsApp number
const WHATSAPP_NUMBER = '+919401609262';

function orderOnWhatsApp(product) {
  const messages = {
    moringa: "Hi! I'd like to order *Moringa Powder* from Rustic Farms. Please share availability and pricing. 🌿",
    amla: "Hi! I'd like to order *Amla Powder* from Rustic Farms. Please share availability and pricing. 🍋",
    retreat: "Hi! I'm interested in visiting Rustic Farms for a farm stay. Could you share more details? 🏡",
    general: "Hi! I'd like to place an order from Rustic Farms. Could you share your available products and pricing? 🌱"
  };
  const msg = encodeURIComponent(messages[product] || messages.general);
  window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}?text=${msg}`, '_blank');
}

// Attach to buttons
document.querySelectorAll('[data-order]').forEach(btn => {
  btn.addEventListener('click', () => orderOnWhatsApp(btn.dataset.order));
});
