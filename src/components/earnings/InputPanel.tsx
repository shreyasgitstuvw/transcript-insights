import { useState, useRef, useCallback, useEffect } from "react";
import { RefreshCw, Upload, ArrowRight, Loader2 } from "lucide-react";
import { fetchModels } from "@/lib/api";

interface InputPanelProps {
  onAnalyze: (transcript: string, model: string) => void;
  isLoading: boolean;
}

const InputPanel = ({ onAnalyze, isLoading }: InputPanelProps) => {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [transcript, setTranscript] = useState("");
  const [modelsLoading, setModelsLoading] = useState(true);
  const [ollamaDown, setOllamaDown] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadModels = useCallback(async () => {
    setModelsLoading(true);
    try {
      const data = await fetchModels();
      if (!data.reachable || data.models.length === 0) {
        setOllamaDown(true);
        setModels([]);
        return;
      }
      setOllamaDown(false);
      setModels(data.models);
      const preferred = data.models.find((m) => /llama3|mistral|gemma|phi/i.test(m));
      setSelectedModel(preferred || data.models[0]);
    } catch {
      setOllamaDown(true);
      setModels([]);
    } finally {
      setModelsLoading(false);
    }
  }, []);

  useEffect(() => { loadModels(); }, [loadModels]);

  const handleFile = (file: File) => {
    if (!/\.(txt|md|csv)$/i.test(file.name)) return;
    const reader = new FileReader();
    reader.onload = (e) => setTranscript(e.target?.result as string);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <aside className="bg-card border border-border rounded-xl shadow-card sticky top-[84px] h-fit flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground">
          <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="4" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Transcript Input</h2>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {ollamaDown && (
          <div className="bg-warn-bg border border-warn-border rounded-lg px-4 py-2.5 text-[13px] text-warn flex items-center gap-2">
            ⚠️ <strong>Ollama not detected.</strong> Make sure Ollama is running on port 11434.
          </div>
        )}

        {/* Model selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-muted-foreground">Ollama Model</label>
          <div className="flex gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={modelsLoading || ollamaDown}
              className="flex-1 px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-primary/10 transition-all"
            >
              {modelsLoading ? (
                <option>Loading…</option>
              ) : models.length === 0 ? (
                <option>Ollama not reachable</option>
              ) : (
                models.map((m) => <option key={m} value={m}>{m}</option>)
              )}
            </select>
            <button
              onClick={loadModels}
              className="h-[42px] w-[42px] flex items-center justify-center border border-border rounded-lg bg-card text-muted-foreground hover:border-primary hover:text-primary transition-all shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Upload area */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-muted-foreground">Upload Transcript</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg px-4 py-3.5 text-center cursor-pointer text-muted-foreground text-[13px] hover:border-primary hover:text-primary hover:bg-primary-light transition-all"
          >
            <Upload className="w-4 h-4 inline-block mr-2 align-middle" />
            Upload .txt file or drag & drop
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
        </div>

        {/* Textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-muted-foreground">Paste Transcript</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={"Paste the full earnings call transcript here…\n\nExample sources:\n• Seeking Alpha earnings transcripts\n• Company investor relations pages\n• SEC filings (8-K exhibits)\n• Bloomberg/Reuters transcripts"}
            className="w-full min-h-[320px] px-3 py-3 bg-card border border-border rounded-lg text-sm text-foreground resize-y focus:outline-none focus:border-ring focus:ring-2 focus:ring-primary/10 transition-all leading-relaxed placeholder:text-muted-foreground/60"
          />
          <div className="text-[12px] text-muted-foreground text-right">
            {transcript.length.toLocaleString()} characters
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={() => onAnalyze(transcript, selectedModel)}
          disabled={isLoading || !transcript.trim() || !selectedModel}
          className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold text-[15px] rounded-lg flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin-fast" />
              Analyzing…
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" />
              Analyze Earnings Call
            </>
          )}
        </button>

        <div className="text-[11px] text-muted-foreground leading-relaxed">
          ⚡ Powered by{" "}
          <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Ollama
          </a>{" "}
          — 100% local, no data leaves your machine.
        </div>
      </div>
    </aside>
  );
};

export default InputPanel;
