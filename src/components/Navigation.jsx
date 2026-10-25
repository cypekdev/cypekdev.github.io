import { NavLink } from "react-router"
import HomeSvg from "../assets/navigation/home.svg?react"
import FaceSvg from "../assets/navigation/face-smiling.svg?react"
import FilesSvg from "../assets/navigation/files.svg?react"
import PaperplaneSvg from "../assets/navigation/paper-airplane.svg?react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Navigation.css"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger);

function Header() {
  const headerRef = useRef(null);

  function handleRefresh() {
    const trigger = ScrollTrigger.getAll()[0];
    trigger.animation.progress(trigger.progress).render(trigger.animation.time(), true, false);
  }

  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    const tween = gsap.fromTo(header, {
      maxWidth: "1000px",
    }, {
      maxWidth: "500px",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=1000",
        scrub: .4,
        // markers: true
      },
      ease: "none",
    });


    addEventListener("scroll:refresh", handleRefresh)

    return (() => {
      removeEventListener("scroll:refresh", handleRefresh)
    })

  }, { scope: headerRef });

  return (
    <header ref={headerRef}>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
    </header>
  )
}


function BottomNavbarElement({SvgComponent, text, to}) {
  return (
    <NavLink to={to} className="bottom-nav-element">
      {({isActive}) => (
        <>
          <SvgComponent style={{ height: 25, width: 25, fill: isActive ? '#fff' : '#bbb'}} />
          <span>{text}</span>
        </>
      )}
    </NavLink>
  )
}

function BottomNavbar() {
  return (
    <nav className="bottom-nav">
      <ul className="bottom-nav-list">
        <li><BottomNavbarElement SvgComponent={ HomeSvg } text="Home" to="/" /></li>
        <li><BottomNavbarElement SvgComponent={ FaceSvg } text="About" to="/about" /></li>
        <li><BottomNavbarElement SvgComponent={ FilesSvg } text="Projects" to="/projects" /></li>
        <li><BottomNavbarElement SvgComponent={ PaperplaneSvg } text="Contact" to="/contact" /></li>
      </ul>
    </nav>
  )
}

export default function Navigation() {
  return (
    <div>
      <Header/>
      <BottomNavbar/>
    </div>
  )
}