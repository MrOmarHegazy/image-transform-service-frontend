import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Upload, Sparkles, Globe, Shield, Trash2, Lock, Scissors } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";

const steps = [
  { icon: Upload, title: "Upload", desc: "Drop your image — JPG, PNG, or WebP. Single file, instant preview." },
  { icon: Sparkles, title: "Remove & Mirror", desc: "Background stripped and image flipped horizontally. Automatic." },
  { icon: Globe, title: "Host & Share", desc: "Get a clean, hosted URL you can share anywhere." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <PageTransition>
      <ScrollProgress />
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
          {/* Subtle radial highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container relative mx-auto px-6 text-center max-w-[1100px]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-display text-4xl md:text-6xl lg:text-[4.25rem] leading-[1.1] mb-6 text-foreground"
            >
              Background removed.
              <br />
              <span className="text-primary">Perfectly mirrored.</span>
              <br />
              Shareable in seconds.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Upload one image. We remove the background, flip it horizontally,
              and host it with a clean URL.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center justify-center gap-4 mb-4"
            >
              <Link
                to={user ? "/app" : "/signup"}
                className="px-8 py-3 text-base font-medium bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-px"
              >
                Try it now
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-3 text-base font-medium text-muted-foreground border border-border rounded-2xl hover:bg-secondary/60 transition-all hover:-translate-y-px"
              >
                See how it works
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm text-muted-foreground mb-16"
            >
              No installs. Delete anytime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            >
              <BeforeAfterSlider />
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 md:py-32">
          <div className="container mx-auto px-6 max-w-[1100px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl text-foreground mb-4">
                How it works
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-md mx-auto">
                Three steps. No learning curve.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i}
                  variants={fadeUp}
                  className="group glass rounded-2xl p-8 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                    <s.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h3 className="font-display text-xl mb-2 text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="py-24 border-t border-border">
          <div className="container mx-auto px-6 max-w-[700px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center"
            >
              <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent-foreground" />
                </div>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl text-foreground mb-4">
                Your images, your control
              </motion.h2>
              <motion.div variants={fadeUp} custom={2} className="space-y-3 text-muted-foreground text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <Trash2 className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span>Delete any image at any time — permanent and immediate.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span>We don't store originals. Processing is fast and private.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span>Per-user storage. Only you can see your images.</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1100px]">
            <div className="flex items-center gap-2 text-foreground">
              <Scissors className="h-4 w-4 text-primary" />
              <span className="font-display text-sm">FlipCut</span>
            </div>
            <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} FlipCut. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
