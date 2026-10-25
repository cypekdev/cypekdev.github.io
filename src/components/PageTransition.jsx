import { useLayoutEffect, useRef, useState, useMemo, Children, Fragment, isValidElement } from "react";
import { useLocation, Routes } from "react-router";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import useScroll from "../hooks/useScroll";

gsap.registerPlugin(CustomEase, CustomBounce, ScrollTrigger);


function getRouteIndex(routeOrder, pathname) {
  const index = routeOrder.indexOf(pathname);
  // Nieznana trasa (np. 404, trasa z parametrem) traktowana jako
  // "na końcu" - wchodzi zawsze z prawej, nie blokuje animacji.
  return index === -1 ? routeOrder.length : index;
}

function getRoutePaths(children) {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment) return getRoutePaths(child.props.children);
    return child.props.path ? [child.props.path] : [];
  });
}

export default function PageTransition({ children, backgroundRef }) {
  const location = useLocation();

  const [displayedLocation, setDisplayedLocation] =
    useState(location);


  const routeOrder = useMemo(() => getRoutePaths(children), [children]);

  const {
    scrollTo,
    getScroll,
    refresh,
  } = useScroll();

  const containerRef = useRef(null);

  const layerRefs = useRef({});

  const isTransitioning =
    location.pathname !== displayedLocation.pathname;

  useLayoutEffect(() => {
    if (isTransitioning) return;

    ScrollTrigger.refresh();
    refresh();
  }, [isTransitioning, refresh]);

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

    const backgroundEl = backgroundRef?.current;
    const backgroundY = backgroundEl
      ? Number(gsap.getProperty(backgroundEl, "y")) || 0
      : 0;

    if (backgroundEl) gsap.killTweensOf(backgroundEl);

    const incomingEl =
      layerRefs.current[
        location.pathname
      ];


    const fromIndex = getRouteIndex(routeOrder, displayedLocation.pathname);
    const toIndex = getRouteIndex(routeOrder, location.pathname);
    const direction = toIndex >= fromIndex ? 1 : -1;

    /*
     * Pobieramy aktualną pozycję scrolla przez getScroll().
     */
    const outgoingTriggers = outgoingEl
      ? ScrollTrigger.getAll().filter((triggerInstance) => {
          const animationTargets = triggerInstance.animation?.targets?.() ?? [];
          const triggerElement = triggerInstance.trigger;
          const triggerBelongsToOutgoing =
            triggerElement instanceof Element && outgoingEl.contains(triggerElement);
          const animationBelongsToOutgoing = animationTargets.some(
            (target) => target instanceof Element && outgoingEl.contains(target)
          );

          return triggerBelongsToOutgoing || animationBelongsToOutgoing;
        })
      : [];

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
        gsap.set(incomingEl, {xPercent: 100 * direction})
      }

      outgoingTriggers.forEach((triggerInstance) => {
        triggerInstance.disable(false, true);
      });

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
          duration: 0.4,
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
        tl.to(outgoingEl, {xPercent: -100 * direction}, 0)
      }
      if (incomingEl) {
        tl.to(incomingEl, {xPercent: 0}, 0)
      }
    }, containerRef)

    if (backgroundEl && (scrollY !== 0 || backgroundY !== 0)) {
      gsap.set(backgroundEl, {y: backgroundY - scrollY});
      gsap.to(backgroundEl, {
        y: 0,
        duration: 1,
        ease: CustomEase.create("custom", "M0,0 C0,0.5 0,0.8 0.1,0.9 0.2,1 0.5,1 1,1 "),
        overwrite: true,
      });
    }

    return () => {
      ctx.revert();

      const activeTriggers = new Set(ScrollTrigger.getAll());
      outgoingTriggers.forEach((triggerInstance) => {
        if (activeTriggers.has(triggerInstance)) {
          triggerInstance.enable(false, false);
        }
      });
    };
  }, [backgroundRef, displayedLocation.pathname, getScroll, location, refresh, routeOrder, scrollTo]);

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