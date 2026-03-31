import type { Metrics, Analysis } from "@/lib/api";
import { formatRange } from "@/lib/format";

interface Props { metrics: Metrics; analysis: Analysis }

const GuidanceSection = ({ metrics, analysis }: Props) => {
  const g = metrics.guidance;
  if (!g) return null;

  const unit = g.unit || "";
  const cur = g.currency || "USD";
  const items: { label: string; value: string | null }[] = [];

  if (g.next_quarter_revenue_low != null || g.next_quarter_revenue_high != null)
    items.push({ label: "Next Qtr Revenue", value: formatRange(g.next_quarter_revenue_low, g.next_quarter_revenue_high, unit, cur) });
  if (g.full_year_revenue_low != null || g.full_year_revenue_high != null)
    items.push({ label: "Full Year Revenue", value: formatRange(g.full_year_revenue_low, g.full_year_revenue_high, unit, cur) });
  if (g.next_quarter_eps_low != null || g.next_quarter_eps_high != null)
    items.push({ label: "Next Qtr EPS", value: formatRange(g.next_quarter_eps_low, g.next_quarter_eps_high, "", "$") });
  if (g.full_year_eps_low != null || g.full_year_eps_high != null)
    items.push({ label: "Full Year EPS", value: formatRange(g.full_year_eps_low, g.full_year_eps_high, "", "$") });

  if (!items.length) return null;
  const ga = analysis.guidance_analysis || {};

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12 L6 7 L10 9 L14 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Forward Guidance
        {ga.verdict && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border text-primary bg-primary-light border-primary/20 ml-1">{ga.verdict}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it, i) => (
          <div key={i} className="bg-background border border-border rounded-lg p-3.5">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">{it.label}</div>
            <div className="text-lg font-bold text-foreground">{it.value || "—"}</div>
          </div>
        ))}
      </div>
      {ga.context && <div className="text-[13px] text-muted-foreground leading-relaxed mt-4">{ga.context}</div>}
      {ga.key_insight && <div className="text-[12px] bg-background border-l-[3px] border-l-primary px-2.5 py-2 rounded-r-lg text-muted-foreground italic leading-snug mt-2">{ga.key_insight}</div>}
    </div>
  );
};

export default GuidanceSection;
