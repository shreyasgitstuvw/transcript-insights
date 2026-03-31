import type { Summary } from "@/lib/api";

const KeyThemes = ({ summary }: { summary: Summary }) => {
  const themes = summary?.key_themes;
  if (!themes?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Key Themes</div>
      <div className="flex flex-wrap gap-2">
        {themes.map((t, i) => (
          <span key={i} className="text-[12px] font-medium px-3 py-1.5 bg-primary-light text-primary border border-primary/20 rounded-full">{t}</span>
        ))}
      </div>
      {summary.tone_rationale && <div className="text-[13px] text-muted-foreground leading-relaxed mt-4">{summary.tone_rationale}</div>}
    </div>
  );
};

export default KeyThemes;
