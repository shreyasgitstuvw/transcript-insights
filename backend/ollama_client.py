import httpx
import json
import re
from typing import Any

from prompts import METRICS_EXTRACTION_PROMPT, METRICS_ANALYSIS_PROMPT, SUMMARY_PROMPT

OLLAMA_BASE = "http://localhost:11434"
# Max chars to send per LLM call — keeps context within model limits
TRANSCRIPT_CHAR_LIMIT = 12_000


class OllamaClient:
    def __init__(self, model: str = "llama3.2"):
        self.model = model

    # ------------------------------------------------------------------
    # Core generate call
    # ------------------------------------------------------------------
    async def _generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.05,   # low temp for reliable JSON
                "num_predict": 4096,
            },
        }
        async with httpx.AsyncClient(timeout=300.0) as client:
            resp = await client.post(f"{OLLAMA_BASE}/api/generate", json=payload)
            resp.raise_for_status()
            return resp.json()["response"]

    # ------------------------------------------------------------------
    # List available models
    # ------------------------------------------------------------------
    async def list_models(self) -> dict:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(f"{OLLAMA_BASE}/api/tags")
                resp.raise_for_status()
                models = [m["name"] for m in resp.json().get("models", [])]
                return {"models": models, "reachable": True}
        except Exception as exc:
            return {"models": [], "reachable": False, "error": str(exc)}

    # ------------------------------------------------------------------
    # JSON extraction helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _extract_json(text: str) -> Any:
        """Robustly pull JSON from LLM output that may contain extra text."""
        # 1. Try fenced code block
        m = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
        if m:
            try:
                return json.loads(m.group(1))
            except json.JSONDecodeError:
                pass

        # 2. Try direct parse
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            pass

        # 3. Find the largest balanced JSON object in the text
        for start_ch, end_ch in [('{', '}'), ('[', ']')]:
            idx = text.find(start_ch)
            if idx == -1:
                continue
            depth = 0
            for i in range(idx, len(text)):
                if text[i] == start_ch:
                    depth += 1
                elif text[i] == end_ch:
                    depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[idx: i + 1])
                    except json.JSONDecodeError:
                        break

        return {}

    # ------------------------------------------------------------------
    # Pipeline steps
    # ------------------------------------------------------------------
    async def extract_metrics(self, transcript: str) -> dict:
        prompt = METRICS_EXTRACTION_PROMPT.format(
            transcript=transcript[:TRANSCRIPT_CHAR_LIMIT]
        )
        raw = await self._generate(prompt)
        result = self._extract_json(raw)
        if not result:
            return {"error": "metric_extraction_failed", "raw_preview": raw[:400]}
        return result

    async def analyze_metrics(self, metrics: dict) -> dict:
        if not metrics or "error" in metrics:
            return {"error": "no_metrics_to_analyze"}
        prompt = METRICS_ANALYSIS_PROMPT.format(
            metrics=json.dumps(metrics, indent=2)
        )
        raw = await self._generate(prompt)
        result = self._extract_json(raw)
        if not result:
            return {"error": "analysis_failed", "raw_preview": raw[:400]}
        return result

    async def generate_summary(self, transcript: str) -> dict:
        # Use first + last portions to capture intro and Q&A
        half = TRANSCRIPT_CHAR_LIMIT // 2
        excerpt = transcript[:half] + "\n...\n" + transcript[-half:]
        prompt = SUMMARY_PROMPT.format(transcript=excerpt)
        raw = await self._generate(prompt)
        result = self._extract_json(raw)
        if not result:
            return {"error": "summary_failed", "raw_preview": raw[:400]}
        return result
