(() => {
  "use strict";

  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  const navigationLinks = Array.from(document.querySelectorAll(".section-nav a[href^='#']"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (navigationLinks.length === 0 || sections.length === 0) {
    return;
  }

  let navigationLockUntil = 0;

  const setActiveSection = (sectionId) => {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const getClosestSection = () => {
    const viewportReference = window.innerHeight * 0.32;
    let closestSection = sections[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section) => {
      const distance = Math.abs(section.getBoundingClientRect().top - viewportReference);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    return closestSection;
  };

  const isAtPageEnd = () => (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  );

  const updateFromScrollPosition = () => {
    if (isAtPageEnd()) {
      setActiveSection(sections[sections.length - 1].id);
      return;
    }

    const closestSection = getClosestSection();
    if (closestSection) {
      setActiveSection(closestSection.id);
    }
  };

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const sectionId = link.getAttribute("href")?.slice(1);
      if (sectionId) {
        navigationLockUntil = Date.now() + 900;
        setActiveSection(sectionId);
      }
    });
  });

  window.addEventListener("hashchange", () => {
    const sectionId = window.location.hash.slice(1);
    if (sections.some((section) => section.id === sectionId)) {
      navigationLockUntil = Date.now() + 500;
      setActiveSection(sectionId);
    }
  });

  const supportsIntersectionObserver = "IntersectionObserver" in window;

  if (supportsIntersectionObserver) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < navigationLockUntil) {
          return;
        }

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -65% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(() => {
      if (isAtPageEnd()) {
        setActiveSection(sections[sections.length - 1].id);
      } else if (!supportsIntersectionObserver && Date.now() >= navigationLockUntil) {
        updateFromScrollPosition();
      }
      ticking = false;
    });

    ticking = true;
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  const initialSection = window.location.hash.slice(1);
  if (sections.some((section) => section.id === initialSection)) {
    setActiveSection(initialSection);
  } else {
    setActiveSection(sections[0].id);
    if (!supportsIntersectionObserver) {
      updateFromScrollPosition();
    }
  }
})();
