import { useCallback, useState } from 'react';
import styles from './GameSetup.module.css';

interface SetupStep {
  id: number;
  title: string;
  brief: string;
  icon: string;
  details: string[];
  playerDependent?: boolean;
}

const setupSteps: SetupStep[] = [
  {
    id: 1,
    title: 'Подготовка героев',
    brief: 'Карты, фигурки, снаряжение',
    icon: '🎭',
    details: [
      'Каждый игрок берёт карту героя, фигурку, панель и подставку',
      'Установите жетоны уровня, опыта, здоровья и маны',
      'Возьмите 4 жетона сокровищ героя (1 редкий + 3 эпических)',
      'Выберите 1 навык 1-го уровня своего класса',
      'Возьмите начальное снаряжение: броню, зелье и оружие класса',
    ],
  },
  {
    id: 2,
    title: 'Подготовка колод',
    brief: 'Сортировка и перемешивание',
    icon: '🃏',
    details: [
      'Карты отрядов — разделите по уровням (1-2, 3-4, 5), перемешайте',
      'Карты бродячих монстров — разделите по уровням, перемешайте',
      'Карты предметов — разделите на обычные/редкие/эпические',
      'Карты предметов отрядов — разделите по уровням',
      'Карты дверей — соберите в одну колоду, перемешайте',
    ],
  },
  {
    id: 3,
    title: 'Сборка подземелья',
    brief: 'Выбор приключения и поле',
    icon: '🗺️',
    details: [
      'Выберите приключение из книги приключений',
      'Соберите подземелье из плиток согласно схеме',
      'Разместите жетоны: двери, порталы, ловушки, сундуки',
      'Подготовьте мешок сокровищ (обычные + 5 редких жетонов)',
      'Разместите фигурки врагов рядом с полем',
    ],
  },
  {
    id: 4,
    title: 'Начальные враги',
    brief: 'Отряды и приспешники',
    icon: '👹',
    details: [
      'Вытяните карту начального отряда согласно приключению',
      'Разместите фигурку лидера отряда',
      'Добавьте приспешников (количество = количеству героев)',
      'Положите карты предметов отрядов под карты врагов',
    ],
    playerDependent: true,
  },
  {
    id: 5,
    title: 'Общий резерв',
    brief: 'Жетоны и искра жизни',
    icon: '✨',
    details: [
      'Жетоны искры жизни: 1-2 героя → 1шт, 3-4 → 2шт, 5-6 → 3шт',
      'Разместите жетоны здоровья и маны в общем запасе',
      'Подготовьте жетоны огня, льда и все кубики',
    ],
    playerDependent: true,
  },
  {
    id: 6,
    title: 'Старт игры',
    brief: 'Размещение и шкала тьмы',
    icon: '🏁',
    details: [
      'Разместите фигурки героев в стартовой зоне приключения',
      'Установите маркер тьмы на ячейку 1 шкалы',
      'Игра готова к началу!',
    ],
  },
];

export const GameSetup = () => {
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = useCallback((stepId: number) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  }, []);

  const toggleCompleted = useCallback((stepId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setCompletedSteps(new Set());
    setExpandedStep(null);
  }, []);

  const getLifeSparkCount = () => {
    if (playerCount <= 2) return 1;
    if (playerCount <= 4) return 2;
    return 3;
  };

  const progress = Math.round((completedSteps.size / setupSteps.length) * 100);
  const isComplete = completedSteps.size === setupSteps.length;

  return (
    <div className={styles.setupContainer}>
      <div className={styles.setupHeader}>
        <h2 className={styles.setupTitle}>📋 Подготовка к игре</h2>
        <p className={styles.setupDescription}>
          Выполните 6 ключевых этапов для подготовки игры
        </p>
      </div>

      {/* Player Count Selector */}
      <div className={styles.playerSelector}>
        <h3 className={styles.playerSelectorTitle}>👥 Количество игроков</h3>
        <div className={styles.playerButtons}>
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <button
              key={count}
              type="button"
              className={`${styles.playerButton} ${playerCount === count ? styles.active : ''}`}
              onClick={() => setPlayerCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
        <div className={styles.tipsBox}>
          <h4 className={styles.tipsTitle}>Для {playerCount} игроков:</h4>
          <ul className={styles.tipsList}>
            <li className={styles.tipItem}>
              Жетонов искры жизни: {getLifeSparkCount()}
            </li>
            <li className={styles.tipItem}>
              Приспешников в отряде: {playerCount}
            </li>
          </ul>
        </div>
      </div>

      {/* Progress Section */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>Прогресс подготовки</h3>
          <span className={styles.progressCount}>
            {completedSteps.size} / {setupSteps.length}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${isComplete ? styles.progressComplete : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className={styles.stepsList}>
        {setupSteps.map((step) => {
          const isExpanded = expandedStep === step.id;
          const isCompleted = completedSteps.has(step.id);

          return (
            <div
              key={step.id}
              className={`${styles.step} ${isCompleted ? styles.completed : ''}`}
            >
              <button
                type="button"
                className={styles.stepHeader}
                onClick={() => toggleStep(step.id)}
              >
                <span className={styles.stepNumber}>{step.id}</span>
                <span className={styles.stepIcon}>{step.icon}</span>
                <div className={styles.stepTitleWrap}>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepBrief}>
                    {step.brief}
                    {step.playerDependent && ' (зависит от кол-ва игроков)'}
                  </p>
                </div>
                <span
                  className={`${styles.stepToggle} ${isExpanded ? styles.expanded : ''}`}
                >
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className={styles.stepContent}>
                  <ul className={styles.stepDetails}>
                    {step.details.map((detail) => (
                      <li key={detail} className={styles.stepDetail}>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isCompleted}
                      onChange={(e) =>
                        toggleCompleted(
                          step.id,
                          e as unknown as React.MouseEvent,
                        )
                      }
                    />
                    Шаг выполнен
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completedSteps.size > 0 && (
        <button
          type="button"
          className={styles.resetButton}
          onClick={resetProgress}
        >
          🔄 Сбросить прогресс
        </button>
      )}

      {isComplete && (
        <div className={styles.tipsBox} style={{ marginTop: '2rem' }}>
          <h4 className={styles.tipsTitle}>🎉 Подготовка завершена!</h4>
          <p style={{ margin: 0, color: '#b0b0b0' }}>
            Все шаги выполнены. Теперь вы готовы начать приключение в
            Преисподней!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameSetup;
