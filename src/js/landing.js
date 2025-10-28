const items = document.querySelectorAll(".provide-item");
      const chemistry = document.getElementById("chemistry");
      const art = document.getElementById("art");

      const navLinks = document.querySelectorAll(".nav-link");

      let hoverTimer;

      // When user hovers on any item
      items.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          clearTimeout(hoverTimer); // cancel the reset timer
          items.forEach((i) => i.classList.remove("active")); // deactivate all
          item.classList.add("active"); // activate hovered item
        });

        item.addEventListener("mouseleave", () => {
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => {
            // after 1 second with no hover, reactivate biology & art
            items.forEach((i) => i.classList.remove("active"));
            chemistry.classList.add("active");
            art.classList.add("active");
          }, 500);
        });
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          const targetId = link.getAttribute("data-target");
          const targetSection = document.getElementById(targetId);

          // Scroll to the target section
          targetSection.scrollIntoView({ behavior: "smooth" });

          // Update active state
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        });
      });