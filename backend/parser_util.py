import re
from typing import Any


def parse_transcript_structure(transcript: str) -> dict[str, Any]:
    """
    Regex-based structural parsing of earnings call transcripts.
    Extracts speakers, sections, and basic metadata without LLM.
    """
    lines = [l.strip() for l in transcript.split("\n") if l.strip()]

    speakers: dict[str, list[str]] = {}
    current_speaker: str | None = None
    current_block: list[str] = []

    # Pattern: "Speaker Name - Title" or "SPEAKER NAME:" or "Speaker Name:"
    speaker_line_re = re.compile(
        r"^([A-Za-z][A-Za-z\s\.\-\']{2,50}?)"          # name
        r"\s*(?:[-–—]|\:)\s*"                            # separator
        r"(?:[A-Za-z&\s,\.]{0,60})?$"                   # optional title
    )

    def flush_block():
        if current_speaker and current_block:
            text = " ".join(current_block).strip()
            if len(text) > 20:
                speakers.setdefault(current_speaker, []).append(text)

    for line in lines:
        m = speaker_line_re.match(line)
        # Only treat as speaker if line is short (< 90 chars) and doesn't look like a sentence
        if m and len(line) < 90 and not line.endswith("."):
            flush_block()
            raw_name = m.group(1).strip()
            # Normalise: title-case
            current_speaker = " ".join(w.capitalize() for w in raw_name.split())
            current_block = []
        else:
            current_block.append(line)

    flush_block()

    # Section detection
    full_lower = transcript.lower()
    has_qa = bool(re.search(r"question.{0,15}answer|q\s*&\s*a session|\bq&a\b", full_lower))
    has_prepared = bool(re.search(r"prepared.{0,15}remarks|opening.{0,15}remarks|presentation", full_lower))

    # Operator / Moderator detection
    operator_names = [
        s for s in speakers
        if re.search(r"\boperator\b|\bmoderator\b|\bhost\b", s, re.I)
    ]

    # Word / duration stats
    words = transcript.split()
    word_count = len(words)

    # Simple financial figure regex scan (for quick preview before LLM)
    dollar_figures = re.findall(r"\$[\d,]+(?:\.\d+)?\s*(?:billion|million|B|M)\b", transcript)
    percent_figures = re.findall(r"-?\d+(?:\.\d+)?\s*%", transcript)

    return {
        "word_count": word_count,
        "estimated_duration_min": max(1, round(word_count / 130)),
        "total_speakers": len(speakers),
        "speakers": list(speakers.keys())[:25],
        "operator_present": len(operator_names) > 0,
        "has_prepared_remarks": has_prepared,
        "has_qa_section": has_qa,
        "dollar_figures_found": len(dollar_figures),
        "percentage_figures_found": len(percent_figures),
        "preview_dollar_figures": list(dict.fromkeys(dollar_figures))[:10],
    }
