import { GuideSlide } from "../types";

export const GUIDE_SLIDES: GuideSlide[] = [
  {
    id: 1,
    titleVi: "Cấu Trúc Master Prompt Chuẩn Cho AI Studio",
    titleEn: "Master Prompt Architecture for AI Studio",
    subtitleVi: "Kỹ thuật phân lớp Role - Constraint - Specification để AI sinh mã nguồn game chạy ngay lập tức",
    subtitleEn: "Layered Role - Constraint - Specification technique to ensure immediate runnable game output",
    keyPointsVi: [
      "Khởi tạo System Persona: Đặt vai trò Lead 2D Game Engineer có kinh nghiệm tối ưu hóa Canvas 60 FPS",
      "Ràng buộc không khoan nhượng (Hard Constraints): Cấm tuyệt đối code dở dang, cấm comment // TODO hoặc logic placeholder",
      "Tiêu chuẩn Single-File: Yêu cầu gói gọn toàn bộ logic, đồ họa procedural và audio trong một component tự chạy",
      "Quy chuẩn điều khiển: Luôn định nghĩa rõ phím WASD / Mũi tên / Space / J / K và cờ trạng thái phím"
    ],
    keyPointsEn: [
      "Define System Persona: Establish senior 2D Game Engineer persona specializing in 60 FPS Canvas optimization",
      "Hard Zero-Placeholder Constraints: Strictly forbid incomplete snippets, // TODO stubs, or mock placeholder logic",
      "Single-File Portability: Mandate bundling game loop, procedural sprites, and chiptune audio inside a self-contained component",
      "Input Rigor: Clearly delineate WASD / Arrow / Space / J / K input mappings and smooth key state tracking"
    ],
    promptTemplate: `[AI STUDIO SYSTEM INSTRUCTION]
Bạn là Kỹ sư Trưởng Lập trình Game 2D Retro. Khi tạo game, bạn TUÂN THỦ TUYỆT ĐỐI:
1. Toàn bộ mã nguồn phải hoàn chỉnh 100%, không rút gọn bất kỳ hàm nào.
2. Vẽ đồ họa Pixel Sprite trực tiếp bằng Canvas 2D API (hoặc procedural SVG) với mảng màu hex chuẩn retro (không dùng link ảnh ngoài).
3. Tích hợp bộ tổng hợp âm thanh Web Audio API (OscillatorNode) cho tiếng nhảy, chém, nhặt vàng.
4. Tối ưu Game Loop 60 FPS với requestAnimationFrame và deltaTime.`,
    proTipVi: "Luôn yêu cầu AI định nghĩa mảng màu (palette) cụ thể gồm 8 đến 16 màu hex retro để hình ảnh đồng nhất phong cách.",
    proTipEn: "Always instruct the model to declare an explicit 8 to 16-color retro hex palette to guarantee artistic coherence.",
    mistakeToAvoidVi: "Tránh viết câu quá chung chung như 'Làm cho tôi một game pixel hay'. AI sẽ tạo code mẫu sơ sài hoặc import ảnh ngoài bị lỗi 404.",
    mistakeToAvoidEn: "Avoid vague requests like 'Make me a cool pixel game'. The AI will output skeleton stubs or link to external images that return 404."
  },
  {
    id: 2,
    titleVi: "Kỹ Thuật Chia Nhỏ Module (Modular Prompting)",
    titleEn: "Modular Prompting & Token Budgeting",
    subtitleVi: "Chiến lược tách biệt Game Loop, Physics, Entities và UI để vượt qua giới hạn token và tránh đứt đoạn",
    subtitleEn: "Separating Game Loop, Physics, Entities, and HUD to overcome token cutoffs and ensure complete code",
    keyPointsVi: [
      "Tách biệt 5 hệ thống lõi: InputManager, PhysicsEngine, EntityManager, Renderer, và AudioSynth",
      "Cơ chế va chạm AABB (Axis-Aligned Bounding Box): Định nghĩa rõ hitbox của nhân vật, quái và gạch nền",
      "Quản lý vòng đời Entity: Danh sách các đối tượng (Player, Enemies, Projectiles, Particles) có hàm update() và draw() riêng",
      "Camera Viewport: Tính toán offset camera mượt mà bám theo nhân vật chính khi màn chơi rộng hơn khung nhìn"
    ],
    keyPointsEn: [
      "Decouple 5 Core Subsystems: InputManager, PhysicsEngine, EntityManager, Renderer, and AudioSynth",
      "AABB Collision Modeling: Clearly define bounding boxes for player, patrolling mobs, coins, and solid tiles",
      "Entity Lifecycle: Maintain clean lists of entities with isolated update(dt) and draw(ctx) loops",
      "Viewport Camera: Smoothly lerp camera offset centered on player when level boundaries exceed canvas dimensions"
    ],
    promptTemplate: `[KIẾN TRÚC MODULAR CHO GAME CANVAS]
Hãy triển khai game theo mô hình hướng đối tượng tinh gọn:
- class InputHandler: theo dõi key state
- class Player: x, y, vx, vy, isGrounded, isAttacking, health, inventory
- class LevelManager: render mảng 2D tilemap (0: rỗng, 1: đất, 2: gai, 3: portal)
- class ParticleSystem: sinh bụi khi nhảy và tia sáng khi chém trúng quái`,
    proTipVi: "Sử dụng mảng số 2D (matrix grid) để đại diện cho bản đồ (0: air, 1: solid tile, 2: coin, 3: spike). AI viết code render matrix này cực kỳ chuẩn xác và không bao giờ lỗi.",
    proTipEn: "Use a 2D number matrix to encode your level map (0: air, 1: solid, 2: coin, 3: spike). LLMs generate matrix parsers with near 100% accuracy.",
    mistakeToAvoidVi: "Không nhồi nhét cả 10 màn chơi cùng lúc trong 1 prompt đầu tiên. Hãy yêu cầu 1 màn hoàn chỉnh trước, sau đó yêu cầu sinh thêm dữ liệu màn ở turn tiếp theo.",
    mistakeToAvoidEn: "Do not attempt to prompt 10 full levels in turn 1. Create a pristine Level 1 first, then prompt for additional level arrays in subsequent turns."
  },
  {
    id: 3,
    titleVi: "Prompt Tạo Procedural Pixel Art & Sprites",
    titleEn: "Procedural Pixel Art & Sprite Prompts",
    subtitleVi: "Bí quyết ra lệnh vẽ Sprite nhân vật, hiệu ứng chém kiếm và gạch nền bằng mã nguồn thuần túy",
    subtitleEn: "Techniques for generating pixel hero sprites, sword slashes, and tilesets via pure procedural code",
    keyPointsVi: [
      "Vẽ Pixel ma trận (Pixel Matrix): Yêu cầu AI biểu diễn nhân vật bằng mảng chuỗi ký tự (ASCII/Color Index) 16x16 hoặc 32x32",
      "Animation Frames: Sinh 4 frame chạy (run cycle) và 2 frame thở (idle) bằng cách dời vị trí chân và đầu",
      "Hiệu ứng hình ảnh Retro: Thêm đường viền đen (1px outline), đổ bóng 2 tông màu (highlight và shadow)",
      "Độ sắc nét Pixel: Luôn kích hoạt imageSmoothingEnabled = false trên canvas context để pixel không bị nhòe"
    ],
    keyPointsEn: [
      "Pixel Matrix Definition: Prompt AI to define character sprites using ASCII or indexed color arrays (16x16 or 32x32)",
      "Procedural Animation: Generate 4-frame run cycles and 2-frame idle breathing by shifting leg and torso offsets",
      "Retro Polish: Add 1px dark outlines and two-tone shading (specular highlight and ambient shadow)",
      "Pixel Crispness: Explicitly enforce ctx.imageSmoothingEnabled = false so pixels remain razor-sharp"
    ],
    promptTemplate: `[SPRITE DRAWING DIRECTIVE]
Vẽ nhân vật chính bằng Canvas 2D:
- Thiết lập ctx.imageSmoothingEnabled = false
- Sử dụng bảng màu: Áo xanh (#2563eb), Da (#fde047), Tóc đỏ (#dc2626), Kiếm bạc (#e2e8f0)
- Tùy theo player.state ('idle' | 'run' | 'jump' | 'attack'), vẽ các pixel offset tương ứng để tạo cảm giác chuyển động sống động.`,
    proTipVi: "Nếu muốn xuất prompt cho AI tạo ảnh (Imagen/Midjourney), hãy thêm: 'Pixel art sprite sheet, 32x32 grid, clean silhouette, limited palette, magenta background #FF00FF'.",
    proTipEn: "When generating sprite sheets with image models, append: 'Pixel art sprite sheet, 32x32 grid, crisp silhouette, limited palette, magenta background #FF00FF'.",
    mistakeToAvoidVi: "Quên tắt khử răng cưa (imageSmoothingEnabled). Nếu quên lệnh này, canvas sẽ làm mờ các pixel và mất đi vẻ đẹp retro hoài niệm.",
    mistakeToAvoidEn: "Forgetting to disable anti-aliasing. Without imageSmoothingEnabled = false, canvas blurs pixels into a muddy smear."
  },
  {
    id: 4,
    titleVi: "Chiến Lược Refinement & Đánh Trùm (Iteration)",
    titleEn: "Refinement, Boss Battles & Polish Loop",
    subtitleVi: "Lộ trình hoàn thiện game từ bản mẫu cơ bản đến tựa game hoàn chỉnh có âm thanh, trùm cuối và hiệu ứng CRT",
    subtitleEn: "Guiding the project from basic prototype to polished game with Web Audio, boss phases, and CRT shaders",
    keyPointsVi: [
      "Bước 1 (Base Mechanics): Đảm bảo vật lý di chuyển, nhảy đôi và va chạm nền hoạt động hoàn hảo",
      "Bước 2 (Combat & Enemies): Thêm hệ thống máu (HP), quái vật tuần tra, và hiệu ứng vung kiếm sát thương",
      "Bước 3 (Boss Battle): Thiết kế Trùm cuối có thanh máu lớn, 3 giai đoạn tấn công báo trước (telegraphed attacks)",
      "Bước 4 (Juice & Polish): Thêm rung màn hình (Screen Shake), hạt nổ (Particle Spurt), và bộ lọc quét mờ quét ngang CRT"
    ],
    keyPointsEn: [
      "Stage 1 (Base Mechanics): Verify gravity, double jump, friction, and solid collision feel tight and responsive",
      "Stage 2 (Combat & Mobs): Implement player HP, patrolling enemies, sword slash hitbox, and invulnerability frames",
      "Stage 3 (Boss Battle): Add epic final boss with boss health bar and 3 telegraphed attack phases",
      "Stage 4 (Juice & Polish): Screen shake on impact, death particles, high-score memory, and retro CRT scanlines"
    ],
    promptTemplate: `[REFINEMENT PROMPT CHO TURN 2 & 3]
Game đã chạy rất tốt. Bây giờ hãy nâng cấp phiên bản này với các tính năng sau:
1. Thêm TRÙM CUỐI ở cuối map: Kích thước gấp 3 lần nhân vật, có 3 chiêu thức: Đập đất tạo sóng xung kích, Bắn 3 quả cầu lửa, và Húc lao tới.
2. Thêm hàm screenShake(duration, intensity) kích hoạt mỗi khi nhân vật hoặc trùm dính đòn.
3. Thêm âm thanh Web Audio chiptune chiến thắng khi tiêu diệt được Boss.`,
    proTipVi: "Khi yêu cầu AI nâng cấp code ở turn tiếp theo, luôn nhắc lại: 'Giữ nguyên toàn bộ logic di chuyển và renderer đang chạy tốt, chỉ chèn thêm các tính năng mới vào đúng module'.",
    proTipEn: "When prompting for enhancements in turn 2+, specify: 'Preserve all existing working physics and rendering code; surgically integrate the new features'.",
    mistakeToAvoidVi: "Đừng gửi prompt sửa đổi quá dài bao gồm cả những thứ không liên quan. Tập trung vào 2-3 tính năng nâng cấp cho mỗi lượt trao đổi.",
    mistakeToAvoidEn: "Do not bombard the model with 20 unrelated feature requests in a single turn. Batch changes into 2-3 tightly scoped features per turn."
  }
];
