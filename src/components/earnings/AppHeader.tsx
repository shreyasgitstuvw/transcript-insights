import { BarChart3, Github, BookOpen } from "lucide-react";

const AppHeader = () => (
  <header className="sticky top-0 z-50 bg-card border-b border-border h-[60px] flex items-center justify-between px-8 shadow-card">
    <div className="flex items-center gap-2.5">
      <BarChart3 className="w-6 h-6 text-primary" />
      <h1 className="text-[17px] font-bold text-foreground">Earnings Call Parser</h1>
      <span className="text-[11px] font-medium bg-primary-light text-primary px-2 py-0.5 rounded-full">
        Open Source
      </span>
    </div>
    <div className="flex items-center gap-1">
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-background transition-colors"
      >
        <Github className="w-4 h-4" /> GitHub
      </a>
      <a
        href="https://ollama.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-background transition-colors"
      >
        <BookOpen className="w-4 h-4" /> Ollama Docs
      </a>
    </div>
  </header>
);

export default AppHeader;
