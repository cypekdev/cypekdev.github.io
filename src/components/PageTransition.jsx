import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, Routes } from "react-router";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";

import useScroll from "../hooks/useScroll";

gsap.registerPlugin(CustomEase, CustomBounce);

export default function PageTransition({ children }) {
  const location = useLocation();

  const [displayedLocation, setDisplayedLocation] =
    useState(location);

  const {
    scrollTo,
    getScroll,
    refresh,
  } = useScroll();

  const containerRef = useRef(null);

  const layerRefs = useRef({});

  const isTransitioning =
    location.pathname !== displayedLocation.pathname;

  const layers = isTransitioning
    ? [
        {
          key: displayedLocation.pathname,
          location: displayedLocation,
          phase: "outgoing",
        },
        {
          key: location.pathname,
          location,
          phase: "incoming",
        },
      ]
    : [
        {
          key: displayedLocation.pathname,
          location: displayedLocation,
          phase: "current",
        },
      ];

  useLayoutEffect(() => {
    if (location.pathname === displayedLocation.pathname) {
      return;
    }

    /*
     * Pobieramy aktualną pozycję za pośrednictwem
     * abstrakcji scrollowania.
     */
    const scrollY = getScroll();

    const outgoingEl =
      layerRefs.current[
        displayedLocation.pathname
      ];

    const incomingEl =
      layerRefs.current[
        location.pathname
      ];

    /*
     * Tutaj potrzebujemy aktualnej pozycji scrolla.
     * Dlatego do API useScroll dodajemy getPosition().
     */
    const ctx = gsap.context(() => {
      // 1. Zamrażamy wychodzącą stronę DOKŁADNIE w miejscu, gdzie
      //    była. position: fixed ustawiamy bezpośrednio przez DOM
      //    (nie GSAP - "position" nie jest właściwością animowalną),
      //    a przesunięcie kompensujące scroll robimy przez
      //    transform (yPercent nie zadziała tu, bo to px, nie %).

      if (outgoingEl) {
        outgoingEl.style.position = "fixed"
        outgoingEl.style.top = "0"
        outgoingEl.style.left = "0"
        outgoingEl.style.right = "0"
        gsap.set(outgoingEl, {y: -scrollY})
      }

      // 2. Wchodząca strona startuje w pozycji "z prawej, niewidoczna"
      if (incomingEl) {
        gsap.set(incomingEl, {xPercent: 100, opacity: 0})
      }

      // 3. Lenis przewija się na górę NATYCHMIAST (bez animacji
      //    scrolla - to nie ma być "smooth scroll to top", tylko
      //    twardy reset dla nowej strony w normalnym flow).
      scrollTo(0, {immediate: true})

      // 4. Właściwa animacja slide.
      //    Uwaga: outgoingEl ma już transform (y: -scrollY) z
      //    kroku 1 - tl.to z xPercent DOPISUJE się do transformu,
      //    GSAP łączy x/y/xPercent/yPercent w jeden matrix, więc
      //    obie transformacje współistnieją bez konfliktu.
      const tl = gsap.timeline({
        defaults: {
          duration: .5,
          ease: CustomEase.create(
            "custom",
            "M0,0 C0,0 0.2,1.03 0.5,1.03 0.6,1.03 0.65,0.99 0.75,0.99 0.85,0.99 0.9,1 1,1",
          ),
        },
        onComplete: () => {
          setDisplayedLocation(location)
          delete layerRefs.current[displayedLocation.pathname]
        },
        onStart: () => {
          refresh()
        },
      })
      if (outgoingEl) {
        tl.to(outgoingEl, {xPercent: -100, opacity: 0}, 0)
      }
      if (incomingEl) {
        tl.to(incomingEl, {xPercent: 0, opacity: 1}, 0)
      }
    }, containerRef)

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {layers.map(
        ({
          key,
          location: layerLocation,
          phase,
        }) => (
          <div
            key={key}
            ref={(el) => {
              if (el) {
                layerRefs.current[key] = el;
              }
            }}
            style={
              phase === "current"
                ? undefined
                : {
                    position: "relative",
                  }
            }
          >
            <Routes location={layerLocation}>
              {children}
            </Routes>
          </div>
        )
      )}
    </div>
  );
}