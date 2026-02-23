import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import beforeAfterImg from "@/assets/before-after.png";

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initial reveal animation
  useEffect(() => {
    const timeout = setTimeout(() => setPosition(50), 600);
    return () => clearTimeout(timeout);
  }, []);

  // Scroll-driven: as user scrolls past, push divider to 100 (fully reveal)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end start"],
  });

  useEffect(() => {
    if (hasInteracted) return;
    const unsub = scrollYProgress.on("change", (v) => {
      if (!isDragging) {
        // Map scroll progress to position: starts at 50, goes to 100
        const mapped = 50 + v * 50;
        setPosition(Math.min(100, mapped));
      }
    });
    return unsub;
  }, [scrollYProgress, isDragging, hasInteracted]);

  // Drag handling
  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-foreground/5 border border-border/30 cursor-col-resize select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <img
        src={beforeAfterImg}
        alt="Before and after transformation"
        className="w-full h-auto block"
        draggable={false}
      />

      {/* Overlay covering "after" side */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-none"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
          transition: isDragging ? "none" : "clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
        style={{
          left: `${position}%`,
          transition: isDragging ? "none" : "left 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary-foreground">
            <polyline points="8 18 4 12 8 6" />
            <polyline points="16 6 20 12 16 18" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-foreground/60 text-background backdrop-blur-sm pointer-events-none"
        style={{ opacity: position > 20 ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        Original
      </div>
      <div
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm pointer-events-none"
        style={{ opacity: position < 80 ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        Processed
      </div>
    </div>
  );
}
