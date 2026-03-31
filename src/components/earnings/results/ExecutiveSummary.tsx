import type { Summary } from "@/lib/api";

const ExecutiveSummary = ({ summary }: { summary: Summary }) => {
  if (!summary || summary.error) return null;
  const positives = summary.key_positives || [];
  const concerns = summary.key_concerns || [];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Executive Summary</div>
      <div className="text-sm text-muted-foreground leading-relaxed">{summary.executive_summary}</div>
      {summary.investor_takeaway && (
        <div className="mt-3.5 px-4 py-3 bg-primary-light rounded-lg border-l-4 border-l-primary text-sm font-medium text-primary leading-relaxed">
          💡 {summary.investor_takeaway}
        </div>
      )}
      {(positives.length > 0 || concerns.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {positives.length > 0 && (
            <div>
              <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Positives</div>
              <ul className="flex flex-col gap-2">
                {positives.map((p, i) => (
                  <li key={i} className="text-[13px] text-muted-foreground leading-relaxed px-3 py-2 rounded-lg bg-beat-bg flex items-start gap-2">
                    <span className="text-beat font-bold shrink-0">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {concerns.length > 0 && (
            <div>
              <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Concerns</div>
              <ul className="flex flex-col gap-2">
                {concerns.map((c, i) => (
                  <li key={i} className="text-[13px] text-muted-foreground leading-relaxed px-3 py-2 rounded-lg bg-miss-bg flex items-start gap-2">
                    <span className="text-miss font-bold shrink-0">!</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummary;
