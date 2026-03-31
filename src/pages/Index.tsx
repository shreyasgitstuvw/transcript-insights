import { useState, useCallback } from "react";
import AppHeader from "@/components/earnings/AppHeader";
import InputPanel from "@/components/earnings/InputPanel";
import ProgressPanel from "@/components/earnings/ProgressPanel";
import ResultsPanel from "@/components/earnings/ResultsPanel";
import { analyzeTranscript, type AnalysisResult, type SSEEvent } from "@/lib/api";

interface ProgressStep {
  step: number;
  status: "pending" | "running" | "done";
  message: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (transcript: string, model: string) => {
    if (!transcript.trim() || !model) return;

    setIsLoading(true);
    setShowProgress(true);
    setProgressSteps([]);
    setResult(null);
    setError(null);

    try {
      await analyzeTranscript(transcript, model, (event: SSEEvent) => {
        if (event.step === "complete") {
          setResult(event.result!);
          setShowProgress(false);
          return;
        }
        if (typeof event.step === "number") {
          setProgressSteps((prev) => {
            const existing = prev.filter((s) => s.step !== event.step);
            return [...existing, {
              step: event.step as number,
              status: (event.status as "running" | "done") || "running",
              message: event.message || "",
            }].sort((a, b) => a.step - b.step);
          });
        }
      });
    } catch (err) {
      setError(`Analysis failed: ${(err as Error).message}`);
      setShowProgress(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 max-w-[1400px] mx-auto px-4 lg:px-8 py-6 min-h-[calc(100vh-60px)]">
        <InputPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
        <main>
          {showProgress && <ProgressPanel steps={progressSteps} />}
          <ResultsPanel result={result} error={error} />
        </main>
      </div>
    </div>
  );
};

export default Index;
