"use strict";

{
  const mediaQuery = window.matchMedia("only screen and (min-width: 36rem)");

  if (mediaQuery.matches) {
    requestAnimationFrame(initAccordions);
  } else {
    mediaQuery.addEventListener("change", initAccordions, { once: true })
  }
}

function initAccordions() {
  const ARIA_EXPANDED = "aria-expanded";
  const TRUE = "true";
  const FALSE = "false";

  for (const accordion of document.getElementsByClassName("accordion")) {
    const scrollThumb = accordion.previousElementSibling.firstElementChild;
    const headers = accordion.getElementsByTagName("h3");
    let expandedHeader = 0;

    for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
      const header = headers[headerIndex];

      const expandHeader = () => {
        if (expandedHeader === headerIndex) {
          return;
        }

        // Track expanded header
        const previousIndex = expandedHeader;
        const nextIndex = headerIndex;
        expandedHeader = headerIndex;

        const previousHeader = headers[previousIndex];
        const previousContainer = previousHeader.nextElementSibling;
        const previousButton = previousHeader.firstElementChild;

        const nextHeader = headers[nextIndex];
        const nextContainer = nextHeader.nextElementSibling;
        const nextButton = nextHeader.firstElementChild;

        // Measure container
        const nextheaderHeight = nextHeader.scrollHeight;
        const nextContentHeight = nextContainer.scrollHeight;

        // Update state
        previousContainer.style.maxHeight = `${previousContainer.scrollHeight}px`;
        previousButton.setAttribute(ARIA_EXPANDED, FALSE);
        nextButton.setAttribute(ARIA_EXPANDED, TRUE);
        scrollThumb.style.height = `${nextheaderHeight + nextContentHeight}px`;
        scrollThumb.style.transform = `translateY(${nextheaderHeight * headerIndex}px)`;

        // Trigger expansion animation
        requestAnimationFrame(() => {
          previousContainer.style.maxHeight = "0px";
          previousContainer.style.opacity = "0";
          nextContainer.style.maxHeight = `${nextContentHeight}px`;
          nextContainer.style.opacity = "1";
        });
      };

      const button = header.firstElementChild;
      button.addEventListener("focus", expandHeader, { capture: true });
      button.addEventListener("pointerenter", expandHeader, { capture: true });

      const container = header.nextElementSibling;

      if (expandedHeader === headerIndex) {
        scrollThumb.style.height = `${header.scrollHeight + container.scrollHeight}px`;
        scrollThumb.style.transform = "translateY(0px)";
        container.style.opacity = "1";
      } else {
        button.setAttribute(ARIA_EXPANDED, FALSE);
        container.style.opacity = "0";
        container.style.maxHeight = "0px";
      }

      container.addEventListener(
        "transitionend",
        function handleTransitionEnd() {
          if (expandedHeader === headerIndex) {
            const container = scrollThumb.parentElement;
            const header = this.previousElementSibling;
            const offset = Math.round(header.getBoundingClientRect().y - container.getBoundingClientRect().y);

            // Clear maxHeight to avoid clipping when content becomes bigger (e.g. user zooms).
            this.style.maxHeight = "";
            // Correct position of the scroll-thumb. At the start of the transition it is only an estimated value.
            scrollThumb.style.transform = `translateY(${offset}px)`;
          }
        },
        { capture: true }
      );
    }
  }
}

function mobileScroll(id) {
  document.getElementById(id).scrollIntoView({block: "nearest"});
}