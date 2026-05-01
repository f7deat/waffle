"use client";

import { useEffect } from "react";
import { animate } from "animejs";

export function ScrollAnimator() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate='reveal']")
    );

    if (!targets.length) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      targets.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return;
    }

    targets.forEach((element) => {
      if (element.dataset.revealed === "true") {
        return;
      }

      element.style.opacity = "0";
      element.style.transform = "translateY(26px)";
      element.style.willChange = "transform, opacity";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;

          if (element.dataset.revealed === "true") {
            observer.unobserve(element);
            return;
          }

          element.dataset.revealed = "true";

          const inlineDelay = element.style.animationDelay || "0ms";
          const parsedDelay = Number.parseFloat(inlineDelay.replace("ms", ""));
          const delay = Number.isFinite(parsedDelay) ? parsedDelay : 0;

          animate(element, {
            opacity: [0, 1],
            y: [26, 0],
            duration: 850,
            delay,
            ease: "outExpo",
            onComplete: () => {
              element.style.willChange = "auto";
            },
          });

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
