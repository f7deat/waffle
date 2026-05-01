import { infrastructures } from "@/app/data/site-content";
import { SectionHeading } from "@/app/components/site/SectionHeading";

export function InfrastructureSection() {
  return (
    <section id="ha-tang" className="section-block" data-animate="reveal">
      <SectionHeading eyebrow="Hạ tầng kỹ thuật" title="Hệ thống kỹ thuật đồng bộ và hiện đại" />
      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {infrastructures.map((item, index) => (
          <div
            key={item}
            className="infra-item"
            style={{ animationDelay: `${index * 60}ms` }}
            data-animate="reveal"
          >
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
            <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
