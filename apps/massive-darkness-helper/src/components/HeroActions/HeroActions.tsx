import { useState } from 'react';
import styles from './HeroActions.module.css';

type ActionType = 'movement' | 'attack' | 'recovery' | 'exchange' | 'special';

interface ActionInfo {
  id: ActionType;
  name: string;
  icon: string;
  shortDesc: string;
  details: string[];
  important?: string[];
  tips?: string[];
}

const actions: ActionInfo[] = [
  {
    id: 'movement',
    name: 'Движение',
    icon: '🚶',
    shortDesc: 'Получите 2 очка движения (ОД) для перемещения и взаимодействия',
    details: [
      'За 1 ОД можно: передвинуться в соседнюю зону',
      'За 1 ОД можно: открыть дверь в своей зоне',
      'За 1 ОД можно: взаимодействовать с объектом (сундук, источник, сокровище)',
      'Нельзя двигаться по диагонали',
      'Нельзя проходить сквозь стены или закрытые двери',
      'Непотраченные ОД теряются в конце действия',
    ],
    important: [
      '⚠️ При выходе из зоны с врагами — получите 1 ранение за КАЖДУЮ фигурку врага!',
      '⚠️ Взаимодействие с объектами возможно только если в зоне НЕТ врагов',
      '✓ Открытие двери НЕ заканчивает действие движения — можно продолжить!',
    ],
    tips: [
      '💡 Навык Нахиаса "Движение: +1 ОД" даёт 3 ОД вместо 2',
      '💡 Некоторые предметы и навыки дают бонусные ОД',
    ],
  },
  {
    id: 'attack',
    name: 'Атака',
    icon: '⚔️',
    shortDesc: 'Атакуйте врага оружием',
    details: [
      'Ближняя атака ⚔️ — цель в той же зоне (дальность 0)',
      'Магическая атака 🔮 — своя зона или 1 зона с видимостью (дальность 0-1)',
      'Дальняя атака 🏹 — минимум 1 зона с видимостью (дальность 1+)',
      'Атаки только по горизонтали или вертикали (не по диагонали!)',
      'Стены и закрытые двери блокируют прямую видимость',
      'Другие фигурки НЕ блокируют видимость',
    ],
    important: [
      '⚠️ В тёмной зоне добавьте кубик сумрака к атаке!',
      '⚠️ Приспешники защищают лидера — убейте их первыми!',
    ],
    tips: [
      '💡 Колонны мешают дальней атаке, но не блокируют её (-1 кубик атаки)',
      '💡 Два оружия одного типа — кубики складываются',
    ],
  },
  {
    id: 'recovery',
    name: 'Восстановление',
    icon: '💚',
    shortDesc: 'Восстановите здоровье или ману',
    details: [
      'Получите до 2 единиц в любой комбинации:',
      '• 2 здоровья',
      '• 2 маны',
      '• 1 здоровье + 1 мана',
      'Или снимите до 2 жетонов огня',
    ],
    tips: [
      '💡 Паладин в освящённой зоне даёт дополнительное восстановление',
      '💡 Зелья дают больше восстановления, но расходуются',
    ],
  },
  {
    id: 'exchange',
    name: 'Обмен и экипировка',
    icon: '🔄',
    shortDesc: 'Обменивайтесь предметами и меняйте экипировку',
    details: [
      '1 герой тратит действие — ВСЕ герои в зоне могут:',
      '• Обмениваться предметами между собой',
      '• Перемещать предметы из инвентаря в ячейки',
      '• Снимать предметы с ячеек в инвентарь',
      'Инвентарь не ограничен — храните сколько угодно предметов',
    ],
    important: [
      '✓ Даже для личной экипировки (без обмена) нужно потратить действие',
    ],
  },
  {
    id: 'special',
    name: 'Особое действие',
    icon: '✨',
    shortDesc: 'Активируйте способности навыков и предметов',
    details: [
      'Навыки и предметы с пометкой "Действие:" требуют траты действия',
      'Пример: способность Матрина "Действие: получите 3 маны"',
      'Пример: "Серебряное кольцо — Действие: исцеление 3"',
      'Некоторые особые действия могут быть классовыми',
    ],
    tips: [
      '💡 Читайте карты внимательно — не всё требует траты действия',
      '💡 "Бой:", "Атака:", "Защита:" — это не действия, а триггеры',
    ],
  },
];

