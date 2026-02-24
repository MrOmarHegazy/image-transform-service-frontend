import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-5xl font-heading font-medium tracking-tight text-foreground">
          404
        </h1>
        <p className="mt-3 text-muted-foreground text-sm">
          This page doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 text-sm text-primary hover:underline font-medium"
        >
          Go home
        </Link>
      </motion.div>
    </div>
  );
}
