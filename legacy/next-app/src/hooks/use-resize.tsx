import { useState, useEffect } from "react";

// Utility to fetch current window dimensions
const getWindowDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

/**
 * Custom hook: useResize
 * Listens to window "resize" events and updates dimensions state.
 * Throttles updates to improve performance in production.
 *
 * @param {number} [fps=60] - Maximum updates per second.
 * @returns {{width: number, height: number}}
 */
export function useResize(fps = 60) {
  // Initialize with current dimensions (guard for SSR)
  const [dimensions, setDimensions] = useState(() =>
    typeof window !== "undefined"
      ? getWindowDimensions()
      : { width: 0, height: 0 }
  );

  useEffect(() => {
    let frameId: number | null = null;
    let lastTimestamp = 0;
    const throttleInterval = 1000 / fps;

    const onResize = () => {
      const now = Date.now();
      // Only update if past the throttle interval
      if (now - lastTimestamp >= throttleInterval) {
        lastTimestamp = now;
        // Use rAF to batch state updates
        frameId = window.requestAnimationFrame(() => {
          setDimensions(getWindowDimensions());
        });
      }
    };

    // Passive listener for improved scrolling performance
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [fps]);
  const { width } = dimensions;
  const isMobile = width < 768;
  const isDesktop = width >= 1120;
  const isTablet = width >= 768 && width < 1120;
  return { ...dimensions, width, isMobile, isDesktop, isTablet };
}
