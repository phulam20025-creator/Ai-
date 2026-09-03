import React, { useState } from "react";
import {
  Gamepad2,
  Terminal,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  Globe,
  Sliders,
  Play,
  Share2,
  Info,
  CheckCircle2
} from "lucide-react";
import { Language, PresetTemplate } from "./types";
import { PromptBuilder } from "./components/PromptBuilder";
import { InteractivePlayground } from "./components/InteractivePlayground";
import { SlideDeckViewer } from "./components/SlideDeckViewer";
import { TemplateGallery } from "./components/TemplateGallery";

export default function App() {
  const [language, setLanguage] = useState<Language>("vi");
  const [activeView, setActiveView] = useState<"builder" | "sandbox" | "guide" | "templates">("builder");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleSelectTemplate = (tmpl: PresetTemplate) => {
    setSelectedTemplate(tmpl);
    setActiveView("builder");
  };

  const handleApplySlidePrompt = (promptText: string) => {
    setSelectedTemplate({
      concept: promptText,
    });
    setActiveView("builder");
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E0E0E0] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* High Density Command Console Header */}
      <header className="h-12 border-b border-[#2D333B] flex items-center justify-between px-3 sm:px-4 bg-[#161B22] shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Brand Icon & Title */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveView("builder")}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.35)] shrink-0">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-semibold tracking-tight uppercase text-[#E0E0E0] flex items-center gap-1.5">
                  PixelPrompt
                  <span className="text-indigo-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#21262D] border border-[#2D333B]">
                    v4.2
                  </span>
                </h1>
              </div>
              <span className="text-[10px] text-[#8B949E] hidden lg:inline tracking-tight font-mono">
                {language === "vi"
                  ? "AI Studio Command Console • 2D Pixel Architecture"
                  : "AI Studio Command Console • 2D Pixel Architecture"}
              </span>
            </div>
          </div>

          {/* Nav Pills in Header */}
          <nav className="hidden md:flex items-center gap-1 pl-3 border-l border-[#2D333B]">
            <button
              id="nav-builder-tab"
              onClick={() => setActiveView("builder")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeView === "builder"
                  ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                  : "text-[#8B949E] hover:text-[#E0E0E0] hover:bg-[#1C2128]"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{language === "vi" ? "Tạo Prompt" : "Prompt Studio"}</span>
            </button>

            <button
              id="nav-sandbox-tab"
              onClick={() => setActiveView("sandbox")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeView === "sandbox"
                  ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                  : "text-[#8B949E] hover:text-[#E0E0E0] hover:bg-[#1C2128]"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{language === "vi" ? "Giả Lập Canvas" : "Sandbox"}</span>
            </button>

            <button
              id="nav-guide-tab"
              onClick={() => setActiveView("guide")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeView === "guide"
                  ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                  : "text-[#8B949E] hover:text-[#E0E0E0] hover:bg-[#1C2128]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === "vi" ? "Slide Cẩm Nang" : "Slide Guide"}</span>
            </button>

            <button
              id="nav-templates-tab"
              onClick={() => setActiveView("templates")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeView === "templates"
                  ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                  : "text-[#8B949E] hover:text-[#E0E0E0] hover:bg-[#1C2128]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === "vi" ? "Mẫu Sẵn" : "Presets"}</span>
            </button>
          </nav>
        </div>

        {/* High Density Telemetry Status Bar & Actions */}
        <div className="flex items-center gap-3 sm:gap-5 text-[11px] font-mono">
          <div className="hidden xl:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            <span className="text-[#3fb950] font-semibold tracking-wider text-[10px]">SYSTEM ONLINE</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 border-l border-[#2D333B] pl-3 text-[10px]">
            <span className="text-[#8B949E]">UPTIME:</span>
            <span className="text-[#E0E0E0]">142:12:09</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 border-l border-[#2D333B] pl-3 text-[10px]">
            <span className="text-[#8B949E]">ENGINE:</span>
            <span className="text-indigo-400">CANVAS_TS</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 border-l border-[#2D333B] pl-3 text-[10px]">
            <span className="text-[#8B949E]">FPS:</span>
            <span className="text-emerald-400">60.0</span>
          </div>

          {/* Language Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
            className="px-2 py-1 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#2D333B] text-[10px] font-mono text-[#E0E0E0] flex items-center gap-1 transition-colors"
            title="Đổi ngôn ngữ / Switch Language"
          >
            <Globe className="w-3 h-3 text-indigo-400" />
            <span>{language === "vi" ? "VI" : "EN"}</span>
          </button>

          {/* AI Studio Link */}
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.25)]"
          >
            <span className="hidden sm:inline">AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Mobile Submenu Navigation Bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 bg-[#0D1117] border-b border-[#2D333B] text-xs">
        <button
          onClick={() => setActiveView("builder")}
          className={`py-1 px-2.5 rounded text-xs font-mono ${
            activeView === "builder" ? "text-indigo-400 font-bold bg-[#21262D] border border-[#2D333B]" : "text-[#8B949E]"
          }`}
        >
          {language === "vi" ? "Tạo Prompt" : "Studio"}
        </button>
        <button
          onClick={() => setActiveView("sandbox")}
          className={`py-1 px-2.5 rounded text-xs font-mono ${
            activeView === "sandbox" ? "text-indigo-400 font-bold bg-[#21262D] border border-[#2D333B]" : "text-[#8B949E]"
          }`}
        >
          {language === "vi" ? "Giả Lập" : "Sandbox"}
        </button>
        <button
          onClick={() => setActiveView("guide")}
          className={`py-1 px-2.5 rounded text-xs font-mono ${
            activeView === "guide" ? "text-indigo-400 font-bold bg-[#21262D] border border-[#2D333B]" : "text-[#8B949E]"
          }`}
        >
          {language === "vi" ? "Cẩm Nang" : "Guide"}
        </button>
        <button
          onClick={() => setActiveView("templates")}
          className={`py-1 px-2.5 rounded text-xs font-mono ${
            activeView === "templates" ? "text-indigo-400 font-bold bg-[#21262D] border border-[#2D333B]" : "text-[#8B949E]"
          }`}
        >
          {language === "vi" ? "Mẫu Sẵn" : "Presets"}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-3 sm:p-4 md:p-5 flex flex-col gap-4 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-grid-dots"></div>

        <div className="relative z-10 flex flex-col gap-4">
          {activeView === "builder" && (
            <PromptBuilder
              language={language}
              initialTemplate={selectedTemplate}
              onRunInSandbox={() => setActiveView("sandbox")}
            />
          )}

          {activeView === "sandbox" && (
            <InteractivePlayground
              language={language}
              onUsePrompt={(promptData) => {
                setSelectedTemplate(promptData);
                setActiveView("builder");
              }}
            />
          )}

          {activeView === "guide" && (
            <SlideDeckViewer
              language={language}
              onApplyPromptTemplate={handleApplySlidePrompt}
            />
          )}

          {activeView === "templates" && (
            <TemplateGallery
              language={language}
              onSelectTemplate={handleSelectTemplate}
            />
          )}
        </div>
      </main>

      {/* Information & Telemetry Sub-Footer */}
      <div className="border-t border-[#2D333B] bg-[#161B22] py-2 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#8B949E]">
          <div className="flex items-center gap-3">
            <span className="text-[#E0E0E0] font-semibold uppercase">PixelPrompt Studio v4.2</span>
            <span>•</span>
            <span className="text-emerald-400">TARGET: HTML5 CANVAS & TYPESCRIPT</span>
            <span>•</span>
            <span>{language === "vi" ? "Dựa trên Gemini Canvas 'Tạo Prompt Làm Game 2D Pixel'" : "Based on Gemini Canvas 'Tạo Prompt Làm Game 2D Pixel'"}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView("guide")}
              className="hover:text-indigo-400 transition-colors uppercase"
            >
              {language === "vi" ? "Slide Cẩm Nang AI Studio" : "AI Studio Slide Deck"}
            </button>
            <span>•</span>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors flex items-center gap-1 uppercase"
            >
              Google AI Studio
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* High Density Command Console Status Bar */}
      <footer className="h-6 bg-indigo-600 flex items-center justify-between px-4 text-[10px] font-bold uppercase tracking-[3px] text-white shrink-0 font-mono">
        <div className="flex items-center gap-2">
          <span>Ready to receive commands _</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[9px] tracking-[1.5px] opacity-90">
          <span>VIRTUAL_ENV: PROD-1</span>
          <span>SSL: ACTIVE</span>
          <span>VECTOR_GRID: OPTIMIZED</span>
        </div>
      </footer>
    </div>
  );
}
