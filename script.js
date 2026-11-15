// Ceylon Odyssey Travels — navigation and booking interactions
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const modal = document.getElementById("bookingModal");
const selectedPackage = document.getElementById("selectedPackage");
const modalContactLink = document.getElementById("modalContactLink");
const bookButtons = document.querySelectorAll(".book-btn");

function closeMenu() {
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
    navItems.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// Update the active navigation item as sections enter the viewport.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => observer.observe(section));
}

function openBookingModal(packageName) {
  selectedPackage.textContent = packageName;
  const subject = encodeURIComponent(`Enquiry about ${packageName}`);
  modalContactLink.href = `mailto:hello@ceylonodysseytravels.com?subject=${subject}`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeBookingModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

bookButtons.forEach((button) => {
  button.addEventListener("click", () => openBookingModal(button.dataset.package));
});

modal.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeBookingModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeBookingModal();
  }
  if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

// Keep the footer year current automatically.
document.getElementById("year").textContent = new Date().getFullYear();

// Close the mobile menu if the viewport grows back to desktop size.
window.addEventListener("resize", () => {
  if (window.innerWidth > 680) closeMenu();
});


// Floating back-to-top control.
const backToTopButton = document.querySelector('.back-to-top');
const updateBackToTop = () => backToTopButton.classList.toggle('visible', window.scrollY > 450);
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

// Close the mobile menu when clicking outside it.
document.addEventListener('click', (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

// Keep keyboard focus inside the booking dialog while it is open, then restore it.
let previouslyFocusedElement = null;
const originalOpenBookingModal = openBookingModal;
openBookingModal = function(packageName) {
  previouslyFocusedElement = document.activeElement;
  originalOpenBookingModal(packageName);
};
const originalCloseBookingModal = closeBookingModal;
closeBookingModal = function() {
  originalCloseBookingModal();
  if (previouslyFocusedElement) previouslyFocusedElement.focus();
};
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || !modal.classList.contains('is-open')) return;
  const focusable = [...modal.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

// Honour reduced-motion preferences for in-page anchor navigation.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const selector = link.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
});
