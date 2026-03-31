import type { TranscriptStructure } from "@/lib/api";

const TranscriptInfo = ({ structure }: { structure: TranscriptStructure }) => {
  if (!structure) return null;
  const badges: string[] = [];
  if (structure.has_prepared_remarks) badges.push("Prepared Remarks");
  if (structure.has_qa_section) badges.push("Q&A Section");
  if (structure.operator_present) badges.push("Operator");

  return (
    <div className="bg-background border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Transcript Info</div>
      <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground">
        <span>📄 {(structure.word_count || 0).toLocaleString()} words</span>
        <span>⏱ ~{structure.estimated_duration_min || 0} min read</span>
        <span>🎤 {structure.total_speakers || 0} speakers</span>
        <span>💲 {structure.dollar_figures_found || 0} dollar figures</span>
        <span>📊 {structure.percentage_figures_found || 0} percentages</span>
      </div>
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {badges.map((b) => (
            <span key={b} className="text-[12px] font-medium px-3 py-1.5 bg-background text-muted-foreground border border-border rounded-full">{b}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptInfo;
