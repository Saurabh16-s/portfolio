import PixelFootballGame from './PixelFootballGame.jsx'

const stats = [
  { label: 'Projects', value: '20+' },
  { label: 'APIs Built', value: '67+' },
  { label: 'Open Source PRs', value: '50+' },
  { label: 'Ideas', value: '∞' },
]

export default function Hero() {
  return (
    <section id="home" className="grid-bg">
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <span className="inline-block text-xs px-3 py-1 rounded-full border border-accent/40 text-accent mb-6">
            ● FULL STACK DEVELOPER
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            BUILDING THINGS
            <br />
            THAT FEEL <span className="text-accent">ALIVE.</span>
          </h1>
          <p className="text-gray-400 max-w-md mb-8">
            I'm Saurabh Singh, a full-stack developer who loves building web
            applications, AI-powered tools and interactive experiences like
            this pixel football game.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="#projects"
              className="px-5 py-3 rounded-md bg-accent text-bg font-semibold hover:opacity-90 transition"
            >
              View My Projects →
            </a>
            <a
              href="#contact"
              className="px-5 py-3 rounded-md border border-line hover:border-accent/60 transition"
            >
              Get In Touch
            </a>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-accent">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="game">
          <PixelFootballGame />
        </div>
      </div>
    </section>
  )
}
