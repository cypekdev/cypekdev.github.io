import { HashRouter as Router, Routes, Route } from "react-router"
import Navigation from "./components/Navigation"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import About from "./pages/About"
import Contact from "./pages/Contact"
import DarkVeil from "./DarkVeil"
import gsap from "gsap"
import { useRef, useEffect } from "react"
import ReactLenis from "lenis/react"

export default function App() {

  const lenisRef = useRef()
  
  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
  
    gsap.ticker.add(update)
  
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <Router>
        <div style={{ width: '100%', minHeight: '100vh', position: 'absolute' }}>
          <div style={{ 
            position: "absolute",  
            width: "100%", 
            height: "100%", 
            overflow: "hidden",
            zIndex: -1}}>      
            <DarkVeil hueShift={14} opacity={.5}/>
          </div>
          
          <Navigation/>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}
