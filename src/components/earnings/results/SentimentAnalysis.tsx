import type { Summary } from "@/lib/api";

const SentimentAnalysis = ({ summary }: { summary: Summary }) => {
  const score = typeof summary?.sentiment_score === "number" ? summary.sentiment_score : parseFloat(String(summary?.sentiment_score));
  if (isNaN(score)) return null;

  const pct = Math.round(((score + 1) / 2) * 100);
  const color = score > 0.2 ? "text-beat" : score < -0.2 ? "text-miss" : "text-warn";
  const label = score >= 0.6 ? "Very Positive" : score >= 0.2 ? "Positive"
    : score <= -0.6 ? "Very Negative" : score <= -0.2 ? "Negative" : "Neutral";

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5">Sentiment Analysis</div>
      <div className="flex items-center gap-5 flex-wrap">
        <div>
          <div className={`text-[32px] font-extrabold ${color}`}>{score > 0 ? "+" : ""}{score.toFixed(2)}</div>
          <div className="text-[13px] text-muted-foreground font-medium">{label}</div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>Very Negative</span><span>Neutral</span><span>Very Positive</span>
          </div>
          <div className="h-2.5 rounded-full relative" style={{ background: "var(--gradient-sentiment)" }}>
            <div
              className="absolute -top-[3px] w-4 h-4 bg-card border-2 rounded-full shadow-card"
              style={{
                left: `${pct}%`,
                transform: "translateX(-50%)",
                borderColor: score > 0.2 ? "hsl(var(--beat))" : score < -0.2 ? "hsl(var(--miss))" : "hsl(var(--warn))"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
