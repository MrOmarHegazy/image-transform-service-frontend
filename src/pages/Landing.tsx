import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Upload, Wand2, Link2, Trash2, ShieldCheck, Zap } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Upload, title: "Upload", desc: "Drop your image — JPG, PNG, or WebP." },
  { icon: Wand2, title: "Process", desc: "Background removed & image flipped automatically." },
  { icon: Link2, title: "Share", desc: "Get a hosted URL you can share anywhere." },
  { icon: Trash2, title: "Delete", desc: "Remove it when you're done. Full control." },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="hero-section relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(175_70%_38%/0.12),transparent_60%)]" />
        <div className="container relative mx-auto px-6 py-28 md:py-40 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            <span className="hero-gradient">Remove background</span>
            <br />
            <span className="text-hero-foreground">+ flip images instantly</span>
          </h1>
          <p className="text-hero-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Upload any image. We strip the background, flip it, and give you a clean hosted URL — ready to use.
          </p>
          <div className="flex items-center justify-center gap-4 mb-14">
            <Button asChild size="lg" className="text-base px-8 h-12 rounded-full">
              <Link to={user ? "/app" : "/signup"}>Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 h-12 rounded-full border-hero-muted/30 text-hero-foreground hover:bg-hero-foreground/10">
              <Link to="/login">Login</Link>
            </Button>
          </div>
          <BeforeAfterSlider />
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How it works</h2>
          <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">Four simple steps from raw image to polished result.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-20 border-t bg-muted/40">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-accent-foreground" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Your images, your control</h2>
          <p className="text-muted-foreground">
            Delete any image at any time. We don't store originals. Processing is fast, private, and entirely under your control.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Zap className="h-5 w-5 text-primary" />
            ImageTransform
          </div>
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} ImageTransform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
