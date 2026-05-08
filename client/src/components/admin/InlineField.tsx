import type { SiteContentVariant } from '@/site/SiteContentContext'

type InlineFieldProps = {
  variant: SiteContentVariant
  as?: 'input' | 'textarea'
  value: string
  onChange: (next: string) => void
  /** Applied to live markup and editor control */
  className?: string
  placeholder?: string
  rows?: number
}

const editorShell =
  'w-full resize-none rounded-lg bg-neutral-950 px-2 py-1.5 shadow-inner shadow-black/40 outline-none transition focus:border-brand/70 focus:ring-2 focus:ring-brand/25 placeholder:text-neutral-600'

export function InlineField({
  variant,
  as = 'input',
  value,
  onChange,
  className,
  placeholder,
  rows = 4,
}: InlineFieldProps) {
  if (variant === 'live') {
    const Tag = as === 'textarea' ? 'p' : 'span'
    return (
      <Tag className={className}>
        {as === 'textarea' ? (
          <>
            {value.split('\n').map((line, idx) => (
              <span key={idx}>
                {idx > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </>
        ) : (
          value
        )}
      </Tag>
    )
  }

  const cls = `${editorShell}${className ? ` ${className}` : ''}`
  if (as === 'textarea') {
    return (
      <textarea
        rows={rows}
        className={cls}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  return (
    <input
      type="text"
      className={cls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
