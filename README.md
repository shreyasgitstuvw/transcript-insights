# Transcript Insights — Earnings Call Parser

Open-source earnings call analysis powered by local AI (Ollama). Paste any earnings call transcript and get structured financial metrics, contextual analysis, sentiment scoring, and executive summaries — all running 100% locally, no data leaves your machine.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | shadcn/ui + Tailwind CSS |
| Backend | FastAPI + Python |
| AI/NLP | Ollama (local LLMs — llama3.2, mistral, etc.) |

## Project Structure

```
transcript-insights/
├── backend/               # FastAPI backend
│   ├── app.py             # API server + SSE streaming
│   ├── ollama_client.py   # Ollama integration
│   ├── parser_util.py     # Regex-based transcript parsing
│   ├── prompts.py         # LLM prompt templates
│   └── requirements.txt
└── src/                   # React frontend
    ├── components/earnings/
    ├── lib/api.ts         # Backend client + TypeScript types
    └── pages/Index.tsx
```

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installed and running

### 1. Start Ollama

```bash
ollama serve
ollama pull llama3.2
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:8000
```

### 3. Start the frontend

```bash
npm install
npm run dev
# Runs on http://localhost:8080
```

Open `http://localhost:8080`, paste a transcript, and click **Analyze**.

## Features

- **Financial metrics** — Revenue, EPS, gross/operating margins, FCF, net income
- **Contextual analysis** — BEAT/MISS/IN-LINE verdicts with plain-English explanations per metric
- **Forward guidance** — Next quarter + full year ranges with RAISED/LOWERED/MAINTAINED verdict
- **Segment breakdown** — Business segment revenue table
- **Executive summary** — Key positives, concerns, investor takeaway
- **Sentiment gauge** — -1 to +1 score with visual indicator
- **Q&A highlights** — Key analyst questions + management responses
- **Live progress** — Step-by-step streaming via SSE
