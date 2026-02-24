import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  LogOut,
  Menu,
  X,
  Upload,
  Images,
} from "lucide-react";
import logoImg from "@/assets/website logo - image transform.png";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  variant?: "landing" | "dashboard";
}

export default function Navbar({ variant = "landing" }: NavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    toast({ title: "Signed out" });
    if (variant === "dashboard") navigate("/");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [variant]);

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-content mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand — left on desktop, centered on mobile */}
        <Link
          to="/"
          className="flex items-center gap-2.5 flex-1 md:flex-initial justify-start"
        >
          <img src={logoImg} alt="ImageTransform" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-heading font-medium text-[15px] tracking-tight text-foreground">
            ImageTransform
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {variant === "landing" && !user && (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
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
          {variant === "landing" && user && (
            <>
              <Button asChild size="sm">
                <Link to="/app?tab=images">
                  Go to Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </>
          )}
          {variant === "dashboard" && (
            <>
              <span className="text-xs text-muted-foreground hidden lg:inline mr-1">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="h-9 w-9 text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-4 left-4 rounded-[14px] border bg-card shadow-lg p-4 space-y-1"
              >
                {variant === "landing" && !user && (
                  <>
                    <MobileLink to="/login" onClick={() => setOpen(false)}>
                      Sign in
                    </MobileLink>
                    <MobileLink to="/signup" onClick={() => setOpen(false)}>
                      Get Started
                    </MobileLink>
                  </>
                )}
                {variant === "landing" && user && (
                  <>
                    <MobileLink to="/app?tab=upload" onClick={() => setOpen(false)}>
                      <Upload className="h-3.5 w-3.5" />
                      Upload
                    </MobileLink>
                    <MobileLink to="/app?tab=images" onClick={() => setOpen(false)}>
                      <Images className="h-3.5 w-3.5" />
                      My Images
                    </MobileLink>
                    <hr className="border-border my-2" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </>
                )}
                {variant === "dashboard" && (
                  <>
                    <p className="px-3 py-1.5 text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <MobileLink to="/app?tab=upload" onClick={() => setOpen(false)}>
                      <Upload className="h-3.5 w-3.5" />
                      Upload
                    </MobileLink>
                    <MobileLink to="/app?tab=images" onClick={() => setOpen(false)}>
                      <Images className="h-3.5 w-3.5" />
                      My Images
                    </MobileLink>
                    <hr className="border-border my-2" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function MobileLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}
