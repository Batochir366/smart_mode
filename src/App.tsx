import { CustomCursor } from '@/components/CustomCursor'
import { ScrollSmootherRoot } from '@/components/ScrollSmootherRoot'

import { AboutSection } from './components/AboutSection'
import { HeroSection } from './components/HeroSection'
import { MissionVisionSection } from './components/MissionVisionSection'
import { SiteNav } from './components/SiteNav'
import { ProductsSection } from './components/ProductsSection'
import { ServicesSection } from './components/ServicesSection'
import { SiteFooter } from './components/SiteFooter'
import { ContactSection } from './components/ContactSection'


function App() {
  return (
    <div className="min-h-screen bg-black font-sans text-neutral-100 antialiased">

      <CustomCursor />
      <SiteNav />
      <ScrollSmootherRoot>
        <main>
          <HeroSection />
          <div className="relative z-10 -mt-[500px] md:-mt-[900px]">
            <AboutSection />
            <MissionVisionSection />
            <ServicesSection />

            <ProductsSection />
            <ContactSection />
          </div>
        </main>
        <SiteFooter />
      </ScrollSmootherRoot>
    </div>
  )
}

export default App
