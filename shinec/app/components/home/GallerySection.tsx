"use client";

import { useEffect, useState } from "react";
import { animate } from "animejs";
import Image from "next/image";
import { galleryImages } from "@/app/data/site-content";
import { SectionHeading } from "@/app/components/site/SectionHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = () => setActiveIndex(null);

  const showPrev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + galleryImages.length) % galleryImages.length;
    });
  };

  const showNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % galleryImages.length;
    });
  };

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      const content = document.querySelector<HTMLElement>(".lightbox-content");
      const figure = document.querySelector<HTMLElement>(".lightbox-figure");
      const caption = document.querySelector<HTMLElement>(".lightbox-caption");

      if (content) {
        animate(content, {
          opacity: [0, 1],
          scale: [0.985, 1],
          duration: 260,
          ease: "outQuad",
        });
      }

      if (figure) {
        animate(figure, {
          opacity: [0, 1],
          y: [14, 0],
          duration: 460,
          ease: "outExpo",
        });
      }

      if (caption) {
        animate(caption, {
          opacity: [0, 1],
          y: [8, 0],
          duration: 420,
          delay: 40,
          ease: "outExpo",
        });
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showPrev();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  return (
    <section id="hinh-anh" className="section-block" data-animate="reveal">
      <SectionHeading
        eyebrow="Thư viện hình ảnh"
        title="Một số hình ảnh minh họa cho định hướng phát triển cụm công nghiệp"
      />

      <div className="gallery-grid mt-8">
        {galleryImages.map((item, index) => (
          <article
            key={item.src}
            className="gallery-item"
            data-animate="reveal"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <button
              type="button"
              className="gallery-open-btn"
              onClick={() => setActiveIndex(index)}
              aria-label={`Mo rong anh ${index + 1}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={720}
                height={520}
                className="gallery-thumb"
              />
            </button>
          </article>
        ))}
      </div>

      <div className={`lightbox-layer ${activeIndex !== null ? "lightbox-visible" : ""}`}>
        <button type="button" className="lightbox-backdrop" onClick={closeLightbox} aria-label="Dong lightbox" />

        <div className="lightbox-content" role="dialog" aria-modal="true" aria-label="Xem hinh lon">
          <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Dong">
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>

          {activeIndex !== null && (
            <>
              <button type="button" className="lightbox-nav left-2" onClick={showPrev} aria-label="Anh truoc">
                <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
              </button>
              <button type="button" className="lightbox-nav right-2" onClick={showNext} aria-label="Anh tiep theo">
                <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
              </button>

              <Image
                src={galleryImages[activeIndex].src}
                alt={galleryImages[activeIndex].alt}
                width={1200}
                height={860}
                className="lightbox-figure max-h-[78vh] w-auto max-w-full rounded-xl border border-white/20 object-contain"
              />
              <div className="lightbox-caption mt-3 flex flex-col items-center gap-2 text-center">
                <span className="lightbox-counter">{activeIndex + 1} / {galleryImages.length}</span>
                <p className="text-sm text-white/90">{galleryImages[activeIndex].alt}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
