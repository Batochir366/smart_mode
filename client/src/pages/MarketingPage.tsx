import { CustomCursor } from '@/components/CustomCursor'
import { ScrollSmootherRoot } from '@/components/ScrollSmootherRoot'
import { SiteNav } from '@/components/SiteNav'
import { MarketingScrollContent } from '@/pages/MarketingScrollContent'

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-neutral-100 antialiased">
      <CustomCursor />
      <SiteNav />
      <ScrollSmootherRoot>
        <MarketingScrollContent />
      </ScrollSmootherRoot>
    </div>
  )
}
