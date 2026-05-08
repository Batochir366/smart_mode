import { AboutSection } from '@/components/AboutSection'
import { AdvantagesSection } from '@/components/AdvantagesSection'
import { HeroSection } from '@/components/HeroSection'
import { MissionVisionSection } from '@/components/MissionVisionSection'
import { ProductsSection } from '@/components/ProductsSection'
import { ServicesSection } from '@/components/ServicesSection'
import { SiteFooter } from '@/components/SiteFooter'
import { ContactSection } from '@/components/ContactSection'
import { TickerBanner } from '@/components/TickerBanner'
import { useSiteContent } from '@/site/SiteContentContext'

export function MarketingScrollContent() {
  const { variant } = useSiteContent()

  return (
    <>
      <main>
        <HeroSection />
        <div
          className={
            variant === 'live'
              ? 'relative z-10 -mt-[500px] md:-mt-[900px]'
              : 'relative z-10'
          }
        >
          <AboutSection />
          <TickerBanner />
          <MissionVisionSection />
          <AdvantagesSection />
          <ServicesSection />


          <ProductsSection />

          <ContactSection />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
