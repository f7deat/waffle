import Link from "next/link";
import { siteInfo } from "@/app/data/site-content";
import { SectionHeading } from "@/app/components/site/SectionHeading";
import { ContactForm } from "@/app/components/site/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export function ContactSection() {
  return (
    <section id="lien-he" className="section-block pb-20" data-animate="reveal">
      <div className="contact-wrap" data-animate="reveal">
        <div className="space-y-3">
          <SectionHeading
            eyebrow="Liên hệ"
            title="Cùng xây dựng nền công nghiệp xanh tại Gia Lai"
          />
          <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Đội ngũ Shinec Gia Lai luôn sẵn sàng hỗ trợ doanh nghiệp khảo sát, tư vấn và kết nối đầu tư.
          </p>
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
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-deep)] hover:underline"
          >
            Truy cập trang liên hệ chi tiết
            <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 text-sm sm:text-base">

          <div id="contact-form-anchor">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
