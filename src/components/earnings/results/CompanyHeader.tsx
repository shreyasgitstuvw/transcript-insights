import type { Metrics, Summary } from "@/lib/api";

interface Props { metrics: Metrics; summary: Summary }

const CompanyHeader = ({ metrics, summary }: Props) => {
  const name = metrics.company_name || "Unknown Company";
  const ticker = metrics.ticker ? `(${metrics.ticker})` : "";
  const quarter = metrics.quarter;
  const fy = metrics.fiscal_year;
  const date = metrics.report_date;
  const tone = summary.management_tone;

  return (
    <div className="rounded-xl p-6 text-primary-foreground flex justify-between items-start flex-wrap gap-4" style={{ background: "var(--gradient-brand)" }}>
      <div>
        <div className="text-[26px] font-extrabold tracking-tight">{name} {ticker}</div>
        <div className="flex gap-3 mt-1.5 flex-wrap">
          {quarter && <span className="text-[13px] opacity-85 bg-[rgba(255,255,255,0.15)] px-2.5 py-0.5 rounded-full">{quarter}</span>}
          {fy && <span className="text-[13px] opacity-85 bg-[rgba(255,255,255,0.15)] px-2.5 py-0.5 rounded-full">{fy}</span>}
          {date && <span className="text-[13px] opacity-85 bg-[rgba(255,255,255,0.15)] px-2.5 py-0.5 rounded-full">📅 {date}</span>}
        </div>
      </div>
      {tone && (
        <div className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] whitespace-nowrap">
          📣 {tone}
        </div>
      )}
    </div>
  );
};

export default CompanyHeader;
