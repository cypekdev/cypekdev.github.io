import '../App.css'
import './Home.css'
import { LogoElement } from '../components/Logo'
import ScrollReveal from '../components/ScrollReveal'
import ShinyText from '../components/ShinyText'
import StarBorder from '../components/StarBorder'
import TextType from '../components/TextType'
import { Link } from 'react-router'



export default function Home() {
  return (<>
    <div style={{height: 200}} />

    <LogoElement />


    <div style={{fontSize: "1.7rem", width: "900px", marginInline: "auto"}}>
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

    <div style={{
      display: "flex", 
      flexDirection: "row",
      justifyContent: "center",
      gap: 32,
      width: 900,
      marginInline: "auto",
      }}>

      <StarBorder 
        as={Link} 
        to={{pathname: "/contact"}}
        color='#0eff0eff'
        thickness={2}
        >
        <span style={{fontSize: "1.2rem"}}>Get in Touch</span>
      </StarBorder>
    </div>

    <div style={{height: 150}} />
  

    <section style={{textAlign: "center", width: "900px", marginInline: "auto"}}>
      <span style={{fontSize: "1.5rem"}}>
        <ShinyText text="About me"/>
      </span>


      <br />

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
        color='#0eabffff'
        thickness={2}
        >
        <span style={{fontSize: "1.2rem"}}>Know me better</span>
      </StarBorder>



    </section>

    <div style={{height: 60}} />

    <section style={{textAlign: "center", width: "900px", marginInline: "auto"}}>
      <span style={{fontSize: "1.5rem"}}>
        <ShinyText text="Value"/>
      </span>

      <div>
        
      </div>


    </section>

    <div style={{height: 1500}} />
    

  </>)
} 
