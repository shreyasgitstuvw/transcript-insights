import type { Summary } from "@/lib/api";

const QAHighlights = ({ summary }: { summary: Summary }) => {
  const qa = summary?.qa_highlights;
  if (!qa?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Q&A Highlights</div>
      <div className="flex flex-col gap-2.5">
        {qa.map((item, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <div className="text-[13px] font-semibold text-foreground bg-background px-3.5 py-2.5 border-b border-border">❓ {item.question_topic}</div>
            <div className="text-[13px] text-muted-foreground px-3.5 py-2.5 leading-relaxed">{item.management_response_summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAHighlights;
