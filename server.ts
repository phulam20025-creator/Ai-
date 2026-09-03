import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init Google GenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper to call Gemini with model fallback
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const ai = getGenAI();
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: systemInstruction
          ? {
              systemInstruction,
              temperature: 0.7,
            }
          : {
              temperature: 0.7,
            },
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: unknown) {
      lastError = err as Error;
      console.warn(`Model ${model} failed:`, (err as Error)?.message);
      // Try next model
    }
  }

  throw lastError || new Error("All Gemini models failed to respond.");
}

// Expand rough idea
app.post("/api/enhance-idea", async (req: Request, res: Response) => {
  try {
    const { idea, genre, language = "vi" } = req.body;

    if (!idea) {
      res.status(400).json({ error: "Missing idea parameter" });
      return;
    }

    const systemInstruction = language === "vi"
      ? "Bạn là một Game Designer kỳ cựu và chuyên gia Prompt Engineering cho Google AI Studio chuyên về 2D Pixel Games. Hãy mở rộng ý tưởng game của người dùng thành các yếu tố game gameplay, pixel art aesthetic, cơ chế cốt lõi và cốt truyện độc đáo."
      : "You are a veteran Game Designer and Prompt Engineering specialist for Google AI Studio specializing in 2D Pixel Games. Expand the user game concept into rich gameplay mechanics, pixel art aesthetics, core loop, and unique lore.";

    const prompt = language === "vi"
      ? `Ý tưởng thô: "${idea}". Thể loại: "${genre || '2D Action Platformer'}".
Hãy phân tích và mở rộng thành định dạng JSON chuẩn (chỉ trả về JSON hợp lệ, không markdown hay văn bản ngoài JSON):
{
  "title": "Tên game gợi ý ấn tượng",
  "tagline": "Khẩu hiệu ngắn gọn phong cách retro",
  "expandedConcept": "Mô tả chi tiết 2-3 câu về bối cảnh và mục tiêu",
  "coreMechanics": ["Cơ chế 1", "Cơ chế 2", "Cơ chế 3", "Cơ chế 4"],
  "pixelArtDirection": "Mô tả bảng màu, độ phân giải sprite và cảm hứng retro",
  "heroDescription": "Mô tả nhân vật chính và đòn tấn công/kỹ năng",
  "bossOrEnemy": "Mô tả kẻ thù chính hoặc quái vật",
  "audioTheme": "Phong cách âm thanh chiptune gợi ý"
}`
      : `Raw idea: "${idea}". Genre: "${genre || '2D Action Platformer'}".
Analyze and expand into valid JSON (return strictly valid JSON, no surrounding markdown code blocks):
{
  "title": "Catchy retro game title",
  "tagline": "Short retro tagline",
  "expandedConcept": "Detailed 2-3 sentence lore and gameplay goal",
  "coreMechanics": ["Mechanic 1", "Mechanic 2", "Mechanic 3", "Mechanic 4"],
  "pixelArtDirection": "Color palette, sprite resolution and retro inspiration",
  "heroDescription": "Protagonist details, weapon/skills",
  "bossOrEnemy": "Signature enemy or boss description",
  "audioTheme": "Chiptune soundscape recommendation"
}`;

    const rawResponse = await callGemini(prompt, systemInstruction);
    const cleaned = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, data: parsed });
  } catch (err: unknown) {
    console.error("Enhance idea error:", err);
    // Fallback if AI call failed
    const { idea, language = "vi" } = req.body;
    res.json({
      success: true,
      data: {
        title: language === "vi" ? `Hành Trình: ${idea}` : `Quest of: ${idea}`,
        tagline: language === "vi" ? "Cuộc phiêu lưu pixel 16-bit hoài niệm" : "A 16-bit retro pixel odyssey",
        expandedConcept: language === "vi"
          ? `Một trò chơi hành động 2D pixel lấy cảm hứng từ ${idea}, với hệ thống di chuyển mượt mà, quái vật thông minh và màn chơi ẩn chứa bí mật.`
          : `An engaging 2D pixel action game inspired by ${idea}, featuring fluid physics, intelligent foes, and secrets hidden in every level.`,
        coreMechanics: [
          language === "vi" ? "Di chuyển mượt mà, nhảy đôi và lướt (dash)" : "Fluid run, double jump, and wall dash",
          language === "vi" ? "Tấn công cận chiến kết hợp kỹ năng phụ" : "Melee combo with projectile secondary",
          language === "vi" ? "Thu thập ngọc năng lượng và nâng cấp trang bị" : "Energy shard collection & weapon upgrades",
          language === "vi" ? "Đấu trùm đa giai đoạn với cơ chế né đòn" : "Multi-phase boss fights with telegraphed patterns",
        ],
        pixelArtDirection: "16-bit SNES style, vibrant 32-color palette, expressive animated sprite sheets (32x32px)",
        heroDescription: language === "vi" ? "Hiệp sĩ phiêu lưu với thanh kiếm ánh sáng và áo choàng bay" : "Vagabond warrior with a glowing broadsword and tattered cape",
        bossOrEnemy: language === "vi" ? "Quái vật bóng đêm với 3 hình thái tấn công diện rộng" : "Corrupted Shadow Golem with shockwave stomp and laser sweep",
        audioTheme: "8-bit / 16-bit Chiptune with punchy square waves and arcade FM basslines",
      },
    });
  }
});

