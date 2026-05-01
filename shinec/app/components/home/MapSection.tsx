import { SectionHeading } from "@/app/components/site/SectionHeading";
import { siteInfo } from "@/app/data/site-content";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

export function MapSection() {
  return (
    <section id="ban-do" className="section-block pt-0" data-animate="reveal">
      <SectionHeading eyebrow="Vị trí thực tế" title="Bản đồ khu vực Cụm công nghiệp số 2 Đak Đoa" />
      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
        <FontAwesomeIcon icon={faMapLocationDot} className="h-4 w-4" />
        Vị trí trung tâm kết nối tại huyện Đak Đoa
      </p>
      <div
        className="mt-6 overflow-hidden flex h-96 rounded-2xl border border-[var(--line)] bg-white shadow-[0_18px_40px_rgba(0,107,29,0.12)]"
        data-animate="reveal"
      >
        <Image
          src="/images/map-cover.svg"
          alt="Minh họa vị trí kết nối của Cụm công nghiệp số 2 Đak Đoa"
          width={1200}
          height={620}
          className="h-full flex-1 object-cover"
        />
        <iframe
          src={siteInfo.mapEmbedUrl}
          title="Bản đồ vị trí Cụm công nghiệp số 2 Đak Đoa"
          className="h-full flex-1"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
