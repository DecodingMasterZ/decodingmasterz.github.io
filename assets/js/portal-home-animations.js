(function () {
  "use strict";

  function setupHeroParallax() {
    var hero = document.querySelector(".portal-hero");
    var visual = document.querySelector(".portal-visual");
    if (!hero || !visual) return;

    visual.style.willChange = "transform";

    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      var relX = (event.clientX - rect.left) / rect.width - 0.5;
      var relY = (event.clientY - rect.top) / rect.height - 0.5;
      var moveX = relX * -28;
      var moveY = relY * -22;

      visual.style.transform =
        "translate3d(" + moveX.toFixed(2) + "px, " + moveY.toFixed(2) + "px, 0)";
    });

    hero.addEventListener("mouseleave", function () {
      visual.style.transform = "translate3d(0, 0, 0)";
    });
  }

  function splitNumber(value) {
    var text = String(value).trim();
    var match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    return {
      number: parseFloat(match[1]),
      suffix: match[2] || ""
    };
  }

  function animateValue(element, target, suffix) {
    var duration = 1600;
    var startTime = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  function setupCounterAnimation() {
    var counterSection = document.querySelector(".portal-home-counter");
    if (!counterSection) return;

    var numbers = Array.prototype.slice.call(
      counterSection.querySelectorAll(".counter-contents h2 span")
    );
    var parsed = numbers
      .map(function (element) {
        var result = splitNumber(element.textContent);
        if (!result) return null;
        element.dataset.counterTarget = result.number;
        element.dataset.counterSuffix = result.suffix;
        element.textContent = "0" + result.suffix;
        return element;
      })
      .filter(Boolean);

    if (!parsed.length) return;

    var started = false;
    var startCounters = function () {
      if (started) return;
      started = true;
      parsed.forEach(function (element) {
        animateValue(
          element,
          Number(element.dataset.counterTarget),
          element.dataset.counterSuffix || ""
        );
      });
    };

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              startCounters();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(counterSection);
    } else {
      startCounters();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupHeroParallax();
    setupCounterAnimation();
  });
})();
