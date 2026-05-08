import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Reveal } from '@/components/Reveal'
import { InlineField } from '@/components/admin/InlineField'
import { getApiBaseUrl } from '@/lib/api'
import { useSiteContent } from '@/site/SiteContentContext'

function Icon({ name }: { name: 'mail' | 'phone' | 'pin' }) {
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

type InfoItemShape = {
  id: string
  label: string
  value: string
  copyText?: string
  icon: 'mail' | 'phone' | 'pin'
}

export function ContactSection() {
  const { data, variant, setData } = useSiteContent()
  const contactCtx = data.contact
  const info = contactCtx.info

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
    async (item: InfoItemShape) => {
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
    [clearCopiedTimer],
  )

  const [submitState, setSubmitState] = useState<'idle' | 'pending' | 'ok' | 'err'>('idle')
  const [submitMessage, setSubmitMessage] = useState<string>('')

  const onSubmitPublic = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (variant !== 'live') return
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const company = String(fd.get('company') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    setSubmitState('pending')
    setSubmitMessage('')
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, email, message }),
      })
      if (!res.ok) {
        setSubmitState('err')
        setSubmitMessage('Could not send — try again later.')
        return
      }
      setSubmitState('ok')
      setSubmitMessage('Thanks — we received your message.')
      e.currentTarget.reset()
    } catch {
      setSubmitState('err')
      setSubmitMessage('Network error — check your connection.')
    }
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-black px-6 py-24 md:px-12 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.45]"
        aria-hidden
      />
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
          <div className='flex flex-col'>
            <InlineField
              variant={variant}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-brand"
              value={contactCtx.eyebrow}
              onChange={(next) =>
                setData((d) => ({
                  ...d,
                  contact: { ...d.contact, eyebrow: next },
                }))
              }
            />
            <InlineField
              variant={variant}
              className="mt-4 font-benzin text-5xl font-light tracking-tight text-white md:text-6xl"
              value={contactCtx.title}
              onChange={(next) =>
                setData((d) => ({
                  ...d,
                  contact: { ...d.contact, title: next },
                }))
              }
            />
          </div>

          <div className="mt-12 space-y-4">
            {info.map((item) => {
              const justCopied = copiedLabel === item.label
              return (
                <div
                  key={item.id}
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
                    <div className="text-sm font-semibold text-white">
                      <InlineField
                        variant={variant}
                        className="text-sm font-semibold text-white"
                        value={item.label}
                        onChange={(next) =>
                          setData((d) => ({
                            ...d,
                            contact: {
                              ...d.contact,
                              info: d.contact.info.map((row) =>
                                row.id === item.id ? { ...row, label: next } : row,
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div
                      role={variant === 'live' ? 'button' : undefined}
                      tabIndex={variant === 'live' ? 0 : undefined}
                      onClick={
                        variant === 'live'
                          ? () => {
                            void handleCopy(item)
                          }
                          : undefined
                      }
                      onKeyDown={
                        variant === 'live'
                          ? (ev) => {
                            if (ev.key === 'Enter' || ev.key === ' ') {
                              ev.preventDefault()
                              void handleCopy(item)
                            }
                          }
                          : undefined
                      }
                      className="mt-1 w-full text-left text-sm leading-relaxed text-neutral-400 transition select-text hover:text-neutral-200 focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand/40"
                    >
                      <InlineField
                        variant={variant}
                        className="text-left text-sm leading-relaxed text-neutral-400"
                        value={item.value}
                        onChange={(next) =>
                          setData((d) => ({
                            ...d,
                            contact: {
                              ...d.contact,
                              info: d.contact.info.map((row) =>
                                row.id === item.id ? { ...row, value: next } : row,
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    {variant === 'admin' ? (
                      <div className="mt-2">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500">Copy text (optional)</p>
                        <InlineField
                          variant={variant}
                          className="mt-1 font-mono text-xs text-neutral-300"
                          value={item.copyText ?? ''}
                          onChange={(next) =>
                            setData((d) => ({
                              ...d,
                              contact: {
                                ...d.contact,
                                info: d.contact.info.map((row) =>
                                  row.id === item.id
                                    ? { ...row, copyText: next.trim() === '' ? undefined : next }
                                    : row,
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                    ) : null}
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
          onSubmit={(e) => void onSubmitPublic(e)}
          className="space-y-5 rounded-2xl border border-white/5 bg-neutral-900/70 p-6 backdrop-blur-sm md:p-8"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-white">
              Нэр
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              disabled={variant === 'admin'}
              className="mt-2 w-full rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="contact-company" className="block text-sm font-medium text-white">
              Компанийн нэр
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="AI Innovations Inc."
              disabled={variant === 'admin'}
              className="mt-2 w-full rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-white">
              И-мэйл хаяг
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="john.doe@aiagency.com"
              disabled={variant === 'admin'}
              className="mt-2 w-full rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-white">
              Мессеж
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder="Hello! I'd like to learn more about your AI automation services."
              disabled={variant === 'admin'}
              className="mt-2 w-full resize-none rounded-lg border border-white/5 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={variant === 'admin' || submitState === 'pending'}
            className="w-full rounded-lg bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {variant === 'admin' ? 'Submit (disabled in editor)' : submitState === 'pending' ? 'Sending…' : 'Submit'}
          </button>
          {variant === 'live' && submitMessage ? (
            <p
              className={`text-sm ${submitState === 'ok' ? 'text-brand' : 'text-red-400'}`}
              role="status"
            >
              {submitMessage}
            </p>
          ) : null}
        </form>
      </Reveal>
    </section>
  )
}
