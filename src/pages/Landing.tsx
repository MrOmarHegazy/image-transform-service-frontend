import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Upload, Wand2, Link2, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Upload, title: "Upload", desc: "Drop your image — JPG, PNG, or WebP." },
  { icon: Wand2, title: "Process", desc: "Background removed and image flipped automatically." },
  { icon: Link2, title: "Share", desc: "Get a hosted URL you can share anywhere." },
  { icon: Trash2, title: "Delete", desc: "Remove it when you're done. Full control." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const jiggle = {
  hover: {
    scale: 1.04,
    rotate: [0, -1.5, 1.5, -1, 1, 0],
    transition: {
      scale: { duration: 0.25, ease: "easeOut" },
      rotate: { duration: 0.5, ease: "easeInOut", repeat: 0 },
    },
  },
};

export default function Landing() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-content mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Wand2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-heading font-medium text-[15px] tracking-tight text-foreground">
              ImageTransform
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm">
                <Link to="/app">
                  Go to Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 md:pt-52 md:pb-32">
        <div className="max-w-content mx-auto px-6">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-heading tracking-[-0.03em] leading-[1.1] text-foreground"
              variants={fadeUp}
              custom={0}
              style={{ fontWeight: 600 }}
            >
              Background removed.
              <br />
              <span className="text-primary">Perfectly mirrored.</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto"
              variants={fadeUp}
              custom={1}
            >
              Upload any image. We strip the background, flip it, and give you
              a clean hosted URL — ready to use.
            </motion.p>

            <motion.div
              className="mt-10 flex items-center justify-center gap-3"
              variants={fadeUp}
              custom={2}
            >
              <Button asChild size="lg" className="h-11 px-7 rounded-[12px] text-sm">
                <Link to={user ? "/app" : "/signup"}>
                  {user ? "Go to Dashboard" : "Start transforming"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {!user && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-[12px] text-sm"
                >
                  <Link to="/login">Sign in</Link>
                </Button>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 md:mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <BeforeAfterSlider />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32">
        <div className="max-w-content mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-heading tracking-[-0.02em]" style={{ fontWeight: 600 }}>
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground text-sm max-w-md mx-auto">
              Four simple steps from raw image to polished result.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                className="group rounded-[18px] border bg-card p-6 cursor-default origin-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover="hover"
                variants={jiggle}
                style={{ willChange: "transform" }}
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <s.icon className="h-[18px] w-[18px] text-accent-foreground" />
                </div>
                <h3 className="font-heading font-medium text-[15px] mb-1.5">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-24 border-t">
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
      <footer className="border-t py-8">
        <div className="max-w-content mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Wand2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-heading font-medium text-sm text-foreground">ImageTransform</span>
          </div>
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} ImageTransform
          </p>
        </div>
      </footer>
    </div>
  );
}
