import type { Metrics, Analysis } from "@/lib/api";
import { formatMoney, bpsToPercent } from "@/lib/format";

interface Props { metrics: Metrics; analysis: Analysis }

interface MetricCardData {
  name: string;
  value: string | null;
  changePct: number | null | undefined;
  verdict?: string;
  context?: string;
  insight?: string;
  changeSuffix?: string;
  isBps?: boolean;
}

const VerdictBadge = ({ verdict }: { verdict: string }) => {
  const v = verdict.toUpperCase();
  const classes =
    /BEAT|EXPANDING|RAISED/.test(v) ? "text-beat bg-beat-bg border-beat-border" :
    /MISS|CONTRACTING|LOWERED/.test(v) ? "text-miss bg-miss-bg border-miss-border" :
    /IN.LINE|STABLE|MAINTAINED|NEUTRAL/.test(v) ? "text-neutral bg-neutral-bg border-neutral-border" :
    "text-warn bg-warn-bg border-warn-border";
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${classes}`}>{verdict}</span>;
};

const MetricCard = ({ name, value, changePct, verdict, context, insight, changeSuffix = "% YoY", isBps }: MetricCardData) => {
  let changeEl = null;
  if (changePct != null) {
    const num = typeof changePct === "number" ? changePct : parseFloat(String(changePct));
    const cls = num > 0 ? "text-beat" : num < 0 ? "text-miss" : "text-neutral";
    const arrow = num > 0 ? "▲" : num < 0 ? "▼" : "─";
    const suffix = isBps
      ? `${Math.abs(Math.round(num * 100))} bps YoY`
      : `${Math.abs(num).toFixed(1)}${changeSuffix}`;
    changeEl = <div className={`text-[13px] font-semibold flex items-center gap-1 ${cls}`}>{arrow} {suffix}</div>;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">{name}</span>
        {verdict && <VerdictBadge verdict={verdict} />}
      </div>
      {value != null ? (
        <div className="text-[28px] font-extrabold text-foreground leading-none">{value}</div>
      ) : (
        <div className="text-base text-muted-foreground font-medium">Not reported</div>
      )}
      {changeEl}
      {context && <div className="text-[13px] text-muted-foreground leading-relaxed pt-2 border-t border-border">{context}</div>}
      {insight && (
        <div className="text-[12px] bg-background border-l-[3px] border-l-primary px-2.5 py-2 rounded-r-lg text-muted-foreground italic leading-snug">{insight}</div>
      )}
    </div>
  );
};

const MetricsGrid = ({ metrics, analysis }: Props) => {
  const cards: MetricCardData[] = [];

  if (metrics.revenue) {
    const r = metrics.revenue;
    const a = analysis.revenue_analysis || {};
    cards.push({ name: "Revenue", value: formatMoney(r.value, r.unit, r.currency), changePct: r.yoy_change_pct, verdict: a.verdict, context: a.context, insight: a.key_insight });
  }
  if (metrics.eps) {
    const e = metrics.eps;
    const a = analysis.eps_analysis || {};
    const val = e.actual != null ? `$${e.actual}` : null;
    const est = e.estimated != null ? ` (est. $${e.estimated})` : "";
    cards.push({ name: `EPS ${e.type || ""}`, value: val ? val + est : null, changePct: e.surprise_pct, verdict: a.verdict, context: a.context, insight: a.key_insight, changeSuffix: "% surprise" });
  }
  if (metrics.gross_margin) {
    const gm = metrics.gross_margin;
    const a = analysis.margin_analysis || {};
    cards.push({ name: "Gross Margin", value: gm.value_pct != null ? `${gm.value_pct}%` : null, changePct: bpsToPercent(gm.yoy_change_bps), verdict: a.verdict, context: a.context, insight: a.key_insight, changeSuffix: "bps YoY", isBps: true });
  }
  if (metrics.operating_margin) {
    const om = metrics.operating_margin;
    cards.push({ name: "Operating Margin", value: om.value_pct != null ? `${om.value_pct}%` : null, changePct: bpsToPercent(om.yoy_change_bps), changeSuffix: "bps YoY", isBps: true });
  }
  if (metrics.free_cash_flow) {
    const fcf = metrics.free_cash_flow;
    const a = analysis.cash_flow_analysis || {};
    cards.push({ name: "Free Cash Flow", value: formatMoney(fcf.value, fcf.unit, fcf.currency), changePct: fcf.yoy_change_pct, context: a.context, insight: a.key_insight });
  }
  if (metrics.net_income) {
    const ni = metrics.net_income;
    cards.push({ name: "Net Income", value: formatMoney(ni.value, ni.unit, ni.currency), changePct: ni.yoy_change_pct });
  }

  if (!cards.length) return null;

  return (
    <div>
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="12" rx="1" fill="currentColor"/><rect x="9" y="5" width="5" height="9" rx="1" fill="currentColor"/><rect x="9" y="2" width="5" height="2" rx="1" fill="currentColor" opacity=".3"/></svg>
        Financial Metrics
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => <MetricCard key={i} {...c} />)}
      </div>
    </div>
  );
};

export default MetricsGrid;
