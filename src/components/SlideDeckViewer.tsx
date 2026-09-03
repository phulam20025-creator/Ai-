import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Lightbulb,
  AlertTriangle,
  FileCode,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  Terminal
} from "lucide-react";
import { GuideSlide, Language } from "../types";
import { GUIDE_SLIDES } from "../data/slidesGuide";

interface SlideDeckViewerProps {
  language: Language;
  onApplyPromptTemplate: (template: string) => void;
}

export const SlideDeckViewer: React.FC<SlideDeckViewerProps> = ({
  language,
  onApplyPromptTemplate,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const slide = GUIDE_SLIDES[currentSlideIndex];
  const totalSlides = GUIDE_SLIDES.length;

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="slide-deck-viewer" className="flex flex-col gap-3">
      {/* Slide Navigation Header Bar */}
      <div className="flex items-center justify-between p-3 bg-[#0D1117] border border-[#2D333B] rounded-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#161B22] border border-[#2D333B] flex items-center justify-center text-indigo-400">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-2">
              <span>{language === "vi" ? "Prompt Guide cho Google AI Studio" : "Prompt Guide for Google AI Studio"}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B22] text-indigo-400 border border-[#2D333B]">
                MODULE {slide.id}/{totalSlides}
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[#8B949E]">
              {language === "vi"
                ? "Cẩm nang kỹ thuật viết prompt tối ưu hóa kết quả làm Game 2D Pixel"
                : "Best practice prompt engineering workflows for 2D Pixel Games"}
            </p>
          </div>
        </div>

        {/* Slide Counter & Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            id="prev-slide-btn"
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1 transition-colors ${
              currentSlideIndex === 0
                ? "bg-[#0A0C10] text-[#484F58] border-[#21262D] cursor-not-allowed"
                : "bg-[#161B22] text-[#E0E0E0] border-[#2D333B] hover:bg-[#21262D] cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === "vi" ? "Trước" : "Prev"}</span>
          </button>

          <span className="font-mono text-[11px] text-[#8B949E] px-1.5">
            {currentSlideIndex + 1}/{totalSlides}
          </span>

          <button
            id="next-slide-btn"
            onClick={nextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1 transition-colors ${
              currentSlideIndex === totalSlides - 1
                ? "bg-[#0A0C10] text-[#484F58] border-[#21262D] cursor-not-allowed"
                : "bg-[#161B22] text-[#E0E0E0] border-[#2D333B] hover:bg-[#21262D] cursor-pointer"
            }`}
          >
            <span className="hidden sm:inline">{language === "vi" ? "Sau" : "Next"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-[#0D1117] border border-[#2D333B] rounded-lg p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden">
        {/* Slide Header */}
        <div className="flex flex-col gap-1.5 border-b border-[#2D333B] pb-3">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>MODULE {slide.id}: {slide.id === 1 ? "FOUNDATION" : slide.id === 2 ? "ARCHITECTURE" : slide.id === 3 ? "PIXEL ASSETS" : "REFINEMENT"}</span>
          </div>
          <h2 className="text-base sm:text-lg font-mono font-bold text-[#E0E0E0] uppercase tracking-wide">
            {language === "vi" ? slide.titleVi : slide.titleEn}
          </h2>
          <p className="text-xs text-[#8B949E]">
            {language === "vi" ? slide.subtitleVi : slide.subtitleEn}
          </p>
        </div>

        {/* Key Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {(language === "vi" ? slide.keyPointsVi : slide.keyPointsEn).map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2.5 bg-[#161B22] border border-[#2D333B] rounded"
            >
              <div className="w-5 h-5 rounded bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="text-xs text-[#E0E0E0] leading-relaxed font-sans">{point}</span>
            </div>
          ))}
        </div>

        {/* Prompt Template Code Box */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span>{language === "vi" ? "Mẫu Prompt Chuẩn Áp Dụng Cho Slide Này:" : "Reference Prompt Formula:"}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                id={`copy-slide-prompt-${slide.id}`}
                onClick={() => handleCopy(slide.promptTemplate)}
                className="px-2 py-0.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E0E0E0] border border-[#2D333B] text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (language === "vi" ? "Đã copy!" : "Copied!") : language === "vi" ? "Sao chép" : "Copy"}</span>
              </button>
              <button
                onClick={() => onApplyPromptTemplate(slide.promptTemplate)}
                className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{language === "vi" ? "Dùng trong Studio" : "Use in Studio"}</span>
              </button>
            </div>
          </div>

          <pre className="p-3 bg-[#0A0C10] rounded border border-[#2D333B] text-[#E0E0E0] text-[11px] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-52">
            {slide.promptTemplate}
          </pre>
        </div>

        {/* Pro Tip & Mistake Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Pro Tip */}
          <div className="p-3 bg-[#238636]/10 border border-[#238636]/40 rounded flex items-start gap-2.5">
            <div className="p-1 rounded bg-[#238636]/20 text-[#3fb950] shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#3fb950] uppercase font-mono tracking-wider">
                {language === "vi" ? "Mẹo Kỹ Thuật (Pro Tip)" : "Pro Tip"}
              </span>
              <p className="text-xs text-[#E0E0E0] leading-relaxed font-sans">
                {language === "vi" ? slide.proTipVi : slide.proTipEn}
              </p>
            </div>
          </div>

          {/* Mistake to Avoid */}
          <div className="p-3 bg-[#da3633]/10 border border-[#da3633]/40 rounded flex items-start gap-2.5">
            <div className="p-1 rounded bg-[#da3633]/20 text-[#f85149] shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#f85149] uppercase font-mono tracking-wider">
                {language === "vi" ? "Sai Lầm Cần Tránh (Pitfall)" : "Pitfall to Avoid"}
              </span>
              <p className="text-xs text-[#E0E0E0] leading-relaxed font-sans">
                {language === "vi" ? slide.mistakeToAvoidVi : slide.mistakeToAvoidEn}
              </p>
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {GUIDE_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlideIndex === idx ? "w-6 bg-indigo-500" : "w-1.5 bg-[#2D333B] hover:bg-[#484F58]"
              }`}
              title={`Slide ${idx + 1}: ${s.titleVi}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
