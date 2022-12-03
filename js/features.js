"use strict";

// {
//   const mediaQuery = window.matchMedia("only screen and (min-width: 36rem)");

//   if (mediaQuery.matches) {
//     requestAnimationFrame(initAccordions);
//     mediaQuery.addEventListener("change", initTabs, { once: true });
//   } else {
//     requestAnimationFrame(initTabs);
//     mediaQuery.addEventListener("change", initAccordions, { once: true });
//   }
// }

requestAnimationFrame(initAccordions);

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
        requestAnimationFrame(() =>
          // Calling requestAnimationFrame inside another ensures that the callback is only executed in the next frame.
          requestAnimationFrame(() => {
            previousContainer.style.maxHeight = "0px";
            previousContainer.style.opacity = "0";
            nextContainer.style.maxHeight = `${nextContentHeight}px`;
            nextContainer.style.opacity = "1";
          })
        );
      };

      const button = header.firstElementChild;
      button.addEventListener("click", expandHeader, { capture: true });
      button.addEventListener("mouseenter", expandHeader, { capture: true });

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
            const container = this.parentElement;
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

function initTabs() {
  const ARIA_SELECTED = "aria-selected";
  const TRUE = "true";
  const FALSE = "false";
  const REGISTER_FOCUS = 0;
  const UNREGISTER_FOCUS = -1;

  for (const tabs of document.getElementsByClassName("tabs")) {
    const tablist = tabs.firstElementChild;
    const buttons = tablist.children;
    const scrollThumb = tablist.nextElementSibling.firstElementChild;
    const tabpanels = tabs.lastElementChild.children;
    const tabCount = Math.min(buttons.length, tabpanels.length);
    let selectedTab = 0;

    tablist.addEventListener("keydown", function handleArrowKeys(event) {
      let nextButton;
      if (event.key === "ArrowRight") {
        nextButton = event.target.nextElementSibling || this.firstElementChild;
      } else if (event.key === "ArrowLeft") {
        nextButton = event.target.previousElementSibling || this.lastElementChild;
      } else {
        return;
      }
      nextButton.focus({ preventScroll: true });
      nextButton.click();
    }, { capture: true });

    for (let tabIndex = 0; tabIndex < tabCount; tabIndex++) {
      buttons[tabIndex].addEventListener("click", () => selectTab(tabIndex), { capture: true });

      if (selectedTab === tabIndex) {
        buttons[tabIndex].setAttribute(ARIA_SELECTED, TRUE);
        tabpanels[tabIndex].tabIndex = REGISTER_FOCUS;
      } else {
        buttons[tabIndex].tabIndex = UNREGISTER_FOCUS;
        tabpanels[tabIndex].tabIndex = UNREGISTER_FOCUS;
      }
    }

    const selectTab = (tabIndex) => {
      if (selectedTab === tabIndex) {
        return;
      }

      // Track selected tab
      const previousIndex = selectedTab;
      const nextIndex = tabIndex;
      selectedTab = tabIndex;

      buttons[previousIndex].setAttribute(ARIA_SELECTED, FALSE);
      buttons[previousIndex].tabIndex = UNREGISTER_FOCUS;
      tabpanels[previousIndex].tabIndex = UNREGISTER_FOCUS;

      buttons[nextIndex].setAttribute(ARIA_SELECTED, TRUE);
      buttons[nextIndex].tabIndex = REGISTER_FOCUS;
      tabpanels[nextIndex].tabIndex = REGISTER_FOCUS;

      scrollThumb.style.transform = `translateX(${100 * tabIndex}%)`;
      tabpanels[nextIndex].scrollIntoView({ block: "nearest" });
    };
  }
}
