import { useEffect, useState } from "react";
import beforeAfterImg from "@/assets/before-after.png";

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(100);

  useEffect(() => {
    const timeout = setTimeout(() => setPosition(50), 600);
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
    <div className="relative w-full max-w-2xl mx-auto rounded-[18px] overflow-hidden border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <img
        src={beforeAfterImg}
        alt="Before and after: original image with background transformed to flipped image with transparent background"
        className="w-full h-auto block"
        draggable={false}
      />

      {/* Overlay that covers the "after" side */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-none"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
          transition: "clip-path 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-primary/60"
        style={{
          left: `${position}%`,
          transition: "left 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary-foreground"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-foreground/70 text-background backdrop-blur-sm"
        style={{
          opacity: position > 60 ? 1 : 0.3,
          transition: "opacity 0.6s ease",
        }}
      >
        Original
      </div>
      <div
        className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm"
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
