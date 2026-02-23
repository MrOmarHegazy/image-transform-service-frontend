import { Check, Loader2 } from "lucide-react";

const STEPS = ["Uploading", "Removing background", "Flipping", "Hosting"];

interface Props {
  currentStep: number; // 0-based, -1 = not started, 4 = done
}

export default function ProcessingSteps({ currentStep }: Props) {
  return (
    <div className="flex flex-col gap-3 py-4">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-colors ${
              done ? "bg-primary border-primary" : active ? "border-primary" : "border-muted-foreground/30"
            }`}>
              {done ? (
                <Check className="h-4 w-4 text-primary-foreground" />
              ) : active ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              )}
            </div>
            <span className={`text-sm font-medium ${done ? "text-primary" : active ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
