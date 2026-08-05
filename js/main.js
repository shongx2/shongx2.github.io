(() => {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const applyReducedMotion = () => {
    document.body.classList.toggle("reduce-motion", reduceMotionQuery.matches);
  };

  applyReducedMotion();
  reduceMotionQuery.addEventListener("change", applyReducedMotion);

  // Smooth anchor scroll (respects reduced motion via CSS / class)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotionQuery.matches ? "auto" : "smooth",
        block: "start",
      });

      if (history.pushState) {
        history.pushState(null, "", id);
      }
    });
  });

  // Section reveal
  const reveals = document.querySelectorAll("[data-reveal]");

  if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  reveals.forEach((el) => observer.observe(el));
})();
