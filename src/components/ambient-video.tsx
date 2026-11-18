"use client";

import { useEffect, useRef } from "react";

export function AmbientVideo({
  src,
  poster,
  className = "",
  label,
  eager = false,
}: {
  src: string;
  poster: string;
  className?: string;
  label: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      video.pause();
      return;
    }

    const play = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          /* el navegador mantiene el poster si bloquea la reproducción */
        });
      }
    };

    play();

    // Pausa cuando el video no está en pantalla (ahorra batería y CPU).
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) play();
          else video.pause();
        });
      },
      { threshold: 0.05 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload={eager ? "auto" : "metadata"}
      aria-label={label}
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
