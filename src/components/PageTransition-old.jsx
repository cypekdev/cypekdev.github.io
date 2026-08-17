import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, Routes } from "react-router";
import { gsap } from "gsap";

/** // TODO Poprawić animacje:
 *  //* - efekt blur zanika
 *  //* - powinno się przewijać w odpowiednią stronę, a nie zawsze w lewo
 *  //* - scroll powinien nie przechodzić w trakcie animacji na samą górę, na odchodzącym elemencie  
 */

/**
 * Slide transition dla klasycznego <Routes>/<Route> (bez
 * createBrowserRouter / useOutlet).
 *
 * Trick: <Routes> normalnie renderuje się na podstawie AKTUALNEJ
 * lokalizacji z useLocation(). Możemy jednak przekazać mu WŁASNY
 * prop "location" - wtedy renderuje trasę dopasowaną do TEJ
 * lokalizacji, niezależnie od tego, co jest w pasku adresu.
 *
 * Dzięki temu możemy:
 * 1. Renderować STARĄ stronę przez <Routes location={displayedLocation}>
 * 2. Renderować NOWĄ stronę przez drugi <Routes location={location}>
 * 3. Animować oba jednocześnie, a dopiero po animacji "zapomnieć"
 *    o starej.
 *
 * Użycie:
 *
 *   <PageTransition>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/projects" element={<Projects />} />
 *     <Route path="/about" element={<About />} />
 *     <Route path="/contact" element={<Contact />} />
 *   </PageTransition>
 *
 * (zamiast bezpośrednio <Routes>...</Routes>)
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState(location);

  const containerRef = useRef(null);
  const incomingRef = useRef(null);
  const outgoingRef = useRef(null);

  const isTransitioning = location.pathname !== displayedLocation.pathname;

  console.log(location)

  // WAŻNE: zależność to WYŁĄCZNIE location.pathname, NIE
  // isTransitioning. isTransitioning to wartość pochodna, liczona
  // na nowo przy każdym renderze - gdyby była w zależnościach,
  // każdy re-render (np. wywołany przez setDisplayedLocation w
  // onComplete) uruchamiałby cleanup (ctx.revert()) i restart
  // efektu, zabijając timeline w połowie animacji, ZANIM
  // onComplete zdąży się wykonać. Efekt: displayedLocation nigdy
  // się nie aktualizuje, isTransitioning zostaje "true" na zawsze.
  useLayoutEffect(() => {
    if (location.pathname === displayedLocation.pathname) return;

    // window.scrollTo({ top: 0 });

    const ctx = gsap.context(() => {
      // KROK 1: ustaw stan startowy natychmiast, synchronicznie,
      // ZANIM zbudujemy timeline. To eliminuje błysk na starcie.
      if (incomingRef.current) {
        gsap.set(incomingRef.current, { xPercent: 100, opacity: 0 });
      }

      // KROK 2: dopiero teraz animacja (.to() zamiast .fromTo(),
      // bo stan "from" już ustawiliśmy ręcznie wyżej)
      const tl = gsap.timeline({
        defaults: { duration: 10, ease: "power2.inOut" },
        onComplete: () => {
          setDisplayedLocation(location);
        },
      });

      if (outgoingRef.current) {
        tl.to(outgoingRef.current, { xPercent: -100, opacity: 0 }, 0);
      }
      if (incomingRef.current) {
        tl.to(incomingRef.current, { xPercent: 0, opacity: 1 }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div ref={containerRef} style={{ position: "relative", overflow: "hidden" }}>
      {isTransitioning && (
        <div ref={outgoingRef} style={{ position: "absolute", inset: 0 }}>
          <Routes location={displayedLocation}>{children}</Routes>
        </div>
      )}

      <div
        ref={incomingRef}
        style={
          isTransitioning
            ? { position: "relative" }
            : undefined
        }
      >
        <Routes location={isTransitioning ? location : displayedLocation}>
          {children}
        </Routes>
      </div>
    </div>
  );
}