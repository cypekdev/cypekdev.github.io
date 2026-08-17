import '../App.css'
import './Home.css'
import { LogoElement } from '../components/Logo'
import ScrollReveal from '../components/ScrollReveal'
import ShinyText from '../components/ShinyText'
import StarBorder from '../components/StarBorder'
import TextType from '../components/TextType'
import { Link } from 'react-router'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'



export default function Home() {

  // const heroSectionWrapperRef = useRef(null)
  const heroSectionRef = useRef(null)

  const logoWrapperRef = useRef(null)
  const consoleRef = useRef(null)
  const ctaRef = useRef(null)

  const aboutSectionRef = useRef(null)

  useGSAP(() => {
    // const heroSectionWrapper = heroSectionWrapperRef.current
    const heroSection = heroSectionRef.current
    const logoElement = logoWrapperRef.current
    const consoleElement = consoleRef.current
    const cta = ctaRef.current

    const aboutSection = aboutSectionRef.current


    if (!heroSection) return

    gsap.to(heroSection, {
      yPercent: 40,
      scale: 0.9,           // Delikatne oddalenie (efekt głębi)
      ease: "none",
      scrollTrigger: {
          trigger: heroSection,
          start: "top top",      // start animacji: gdy element dotknie góry ekranu
          end: "+=800",          // koniec animacji: po przewinięciu o 400 pikseli
          scrub: true,           // płynne powiązanie animacji z ruchem scrolla
          // markers: true           // włączenie markerów dla łatwiejszego debugowania
      }}
    );

    gsap.to(heroSection, {
      opacity: 0,
      filter: "blur(10px)",
      ease: "none",
      scrollTrigger: {
          trigger: heroSection,
          start: "top+=200 top",      // start animacji: gdy element dotknie góry ekranu
          end: "+=400",          // koniec animacji: po przewinięciu o 400 pikseli
          scrub: true,           // płynne powiązanie animacji z ruchem scrolla
          // markers: true           // włączenie markerów dla łatwiejszego debugowania
      }}
    );
  }) 



  return (<>
    <section ref={heroSectionRef} style={{
      padding: "200px 0 100px 0",
    }}>

      <div ref={logoWrapperRef}>
        <LogoElement />
      </div>

      <div ref={consoleRef} style={{fontSize: "1.7rem", maxWidth: 900, width: "100%", marginInline: "auto"}}>
        <TextType
          text={[
            "> enjoyer of not only software engineering",
            "> enjoyer of creation",
            "> enjoyer of technology",
            "> previously a LEGO lover",
            "> developer of zs10.zabrze.pl school website",
            "> developer of arduino/raspberry projects",
            "> early IoT developer",
            "> 3D project designer",
            "> short film editor",
            "> singer in the choir", 
            "> singer in the school band",
            "> enjoyer of monospace font"
          ]}
          variableSpeed={{ min: 50, max: 100 }}
          deletingSpeed={30}
        />
        
      </div>


      <div style={{height: 100}} />

      
      <div ref={ctaRef} style={{
        display: "flex", 
        flexDirection: "row",
        justifyContent: "center",
        gap: 32,
        maxWidth: 900,
        width: "100%",
        marginInline: "auto",
        }}>

        <StarBorder 
          as={Link} 
          to={{pathname: "/projects"}}
          color='#00d0ff'
          thickness={2}
          >
          <span style={{fontSize: "1.2rem"}}>View My Work</span>
        </StarBorder>
        <StarBorder 
          as={Link} 
          to={{pathname: "/contact"}}
          color='#0eff0eff'
          thickness={2}
          >
          <span style={{fontSize: "1.2rem"}}>Get in Touch</span>
        </StarBorder>
      </div>  
    </section>


    <section ref={aboutSectionRef} style={{
      textAlign: "center", 
      maxWidth: 900, 
      width: "100%", 
      marginInline: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16
    }}>
      <h2 style={{fontSize: "1.5rem", fontWeight: "normal"}}>
        <ShinyText text="About me"/>
      </h2>

      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={0}
        blurStrength={10}
        wordAnimationEnd="bottom bottom-=25%"
        textClassName='about-me-reveal-text'>
        I’m Cyprian - a curiosity-driven engineer who believes that quality is 
        not an accident, but the result of thoughtful design, clean 
        architecture, and responsibility for every detail.
        I work at the intersection of technology, engineering, and people, building solutions that are meant to last.
      </ScrollReveal>

      <StarBorder 
        as={Link} 
        to={{pathname: "/about"}}
        color='rgb(2, 255, 150)'
        thickness={2}
        >
        <span style={{fontSize: "1.2rem"}}>Know me better</span>
      </StarBorder>



    </section>

    <div style={{height: 60}} />

    <section style={{textAlign: "center", maxWidth: 900, width: "100%", marginInline: "auto"}}>
      <span style={{fontSize: "1.5rem"}}>
        <ShinyText text="Value"/>
      </span>

      <div>
        
      </div>


    </section>

    <div style={{height: 1500}} />
    

  </>)
} 
