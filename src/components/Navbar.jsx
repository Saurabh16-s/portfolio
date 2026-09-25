const links = ['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact']

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <span className="text-accent">●</span>
          <span>SAURABH.DEV</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          {links.map((l, i) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className={i === 0 ? 'text-accent' : 'hover:text-accent transition-colors'}
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-gray-300">
          <a href="https://github.com/Saurabh16-s" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent">
            GH
          </a>
          <a href="https://www.linkedin.com/in/saurabhsingh16/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent">
            LI
          </a>
        </div>
      </div>
    </header>
  )
}
