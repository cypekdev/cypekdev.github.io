import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

import useScroll from "../hooks/useScroll";

import "./Scrollbar.css";

gsap.registerPlugin(Draggable);

export default function Scrollbar() {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const draggableRef = useRef(null);

  const [showThumb, setShowThumb] = useState(true);

  const {
    scrollTo,
    getProgress,
    subscribe,
    refresh,
  } = useScroll();

  /*
   * Aktualizuje pozycję thumb na podstawie
   * progress 0-1.
   */
  const updateThumbPosition = (progress) => {
    const thumb = thumbRef.current;

    if (!thumb) return;

    const windowHeight = window.innerHeight;
    const thumbHeight = thumb.offsetHeight;

    const maxTravel =
      windowHeight - thumbHeight;

    gsap.set(thumb, {
      y: progress * maxTravel,
    });
  };

  useEffect(() => {
    const thumb = thumbRef.current;
    const track = trackRef.current;

    if (!thumb || !track) {
      return;
    }

    const updateDimensions = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight;

      /*
       * Strona nie wymaga przewijania.
       */
      if (documentHeight <= windowHeight) {
        setShowThumb(false);
        return;
      }

      setShowThumb(true);

      const scrollRatio =
        windowHeight / documentHeight;

      const thumbHeight = Math.max(
        windowHeight * scrollRatio,
        40
      );

      gsap.set(thumb, {
        height: thumbHeight,
      });

      /*
       * Draggable nie powinien być tworzony ponownie
       * przy każdym refreshu.
       */
      if (!draggableRef.current) {
        const [draggable] =
          Draggable.create(thumb, {
            type: "y",
            bounds: track,

            onDrag() {
              const currentThumbHeight =
                thumb.offsetHeight;

              const maxTravel =
                windowHeight -
                currentThumbHeight;

              const progress =
                maxTravel > 0
                  ? this.y / maxTravel
                  : 0;

              const maxScroll =
                documentHeight -
                windowHeight;

              scrollTo(
                progress * maxScroll,
                {
                  immediate: true,
                }
              );
            },
          });

        draggableRef.current = draggable;
      } else {
        draggableRef.current.update();
      }

      updateThumbPosition(
        getProgress()
      );
    };

    /*
     * Pierwsze wyliczenie.
     */
    updateDimensions();

    /*
     * Scrollowanie.
     */
    const unsubscribe = subscribe(
      (progress) => {
        if (
          draggableRef.current?.isDragging
        ) {
          return;
        }

        updateThumbPosition(progress);
      }
    );

    /*
     * Odświeżenie wywołane np. przez
     * PageTransition.
     */
    const handleRefresh = () => {
      updateDimensions();
    };

    window.addEventListener(
      "scroll:refresh",
      handleRefresh
    );

    return () => {
      unsubscribe();

      window.removeEventListener(
        "scroll:refresh",
        handleRefresh
      );

      draggableRef.current?.kill();
      draggableRef.current = null;
    };
  }, [
    getProgress,
    scrollTo,
    subscribe,
  ]);

  return (
    <div
      ref={trackRef}
      className="track-style"
    >
      <div
        ref={thumbRef}
        className="thumb-style"
        style={{
          visibility: showThumb
            ? "visible"
            : "hidden",
        }}
      />
    </div>
  );
}