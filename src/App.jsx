import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import TechStack from './components/TechStack.jsx'
import Projects from './components/Projects.jsx'
import GithubActivity from './components/GithubActivity.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <div className="grid lg:grid-cols-2">
        <About />
        <TechStack />
      </div>
      <Projects />
      <GithubActivity />
      <Footer />
    </div>
  )
}
