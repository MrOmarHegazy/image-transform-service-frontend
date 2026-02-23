import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { LogOut, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged out" });
    navigate("/");
  };

  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1160px] rounded-2xl transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-foreground/5"
          : "bg-background/60 backdrop-blur-xl border border-border/40"
      }`}
    >
      <div className="flex items-center justify-between h-14 px-6">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <Scissors className="h-5 w-5 text-primary" />
          <span className="font-display text-lg">FlipCut</span>
        </Link>

        <div className="flex items-center gap-1">
          {isLanding && (
            <>
              <a href="#how-it-works" className="hidden sm:inline-flex px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg">
                How it works
              </a>
              <a href="#privacy" className="hidden sm:inline-flex px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg">
                Privacy
              </a>
            </>
          )}

          {user ? (
            <>
              <Link
                to="/app"
                className="px-4 py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-lg"
              >
                App
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:shadow-md hover:shadow-primary/20 hover:-translate-y-px"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
