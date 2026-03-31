METRICS_EXTRACTION_PROMPT = """You are an expert financial analyst. Extract ALL financial metrics explicitly stated in this earnings call transcript.

Return ONLY a valid JSON object — no explanation, no markdown fences, just raw JSON.
Use null for any metric not mentioned in the transcript.

{{
  "company_name": "string",
  "ticker": "string or null",
  "quarter": "e.g. Q4 2024",
  "fiscal_year": "e.g. FY2024",
  "report_date": "string or null",
  "revenue": {{
    "value": number or null,
    "currency": "USD",
    "unit": "millions or billions",
    "yoy_change_pct": number or null,
    "vs_estimate_pct": number or null
  }},
  "eps": {{
    "actual": number or null,
    "estimated": number or null,
    "surprise_pct": number or null,
    "type": "GAAP or Non-GAAP or null"
  }},
  "gross_margin": {{
    "value_pct": number or null,
    "yoy_change_bps": number or null
  }},
  "operating_margin": {{
    "value_pct": number or null,
    "yoy_change_bps": number or null
  }},
  "net_income": {{
    "value": number or null,
    "currency": "USD",
    "unit": "millions or billions",
    "yoy_change_pct": number or null
  }},
  "free_cash_flow": {{
    "value": number or null,
    "currency": "USD",
    "unit": "millions or billions",
    "yoy_change_pct": number or null
  }},
  "guidance": {{
    "next_quarter_revenue_low": number or null,
    "next_quarter_revenue_high": number or null,
    "next_quarter_eps_low": number or null,
    "next_quarter_eps_high": number or null,
    "full_year_revenue_low": number or null,
    "full_year_revenue_high": number or null,
    "full_year_eps_low": number or null,
    "full_year_eps_high": number or null,
    "currency": "USD",
    "unit": "millions or billions"
  }},
  "segments": [
    {{
      "name": "string",
      "revenue": number or null,
      "unit": "string",
      "yoy_change_pct": number or null
    }}
  ]
}}

Transcript:
{transcript}"""


METRICS_ANALYSIS_PROMPT = """You are a senior equity research analyst at a top investment bank. Given these extracted financial metrics from an earnings call, provide a clear, plain-English contextual analysis that helps investors understand what each number actually means.

Return ONLY a valid JSON object — no explanation, no markdown fences, just raw JSON.

{{
  "revenue_analysis": {{
    "verdict": "BEAT or MISS or IN-LINE or NO-ESTIMATE",
    "context": "2-3 sentences: what this revenue figure means, is it good or bad, industry context, what drove it",
    "key_insight": "single most important takeaway for investors in plain English"
  }},
  "eps_analysis": {{
    "verdict": "BEAT or MISS or IN-LINE or NO-ESTIMATE",
    "context": "2-3 sentences: profitability interpretation, what drove earnings, quality of earnings",
    "key_insight": "single most important takeaway"
  }},
  "margin_analysis": {{
    "verdict": "EXPANDING or CONTRACTING or STABLE or INSUFFICIENT-DATA",
    "context": "2-3 sentences: what margin trends signal about business health, pricing power, cost structure",
    "key_insight": "single most important takeaway"
  }},
  "guidance_analysis": {{
    "verdict": "RAISED or LOWERED or MAINTAINED or NOT-PROVIDED",
    "context": "2-3 sentences: management confidence level, what guidance implies about next quarter/year, any risks",
    "key_insight": "single most important takeaway"
  }},
  "cash_flow_analysis": {{
    "context": "1-2 sentences: what FCF tells us about business quality and capital allocation",
    "key_insight": "single most important takeaway"
  }},
  "overall_health": {{
    "score": "integer 1 through 10",
    "label": "Excellent or Strong or Moderate or Weak or Concerning",
    "rationale": "2-3 sentences synthesizing the overall financial picture"
  }}
}}

Metrics to analyze:
{metrics}"""


SUMMARY_PROMPT = """You are an expert financial analyst covering earnings calls. Analyze this transcript and produce a comprehensive summary.

Return ONLY a valid JSON object — no explanation, no markdown fences, just raw JSON.

{{
  "executive_summary": "3-4 sentence high-level overview of how the quarter went and what the market should know",
  "key_positives": [
    "positive point 1",
    "positive point 2",
    "positive point 3"
  ],
  "key_concerns": [
    "concern or risk 1",
    "concern or risk 2"
  ],
  "management_tone": "Bullish or Cautiously Optimistic or Neutral or Cautious or Bearish",
  "tone_rationale": "1-2 sentences explaining what in the call drove this tone assessment",
  "key_themes": [
    "theme 1",
    "theme 2",
    "theme 3",
    "theme 4",
    "theme 5"
  ],
  "qa_highlights": [
    {{
      "question_topic": "topic asked by analyst",
      "management_response_summary": "1-2 sentence summary of management answer"
    }}
  ],
  "sentiment_score": "number between -1.0 and 1.0 where -1 is very negative and 1 is very positive",
  "investor_takeaway": "1-2 sentence bottom-line summary for investors deciding whether to buy/hold/sell"
}}

Transcript:
{transcript}"""
