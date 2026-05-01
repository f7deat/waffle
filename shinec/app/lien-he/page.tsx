import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { ContactForm } from "@/app/components/site/ContactForm";
import { siteInfo } from "@/app/data/site-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export const metadata: Metadata = {
  title: "Liên hệ đầu tư | Cụm công nghiệp số 2 Đak Đoa",
  description:
    "Thông tin liên hệ và vị trí dự án Cụm công nghiệp số 2 Đak Đoa thuộc Công ty Cổ phần Shinec Gia Lai.",
};

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Liên hệ đầu tư - Cụm công nghiệp số 2 Đak Đoa",
    mainEntity: {
      "@type": "Organization",
      name: "Công ty Cổ phần Shinec Gia Lai",
      email: siteInfo.email,
      telephone: siteInfo.phone,
      sameAs: [siteInfo.facebook],
    },
  };

  return (
    <div className="bg-[var(--bg-soft)] text-[var(--text-strong)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <SiteHeader currentPage="contact" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article
            className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_14px_30px_rgba(0,107,29,0.08)] sm:p-7"
            data-animate="reveal"
          >
            <p className="eyebrow">Liên hệ đầu tư</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-[var(--primary-deep)] sm:text-4xl">
              Kết nối với đội ngũ Shinec Gia Lai
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              Chúng tôi luôn sẵn sàng hỗ trợ nhà đầu tư trong quá trình khảo sát, tìm hiểu mô hình ESG và triển khai dự án tại Cụm công nghiệp số 2 Đak Đoa.
            </p>

            <div className="mt-6 grid gap-3 text-sm sm:text-base">
              <a className="contact-item" href={`mailto:${siteInfo.email}`}>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 h-3.5 w-3.5 text-[var(--primary)]" />
                Email: {siteInfo.email}
              </a>
              <a className="contact-item" href={`tel:${siteInfo.phone}`}>
                <FontAwesomeIcon icon={faPhone} className="mr-2 h-3.5 w-3.5 text-[var(--primary)]" />
                SĐT: {siteInfo.phone}
              </a>
              <a
                className="contact-item"
                href={siteInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookF} className="mr-2 h-3.5 w-3.5 text-[var(--accent-deep)]" />
                Facebook: facebook.com/shinecgialai
              </a>
              <div className="contact-item">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2 h-3.5 w-3.5 text-[var(--primary)]" />
                Địa chỉ: {siteInfo.location}
              </div>
            </div>

            <div className="mt-6">
              <ContactForm />
            </div>
          </article>

          <article
            className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_18px_40px_rgba(0,107,29,0.12)]"
            data-animate="reveal"
          >
            <iframe
              src={siteInfo.mapEmbedUrl}
              title="Bản đồ vị trí Cụm công nghiệp số 2 Đak Đoa"
              className="h-[380px] w-full sm:h-full sm:min-h-[460px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
