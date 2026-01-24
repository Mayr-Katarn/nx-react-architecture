import { useState } from 'react';
import type { Hero } from '../../data/types';
import styles from './HeroCard.module.css';

interface HeroCardProps {
  hero: Hero;
}

export const HeroCard = ({ hero }: HeroCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`${styles.cardContainer} ${isExpanded ? styles.expanded : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
        style={{ '--hero-color': hero.color } as React.CSSProperties}
      >
        {/* Лицевая сторона */}
        <div className={styles.cardFront}>
          <div className={styles.cardHeader}>
            <span className={styles.heroIcon}>{hero.icon}</span>
            <div className={styles.heroInfo}>
              <h3 className={styles.heroName}>{hero.name}</h3>
              <span className={styles.heroClass}>{hero.classNameRu}</span>
            </div>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.stat}>
              <span className={styles.statIcon}>❤️</span>
              <span className={styles.statValue}>{hero.health}</span>
              <span className={styles.statLabel}>Здоровье</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>💧</span>
              <span className={styles.statValue}>{hero.mana}</span>
              <span className={styles.statLabel}>Мана</span>
            </div>
          </div>

          <div className={styles.abilities}>
            <div className={styles.ability}>
              <span className={styles.abilityIcon}>🌙</span>
              <div className={styles.abilityContent}>
                <span className={styles.abilityLabel}>Сумрачная способность</span>
                <p className={styles.abilityText}>{hero.shadowAbility}</p>
              </div>
            </div>

            <div className={styles.ability}>
              <span className={styles.abilityIcon}>⚔️</span>
              <div className={styles.abilityContent}>
                <span className={styles.abilityLabel}>Героическая способность</span>
                <p className={styles.abilityText}>{hero.heroicAbility}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.flipButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(true);
            }}
          >
            🔄 Механика класса
          </button>
        </div>

        {/* Обратная сторона */}
        <div className={styles.cardBack}>
          <div className={styles.cardHeader}>
            <span className={styles.heroIcon}>{hero.icon}</span>
            <div className={styles.heroInfo}>
              <h3 className={styles.heroName}>{hero.name}</h3>
              <span className={styles.heroClass}>{hero.classNameRu}</span>
            </div>
          </div>

          <div className={styles.mechanicSection}>
            <h4 className={styles.mechanicTitle}>⚙️ Особая механика</h4>
            <p className={styles.mechanicText}>{hero.specialMechanic}</p>
          </div>

          <div className={styles.classFeatures}>
            <h4 className={styles.featuresTitle}>📋 Особенности класса</h4>
            <ClassFeatures heroClass={hero.class} />
          </div>

          <button
            type="button"
            className={styles.flipButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
          >
            🔄 Характеристики
          </button>
        </div>
      </div>
    </div>
  );
};

const ClassFeatures = ({ heroClass }: { heroClass: Hero['class'] }) => {
  const features: Record<Hero['class'], string[]> = {
    berserker: [
      '3 стойки с уникальными эффектами',
      'Жетоны ярости (макс. 7)',
      'Получение ярости от 🎲 врагов',
      'Смена стойки за 1 ярость',
    ],
    paladin: [
      'Жетоны освящения (до 3)',
      'Благословение навыков',
      'Эффекты в освящённых зонах',
      'Защита союзников',
    ],
    shaman: [
      '4 планшета стихий',
      'Огненный и ледяной духи',
      'Постоянные способности стихий',
      'Призыв духов за ману',
    ],
    rogue: [
      'Мешок воровских инструментов',
      '24 жетона плута',
      'Яд для врагов',
      'Эффекты сумрака',
    ],
    wizard: [
      'Амулет с 4 секторами',
      'Маркер готовности заклинаний',
      'Поворот за 1 ману',
      'Улучшение базовых заклинаний',
    ],
    ranger: [
      '14 карт стрел',
      'Раскрытие при дальней атаке',
      'Различные эффекты стрел',
      'Бонус к движению',
    ],
  };

  return (
    <ul className={styles.featuresList}>
      {features[heroClass].map((feature) => (
        <li key={feature} className={styles.featureItem}>
          {feature}
        </li>
      ))}
    </ul>
  );
};

export default HeroCard;
