// In dev: Vite proxy forwards /models and /analyze → http://localhost:8000
// In prod: set VITE_API_BASE to your deployed backend URL
const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface SSEEvent {
  step: number | "complete";
  total?: number;
  status?: "running" | "done";
  message?: string;
  result?: AnalysisResult;
}

export interface AnalysisResult {
  structure: TranscriptStructure;
  metrics: Metrics;
  analysis: Analysis;
  summary: Summary;
}

export interface TranscriptStructure {
  word_count: number;
  total_speakers: number;
  estimated_duration_min: number;
  dollar_figures_found: number;
  percentage_figures_found: number;
  has_prepared_remarks: boolean;
  has_qa_section: boolean;
  operator_present: boolean;
}

export interface Metrics {
  company_name?: string;
  ticker?: string;
  quarter?: string;
  fiscal_year?: string;
  report_date?: string;
  revenue?: { value: number; unit: string; currency: string; yoy_change_pct?: number };
  eps?: { actual?: number; estimated?: number; type?: string; surprise_pct?: number };
  gross_margin?: { value_pct?: number; yoy_change_bps?: number };
  operating_margin?: { value_pct?: number; yoy_change_bps?: number };
  free_cash_flow?: { value: number; unit: string; currency: string; yoy_change_pct?: number };
  net_income?: { value: number; unit: string; currency: string; yoy_change_pct?: number };
  guidance?: {
    unit?: string;
    currency?: string;
    next_quarter_revenue_low?: number;
    next_quarter_revenue_high?: number;
    full_year_revenue_low?: number;
    full_year_revenue_high?: number;
    next_quarter_eps_low?: number;
    next_quarter_eps_high?: number;
    full_year_eps_low?: number;
    full_year_eps_high?: number;
  };
  segments?: Array<{ name: string; revenue?: number; unit?: string; yoy_change_pct?: number }>;
}

export interface Analysis {
  revenue_analysis?: { verdict?: string; context?: string; key_insight?: string };
  eps_analysis?: { verdict?: string; context?: string; key_insight?: string };
  margin_analysis?: { verdict?: string; context?: string; key_insight?: string };
  cash_flow_analysis?: { context?: string; key_insight?: string };
  guidance_analysis?: { verdict?: string; context?: string; key_insight?: string };
  overall_health?: { score: number; label?: string; rationale?: string };
}

export interface Summary {
  executive_summary?: string;
  investor_takeaway?: string;
  key_positives?: string[];
  key_concerns?: string[];
  key_themes?: string[];
  management_tone?: string;
  tone_rationale?: string;
  sentiment_score?: number;
  qa_highlights?: Array<{ question_topic: string; management_response_summary: string }>;
  error?: string;
}

export async function fetchModels(): Promise<{ reachable: boolean; models: string[] }> {
  const res = await fetch(`${API_BASE}/models`);
  return res.json();
}

export async function analyzeTranscript(
  transcript: string,
  model: string,
  onEvent: (event: SSEEvent) => void
): Promise<void> {
  const formData = new FormData();
  formData.append("transcript", transcript);
  formData.append("model", model);

  const resp = await fetch(`${API_BASE}/analyze`, { method: "POST", body: formData });
  if (!resp.ok) throw new Error(`Server error ${resp.status}`);

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const event: SSEEvent = JSON.parse(line.slice(6));
          onEvent(event);
        } catch { /* ignore malformed */ }
      }
    }
  }
}
