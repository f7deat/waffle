"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "../themes/shinec.css";
import { BarsOutlined, CloseOutlined } from "@ant-design/icons";

type SiteHeaderProps = {
  currentPage: "home" | "news" | "contact";
};

const sectionItems = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "loi-the", label: "Lợi thế" },
  { id: "ha-tang", label: "Hạ tầng" },
  { id: "tin-tuc", label: "Tin tức" },
  { id: "hinh-anh", label: "Hình ảnh" },
  { id: "lien-he", label: "Liên hệ" },
];

export function ShinecHeader({ currentPage }: SiteHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionItems[0].id);
  const drawerRef = useRef<HTMLElement | null>(null);

  const sectionHref = (id: string) => {
    return currentPage === "home" ? `#${id}` : `/#${id}`;
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const isActive = (id: string) => currentPage === "home" && activeSection === id;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
    );

    if (focusables && focusables.length > 0) {
      requestAnimationFrame(() => focusables[0].focus());
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !focusables || focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (currentPage !== "home") {
      return;
    }

    const sections = sectionItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) {
          return;
        }

        setActiveSection(visible[0].target.id);
      },
      {
        threshold: [0.22, 0.45, 0.68],
        rootMargin: "-18% 0px -55% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [currentPage]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-primary backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-sm font-black tracking-[0.15em] text-white sm:text-base">
            <img src="https://api.shinecgialai.vn/imgs/logo-white.png" alt="Shinec Logo" className="h-6 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/90 md:flex">
            {sectionItems.map((item) => (
              <a
                key={item.id}
                className={`nav-link ${isActive(item.id) ? "nav-link-active" : ""}`}
                href={sectionHref(item.id)}
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/tin-tuc"
              className="rounded-full border border-white/35 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-1.5">
                Trang Tin tức
              </span>
            </Link>
            <Link
              href="/lien-he"
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[var(--primary)] hover:bg-white/90"
            >
              <span className="inline-flex items-center gap-1.5">
                Trang Liên hệ
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white md:hidden"
            aria-label="Mở menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <BarsOutlined />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/45 backdrop-blur-[1.5px] transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] h-screen w-[86%] max-w-[350px] border-l border-[var(--line)] bg-white p-5 shadow-2xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:hidden ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } ${isDrawerOpen ? "drawer-open" : ""}`}
        aria-hidden={!isDrawerOpen}
        role="dialog"
        aria-label="Menu điều hướng"
        ref={drawerRef}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-black tracking-[0.12em] text-[var(--primary-deep)]">SHINEC MENU</p>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--primary-deep)]"
            aria-label="Đóng menu"
            onClick={closeDrawer}
          >
            <CloseOutlined />
          </button>
        </div>

        <nav className="mt-6 grid gap-2">
          {sectionItems.map((item, index) => (
            <a
              key={item.id}
              href={sectionHref(item.id)}
              className={`drawer-item inline-flex items-center gap-3 rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm font-semibold text-[var(--primary-deep)] ${
                isActive(item.id) ? "drawer-link-active" : ""
              }`}
              onClick={closeDrawer}
              style={{ transitionDelay: `${80 + index * 45}ms` }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-6 grid gap-2">
          <Link
            href="/tin-tuc"
            className="drawer-item inline-flex items-center justify-between rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm font-bold text-[var(--primary-deep)]"
            onClick={closeDrawer}
            style={{ transitionDelay: "320ms" }}
          >
            Trang Tin tức
          </Link>
          <Link
            href="/lien-he"
            className="drawer-item inline-flex items-center justify-between rounded-xl bg-[var(--primary)] px-3 py-2.5 text-sm font-bold text-white"
            onClick={closeDrawer}
            style={{ transitionDelay: "360ms" }}
          >
            Trang Liên hệ
          </Link>
        </div>
      </aside>
    </header>
  );
}
