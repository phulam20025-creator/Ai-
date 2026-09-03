import React from "react";
import { Sparkles, ArrowRight, Gamepad2, Palette, ShieldAlert } from "lucide-react";
import { PresetTemplate, Language } from "../types";
import { PRESET_TEMPLATES } from "../data/templates";

interface TemplateGalleryProps {
  language: Language;
  onSelectTemplate: (template: PresetTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  language,
  onSelectTemplate,
}) => {
  return (
    <div id="template-gallery" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-mono font-bold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{language === "vi" ? "Thư Viện Mẫu Game 2D Pixel Có Sẵn" : "Battle-Tested 2D Pixel Presets"}</span>
        </h3>
        <p className="text-[11px] font-mono text-[#8B949E]">
          {language === "vi"
            ? "Chọn nhanh một mẫu thể loại kinh điển để nạp thông số và tạo prompt cho Google AI Studio ngay lập tức."
            : "Pick a classic genre archetype to immediately populate parameters and generate an AI Studio prompt suite."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group p-3.5 bg-[#0D1117] hover:bg-[#161B22] border border-[#2D333B] hover:border-indigo-500/50 rounded-lg flex flex-col justify-between gap-3 transition-all cursor-pointer"
            onClick={() => onSelectTemplate(tmpl)}
          >
            <div className="flex flex-col gap-2.5">
              {/* Top Banner & Genre */}
              <div className="flex items-center justify-between">
                <span className="text-xl p-1.5 rounded bg-[#161B22] border border-[#2D333B]">
                  {tmpl.bannerEmoji}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B22] text-[#8B949E] border border-[#2D333B]">
                  {tmpl.genreName}
                </span>
              </div>

              {/* Title & Lore */}
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-mono font-bold text-[#E0E0E0] group-hover:text-indigo-400 transition-colors uppercase tracking-wider">
                  {tmpl.title}
                </h4>
                <p className="text-[11px] text-[#8B949E] leading-relaxed line-clamp-2">
                  {language === "vi" ? tmpl.concept : tmpl.lore}
                </p>
              </div>

              {/* Mechanics Pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {tmpl.mechanics.slice(0, 3).map((m, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A0C10] text-[#8B949E] border border-[#2D333B]"
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Color Palette preview */}
              <div className="flex items-center gap-1 pt-1">
                <span className="text-[10px] text-[#8B949E] font-mono mr-1">Palette:</span>
                {tmpl.colorPalette.map((col, idx) => (
                  <span
                    key={idx}
                    className="w-3 h-3 rounded-xs border border-black/40 shadow-xs"
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                ))}
              </div>
            </div>

            {/* Bottom button */}
            <div className="pt-2 border-t border-[#2D333B] flex items-center justify-between text-[11px] font-mono font-semibold text-indigo-400 group-hover:text-indigo-300 uppercase tracking-wider">
              <span>{language === "vi" ? "Dùng mẫu này" : "Load Preset"}</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
