import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Code2,
  Image as ImageIcon,
  Music,
  Compass,
  RefreshCw,
  Sliders,
  Gamepad2,
  Palette,
  Cpu,
  BookmarkPlus
} from "lucide-react";
import {
  GameGenre,
  PixelArtStyle,
  PixelResolution,
  GameEngineTarget,
  GamePromptSuite,
  Language
} from "../types";

interface PromptBuilderProps {
  language: Language;
  initialTemplate?: any;
  onRunInSandbox?: (promptSuite: GamePromptSuite) => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  language,
  initialTemplate,
  onRunInSandbox,
}) => {
  // Config state
  const [concept, setConcept] = useState(
    initialTemplate?.concept ||
      (language === "vi"
        ? "Một hiệp sĩ pixel phiêu lưu qua tòa lâu đài bóng đêm, thu thập ngọc linh hồn và tiêu diệt quái vật slime."
        : "A pixel knight traversing a gothic dark castle, collecting soul shards and fighting slime sentinels.")
  );
  const [genre, setGenre] = useState<GameGenre>(initialTemplate?.genre || "platformer");
  const [artStyle, setArtStyle] = useState<PixelArtStyle>(initialTemplate?.artStyle || "snes_16bit");
  const [resolution, setResolution] = useState<PixelResolution>(initialTemplate?.resolution || "32x32");
  const [engineTarget, setEngineTarget] = useState<GameEngineTarget>(initialTemplate?.engineTarget || "canvas_ts");
  const [enemies, setEnemies] = useState(
    initialTemplate?.enemies || (language === "vi" ? "Quái slime xanh nhảy tuần tra, dơi bay quầng sóng sin, trùm Golem đá" : "Patrolling slime, flying oscillating bat, Stone Golem boss")
  );
  const [biome, setBiome] = useState(
    initialTemplate?.biome || (language === "vi" ? "Tàn tích lâu đài cổ dưới trăng tròn huyền bí" : "Ancient moonlit castle ruins with glowing crystal torches")
  );
  const [soundStyle, setSoundStyle] = useState(
    initialTemplate?.soundStyle || (language === "vi" ? "Chiptune 8-bit hoài niệm tổng hợp bằng Web Audio API" : "8-bit chiptune procedural synthesis via Web Audio API")
  );

  // Mechanics checkmarks
  const [mechanics, setMechanics] = useState<string[]>([
    "Nhảy đôi (Double Jump)",
    "Chém kiếm ánh sáng (Sword Slash)",
    "Thu thập đồng xu & Điểm số (Coins & Score)",
    "Âm thanh Chiptune Web Audio API",
    "Bộ lọc màn hình CRT Retro (Scanlines)",
    "Hỗ trợ phím cảm ứng di động (Touch Controls)"
  ]);

  // Loading & Generation states
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSuite, setPromptSuite] = useState<GamePromptSuite | null>(null);
  const [activeTab, setActiveTab] = useState<"master" | "architecture" | "code" | "sprites" | "audio" | "roadmap">("master");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleMechanic = (item: string) => {
    if (mechanics.includes(item)) {
      setMechanics(mechanics.filter((m) => m !== item));
    } else {
      setMechanics([...mechanics, item]);
    }
  };

  // AI Idea Enhancer via Backend Gemini endpoint
  const handleEnhanceIdea = async () => {
    if (!concept.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: concept,
          genre,
          language,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        setConcept(d.expandedConcept || concept);
        if (d.bossOrEnemy) setEnemies(d.bossOrEnemy);
        if (d.audioTheme) setSoundStyle(d.audioTheme);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Prompt Suite via Backend Gemini endpoint
  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameConcept: concept,
          genre,
          artStyle,
          resolution,
          engineTarget,
          mechanics,
          enemies,
          biome,
          soundStyle,
          language,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPromptSuite(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadMarkdown = () => {
    if (!promptSuite) return;
    const content = `# ${promptSuite.gameTitle} - Google AI Studio Prompt Suite
Generated via PixelPrompt Studio

## 1. Master System Instruction
\`\`\`
${promptSuite.masterSystemInstruction}
\`\`\`

## 2. Game Architecture & GDD
${promptSuite.architectureGDD}

## 3. Main Runnable Code Prompt
\`\`\`
${promptSuite.mainImplementationPrompt}
\`\`\`

## 4. Pixel Art Sprite Generation
${promptSuite.spriteAssetPrompt}

## 5. Web Audio Chiptune Synthesis
\`\`\`typescript
${promptSuite.audioSynthPrompt}
\`\`\`

## 6. Refinement Roadmap
${promptSuite.refinementRoadmap.map((step, i) => `${i + 1}. ${step}`).join("\n")}
`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${promptSuite.gameTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_prompt_suite.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="prompt-builder" className="flex flex-col gap-4">
      {/* Top Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 p-4 bg-[#0D1117] border border-[#2D333B] rounded-lg">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#2D333B]">
            <h3 className="text-[11px] font-bold text-[#8B949E] uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === "vi" ? "Cấu Hình Game 2D Pixel" : "2D Pixel Game Parameters"}</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#161B22] border border-[#2D333B] text-[10px] font-mono text-[#8B949E] rounded">
                AI STUDIO OPTIMIZED
              </span>
              <span className="px-2 py-0.5 bg-[#238636]/20 text-[#3fb950] border border-[#238636] text-[10px] font-mono rounded">
                CONFIG READY
              </span>
            </div>
          </div>

          {/* Game Concept Input + Enhance Button */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider flex items-center justify-between">
              <span>{language === "vi" ? "Ý tưởng / Bối cảnh trò chơi:" : "Game Concept & Core Lore:"}</span>
              <button
                id="enhance-idea-btn"
                onClick={handleEnhanceIdea}
                disabled={isEnhancing}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-[#161B22] hover:bg-[#21262D] px-2 py-0.5 rounded border border-[#2D333B] transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-3 h-3 ${isEnhancing ? "animate-spin" : "text-indigo-400"}`} />
                <span>{isEnhancing ? (language === "vi" ? "Đang mở rộng..." : "Enhancing...") : language === "vi" ? "Mở rộng bằng Gemini" : "Expand with Gemini"}</span>
              </button>
            </label>
            <textarea
              id="game-concept-input"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              rows={3}
              placeholder={
                language === "vi"
                  ? "Ví dụ: Ninja mèo neon vượt qua các mái nhà cyberpunk chiến đấu với robot bay..."
                  : "e.g. Cyberpunk cat ninja leaping across neon rooftops fighting flying security drones..."
              }
              className="w-full p-2.5 bg-[#0A0C10] border border-[#2D333B] rounded text-xs text-[#E0E0E0] placeholder:text-[#484F58] focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Genre & Target Engine Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Genre */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === "vi" ? "Thể loại Game:" : "Genre:"}</span>
              </label>
              <select
                id="select-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value as GameGenre)}
                className="w-full p-2 bg-[#0A0C10] border border-[#2D333B] rounded text-xs text-[#E0E0E0] focus:outline-hidden focus:border-indigo-500 font-mono"
              >
                <option value="platformer">2D Action Platformer</option>
                <option value="topdown_rpg">Top-down Zelda-like RPG</option>
                <option value="roguelike">Procedural Dungeon Roguelike</option>
                <option value="bullet_hell">Retro Arcade Space Shmup</option>
                <option value="metroidvania">Metroidvania Exploration</option>
                <option value="farm_sim">Cozy Pixel Farm Simulator</option>
                <option value="turn_tactics">Turn-based Grid Tactics</option>
                <option value="cyberpunk_brawler">Cyberpunk Pixel Brawler</option>
              </select>
            </div>

            {/* Target Engine */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === "vi" ? "Mã nguồn đích:" : "Target Stack:"}</span>
              </label>
              <select
                id="select-engine"
                value={engineTarget}
                onChange={(e) => setEngineTarget(e.target.value as GameEngineTarget)}
                className="w-full p-2 bg-[#0A0C10] border border-[#2D333B] rounded text-xs text-[#E0E0E0] focus:outline-hidden focus:border-indigo-500 font-mono"
              >
                <option value="canvas_ts">HTML5 Canvas + TypeScript (Chạy ngay 100%)</option>
                <option value="phaser3">Phaser 3 Framework</option>
                <option value="kaboom">Kaboom.js Retro Engine</option>
                <option value="godot_gdscript">Godot 4 2D (GDScript)</option>
                <option value="pygame">Python Pygame</option>
              </select>
            </div>
          </div>

          {/* Art Style & Resolution Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Art Style */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === "vi" ? "Phong cách Pixel Art:" : "Pixel Art Aesthetic:"}</span>
              </label>
              <select
                id="select-art-style"
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value as PixelArtStyle)}
                className="w-full p-2 bg-[#0A0C10] border border-[#2D333B] rounded text-xs text-[#E0E0E0] focus:outline-hidden focus:border-indigo-500 font-mono"
              >
                <option value="snes_16bit">16-Bit SNES Classic (32 Colors)</option>
                <option value="nes_8bit">8-Bit NES Arcade (16 Colors)</option>
                <option value="gba_32bit">32-Bit GBA Vibrant & Expressive</option>
                <option value="pico8">PICO-8 Palette (128x128 Retro)</option>
                <option value="gameboy_mono">GameBoy 4-Shade Monochrome</option>
                <option value="cyber_neon">Cyberpunk Neon Glow Pixel</option>
                <option value="dark_fantasy">Dark Gothic Fantasy Pixel</option>
              </select>
            </div>

            {/* Resolution */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === "vi" ? "Độ phân giải Sprite:" : "Sprite Resolution:"}</span>
              </label>
              <select
                id="select-resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value as PixelResolution)}
                className="w-full p-2 bg-[#0A0C10] border border-[#2D333B] rounded text-xs text-[#E0E0E0] focus:outline-hidden focus:border-indigo-500 font-mono"
              >
                <option value="16x16">16x16 px (Ultra Retro Micro)</option>
                <option value="24x24">24x24 px (Compact Expressive)</option>
                <option value="32x32">32x32 px (Standard SNES Golden Ratio)</option>
                <option value="48x48">48x48 px (Detailed Modern Indie)</option>
                <option value="64x64">64x64 px (High-Fidelity Bosses)</option>
              </select>
            </div>
          </div>

          {/* Foes & Biome Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">
                {language === "vi" ? "Kẻ địch & Trùm (Enemies):" : "Enemies & Boss Design:"}
              </label>
              <input
                id="enemies-input"
                type="text"
                value={enemies}
                onChange={(e) => setEnemies(e.target.value)}
                className="p-2 bg-[#0A0C10] border border-[#2D333B] rounded text-xs text-[#E0E0E0] focus:outline-hidden focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">
                {language === "vi" ? "Môi trường (Biome):" : "Biome / Environment:"}
              </label>
              <input
                id="biome-input"
                type="text"
                value={biome}
                onChange={(e) => setBiome(e.target.value)}
                className="p-2 bg-[#0A0C10] border border-[#2D333B] rounded text-xs text-[#E0E0E0] focus:outline-hidden focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Mechanics Selection Pills */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">
              {language === "vi" ? "Cơ chế bổ sung (Feature Flags):" : "Key Mechanics to Include:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Nhảy đôi (Double Jump)",
                "Lướt nhanh (Dash)",
                "Bám tường (Wall-slide)",
                "Chém kiếm ánh sáng (Sword Slash)",
                "Bắn đạn ma thuật (Magic Projectiles)",
                "Thanh thể lực (Stamina Bar)",
                "Thu thập đồng xu & Điểm số (Coins & Score)",
                "Bản đồ ma trận (Matrix Tilemap)",
                "Âm thanh Chiptune Web Audio API",
                "Bộ lọc màn hình CRT Retro (Scanlines)",
                "Rung màn hình (Screen Shake)",
                "Hỗ trợ phím cảm ứng di động (Touch Controls)",
              ].map((m) => {
                const active = mechanics.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMechanic(m)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors border ${
                      active
                        ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/60 font-semibold"
                        : "bg-[#161B22] text-[#8B949E] border-[#2D333B] hover:border-[#484F58]"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            id="generate-master-prompt-btn"
            onClick={handleGeneratePrompt}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(99,102,241,0.35)] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 fill-current ${isGenerating ? "animate-bounce" : ""}`} />
            <span>
              {isGenerating
                ? (language === "vi" ? "ĐANG BIÊN DỊCH PROMPT CHO AI STUDIO..." : "COMPILING AI STUDIO PROMPTS...")
                : (language === "vi" ? "TẠO SIÊU PROMPT GOOGLE AI STUDIO" : "GENERATE AI STUDIO PROMPT SUITE")}
            </span>
          </button>
        </div>

        {/* Right Column: Prompt Output Viewer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 p-4 bg-[#0D1117] border border-[#2D333B] rounded-lg">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#2D333B]">
            <h3 className="text-[11px] font-bold text-[#8B949E] uppercase tracking-widest flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === "vi" ? "Bộ Prompt Đầu Ra" : "Generated Prompt Suite"}</span>
            </h3>

            {promptSuite && (
              <div className="flex items-center gap-1.5">
                <button
                  id="download-md-btn"
                  onClick={downloadMarkdown}
                  className="px-2 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E0E0E0] border border-[#2D333B] text-[10px] font-mono flex items-center gap-1 transition-colors"
                  title="Tải về file Markdown"
                >
                  <Download className="w-3 h-3 text-indigo-400" />
                  <span>.MD</span>
                </button>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono flex items-center gap-1 transition-colors"
                  title="Mở Google AI Studio"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>AI Studio</span>
                </a>
              </div>
            )}
          </div>

          {!promptSuite ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-3 my-auto">
              <div className="w-10 h-10 rounded bg-[#161B22] border border-[#2D333B] flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono font-semibold text-[#E0E0E0] uppercase tracking-wider">
                {language === "vi" ? "Chưa có prompt được tạo" : "No prompt generated yet"}
              </p>
              <p className="text-[11px] font-mono text-[#8B949E] max-w-xs leading-relaxed">
                {language === "vi"
                  ? "Nhấn nút 'TẠO SIÊU PROMPT' ở bên trái để sinh bộ chỉ dẫn chuẩn xác cho Google AI Studio."
                  : "Click 'GENERATE AI STUDIO PROMPT SUITE' to produce the structured multi-section prompt."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Output Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-mono border-b border-[#2D333B]">
                <button
                  onClick={() => setActiveTab("master")}
                  className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    activeTab === "master"
                      ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                      : "text-[#8B949E] hover:text-[#E0E0E0]"
                  }`}
                >
                  Master
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    activeTab === "code"
                      ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                      : "text-[#8B949E] hover:text-[#E0E0E0]"
                  }`}
                >
                  Code Prompt
                </button>
                <button
                  onClick={() => setActiveTab("architecture")}
                  className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    activeTab === "architecture"
                      ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                      : "text-[#8B949E] hover:text-[#E0E0E0]"
                  }`}
                >
                  GDD
                </button>
                <button
                  onClick={() => setActiveTab("sprites")}
                  className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    activeTab === "sprites"
                      ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                      : "text-[#8B949E] hover:text-[#E0E0E0]"
                  }`}
                >
                  Sprites
                </button>
                <button
                  onClick={() => setActiveTab("audio")}
                  className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    activeTab === "audio"
                      ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                      : "text-[#8B949E] hover:text-[#E0E0E0]"
                  }`}
                >
                  Audio
                </button>
                <button
                  onClick={() => setActiveTab("roadmap")}
                  className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    activeTab === "roadmap"
                      ? "bg-[#21262D] text-indigo-400 border border-[#2D333B] font-semibold"
                      : "text-[#8B949E] hover:text-[#E0E0E0]"
                  }`}
                >
                  Roadmap
                </button>
              </div>

              {/* Tab Content Box */}
              <div className="flex flex-col border border-[#2D333B] rounded overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-[#2D333B] text-[10px] font-mono text-[#8B949E]">
                  <span className="font-semibold text-[#E0E0E0] uppercase tracking-wider">
                    {activeTab === "master" && "System Instruction (AI Studio)"}
                    {activeTab === "code" && "Main Runnable Code User Prompt"}
                    {activeTab === "architecture" && "GDD & Architecture Specs"}
                    {activeTab === "sprites" && "Sprite Sheet Asset Prompt"}
                    {activeTab === "audio" && "Web Audio API Synthesis Code"}
                    {activeTab === "roadmap" && "Multi-Turn Refinement Plan"}
                  </span>
                  <button
                    id={`copy-${activeTab}-btn`}
                    onClick={() => {
                      let text = "";
                      if (activeTab === "master") text = promptSuite.masterSystemInstruction;
                      if (activeTab === "code") text = promptSuite.mainImplementationPrompt;
                      if (activeTab === "architecture") text = promptSuite.architectureGDD;
                      if (activeTab === "sprites") text = promptSuite.spriteAssetPrompt;
                      if (activeTab === "audio") text = promptSuite.audioSynthPrompt;
                      if (activeTab === "roadmap") text = promptSuite.refinementRoadmap.join("\n");
                      copyToClipboard(text, activeTab);
                    }}
                    className="px-2 py-0.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#2D333B] text-[#E0E0E0] text-[10px] font-mono flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === activeTab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === activeTab ? (language === "vi" ? "Đã copy" : "Copied") : (language === "vi" ? "Sao chép" : "Copy")}</span>
                  </button>
                </div>

                <div className="p-3 bg-[#0A0C10] text-[11px] font-mono text-[#E0E0E0] max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {activeTab === "master" && promptSuite.masterSystemInstruction}
                  {activeTab === "code" && promptSuite.mainImplementationPrompt}
                  {activeTab === "architecture" && promptSuite.architectureGDD}
                  {activeTab === "sprites" && promptSuite.spriteAssetPrompt}
                  {activeTab === "audio" && promptSuite.audioSynthPrompt}
                  {activeTab === "roadmap" && (
                    <div className="flex flex-col gap-1.5">
                      {promptSuite.refinementRoadmap.map((step, i) => (
                        <div key={i} className="p-2 bg-[#161B22] rounded border border-[#2D333B] text-indigo-300">
                          <span className="font-bold text-amber-400 font-mono mr-2">[{i + 1}]</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Master Full Copy Button */}
              <button
                id="copy-entire-bundle-btn"
                onClick={() => {
                  const fullText = `=== GOOGLE AI STUDIO PROMPT BUNDLE: ${promptSuite.gameTitle} ===\n\n[SYSTEM INSTRUCTION]:\n${promptSuite.masterSystemInstruction}\n\n[USER PROMPT]:\n${promptSuite.mainImplementationPrompt}\n\n[GDD ARCHITECTURE]:\n${promptSuite.architectureGDD}\n\n[AUDIO CODE]:\n${promptSuite.audioSynthPrompt}`;
                  copyToClipboard(fullText, "all");
                }}
                className="w-full py-2 bg-[#238636]/20 hover:bg-[#238636]/30 text-[#3fb950] border border-[#238636] font-mono font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                {copiedKey === "all" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copiedKey === "all"
                    ? (language === "vi" ? "Đã sao chép toàn bộ gói Prompt!" : "Entire Bundle Copied!")
                    : (language === "vi" ? "Sao Chép Toàn Bộ Gói Prompt Cho AI Studio" : "Copy Full AI Studio Master Bundle")}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