export const HeroActions = () => {
  const [selectedAction, setSelectedAction] = useState<ActionType>('movement');
  const currentAction = actions.find((a) => a.id === selectedAction)!;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>🦸 Фаза героев</h2>
        <p className={styles.subtitle}>
          Каждый герой выполняет <strong>3 действия</strong> за ход в любом
          сочетании. Одно действие можно выполнить несколько раз.
        </p>
      </header>

      {/* Action selector */}
      <div className={styles.actionSelector}>
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`${styles.actionBtn} ${selectedAction === action.id ? styles.active : ''}`}
            onClick={() => setSelectedAction(action.id)}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionName}>{action.name}</span>
          </button>
        ))}
      </div>

      {/* Action details */}
      <div className={styles.actionDetails}>
        <div className={styles.actionHeader}>
          <span className={styles.detailIcon}>{currentAction.icon}</span>
          <div>
            <h3 className={styles.detailTitle}>{currentAction.name}</h3>
            <p className={styles.detailDesc}>{currentAction.shortDesc}</p>
          </div>
        </div>

        <ul className={styles.detailList}>
          {currentAction.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>

        {currentAction.important && (
          <div className={styles.importantBox}>
            <h4>Важно!</h4>
            {currentAction.important.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        )}

        {currentAction.tips && (
          <div className={styles.tipsBox}>
            <h4>Советы</h4>
            {currentAction.tips.map((tip) => (
              <p key={tip}>{tip}</p>
            ))}
          </div>
        )}
      </div>

      {/* Movement Diagram - shown when movement is selected */}
      {selectedAction === 'movement' && <MovementDiagram />}

      {/* Attack Types Diagram - shown when attack is selected */}
      {selectedAction === 'attack' && <AttackTypesDiagram />}

      {/* Door Opening Sequence */}
      {selectedAction === 'movement' && <DoorOpeningSequence />}
    </div>
  );
};

