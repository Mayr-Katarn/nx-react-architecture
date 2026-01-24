/**
 * Типы данных для Massive Darkness Helper
 */

export type HeroClass =
  | 'berserker'
  | 'paladin'
  | 'shaman'
  | 'rogue'
  | 'wizard'
  | 'ranger';

export type EnemyType = 'mob' | 'roaming' | 'boss';

export type DiceType =
  | 'yellow'
  | 'orange'
  | 'blue'
  | 'purple'
  | 'black';

export interface Hero {
  id: string;
  name: string;
  nameEn: string;
  class: HeroClass;
  classNameRu: string;
  health: number;
  mana: number;
  shadowAbility: string;
  heroicAbility: string;
  specialMechanic: string;
  color: string;
  icon: string;
}

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  health: number | string; // string для "/герой"
  attackDice: DiceType[];
  defenseDice: DiceType[];
  specialAbility: string;
  level: string;
  icon: string;
}

export interface GamePhase {
  id: string;
  number: number;
  name: string;
  description: string;
  details: string[];
  icon: string;
  color: string;
}

export interface DiceInfo {
  type: DiceType;
  name: string;
  color: string;
  description: string;
  symbols: string[];
}

export interface QuickRule {
  id: string;
  title: string;
  content: string;
  icon: string;
}
