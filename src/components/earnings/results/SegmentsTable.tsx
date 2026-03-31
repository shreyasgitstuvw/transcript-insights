import type { Metrics } from "@/lib/api";

const SegmentsTable = ({ metrics }: { metrics: Metrics }) => {
  const segs = metrics.segments;
  if (!segs?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Segment Breakdown</div>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="text-left text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pb-2 border-b border-border px-3">Segment</th>
            <th className="text-left text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pb-2 border-b border-border px-3">Revenue</th>
            <th className="text-left text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pb-2 border-b border-border px-3">YoY</th>
          </tr>
        </thead>
        <tbody>
          {segs.map((s, i) => (
            <tr key={i}>
              <td className="py-2.5 px-3 border-b border-border font-semibold text-foreground">{s.name}</td>
              <td className="py-2.5 px-3 border-b border-border text-muted-foreground">{s.revenue != null ? `${s.revenue}${s.unit ? " " + s.unit : ""}` : "—"}</td>
              <td className="py-2.5 px-3 border-b border-border">
                {s.yoy_change_pct != null ? (
                  <span className={`text-[12px] font-semibold ${s.yoy_change_pct >= 0 ? "text-beat" : "text-miss"}`}>
                    {s.yoy_change_pct >= 0 ? "▲" : "▼"} {Math.abs(s.yoy_change_pct).toFixed(1)}%
                  </span>
                ) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SegmentsTable;