const MovementDiagram = () => {
  const [step, setStep] = useState(0);
  const [heroPosition, setHeroPosition] = useState({ row: 1, col: 1 });
  const [movementPoints, setMovementPoints] = useState(2);
  const [doorOpen, setDoorOpen] = useState(false);

  const resetDemo = () => {
    setStep(0);
    setHeroPosition({ row: 1, col: 1 });
    setMovementPoints(2);
    setDoorOpen(false);
  };

  const grid = [
    [
      { type: 'corridor', dark: false },
      { type: 'corridor', dark: true },
      { type: 'wall' },
    ],
    [
      { type: 'corridor', dark: true },
      { type: 'corridor', dark: false, enemy: true },
      { type: 'door' },
    ],
    [
      { type: 'wall' },
      { type: 'corridor', dark: true, treasure: true },
      { type: 'hall', dark: true },
    ],
  ];

  const stepDescriptions = [
    {
      title: 'Начало действия движения',
      text: 'Герой в центре получает 2 ОД. В зоне есть враг (👹)!',
    },
    {
      title: 'Вариант 1: Движение влево',
      text: 'Потратьте 1 ОД → переход в соседнюю зону. НО получите 1 ранение от врага!',
    },
    {
      title: 'Вариант 2: Движение вниз к сокровищу',
      text: 'Потратьте 1 ОД → переход. Получите 1 ранение! Осталось 1 ОД для взаимодействия.',
    },
    {
      title: 'Вариант 3: Открыть дверь',
      text: 'Потратьте 1 ОД → открыть дверь. Получите 1 ранение! Триггер: открытие зала.',
    },
    {
      title: 'После открытия двери',
      text: 'Осталось 1 ОД! Можно войти в зал или сделать что-то другое.',
    },
  ];

  const handleNextStep = () => {
    if (step < stepDescriptions.length - 1) {
      setStep(step + 1);
      if (step === 2) {
        setDoorOpen(true);
      }
    }
  };

  const getCellClass = (row: number, col: number) => {
    const cell = grid[row][col];
    let classes = styles.cell;

    if (cell.type === 'wall') classes += ` ${styles.wall}`;
    if (cell.type === 'door') classes += ` ${styles.door}`;
    if (cell.type === 'hall') classes += ` ${styles.hall}`;
    if (cell.dark) classes += ` ${styles.dark}`;

    // Highlight possible moves
    if (step > 0 && step < 4) {
      const isAdjacent =
        (Math.abs(row - heroPosition.row) === 1 &&
          col === heroPosition.col) ||
        (Math.abs(col - heroPosition.col) === 1 && row === heroPosition.row);
      if (isAdjacent && cell.type !== 'wall') {
        classes += ` ${styles.highlight}`;
      }
    }

    return classes;
  };

  return (
    <div className={styles.diagramSection}>
      <h3 className={styles.diagramTitle}>📍 Схема действия движения</h3>

      <div className={styles.diagramContent}>
        {/* Grid */}
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            {grid.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={getCellClass(rowIdx, colIdx)}
                >
                  {/* Cell content */}
                  {cell.type === 'wall' && <span className={styles.wallIcon}>🧱</span>}
                  {cell.type === 'door' && (
                    <span className={styles.doorIcon}>
                      {doorOpen ? '🚪' : '🔒'}
                    </span>
                  )}
                  {cell.treasure && <span className={styles.treasureIcon}>💎</span>}
                  {cell.enemy && rowIdx === 1 && colIdx === 1 && (
                    <span className={styles.enemyIcon}>👹</span>
                  )}

                  {/* Hero position */}
                  {heroPosition.row === rowIdx && heroPosition.col === colIdx && (
                    <span className={styles.heroIcon}>🦸</span>
                  )}

                  {/* Light/Dark indicator */}
                  {cell.type !== 'wall' && cell.type !== 'door' && (
                    <span className={styles.lightIndicator}>
                      {cell.dark ? '🌙' : '☀️'}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} data-type="light" /> Светлая зона
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} data-type="dark" /> Тёмная зона
            </div>
            <div className={styles.legendItem}>
              <span>👹</span> Враг
            </div>
            <div className={styles.legendItem}>
              <span>💎</span> Сокровище
            </div>
            <div className={styles.legendItem}>
              <span>🔒/🚪</span> Дверь
            </div>
          </div>
        </div>

        {/* Step description */}
        <div className={styles.stepInfo}>
          <div className={styles.movementPoints}>
            <span className={styles.mpLabel}>Очки движения:</span>
            <div className={styles.mpDots}>
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className={`${styles.mpDot} ${i < movementPoints ? styles.active : ''}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>Шаг {step + 1}</div>
            <h4>{stepDescriptions[step].title}</h4>
            <p>{stepDescriptions[step].text}</p>
          </div>

          <div className={styles.stepControls}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={resetDemo}
            >
              🔄 Сбросить
            </button>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={handleNextStep}
              disabled={step >= stepDescriptions.length - 1}
            >
              Далее →
            </button>
          </div>
        </div>
      </div>

      {/* Key rules */}
      <div className={styles.keyRules}>
        <div className={styles.ruleBox} data-type="danger">
          <span className={styles.ruleIcon}>⚠️</span>
          <div>
            <strong>Выход из зоны с врагом</strong>
            <p>
              При выходе из зоны, где находится враг, герой получает 1 ранение
              за КАЖДУЮ вражескую фигурку в этой зоне!
            </p>
          </div>
        </div>

        <div className={styles.ruleBox} data-type="info">
          <span className={styles.ruleIcon}>💡</span>
          <div>
            <strong>Взаимодействие с объектами</strong>
            <p>
              1 ОД = взять сокровище, открыть сундук, попить из источника.
              Работает только если в зоне НЕТ врагов!
            </p>
          </div>
        </div>

        <div className={styles.ruleBox} data-type="success">
          <span className={styles.ruleIcon}>✅</span>
          <div>
            <strong>Открытие двери</strong>
            <p>
              Открытие двери стоит 1 ОД, но НЕ заканчивает действие движения.
              Оставшиеся ОД можно использовать!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttackTypesDiagram = () => {
  return (
    <div className={styles.diagramSection}>
      <h3 className={styles.diagramTitle}>🎯 Типы атак и дальность</h3>

      <div className={styles.attackTypes}>
        <div className={styles.attackTypeCard} data-type="melee">
          <div className={styles.attackTypeHeader}>
            <span className={styles.attackTypeIcon}>⚔️</span>
            <h4>Ближняя атака</h4>
          </div>
          <div className={styles.rangeVisual}>
            <div className={styles.rangeGrid}>
              <div className={styles.rangeCell} />
              <div className={styles.rangeCell} />
              <div className={styles.rangeCell} />
              <div className={styles.rangeCell} />
              <div className={`${styles.rangeCell} ${styles.heroCell}`}>🦸</div>
              <div className={styles.rangeCell} />
              <div className={styles.rangeCell} />
              <div className={styles.rangeCell} />
              <div className={styles.rangeCell} />
            </div>
            <p className={styles.rangeText}>
              <strong>Дальность: 0</strong>
              <br />
              Только в своей зоне
            </p>
          </div>
        </div>

        <div className={styles.attackTypeCard} data-type="magic">
          <div className={styles.attackTypeHeader}>
            <span className={styles.attackTypeIcon}>🔮</span>
            <h4>Магическая атака</h4>
          </div>
          <div className={styles.rangeVisual}>
            <div className={styles.rangeGrid}>
              <div className={styles.rangeCell} />
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={styles.rangeCell} />
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.heroCell}`}>🦸</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={styles.rangeCell} />
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={styles.rangeCell} />
            </div>
            <p className={styles.rangeText}>
              <strong>Дальность: 0-1</strong>
              <br />
              Своя зона или 1 зона с видимостью
            </p>
          </div>
        </div>

        <div className={styles.attackTypeCard} data-type="ranged">
          <div className={styles.attackTypeHeader}>
            <span className={styles.attackTypeIcon}>🏹</span>
            <h4>Дальняя атака</h4>
          </div>
          <div className={styles.rangeVisual}>
            <div className={styles.rangeGrid}>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.heroCell}`}>🦸</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
              <div className={`${styles.rangeCell} ${styles.targetCell}`}>👹</div>
            </div>
            <p className={styles.rangeText}>
              <strong>Дальность: 1+</strong>
              <br />
              Минимум 1 зона, требуется видимость
            </p>
          </div>
        </div>
      </div>

      <div className={styles.attackNote}>
        <strong>⚠️ Важно:</strong> Атаки совершаются только по горизонтали или
        вертикали. Диагональные атаки запрещены!
      </div>
    </div>
  );
};

const DoorOpeningSequence = () => {
  return (
    <div className={styles.diagramSection}>
      <h3 className={styles.diagramTitle}>🚪 Открытие зала — последовательность</h3>

      <div className={styles.sequence}>
        <div className={styles.sequenceStep}>
          <div className={styles.sequenceNumber}>1</div>
          <div className={styles.sequenceContent}>
            <h4>🎴 Возьмите карту двери</h4>
            <p>Разыграйте событие с карты (ловушка, бонус и т.д.)</p>
          </div>
        </div>

        <div className={styles.sequenceArrow}>→</div>

        <div className={styles.sequenceStep}>
          <div className={styles.sequenceNumber}>2</div>
          <div className={styles.sequenceContent}>
            <h4>👹 Появление врагов</h4>
            <p>
              За каждый жетон 👁️ в зале появляется отряд:
              <br />1 лидер + приспешники (= количество героев)
            </p>
          </div>
        </div>

        <div className={styles.sequenceArrow}>→</div>

        <div className={styles.sequenceStep}>
          <div className={styles.sequenceNumber}>3</div>
          <div className={styles.sequenceContent}>
            <h4>💎 Размещение сокровищ</h4>
            <p>Жетоны сокровищ из мешка → на жетоны добычи в зале</p>
          </div>
        </div>

        <div className={styles.sequenceArrow}>→</div>

        <div className={styles.sequenceStep}>
          <div className={styles.sequenceNumber}>4</div>
          <div className={styles.sequenceContent}>
            <h4>🚶 Продолжение движения</h4>
            <p>Если остались ОД — можно продолжить действие!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroActions;
