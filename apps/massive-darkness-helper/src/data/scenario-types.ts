/**
 * Типы данных для генератора сценариев
 */

/** Размер карты */
export type MapSize = 'small' | 'medium' | 'large';

/** Уровень сложности */
export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'nightmare';

/** Типы целей приключения (из правил + оригинальные) */
export type ObjectiveType =
  // Из правил
  | 'COLLECT_ITEMS'
  | 'ACTIVATE_SWITCHES'
  | 'ESCORT_NPC'
  | 'FORGE_ARTIFACT'
  | 'DESTROY_TARGETS'
  | 'HUNT_MONSTERS'
  | 'DEFEAT_BOSS'
  | 'COLLECT_SOULS'
  | 'TIMED_COLLECTION'
  | 'CLOSE_RIFT'
  // Оригинальные
  | 'DEFEND_ZONE'
  | 'SURVIVE_WAVES'
  | 'PURIFY_CORRUPTION'
  | 'RACE_TO_EXIT'
  | 'RITUAL_SEQUENCE';

/** Позиция на сетке раскладки */
export interface GridPosition {
  row: number;
  col: number;
}

/** Роль тайла в сценарии */
export type TileRole = 'start' | 'middle' | 'objective' | 'boss' | 'exit';

/** Тип двери между тайлами */
export type DoorType = 'normal' | 'locked' | 'gate';

/** Тайл карты */
export interface MapTile {
  id: string; // e.g. '1A', '3B'
  side: 'A' | 'B';
  number: number; // 1-8
}

/** Жетон, размещённый на конкретном тайле */
export interface TileToken {
  name: string;
  icon: string;
  count: number;
}

/** Тайл, размещённый на карте с позицией и жетонами */
export interface PlacedTile extends MapTile {
  /** Координаты на сетке раскладки */
  position: GridPosition;
  /** Роль тайла в сценарии */
  role: TileRole;
  /** Жетоны на этом тайле */
  tokens: TileToken[];
}

/** Соединение (дверь) между двумя тайлами */
export interface TileConnection {
  fromTileId: string;
  toTileId: string;
  doorType: DoorType;
}

/** Тип раскладки тайлов */
export type LayoutType =
  | 'linear'
  | 'L-shape'
  | 'T-shape'
  | 'cross'
  | 'zigzag';

/** Полная раскладка карты */
export interface MapLayout {
  /** Размещённые тайлы с позициями и жетонами */
  placedTiles: PlacedTile[];
  /** Соединения (двери) между тайлами */
  connections: TileConnection[];
  /** Размер сетки */
  gridSize: { rows: number; cols: number };
  /** Тип раскладки */
  layoutType: LayoutType;
}

/** Задача приключения */
export interface Objective {
  type: ObjectiveType;
  order: number;
  title: string;
  description: string;
  icon: string;
}

/** Особое правило сценария */
export interface SpecialRule {
  name: string;
  description: string;
  icon: string;
}

/** Жетон для расстановки */
export interface TokenPlacement {
  name: string;
  icon: string;
  count: number;
  /** Дополнительное количество при 3+ игроках */
  countAt3Plus?: number;
  /** Дополнительное количество при 5+ игроках */
  countAt5Plus?: number;
}

/** Условия победы/поражения */
export interface WinLoseConditions {
  victory: string;
  defeat: string;
}

/** Настройки генерации */
export interface ScenarioConfig {
  seed: string;
  mapSize: MapSize;
  difficulty: DifficultyLevel;
  playerCount: number;
}

/** Полностью сгенерированный сценарий */
export interface GeneratedScenario {
  /** Название приключения */
  name: string;
  /** Иконка */
  icon: string;
  /** Нарративный текст */
  narrative: string;
  /** Сид, из которого сгенерирован */
  seed: string;
  /** Параметры генерации */
  config: ScenarioConfig;
  /** Фрагменты поля */
  tiles: MapTile[];
  /** Раскладка карты с позициями, жетонами и соединениями */
  mapLayout: MapLayout;
  /** Задачи приключения (упорядоченные) */
  objectives: Objective[];
  /** Особые правила */
  specialRules: SpecialRule[];
  /** Расстановка жетонов (сводная таблица) */
  tokens: TokenPlacement[];
  /** Условия победы/поражения */
  conditions: WinLoseConditions;
  /** Модификаторы сложности (текстовые) */
  difficultyModifiers: string[];
}
