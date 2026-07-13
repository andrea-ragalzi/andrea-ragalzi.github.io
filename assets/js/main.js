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

  const getSectionAtReferenceLine = () => {
    const viewportReference = window.innerHeight * 0.23;
    let activeSection = sections[0];

    for (const section of sections) {
      if (section.getBoundingClientRect().top > viewportReference) {
        break;
      }
      activeSection = section;
    }

    return activeSection;
  };

  const isAtPageEnd = () => (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  );

  const updateFromScrollPosition = () => {
    if (isAtPageEnd()) {
      setActiveSection(sections[sections.length - 1].id);
      return;
    }

    const activeSection = getSectionAtReferenceLine();
    if (activeSection) {
      setActiveSection(activeSection.id);
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

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(() => {
      if (Date.now() >= navigationLockUntil) {
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
    updateFromScrollPosition();
  }
})();
