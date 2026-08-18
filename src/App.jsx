import { HashRouter as Router, Routes, Route } from "react-router"
import Navigation from "./components/Navigation"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import About from "./pages/About"
import Contact from "./pages/Contact"
import DarkVeil from "./components/DarkVeil"
import gsap from "gsap"
import { useRef, useEffect } from "react"
import PageTransition from "./components/PageTransition"
import { ScrollProvider } from "./providers/ScrollProvider"
import { ReactLenis } from "lenis/react";


export default function App() {

  return (
    <>
      <ScrollProvider>
        <Router>


          <div className="background-wrapper">      
            <DarkVeil hueShift={14} opacity={.5}/>
          </div>
          
          <Navigation/>

          <PageTransition>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </PageTransition>
        </Router>
      </ScrollProvider>
    </>
  )
}
