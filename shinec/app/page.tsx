import { AdvantagesSection } from "@/app/components/home/AdvantagesSection";
import { ContactSection } from "@/app/components/home/ContactSection";
import { GallerySection } from "@/app/components/home/GallerySection";
import { HeroSection } from "@/app/components/home/HeroSection";
import { InfrastructureSection } from "@/app/components/home/InfrastructureSection";
import { LandUseSection } from "@/app/components/home/LandUseSection";
import { MapSection } from "@/app/components/home/MapSection";
import { NewsPreviewSection } from "@/app/components/home/NewsPreviewSection";
import { PartnerSection } from "@/app/components/home/PartnerSection";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { organizationJsonLd } from "@/app/data/site-content";

export default function Home() {

  return (
    <div className="bg-[var(--bg-soft)] text-[var(--text-strong)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <SiteHeader currentPage="home" />

      <main>
        <HeroSection />
        <LandUseSection />
        <AdvantagesSection />
        <InfrastructureSection />
        <NewsPreviewSection />
        <GallerySection />
        <PartnerSection />
        <MapSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
