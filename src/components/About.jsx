export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-sm font-semibold text-gray-300 mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-accent inline-block" /> ABOUT ME
      </h2>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <img
          src="/pic.png"
          alt="Saurabh Singh"
          className="w-32 h-32 rounded-lg object-cover flex-shrink-0 border border-line"
        />
        <div>
          <h3 className="text-xl font-bold mb-3">Hey, I'm Saurabh Singh.</h3>
          <p className="text-gray-400 max-w-2xl mb-4">
            A Computer Science undergraduate and a full-stack developer
            interested in building scalable web apps, AI agents and fun
            interactive projects. I enjoy working with modern tech stacks and
            turning ideas into real products.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span>📍 Haridwar, Uttarakhand</span>
            <span>🎓 B.Tech CSE</span>
            <span>📖 Always learning</span>
          </div>
        </div>
      </div>
    </section>
  )
}