import { useState } from 'react';
import type { DiceType, Enemy } from '../../data/types';
import styles from './EnemyCard.module.css';

interface EnemyCardProps {
  enemy: Enemy;
}

const diceColors: Record<DiceType, string> = {
  yellow: '#ffc107',
  orange: '#ff9800',
  blue: '#2196f3',
  purple: '#9c27b0',
  black: '#424242',
};

const typeLabels: Record<Enemy['type'], { label: string; color: string }> = {
  mob: { label: 'Отряд', color: '#4caf50' },
  roaming: { label: 'Бродячий монстр', color: '#ff9800' },
  boss: { label: 'Вожак', color: '#f44336' },
};

export const EnemyCard = ({ enemy }: EnemyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const typeInfo = typeLabels[enemy.type];

  return (
    <div
      className={`${styles.card} ${styles[enemy.type]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--type-color': typeInfo.color } as React.CSSProperties}
    >
      <div
        className={`${styles.glowEffect} ${isHovered ? styles.active : ''}`}
      />

      <div className={styles.header}>
        <div className={styles.typeTag}>{typeInfo.label}</div>
        <span className={styles.level}>Уровень {enemy.level}</span>
      </div>

      <div className={styles.iconContainer}>
        <span className={styles.icon}>{enemy.icon}</span>
        <div className={styles.iconGlow} />
      </div>

      <h3 className={styles.name}>{enemy.name}</h3>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>❤️ Здоровье</span>
          <span className={styles.statValue}>{enemy.health}</span>
        </div>
      </div>

      <div className={styles.diceSection}>
        <div className={styles.diceRow}>
          <span className={styles.diceLabel}>⚔️ Атака:</span>
          <div className={styles.diceList}>
            {enemy.attackDice.map((dice, idx) => (
              <span
                key={`${dice}-${idx}`}
                className={styles.dice}
                style={{ backgroundColor: diceColors[dice] }}
                title={dice}
              />
            ))}
          </div>
        </div>
        <div className={styles.diceRow}>
          <span className={styles.diceLabel}>🛡️ Защита:</span>
          <div className={styles.diceList}>
            {enemy.defenseDice.map((dice, idx) => (
              <span
                key={`${dice}-${idx}`}
                className={styles.dice}
                style={{ backgroundColor: diceColors[dice] }}
                title={dice}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.abilitySection}>
        <span className={styles.abilityIcon}>✨</span>
        <p className={styles.abilityText}>{enemy.specialAbility}</p>
      </div>
    </div>
  );
};

export default EnemyCard;
