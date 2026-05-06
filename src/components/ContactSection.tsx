import { useCallback, useEffect, useRef, useState } from 'react'

import { Reveal } from '@/components/Reveal'

type InfoItem = {
  label: string
  value: string
  /** Text written to clipboard; defaults to `value` */
  copyText?: string
  icon: 'mail' | 'phone' | 'pin'
}

const info: InfoItem[] = [
  {
    label: 'Mail',
    value: 'info@smartmode.mn',
    icon: 'mail',
  },
  {
    label: 'Phone',
    value: '+976 7711 6644',
    copyText: '+97677116644',
    icon: 'phone',
  },
  {
    label: 'Office',
    value: 'Ulaanbaatar, Mongolia — www.smartmode.mn',
    copyText: 'Ulaanbaatar, Mongolia — https://www.smartmode.mn',
    icon: 'pin',
  },
]

function Icon({ name }: { name: InfoItem['icon'] }) {
  const common = 'h-5 w-5 text-neutral-300'
  switch (name) {
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      )
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      )
    case 'pin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
  }
}

function LinkCopyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export function ContactSection() {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)
  const copiedTimerRef = useRef<number | null>(null)

  const clearCopiedTimer = useCallback(() => {
    if (copiedTimerRef.current != null) {
      window.clearTimeout(copiedTimerRef.current)
      copiedTimerRef.current = null
    }
  }, [])

  useEffect(() => () => clearCopiedTimer(), [clearCopiedTimer])

  const handleCopy = useCallback(
    async (item: InfoItem) => {
      const text = item.copyText ?? item.value
      const ok = await writeClipboard(text)
      if (!ok) return
      clearCopiedTimer()
      setCopiedLabel(item.label)
      copiedTimerRef.current = window.setTimeout(() => {
        setCopiedLabel(null)
        copiedTimerRef.current = null
      }, 2000)
    },
    [clearCopiedTimer]
  )

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-black px-6 py-24 md:px-12 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.45]"
        aria-hidden
      >
        {/* <LightRays
          raysOrigin="top-center"
          raysColor="#2ecc71"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={10}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        /> */}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-2">
        <div className="sticky top-0 flex h-screen items-center">
          <img
            src="/ball.avif"
            alt=""
            className="-ml-40 h-[200px] w-[200px] select-none object-contain opacity-90 blur-[10px] sm:-ml-32 md:-ml-48 md:h-[440px] md:w-[440px] lg:-ml-64"
          />
        </div>
      </div>

      <Reveal className="relative z-10 mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:pl-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            Get In Touch
          </p>
          <h2 className="mt-4 text-5xl font-light tracking-tight text-white md:text-6xl font-benzin">
            Contact
          </h2>

          <div className="mt-12 space-y-4">
            {info.map((item) => {
              const justCopied = copiedLabel === item.label
              return (
                <div
                  key={item.label}
                  className="group relative rounded-2xl border border-white/5 bg-neutral-900/70 p-5 pr-14 backdrop-blur-sm transition hover:border-brand/30 hover:bg-neutral-900"
                >
                  <button
                    type="button"
                    onClick={() => void handleCopy(item)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white/5 hover:text-brand focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand/40"
                    aria-label={justCopied ? `${item.label} copied` : `Copy ${item.label}`}
                  >
                    {justCopied ? (
                      <CheckIcon className="h-4 w-4 text-brand" />
                    ) : (
                      <LinkCopyIcon className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800/80">
                    <Icon name={item.icon} />
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <button
                      type="button"
                      onClick={() => void handleCopy(item)}
                      className="mt-1 w-full text-left text-sm leading-relaxed text-neutral-400 transition select-text hover:text-neutral-200 focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand/40"
                    >
                      {item.value}
                    </button>
                    {justCopied ? (
                      <p className="mt-2 text-xs font-medium text-brand" role="status">
                        Copied to clipboard
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5 rounded-2xl border border-white/5 bg-neutral-900/70 p-6 backdrop-blur-sm md:p-8"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-white">
              Full Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="mt-2 w-full rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label htmlFor="contact-company" className="block text-sm font-medium text-white">
              Company Name
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="AI Innovations Inc."
              className="mt-2 w-full rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="john.doe@aiagency.com"
              className="mt-2 w-full rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-white">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder="Hello! I'd like to learn more about your AI automation services."
              className="mt-2 w-full resize-none rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            Submit
          </button>
        </form>
      </Reveal>
    </section>
  )
}
