import { useState } from 'react'

function iconUrl(logo) {
  if (!logo) return null
  if (logo.type === 'devicon') {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${logo.slug}/${logo.slug}-original.svg`
  }
  if (logo.type === 'simple') {
    return `https://cdn.simpleicons.org/${logo.slug}/ffffff`
  }
  return null
}

export default function TechIcon({ name, logo }) {
  const [failed, setFailed] = useState(false)
  const safeName = name || '?'
  const url = iconUrl(logo)

  if (!url || failed) {
    return (
      <span className="w-6 h-6 rounded bg-line flex items-center justify-center text-[11px] text-accent font-bold flex-shrink-0">
        {safeName.charAt(0)}
      </span>
    )
  }

  return (
    <span className="w-6 h-6 rounded bg-white/90 flex items-center justify-center p-1 flex-shrink-0">
      <img
        src={url}
        alt={`${safeName} logo`}
        className="w-full h-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  )
}