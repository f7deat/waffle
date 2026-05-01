import { partnerLogos } from "@/app/data/site-content";
import { SectionHeading } from "@/app/components/site/SectionHeading";

export function PartnerSection() {
  return (
    <section id="doi-tac" className="section-block" data-animate="reveal">
      <SectionHeading eyebrow="Logo các công ty" title="Mạng lưới ngành nghề có thể kết nối trong cụm" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {partnerLogos.map((item) => (
          <div key={item} className="logo-chip" data-animate="reveal">
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
