import type { AnalysisResult } from "@/lib/api";
import CompanyHeader from "./results/CompanyHeader";
import MetricsGrid from "./results/MetricsGrid";
import GuidanceSection from "./results/GuidanceSection";
import SegmentsTable from "./results/SegmentsTable";
import OverallHealth from "./results/OverallHealth";
import ExecutiveSummary from "./results/ExecutiveSummary";
import KeyThemes from "./results/KeyThemes";
import SentimentAnalysis from "./results/SentimentAnalysis";
import QAHighlights from "./results/QAHighlights";
import TranscriptInfo from "./results/TranscriptInfo";

interface Props {
  result: AnalysisResult | null;
  error: string | null;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-3 text-center">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-30">
      <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" strokeWidth="2"/>
      <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" strokeWidth="2"/>
      <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2"/>
      <line x1="20" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="2"/>
    </svg>
    <p className="text-sm max-w-[260px] leading-relaxed">
      Paste an earnings call transcript on the left and click <strong>Analyze</strong> to extract financial metrics with AI-powered context.
    </p>
  </div>
);

const ResultsPanel = ({ result, error }: Props) => {
  if (error) {
    return (
      <div className="bg-miss-bg border border-miss-border rounded-lg px-4 py-3 text-[13px] text-miss flex gap-2 items-start">
        ⚠️ {error}
      </div>
    );
  }

  if (!result) return <EmptyState />;

  const { structure, metrics, analysis, summary } = result;

  return (
    <div className="flex flex-col gap-6">
      <CompanyHeader metrics={metrics} summary={summary} />
      <MetricsGrid metrics={metrics} analysis={analysis} />
      <GuidanceSection metrics={metrics} analysis={analysis} />
      <SegmentsTable metrics={metrics} />
      <OverallHealth analysis={analysis} />
      <ExecutiveSummary summary={summary} />
      <KeyThemes summary={summary} />
      <SentimentAnalysis summary={summary} />
      <QAHighlights summary={summary} />
      <TranscriptInfo structure={structure} />
    </div>
  );
};

export default ResultsPanel;
