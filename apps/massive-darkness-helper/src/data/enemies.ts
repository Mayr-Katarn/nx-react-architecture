import type { Enemy } from './types';

export const mobs: Enemy[] = [
  {
    id: 'skeletons',
    name: 'Скелеты',
    type: 'mob',
    health: 2,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue'],
    specialAbility:
      'Защита 2🎲: к отряду добавляется 1 скелет-приспешник, если атакующий герой не сбросит 1 ману',
    level: '1-2',
    icon: '💀',
  },
  {
    id: 'infernal-imps',
    name: 'Адские бесы',
    type: 'mob',
    health: 2,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue'],
    specialAbility: 'Особая способность на карте предмета отряда',
    level: '1-2',
    icon: '👿',
  },
  {
    id: 'gargoyles',
    name: 'Гаргульи',
    type: 'mob',
    health: 3,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue'],
    specialAbility: 'Защита 1🎲: +1 щит',
    level: '1-2',
    icon: '🗿',
  },
  {
    id: 'satyrs',
    name: 'Сатиры',
    type: 'mob',
    health: 4,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue'],
    specialAbility: 'Атака 1🎲: +2 урона',
    level: '3-4',
    icon: '🐐',
  },
  {
    id: 'fire-entities',
    name: 'Огненные сущности',
    type: 'mob',
    health: 4,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue'],
    specialAbility:
      'Бой 1🎲: добавьте 1 огонь атакующему или защищающемуся герою',
    level: '3-4',
    icon: '🔥',
  },
  {
    id: 'undead',
    name: 'Нежить',
    type: 'mob',
    health: 4,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue'],
    specialAbility: 'Атака 1🎲: +1 урон, +1 перебросить и отряд получает 2 ранения',
    level: '3-4',
    icon: '🧟',
  },
  {
    id: 'fallen-angels',
    name: 'Падшие ангелы',
    type: 'mob',
    health: 5,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue', 'blue'],
    specialAbility: 'Атака 1🎲: у защищающегося -2 щита',
    level: '5',
    icon: '😇',
  },
  {
    id: 'demons',
    name: 'Демоны',
    type: 'mob',
    health: 5,
    attackDice: ['yellow', 'orange'],
    defenseDice: ['blue', 'blue'],
    specialAbility: 'Мощные атаки с уроном огнём',
    level: '5',
    icon: '👹',
  },
];

export const roamingMonsters: Enemy[] = [
  {
    id: 'andra',
    name: 'Андра',
    type: 'roaming',
    health: '5/герой',
    attackDice: ['yellow', 'orange', 'black', 'black'],
    defenseDice: ['blue', 'black'],
    specialAbility:
      'Атакует героя с самым низким здоровьем. Бой 1🎲: нанесите 1 ранение другому герою с самым низким здоровьем в прямой видимости.',
    level: '1-2',
    icon: '🦇',
  },
  {
    id: 'ghoul',
    name: 'Упырь',
    type: 'roaming',
    health: '5/герой',
    attackDice: ['yellow', 'orange', 'black', 'black'],
    defenseDice: ['blue', 'black'],
    specialAbility:
      'Если в зоне есть приспешник — убивает его и исцеляет 5 ранений. Бой 1🎲: передвиньте ближайший отряд на 1 зону к упырю.',
    level: '1-2',
    icon: '🧛',
  },
  {
    id: 'lidan',
    name: 'Лидан, повелитель инкубов',
    type: 'roaming',
    health: '10/герой',
    attackDice: ['orange', 'orange', 'black', 'black'],
    defenseDice: ['blue', 'blue', 'black'],
    specialAbility:
      'В светлой зоне получает 5 ранений. Телепортируется к героям. Атака 1🎲: разыграйте все огни на герое.',
    level: '3-4',
    icon: '😈',
  },
  {
    id: 'iteria',
    name: 'Итерия, королева нежити',
    type: 'roaming',
    health: '8/герой',
    attackDice: ['orange', 'orange', 'black', 'black'],
    defenseDice: ['blue', 'blue', 'blue', 'black'],
    specialAbility:
      'Атакует всех героев в прямой видимости. Атака 1🎲: добавьте 1 приспешника в каждый отряд.',
    level: '5',
    icon: '👸',
  },
];

export const bosses: Enemy[] = [
  {
    id: 'michael',
    name: 'Михаил, Осквернённый Архангел',
    type: 'boss',
    health: '15/герой',
    attackDice: ['orange', 'orange', 'black', 'black'],
    defenseDice: ['blue', 'blue', 'black', 'black'],
    specialAbility:
      'Небесное правосудие, Бросок копья, Благословение Тьмы. Порча увеличивает урон. Тьма даёт бонусные кубики.',
    level: 'Вожак',
    icon: '👼',
  },
  {
    id: 'reaper',
    name: 'Жнец',
    type: 'boss',
    health: '25/герой',
    attackDice: ['orange', 'orange', 'orange', 'black', 'black'],
    defenseDice: ['blue', 'blue', 'blue', 'black', 'black'],
    specialAbility:
      'Осушение душ, Время уходит, Смерть грядёт. Тёмная ярость: X действий за активацию. Бой 2🎲: если нет маны — берёт 1 холод.',
    level: 'Вожак',
    icon: '💀',
  },
];

export const allEnemies = [...mobs, ...roamingMonsters, ...bosses];

export const getEnemyById = (id: string): Enemy | undefined =>
  allEnemies.find((e) => e.id === id);
