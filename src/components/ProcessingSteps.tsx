import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const STEPS = ["Uploading", "Removing background", "Mirroring", "Hosting"];

interface Props {
  currentStep: number;
}

export default function ProcessingSteps({ currentStep }: Props) {
  return (
    <div className="flex flex-col gap-4 py-6">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 ${
                done
                  ? "bg-primary border-primary"
                  : active
                  ? "border-primary"
                  : "border-border"
              }`}
            >
              {done ? (
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              ) : active ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              )}
            </div>
            <span
              className={`text-sm transition-colors duration-300 ${
                done ? "text-primary font-medium" : active ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
