import { useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react'; // Wymaga: npm install @gsap/react

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;
    if (scrollContainerRef && !scrollContainerRef.current) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    // 1. Animacja obrotu
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll('.word');

    gsap.fromTo(
      wordElements,
      { 
        opacity: baseOpacity, 
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        willChange: 'opacity, filter' 
      },
      {
        ease: 'none',
        opacity: 1,
        filter: enableBlur ? 'blur(0px)' : 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

  }, {
    // Obiekt konfiguracyjny jako drugi parametr
    dependencies: [scrollContainerRef, scrollContainerRef?.current, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength],
    scope: containerRef // Automatycznie zawęża querySelector tylko do wnętrza tego komponentu
  });

  return (
    <p ref={containerRef} className={`scroll-reveal ${textClassName}`}>
      {splitText}
    </p>
  );
}