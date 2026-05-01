"use client";

import { useEffect, useState } from "react";
import { siteInfo } from "@/app/data/site-content";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faArrowRight,
  faLocationDot,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const heroSlides = [
  {
    src: "/images/hero-esg.svg",
    alt: "Toan canh cum cong nghiep sinh thai theo dinh huong ESG",
  },
  {
    src: "/images/news-infra.svg",
    alt: "He thong ha tang ky thuat dong bo trong cum cong nghiep",
  },
  {
    src: "/images/map-cover.svg",
    alt: "Ban do ket noi vi tri cum cong nghiep Dak Doa",
  },
];

export function HeroSection() {
  const [slideIndex, setSlideIndex] = useState(0);

  const openContactForm = () => {
    const formAnchor = document.getElementById("contact-form-anchor");
    if (!formAnchor) {
      window.location.hash = "lien-he";
      return;
    }

    formAnchor.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      const firstInput = formAnchor.querySelector<HTMLInputElement>("input, textarea");
      firstInput?.focus();
    }, 350);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const showPrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const showNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-[var(--line)] pt-28 pb-16 sm:pt-32"
      data-animate="reveal"
    >
      <div className="hero-aura pointer-events-none" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6 animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
            <FontAwesomeIcon icon={faLeaf} className="h-3 w-3" />
            Cụm công nghiệp sinh thái định hướng ESG
          </span>
          <h1 className="text-balance text-3xl font-black leading-tight text-[var(--primary-deep)] sm:text-4xl lg:text-5xl">
            Cụm công nghiệp số 2 Đak Đoa
            <br />
            Công ty Cổ phần Shinec Gia Lai
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            Mô hình cụm công nghiệp phát triển theo định hướng ESG, gắn liền với hình ảnh cụm công nghiệp sinh thái,
            chuỗi kinh tế tuần hoàn và thân thiện với môi trường.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={openContactForm}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-mid)]"
            >
              Nhận tư vấn đầu tư
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
            </button>
            <a
              href="#loi-the"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--line)] bg-white px-6 text-sm font-bold text-[var(--primary-deep)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Khám phá lợi thế
            </a>
          </div>
        </div>

        <aside className="glass-card animate-float">
          <div className="hero-slider mb-4" data-animate="reveal">
            <div
              className="hero-slider-track"
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {heroSlides.map((slide, index) => (
                <div className="hero-slide" key={slide.src}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={1200}
                    height={760}
                    className="h-44 w-full object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="hero-slider-control left-2"
              aria-label="Anh truoc"
              onClick={showPrevSlide}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="hero-slider-control right-2"
              aria-label="Anh tiep theo"
              onClick={showNextSlide}
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
            </button>

            <div className="hero-slider-dots">
              {heroSlides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.src}
                  className={`hero-slider-dot ${index === slideIndex ? "hero-slider-dot-active" : ""}`}
                  onClick={() => setSlideIndex(index)}
                  aria-label={`Chon anh ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-lg font-extrabold text-[var(--primary-deep)]">Thông tin nhanh</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li>
              <p className="font-semibold text-[var(--primary)]">
                <span className="inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5" />
                  Vị trí
                </span>
              </p>
              <p className="text-[var(--text-muted)]">{siteInfo.location}</p>
            </li>
            <li>
              <p className="font-semibold text-[var(--primary)]">Định hướng phát triển</p>
              <p className="text-[var(--text-muted)]">Cụm công nghiệp sinh thái, chuỗi kinh tế tuần hoàn</p>
            </li>
            <li>
              <p className="font-semibold text-[var(--primary)]">Trọng tâm kết nối</p>
              <p className="text-[var(--text-muted)]">Hạ tầng đồng bộ, thu hút đầu tư linh hoạt</p>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
