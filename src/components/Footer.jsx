export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line mt-10 bg-panel/40">
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 font-bold tracking-wide mb-3">
            <span className="text-accent">●</span>
            <span>SAURABH.DEV</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            Full-stack developer building web apps, AI agents, and interactive
            experiences. Open to internships and collaborations.
          </p>
        </div>

        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#about" className="hover:text-accent transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:text-accent transition-colors">
                Projects
              </a>
            </li>
            <li>
              <a href="#skills" className="hover:text-accent transition-colors">
                Skills
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-accent transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-4">Get In Touch</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="mailto:saurabhsingh050416@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
              >
                <span className="text-accent">Email:</span> saurabhsingh050416@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+917830979460"
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
              >
                <span className="text-accent">Phone:</span> +91 78309 79460
              </a>
            </li>
            <li className="flex gap-4 pt-1">
              <a
                href="https://github.com/Saurabh16-s"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/saurabhsingh16/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>Copyright {new Date().getFullYear()} Saurabh Singh. Built with React and Canvas.</span>
          <a href="#home" className="hover:text-accent transition-colors">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}