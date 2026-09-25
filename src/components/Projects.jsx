import { useState } from 'react'
import { projects } from '../data/projects.js'

const VISIBLE = 3

export default function Projects() {
  const maxIndex = Math.max(0, projects.length - VISIBLE)
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1))
  const visible = projects.slice(index, index + VISIBLE)

  return (
    <section id="projects" className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span className="w-1 h-4 bg-accent inline-block" /> PROJECTS
        </h2>
        <span className="text-xs text-gray-500">
          {index + 1}–{index + visible.length} of {projects.length}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous projects"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-line text-gray-300 hover:border-accent/60 hover:text-accent transition-colors disabled:opacity-30 disabled:hover:border-line disabled:hover:text-gray-300"
        >
          ←
        </button>

        <div className="flex-1 grid md:grid-cols-3 gap-6">
          {visible.map((p) => (
            <div key={p.title} className="rounded-lg border border-line bg-panel overflow-hidden flex flex-col">
              <div className="h-40 bg-line overflow-hidden relative flex-shrink-0">
                {p.image ? (
                  <img src={p.image} alt={`${p.title} screenshot`} className="w-full h-full object-cover" />
                ) : null}
                <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-bg/70 border border-line">
                  {p.tag}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 mb-4 flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.stack.map((s) => (
                    <span key={s} className="text-[11px] px-2 py-1 rounded border border-line text-gray-400">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm">
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                      Live Demo ↗
                    </a>
                  )}
                  <a href={p.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent">
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={next}
          disabled={index === maxIndex}
          aria-label="Next projects"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-line text-gray-300 hover:border-accent/60 hover:text-accent transition-colors disabled:opacity-30 disabled:hover:border-line disabled:hover:text-gray-300"
        >
          →
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to position ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-accent' : 'bg-line'}`}
          />
        ))}
      </div>
    </section>
  )
}