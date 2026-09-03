export type Language = "vi" | "en";

export type GameGenre =
  | "platformer"
  | "topdown_rpg"
  | "roguelike"
  | "bullet_hell"
  | "metroidvania"
  | "farm_sim"
  | "turn_tactics"
  | "cyberpunk_brawler";

export type PixelArtStyle =
  | "nes_8bit"
  | "snes_16bit"
  | "gba_32bit"
  | "pico8"
  | "gameboy_mono"
  | "cyber_neon"
  | "dark_fantasy";

export type PixelResolution = "16x16" | "24x24" | "32x32" | "48x48" | "64x64";

export type GameEngineTarget =
  | "canvas_ts"
  | "phaser3"
  | "kaboom"
  | "godot_gdscript"
  | "pygame";

export interface GamePromptSuite {
  gameTitle: string;
  summary: string;
  masterSystemInstruction: string;
  architectureGDD: string;
  mainImplementationPrompt: string;
  spriteAssetPrompt: string;
  audioSynthPrompt: string;
  refinementRoadmap: string[];
}

export interface PresetTemplate {
  id: string;
  title: string;
  genre: GameGenre;
  genreName: string;
  artStyle: PixelArtStyle;
  artStyleName: string;
  resolution: PixelResolution;
  engineTarget: GameEngineTarget;
  concept: string;
  lore: string;
  mechanics: string[];
  enemies: string;
  biome: string;
  soundStyle: string;
  colorPalette: string[];
  bannerEmoji: string;
}

export interface GuideSlide {
  id: number;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  keyPointsVi: string[];
  keyPointsEn: string[];
  promptTemplate: string;
  proTipVi: string;
  proTipEn: string;
  mistakeToAvoidVi: string;
  mistakeToAvoidEn: string;
  codeSnippet?: string;
}
