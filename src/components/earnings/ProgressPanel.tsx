import { Check, Loader2 } from "lucide-react";

interface ProgressStep {
  step: number;
  status: "pending" | "running" | "done";
  message: string;
}

const STEP_LABELS = [
  "Parse transcript structure",
  "Extract financial metrics",
  "Generate contextual analysis",
  "Create executive summary",
];

interface ProgressPanelProps {
  steps: ProgressStep[];
}

const ProgressPanel = ({ steps }: ProgressPanelProps) => {
  const displaySteps = STEP_LABELS.map((label, i) => {
    const found = steps.find((s) => s.step === i + 1);
    return {
      step: i + 1,
      status: found?.status || "pending",
      message: found?.message || label,
    };
  });

  return (
    <div className="bg-card border border-border rounded-xl shadow-card mb-5">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 text-primary animate-spin-fast" />
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Analyzing</h2>
      </div>
      <div className="p-5 flex flex-col gap-2">
        {displaySteps.map((s) => (
          <div
            key={s.step}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-[13px] transition-all ${
              s.status === "running"
                ? "border-primary bg-primary-light text-primary font-medium"
                : s.status === "done"
                ? "border-beat-border bg-beat-bg text-beat"
                : "border-border bg-background text-muted-foreground"
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {s.status === "running" ? (
                <Loader2 className="w-4 h-4 animate-spin-fast" />
              ) : s.status === "done" ? (
                <Check className="w-4 h-4" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              )}
            </div>
            <span>{s.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPanel;
