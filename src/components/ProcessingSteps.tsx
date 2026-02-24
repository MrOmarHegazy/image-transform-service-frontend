import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = ["Uploading", "Removing background", "Flipping", "Hosting"];

interface Props {
  currentStep: number;
}

export default function ProcessingSteps({ currentStep }: Props) {
  return (
    <div className="flex flex-col gap-3 py-2">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full border transition-colors duration-300 ${
                done
                  ? "bg-primary border-primary"
                  : active
                  ? "border-primary"
                  : "border-muted-foreground/20"
              }`}
            >
              {done ? (
                <Check className="h-3 w-3 text-primary-foreground" />
              ) : active ? (
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  {i + 1}
                </span>
              )}
            </div>
            <span
              className={`text-sm ${
                done
                  ? "text-primary font-medium"
                  : active
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
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
