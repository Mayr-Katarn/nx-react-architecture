import { useState } from 'react';
import { diceInfo, quickRules } from '../../data/game-phases';
import styles from './QuickRules.module.css';

export const QuickRules = () => {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <section className={styles.rulesSection}>
        <h2 className={styles.sectionTitle}>📜 Быстрые правила</h2>
        <div className={styles.rulesList}>
          {quickRules.map((rule) => (
            <div
              key={rule.id}
              className={`${styles.ruleCard} ${expandedRule === rule.id ? styles.expanded : ''}`}
              onClick={() =>
                setExpandedRule(expandedRule === rule.id ? null : rule.id)
              }
            >
              <div className={styles.ruleHeader}>
                <span className={styles.ruleIcon}>{rule.icon}</span>
                <h3 className={styles.ruleTitle}>{rule.title}</h3>
                <span
                  className={`${styles.expandIcon} ${expandedRule === rule.id ? styles.rotated : ''}`}
                >
                  ▼
                </span>
              </div>
              <div className={styles.ruleContent}>
                <p>{rule.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.diceSection}>
        <h2 className={styles.sectionTitle}>🎲 Справочник кубиков</h2>
        <div className={styles.diceGrid}>
          {diceInfo.map((dice) => (
            <div
              key={dice.type}
              className={styles.diceCard}
              style={{ '--dice-color': dice.color } as React.CSSProperties}
            >
              <div className={styles.diceVisual}>
                <div className={styles.diceIcon} />
              </div>
              <div className={styles.diceInfo}>
                <h4 className={styles.diceName}>{dice.name}</h4>
                <p className={styles.diceDescription}>{dice.description}</p>
                <div className={styles.diceSymbols}>
                  {dice.symbols.map((symbol) => (
                    <span key={symbol} className={styles.symbol}>
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuickRules;
