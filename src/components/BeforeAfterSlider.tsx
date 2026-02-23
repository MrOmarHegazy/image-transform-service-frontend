import { useEffect, useState } from "react";
import beforeAfterImg from "@/assets/before-after.png";

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(100); // percentage from left where divider is (100 = far right)
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    // Start animation after a short delay
    const timeout = setTimeout(() => {
      setPosition(50);
    }, 600);

    // Loop the animation
    const interval = setInterval(() => {
      setPosition(100);
      setTimeout(() => setPosition(50), 800);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/30">
      {/* The full before/after image */}
      <img
        src={beforeAfterImg}
        alt="Before and after: original image with background transformed to flipped image with transparent background"
        className="w-full h-auto block"
        draggable={false}
      />

      {/* Overlay that covers the "after" side — clips from the divider to the right */}
      <div
        className="absolute inset-0 bg-hero/80 backdrop-blur-sm pointer-events-none"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
          transition: "clip-path 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_12px_hsl(175_70%_48%/0.6)]"
        style={{
          left: `${position}%`,
          transition: "left 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Divider handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary-foreground">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-foreground/70 text-background backdrop-blur-sm"
        style={{
          opacity: position > 60 ? 1 : 0.3,
          transition: "opacity 0.6s ease",
        }}
      >
        Original
      </div>
      <div
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm"
        style={{
          opacity: position < 70 ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        Processed
      </div>
    </div>
  );
}
