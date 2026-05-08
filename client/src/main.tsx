import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

import './index.css'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement?: ((new (options: object, elementId: string) => unknown) & {
          InlineLayout?: { SIMPLE?: number }
        })
      }
    }
  }
}

const blockIosZoomGestures = () => {
  if (typeof window === 'undefined') return

  let lastTouchEnd = 0

  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    { passive: false },
  )

  document.addEventListener(
    'gesturestart',
    (event) => {
      event.preventDefault()
    },
    { passive: false },
  )
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'EN',
  mn: 'MNG',
}

const relabelGoogleTranslateOptions = () => {
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (!select) return

  for (const option of Array.from(select.options)) {
    const short = option.value ? LANGUAGE_LABELS[option.value] : ''
    if (short) option.text = short
  }
}

const watchGoogleTranslateSelect = () => {
  const shell = document.getElementById('google_translate_element')
  if (!shell) return

  relabelGoogleTranslateOptions()

  const observer = new MutationObserver(() => {
    relabelGoogleTranslateOptions()
  })
  observer.observe(shell, { childList: true, subtree: true })
}

const initGoogleTranslate = () => {
  if (typeof window === 'undefined') return
  if (document.getElementById('google-translate-script')) return

  window.googleTranslateElementInit = () => {
    const TranslateElement = window.google?.translate?.TranslateElement
    if (!TranslateElement) return
    new TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'mn,en',
        autoDisplay: false,
        layout: TranslateElement.InlineLayout?.SIMPLE,
      },
      'google_translate_element',
    )
    watchGoogleTranslateSelect()
  }

  const script = document.createElement('script')
  script.id = 'google-translate-script'
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  document.body.appendChild(script)
}

blockIosZoomGestures()
initGoogleTranslate()
document.documentElement.lang = 'en'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)