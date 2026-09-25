import { useState } from 'react'
import { techStack } from '../data/techStack.js'
import TechIcon from './TechIcon.jsx'

export default function TechStack() {
  const [index, setIndex] = useState(0)
  const current = techStack[index]

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(techStack.length - 1, i + 1))

  return (
    <section id="skills" className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span className="w-1 h-4 bg-accent inline-block" /> TECH STACK
        </h2>
        <span className="text-xs text-gray-500">
          {index + 1} / {techStack.length}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous category"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-line text-gray-300 hover:border-accent/60 hover:text-accent transition-colors disabled:opacity-30 disabled:hover:border-line disabled:hover:text-gray-300"
        >
          ←
        </button>

        <div className="flex-1">
          <h3 className="text-xs text-gray-500 mb-4 tracking-wide uppercase">{current.category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {current.items.map((t) => (
              <div
                key={t.name}
                className="rounded-lg border border-line bg-panel py-4 px-3 flex items-center gap-2 hover:border-accent/50 transition-colors"
              >
                <TechIcon name={t.name} logo={t.logo} />
                <span className="text-sm text-gray-300">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          disabled={index === techStack.length - 1}
          aria-label="Next category"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-line text-gray-300 hover:border-accent/60 hover:text-accent transition-colors disabled:opacity-30 disabled:hover:border-line disabled:hover:text-gray-300"
        >
          →
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-6">
        {techStack.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to category ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-accent' : 'bg-line'}`}
          />
        ))}
      </div>
    </section>
  )
}