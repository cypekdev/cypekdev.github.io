import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";

import Scrollbar from "../components/Scrollbar";

export const ScrollContext = createContext(null);

function ScrollController({ children }) {
  const lenis = useLenis();

  const listenersRef = useRef(new Set());

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = (event) => {
      listenersRef.current.forEach((listener) => {
        listener(event.progress);
      });
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  const scrollTo = useCallback(
    (position, options = {}) => {
      if (!lenis) return;

      lenis.scrollTo(position, options);
    },
    [lenis]
  );

  const getScroll = useCallback(() => {
    return lenis.scroll;
  }, [lenis]);

  const getProgress = useCallback(() => {
    if (!lenis) return 0;

    return lenis.progress;
  }, [lenis]);

  const subscribe = useCallback((callback) => {
    listenersRef.current.add(callback);

    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const refresh = useCallback(() => {
    if (!lenis) return;

    lenis.resize();

    window.dispatchEvent(
      new Event("scroll:refresh")
    );
  }, [lenis]);

  const value = useMemo(
    () => ({
      scrollTo,
      getScroll,
      getProgress,
      subscribe,
      refresh,
    }),
    [
      scrollTo,
      getScroll,
      getProgress,
      subscribe,
      refresh,
    ]
  );

  /*
   * Lenis nie jest jeszcze gotowy.
   * Nie renderujemy komponentów zależnych od niego.
   */
  if (!lenis) {
    return null;
  }

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}

export function ScrollProvider({ children }) {
  const lenisRef = useRef(null);

  /*
   * Lenis jest ręcznie sterowany przez GSAP ticker.
   */
  useEffect(() => {
    function update(time) {
      lenisRef.current.lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false }}
      ref={lenisRef}
    >
      <ScrollController>
        <Scrollbar />
        {children}
      </ScrollController>
    </ReactLenis>
  );
}