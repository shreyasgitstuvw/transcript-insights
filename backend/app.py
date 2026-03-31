import json
import asyncio
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from parser_util import parse_transcript_structure
from ollama_client import OllamaClient

app = FastAPI(title="Earnings Call Parser", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# Models endpoint
# ------------------------------------------------------------------
@app.get("/models")
async def get_models():
    client = OllamaClient()
    return await client.list_models()


# ------------------------------------------------------------------
# Main analysis — SSE streaming so UI shows step-by-step progress
# ------------------------------------------------------------------
def sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


async def _run_analysis(transcript: str, model: str):
    """Generator that yields SSE events for each pipeline step."""

    # Step 1 — structural parse (fast, no LLM)
    yield sse({"step": 1, "total": 4, "status": "running",
                "message": "Parsing transcript structure..."})
    await asyncio.sleep(0)  # yield control so SSE flushes
    structure = parse_transcript_structure(transcript)
    yield sse({"step": 1, "total": 4, "status": "done",
                "message": f"Structure parsed — {structure['word_count']:,} words, "
                           f"{structure['total_speakers']} speakers detected."})

    client = OllamaClient(model=model)

    # Step 2 — metric extraction
    yield sse({"step": 2, "total": 4, "status": "running",
                "message": "Extracting financial metrics with AI..."})
    metrics = await client.extract_metrics(transcript)
    yield sse({"step": 2, "total": 4, "status": "done",
                "message": "Financial metrics extracted."})

    # Step 3 — contextual analysis
    yield sse({"step": 3, "total": 4, "status": "running",
                "message": "Generating contextual analysis of each metric..."})
    analysis = await client.analyze_metrics(metrics)
    yield sse({"step": 3, "total": 4, "status": "done",
                "message": "Contextual analysis complete."})

    # Step 4 — executive summary
    yield sse({"step": 4, "total": 4, "status": "running",
                "message": "Creating executive summary and Q&A highlights..."})
    summary = await client.generate_summary(transcript)
    yield sse({"step": 4, "total": 4, "status": "done",
                "message": "Summary generated."})

    # Final payload
    yield sse({
        "step": "complete",
        "result": {
            "structure": structure,
            "metrics": metrics,
            "analysis": analysis,
            "summary": summary,
        }
    })


@app.post("/analyze")
async def analyze(transcript: str = Form(...), model: str = Form("llama3.2")):
    if not transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript is empty.")
    return StreamingResponse(
        _run_analysis(transcript, model),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/analyze-file")
async def analyze_file(
    file: UploadFile = File(...),
    model: str = Form("llama3.2"),
):
    content = await file.read()
    try:
        transcript = content.decode("utf-8")
    except UnicodeDecodeError:
        transcript = content.decode("latin-1")
    if not transcript.strip():
        raise HTTPException(status_code=400, detail="File is empty.")
    return StreamingResponse(
        _run_analysis(transcript, model),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