// Full AI Studio Game Prompt Generation
app.post("/api/generate-prompt", async (req: Request, res: Response) => {
  try {
    const {
      gameConcept,
      genre,
      artStyle,
      resolution,
      engineTarget,
      mechanics = [],
      enemies = "",
      biome = "",
      soundStyle = "",
      language = "vi",
      includeArchitecture = true,
      includeSpritePrompts = true,
      includeAudioCode = true,
      includeRefinementPrompts = true,
    } = req.body;

    const systemInstruction = language === "vi"
      ? `Bạn là Trưởng nhóm Kỹ sư Prompt (Prompt Engineer Master) chuyên biệt cho Google AI Studio. Nhiệm vụ của bạn là tạo ra một bộ SIÊU PROMPT hoàn chỉnh, chi tiết, chuyên nghiệp theo cấu trúc chuẩn Google AI Studio để người dùng chỉ cần copy và paste vào Google AI Studio là có thể tạo ra ngay một tựa game 2D Pixel hoàn chỉnh, chạy được 100% không lỗi, không bị cắt code hay dùng placeholder vô dụng.`
      : `You are the Lead Prompt Engineering Architect specialized in Google AI Studio for 2D Pixel Games. Your mission is to construct a rigorous, production-grade MASTER PROMPT engineered specifically for Google AI Studio, guaranteeing that pasting it yields a fully working, self-contained, 100% complete 2D Pixel Game without missing code or broken placeholders.`;

    const promptInstructions = language === "vi"
      ? `Hãy xây dựng bộ Prompt hoàn chỉnh cho dự án Game 2D Pixel sau:
- Ý tưởng game: ${gameConcept || "Retro 2D pixel platformer game"}
- Thể loại: ${genre || "Platformer"}
- Phong cách Art & Độ phân giải: ${artStyle || "16-Bit SNES"} (${resolution || "32x32px"})
- Nền tảng đích trong AI Studio: ${engineTarget || "HTML5 Canvas + TypeScript (Single-file hoặc React)"}
- Cơ chế bổ sung: ${mechanics.join(", ") || "Jump, attack, collect coins, health bar"}
- Kẻ địch/Trùm: ${enemies || "Patrolling slime, flying bat, guardian boss"}
- Bối cảnh/Môi trường: ${biome || "Cổ thành đổ nát rực rỡ ánh trăng"}
- Âm thanh: ${soundStyle || "Chiptune 8-bit tổng hợp Web Audio API"}

Yêu cầu định dạng đầu ra chuẩn JSON (strictly valid JSON, no markdown outside):
{
  "gameTitle": "Tên game đề xuất",
  "summary": "Tóm tắt ngắn gọn cấu trúc prompt",
  "masterSystemInstruction": "System Instruction chuẩn mực thiết lập persona, nguyên tắc kỹ thuật, luật cấm rút gọn code, cấm placeholder cho AI Studio",
  "architectureGDD": "Game Design Document ngắn và sơ đồ kiến trúc module (GameLoop, InputManager, EntityManager, CollisionSystem, Tilemap, SoundSynth)",
  "mainImplementationPrompt": "Prompt yêu cầu AI Studio viết mã nguồn hoàn chỉnh có thể chạy được ngay (sử dụng Canvas API hoặc engine chỉ định, vẽ sprite pixel thuần procedural hoặc base64, đầy đủ bàn phím A/D/Space hoặc Arrow keys, cơ chế va chạm, physics, điểm số, mạng sống, màn hình Game Over và Victory)",
  "spriteAssetPrompt": "Prompt hướng dẫn tạo Pixel Art Spritesheet cho các model hình ảnh (kích thước, bảng màu, animation frame sheet)",
  "audioSynthPrompt": "Prompt code Web Audio API Procedural Chiptune Synthesizer (tự tạo âm thanh nhảy, chém, nhặt vàng, nổ, chết bằng sóng Sine/Square không cần file mp3 ngoài)",
  "refinementRoadmap": [
    "Prompt bước 2: Thêm màn chơi mới và bẫy động",
    "Prompt bước 3: Thêm Trùm cuối đa giai đoạn và thanh máu Boss",
    "Prompt bước 4: Hỗ trợ phím ảo Touch Control cho di động và hiệu ứng màn hình CRT scanlines"
  ]
}`
      : `Build a comprehensive Prompt Suite for this 2D Pixel Game project:
- Game Concept: ${gameConcept || "Retro 2D pixel platformer game"}
- Genre: ${genre || "Platformer"}
- Art Style & Resolution: ${artStyle || "16-Bit SNES"} (${resolution || "32x32px"})
- Target Stack in AI Studio: ${engineTarget || "HTML5 Canvas + TypeScript"}
- Selected Mechanics: ${mechanics.join(", ") || "Jump, attack, collect coins, health bar"}
- Foes & Bosses: ${enemies || "Patrolling slime, flying bat, guardian boss"}
- Environment / Biome: ${biome || "Mystic moonlit castle ruins"}
- Audio Style: ${soundStyle || "Chiptune synthesized via Web Audio API"}

Output strict valid JSON:
{
  "gameTitle": "Suggested Game Title",
  "summary": "Brief overview of this prompt suite",
  "masterSystemInstruction": "Master System Instruction for AI Studio (Role, zero-placeholder mandate, complete runnable code, 60fps canvas loop)",
  "architectureGDD": "Game Design Document & module breakdown (GameLoop, InputManager, EntityManager, CollisionSystem, Tilemap, AudioSynth)",
  "mainImplementationPrompt": "Main user prompt for AI Studio to generate the complete, self-contained playable game code with procedural pixel art sprites, player physics, enemies, UI, and win/lose states",
  "spriteAssetPrompt": "Prompt for generating sprite sheets and pixel assets with fixed color palettes and frame layouts",
  "audioSynthPrompt": "Prompt for procedural 8-bit chiptune sound synthesis via Web Audio API (jump, coin, sword, hit, game over, victory)",
  "refinementRoadmap": [
    "Step 2 prompt: Add procedural dungeon layouts and hazard traps",
    "Step 3 prompt: Add multi-phase boss fight with health bar and attack cycles",
    "Step 4 prompt: Add mobile on-screen d-pad touch controls & retro CRT scanline shaders"
  ]
}`;

    const rawResponse = await callGemini(promptInstructions, systemInstruction);
    const cleaned = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, data: parsed });
  } catch (err: unknown) {
    console.error("Generate prompt error:", err);
    // Deterministic fallback generator
    const {
      gameConcept = "Pixel Knight Odyssey",
      genre = "2D Action Platformer",
      artStyle = "16-Bit SNES",
      resolution = "32x32px",
      engineTarget = "HTML5 Canvas + TypeScript",
      language = "vi",
    } = req.body;

    const fallbackVi = {
      gameTitle: `Huyền Thoại Pixel: ${gameConcept || "Chiến Binh Ánh Sáng"}`,
      summary: `Bộ prompt chuyên sâu tối ưu cho Google AI Studio phát triển game ${genre} phong cách ${artStyle}`,
      masterSystemInstruction: `[AI STUDIO SYSTEM INSTRUCTION]
Bạn là Kỹ sư Trưởng Lập trình Game 2D Retro hàng đầu. Khi nhận yêu cầu tạo game, bạn TUÂN THỦ NGHIÊM NGẶT các quy tắc sau:
1. KHÔNG BAO GIỜ viết code dở dang, code tóm tắt, "// TODO: tự điền logic", hoặc placeholder giả lập.
2. Viết toàn bộ mã nguồn hoàn chỉnh trong một file code duy nhất (Single-file Component/Canvas), sẵn sàng thực thi ngay lập tức mà không yêu cầu cài thêm thư viện ngoài không rõ nguồn gốc.
3. Tạo hình ảnh nhân vật, gạch nền (tiles), vật phẩm hoàn toàn bằng PROCEDURAL PIXEL ART (dùng canvas 2D context vẽ từng pixel/rect với mảng màu hex retro) hoặc tạo procedural SVG/DataURI để game tự chạy 100% không bị phụ thuộc vào link ảnh ngoài bị chết.
4. Tích hợp sẵn bộ tổng hợp âm thanh 8-bit Chiptune bằng Web Audio API thuần (OscillatorNode, GainNode) cho các hiệu ứng: Nhảy, Tấn công, Nhặt vàng, Dính đòn, Qua màn.
5. Luôn xây dựng Game Loop chuẩn requestAnimationFrame với delta time, giới hạn 60 FPS mượt mà, hỗ trợ cả bàn phím (WASD / Mũi tên / Space / J / K) và hệ thống phím cảm ứng trên màn hình cho thiết bị di động.`,
      architectureGDD: `[KIẾN TRÚC GAME DESIGN DOCUMENT - 2D PIXEL ${genre.toUpperCase()}]
- Bối cảnh: ${gameConcept}
- Hệ thống trạng thái: TitleScreen -> Playing -> Paused -> GameOver -> VictoryScreen
- Cấu trúc Module:
  1. InputController: Lắng nghe KeyDown/KeyUp, TouchEvents, lưu trữ cờ di chuyển (left, right, jump, attack, dash).
  2. PhysicsEngine: Gravity (0.5), VelocityX/Y, Friction (0.85), AABB Collision (Axis-Aligned Bounding Box) giữa Hitbox nhân vật và Tilemap.
  3. PixelRenderer: Vẽ Tilemap nền (Ground, Wall, Platform, Spikes), Sprite nhân vật (Idle, Run, Jump, Attack), Camera bám theo người chơi.
  4. AudioSynth: Web Audio API Oscillator (Square / Sawtooth / Triangle) tạo hiệu ứng âm thanh cổ điển không cần file media ngoài.
  5. EntityManager: Quản lý Player, Quái vật tuần tra (Patrol AI), Đạn/Chiêu thức, và Vật phẩm thu thập (Coins, Keys, Potions).`,
      mainImplementationPrompt: `Hãy tạo toàn bộ mã nguồn trò chơi 2D Pixel "${gameConcept}" (${genre}) chạy trên nền tảng ${engineTarget}:
- Phong cách đồ họa: ${artStyle} với độ phân giải pixel gốc ${resolution}.
- Hãy render trực tiếp nhân vật chính dạng hiệp sĩ pixel với các frame chuyển động: đứng thở (idle), chạy (run 4 frame), nhảy lên (jump), và vung kiếm (slash).
- Kẻ địch: Tạo 2 loại quái pixel: 1 loại slime bò tuần tra đảo chiều khi gặp vực/tường, 1 quái bay lượn lờ theo nhịp sóng sin.
- Hệ thống vật phẩm: Đồng xu vàng xoay lấp lánh (animation 4 frame) và bình máu hồi phục.
- Màn chơi: Thiết kế một màn chơi phiêu lưu có độ dài gấp 3 lần màn hình với các tầng platform, vực thẳm gai nhọn và cổng dịch chuyển chiến thắng ở cuối màn.
- HUD/UI: Hiển thị thanh máu tim pixel, số xu nhặt được, điểm số, và nút bật/tắt hiệu ứng màn hình CRT Retro (scanlines).
- Toàn bộ code phải đầy đủ 100%, không rút gọn bất kỳ hàm nào.`,
      spriteAssetPrompt: `Prompt tạo Sprite Sheet Pixel Art cho Imagen / Stable Diffusion:
"Pixel art sprite sheet of a 2D retro ${gameConcept} protagonist, ${artStyle} style, 32x32 pixel grid, isolated on solid magenta (#FF00FF) background for easy chroma-keying. Frames arranged horizontally: 4 frames idle animation, 6 frames running loop, 2 frames jumping, 4 frames sword slash with glowing pixel trail. Crisp sharp pixels, no anti-aliasing, limited 16-color palette, Masterpiece retro indie game asset."`,
      audioSynthPrompt: `Code mẫu Web Audio API Chiptune Synth để AI Studio nhúng vào game:
class PixelAudio {
  private ctx: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  playJump() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.15);
  }
  playCoin() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.25);
  }
}`,
      refinementRoadmap: [
        "Bước 1: Chạy và kiểm tra vật lý di chuyển nhân vật cùng cơ chế nhảy đôi và va chạm bề mặt.",
        "Bước 2: Thêm Trùm Độc Nhãn Khổng Lồ ở cuối map với 3 chiêu thức: Dậm đất đá rơi, Bắn tia năng lượng, và Húc lao tới.",
        "Bước 3: Thêm hệ thống Lưu điểm cao (High Score) bằng LocalStorage và hiệu ứng Rung màn hình (Screen Shake) mỗi khi nhận sát thương.",
        "Bước 4: Tối ưu hoá bàn phím cảm ứng dạng D-Pad + Nút A/B nổi trên màn hình khi phát hiện người dùng truy cập từ smartphone."
      ]
    };

    res.json({ success: true, data: fallbackVi });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PixelPrompt Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
