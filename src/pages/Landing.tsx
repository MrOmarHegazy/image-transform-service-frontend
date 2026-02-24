import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Upload, Wand2, Link2, Trash2, ShieldCheck, ArrowRight, ScanSearch, Focus, Eraser } from "lucide-react";
import logoImg from "@/assets/website logo - image transform.png";
import heroVideo from "@/assets/grok hero page video.mp4";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ProcessSection } from "@/components/ui/how-we-do-it-process-overview";

const processItems = [
  { icon: Upload, title: "Upload", description: "Drop your image — JPG, PNG, or WebP. We handle the rest." },
  { icon: Wand2, title: "Process", description: "Background removed and image flipped automatically in seconds." },
  { icon: Link2, title: "Share", description: "Get a hosted URL you can share anywhere, anytime." },
  { icon: Trash2, title: "Delete", description: "Remove any image when you're done. Full control, always." },
];

const HEADLINE = "Background removed.";
const CHAR_DELAY = 60;
const INITIAL_PAUSE = 500;
const PAUSE_AFTER_TYPE = 350;
const FLIP_MS = 900;

export default function Landing() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // 0 = blank, 1 = typing, 2 = flipping, 3 = reveal
  const [phase, setPhase] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const reveal = phase >= 3;

  // Video ping-pong (forward → reverse → forward …)
  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<"forward" | "reverse">("forward");
  const rafRef = useRef<number>(0);

  const stepReverse = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const step = 1 / 30;
    if (v.currentTime <= step) {
      v.currentTime = 0;
      directionRef.current = "forward";
      v.play();
      return;
    }
    v.currentTime -= step;
    rafRef.current = requestAnimationFrame(stepReverse);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onEnded = () => {
      directionRef.current = "reverse";
      rafRef.current = requestAnimationFrame(stepReverse);
    };

    v.addEventListener("ended", onEnded);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && v.paused && directionRef.current === "forward") {
          v.play();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(v);

    return () => {
      v.removeEventListener("ended", onEnded);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [stepReverse]);

  useEffect(() => {
    if (!reveal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [reveal]);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), INITIAL_PAUSE);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    if (charIndex >= HEADLINE.length) {
      const t = setTimeout(() => setPhase(2), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCharIndex((i) => i + 1), CHAR_DELAY);
    return () => clearTimeout(t);
  }, [phase, charIndex]);

  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(() => setPhase(3), FLIP_MS + 300);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Navbar — CSS-only opacity to preserve position:fixed */}
      <div style={{ opacity: reveal ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
        <Navbar variant="landing" />
      </div>

      {/* Hero — full viewport height, text stays exactly where it animated */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        <div className="max-w-2xl w-full text-center" style={{ perspective: 1000 }}>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-heading tracking-[-0.03em] leading-[1.1] text-foreground"
            style={{ fontWeight: 600 }}
          >
            {/* Line 1 — phantom keeps layout stable while characters type in */}
            <span className="block relative">
              <span className="invisible select-none" aria-hidden="true">
                {HEADLINE}
              </span>
              <span className="absolute inset-0">
                {phase >= 3 ? HEADLINE : HEADLINE.slice(0, charIndex)}
                {phase === 1 && (
                  <span
                    className="inline-block w-[3px] bg-foreground ml-0.5 animate-pulse"
                    style={{
                      height: "0.85em",
                      verticalAlign: "baseline",
                      transform: "translateY(0.08em)",
                    }}
                  />
                )}
              </span>
            </span>

            {/* Line 2 — flips from behind line 1 */}
            <motion.span
              className="text-primary block"
              style={{ transformOrigin: "top center" }}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={
                phase >= 2
                  ? { rotateX: 0, opacity: 1 }
                  : { rotateX: -90, opacity: 0 }
              }
              transition={{
                duration: FLIP_MS / 1000,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Perfectly mirrored.
            </motion.span>
          </h1>

          {/* Subtitle — populates below after intro */}
          <motion.p
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto"
            initial={{ opacity: 0, y: 14 }}
            animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              delay: reveal ? 0.15 : 0,
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Upload any image. We strip the background, flip it, and give you
            a clean hosted URL — ready to use.
          </motion.p>

          {/* CTA buttons — populate after subtitle */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              delay: reveal ? 0.3 : 0,
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {user ? (
              <>
                <Button asChild size="lg" className="h-11 px-7 rounded-[12px] text-sm">
                  <Link to="/app?tab=upload">
                    Try it now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-[12px] text-sm"
                >
                  <Link to="/app?tab=images">My Images</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="h-11 px-7 rounded-[12px] text-sm">
                  <Link to="/signup">
                    Start transforming
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-[12px] text-sm"
                >
                  <Link to="/login">Sign in</Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator — mouse icon with animated dot */}
        <motion.div
          className="absolute bottom-8 right-8 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: reveal ? 1 : 0 }}
          transition={{ delay: reveal ? 0.8 : 0, duration: 0.6 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-muted-foreground/60"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
              }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground/40 tracking-widest uppercase select-none">
            scroll
          </span>
        </motion.div>
      </section>

      {/* Video showcase */}
      <section className="py-28 md:py-36">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="rounded-[18px] overflow-hidden border shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <video
                ref={videoRef}
                src={heroVideo}
                muted
                playsInline
                className="w-full block"
                style={{ aspectRatio: "752 / 416" }}
              />
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <ScanSearch className="h-[18px] w-[18px] text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-[15px] mb-1">Smart detection</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Intelligently identifies every subject in a scene — people, objects, and fine details.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Focus className="h-[18px] w-[18px] text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-[15px] mb-1">Focus on what matters</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Preserves your subject with pixel-perfect precision, keeping every edge crisp.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Eraser className="h-[18px] w-[18px] text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-[15px] mb-1">Remove the rest</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Strips away backgrounds cleanly — no artifacts, no halos, just your subject.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ProcessSection
          subtitle="How It Works"
          title="Four simple steps"
          description="From raw image to polished result — upload, process, share, and manage with full control."
          buttonText={user ? "Try it now" : "Get started"}
          buttonAction={
            <Button
              asChild
              size="lg"
              className="h-11 px-7 rounded-[12px] text-sm hover:scale-105 duration-300 transition-all"
            >
              <Link to={user ? "/app?tab=upload" : "/signup"}>
                {user ? "Try it now" : "Get started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          }
          items={processItems}
        />
      </motion.div>

      {/* Privacy */}
      <section className="py-28 border-t">
        <div className="max-w-content mx-auto px-6">
          <motion.div
            className="text-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-medium tracking-[-0.01em]">
              Your images, your control
            </h2>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Delete any image at any time. We don't store originals. Processing
              is fast, private, and entirely under your control.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-content mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="ImageTransform" className="w-6 h-6 rounded-md object-cover" />
            <span className="font-heading font-medium text-sm text-foreground">
              ImageTransform
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} ImageTransform
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
