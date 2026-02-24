import { useEffect, useRef, useCallback } from "react";
import beforeAfterImg from "@/assets/before-after.png";

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const originalRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(50);
  const draggingRef = useRef(false);
  const animationDoneRef = useRef(false);

  const applyPosition = useCallback((pct: number) => {
    posRef.current = pct;
    if (overlayRef.current) {
      overlayRef.current.style.clipPath = `inset(0 0 0 ${pct}%)`;
    }
    if (dividerRef.current) {
      dividerRef.current.style.left = `${pct}%`;
    }

    const onOriginal = pct < 40;
    if (originalRef.current) {
      originalRef.current.style.background = onOriginal
        ? "hsl(var(--primary) / 0.9)"
        : "hsl(var(--foreground) / 0.5)";
      originalRef.current.style.color = onOriginal
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--background))";
      originalRef.current.style.opacity = "1";
    }
    if (processedRef.current) {
      processedRef.current.style.background = !onOriginal
        ? "hsl(var(--primary) / 0.9)"
        : "hsl(var(--foreground) / 0.5)";
      processedRef.current.style.color = !onOriginal
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--background))";
      processedRef.current.style.opacity = "1";
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.transition = "clip-path 1.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }
      if (dividerRef.current) {
        dividerRef.current.style.transition = "left 1.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }
      applyPosition(100);

      setTimeout(() => {
        animationDoneRef.current = true;
        if (overlayRef.current) overlayRef.current.style.transition = "none";
        if (dividerRef.current) dividerRef.current.style.transition = "none";
        if (arrowRef.current) arrowRef.current.style.transform = "none";
        if (containerRef.current) containerRef.current.style.cursor = "ew-resize";
      }, 1900);
    }, 800);
    return () => clearTimeout(timeout);
  }, [applyPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getPercent = (clientX: number) => {
      const rect = container.getBoundingClientRect();
      return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    };

    const onDown = (e: PointerEvent) => {
      if (!animationDoneRef.current) return;
      draggingRef.current = true;
      container.setPointerCapture(e.pointerId);
      applyPosition(getPercent(e.clientX));
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      applyPosition(getPercent(e.clientX));
    };

    const onUp = () => {
      draggingRef.current = false;
    };

    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);

    return () => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
    };
  }, [applyPosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto rounded-[18px] overflow-hidden border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)] select-none touch-none"
    >
      <img
        src={beforeAfterImg}
        alt="Before and after: original with background, and processed with transparent background"
        className="w-full h-auto block pointer-events-none"
        draggable={false}
      />

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-background/80 pointer-events-none"
        style={{ clipPath: `inset(0 0 0 50%)` }}
      />

      {/* Divider */}
      <div
        ref={dividerRef}
        className="absolute top-0 bottom-0 w-px bg-primary/60 pointer-events-none"
        style={{ left: "50%" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
          <svg
            ref={arrowRef}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary-foreground"
            style={{ transform: "scaleX(-1)", transition: "transform 0.3s ease" }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        ref={originalRef}
        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-medium backdrop-blur-sm pointer-events-none"
        style={{
          background: "hsl(var(--primary) / 0.9)",
          color: "hsl(var(--primary-foreground))",
        }}
      >
        Original
      </div>
      <div
        ref={processedRef}
        className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-medium backdrop-blur-sm pointer-events-none"
        style={{
          background: "hsl(var(--foreground) / 0.5)",
          color: "hsl(var(--background))",
        }}
      >
        Processed
      </div>
    </div>
  );
}
