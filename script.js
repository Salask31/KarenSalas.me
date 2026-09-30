const header = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const counters = document.querySelectorAll("[data-counter]");

if (reducedMotion || !("IntersectionObserver" in window)) {
  counters.forEach((counter) => {
    counter.textContent = `${counter.dataset.counter}+`;
  });
} else {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.counter);
        const duration = 900;
        const startTime = performance.now();

        function animate(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = `${Math.floor(target * eased)}+`;

          if (progress < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        counterObserver.unobserve(element);
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}


const timeline = document.querySelector("[data-timeline]");
const timelineProgress = document.querySelector(".timeline__progress");
const timelineItems = document.querySelectorAll("[data-timeline-item]");

function updateTimeline() {
  if (!timeline || !timelineProgress) return;

  const rect = timeline.getBoundingClientRect();
  const viewportPoint = window.innerHeight * 0.55;
  const total = rect.height;
  const traveled = Math.min(Math.max(viewportPoint - rect.top, 0), total);
  const progress = (traveled / total) * 100;

  timelineProgress.style.height = `${progress}%`;

  timelineItems.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const active = itemRect.top < viewportPoint && itemRect.bottom > viewportPoint - 120;
    item.classList.toggle("is-active", active);
  });
}

window.addEventListener("scroll", updateTimeline, { passive: true });
window.addEventListener("resize", updateTimeline);
updateTimeline();


// CV download button — burgundy state after activation
document.querySelectorAll('a[download][href*="Karen-Salas-CV.pdf"]').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.add('is-downloaded');
  });
});


// Education Brands — 3-design carousel
document.querySelectorAll('.project-case__education-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.education-carousel__track');
  const slides = [...carousel.querySelectorAll('.education-carousel__slide')];
  const dots = [...carousel.querySelectorAll('.education-carousel__dots button')];
  const prev = carousel.querySelector('.education-carousel__button--prev');
  const next = carousel.querySelector('.education-carousel__button--next');
  let current = 0;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  };

  prev?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
});
