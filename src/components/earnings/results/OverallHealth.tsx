import type { Analysis } from "@/lib/api";

const OverallHealth = ({ analysis }: { analysis: Analysis }) => {
  const oh = analysis.overall_health;
  if (!oh) return null;

  const score = typeof oh.score === "number" ? oh.score : parseInt(String(oh.score)) || 0;
  const pct = (score / 10) * 100;
  const color = score >= 8 ? "text-beat" : score >= 6 ? "text-warn" : "text-miss";

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Overall Financial Health</div>
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-foreground">{score}<span className="text-base text-muted-foreground">/10</span></div>
          <div className={`text-[13px] font-semibold ${color}`}>{oh.label || ""}</div>
        </div>
        <div className="flex-1 min-w-[160px]">
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-600" style={{ width: `${pct}%`, background: "var(--gradient-health)" }} />
          </div>
        </div>
      </div>
      {oh.rationale && <div className="text-[13px] text-muted-foreground leading-relaxed mt-2">{oh.rationale}</div>}
    </div>
  );
};

export default OverallHealth;
