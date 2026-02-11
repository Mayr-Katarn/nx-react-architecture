import { useState } from 'react';
import { gamePhases } from '../../data/game-phases';
import type { GamePhase } from '../../data/types';
import styles from './GamePhases.module.css';

export const GamePhases = () => {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🔄 Структура раунда</h2>
      <p className={styles.subtitle}>
        Каждый раунд игры состоит из 4 фаз, выполняемых по порядку
      </p>

      <div className={styles.phasesCircle}>
        <div className={styles.centerCircle}>
          <span className={styles.centerIcon}>⚔️</span>
          <span className={styles.centerText}>Раунд</span>
        </div>

        {gamePhases.map((phase, index) => (
          <PhaseNode
            key={phase.id}
            phase={phase}
            index={index}
            isActive={activePhase === phase.id}
            onClick={() =>
              setActivePhase(activePhase === phase.id ? null : phase.id)
            }
          />
        ))}

        {/* Connecting lines */}
        <svg className={styles.connections} viewBox="0 0 400 400">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4a1942" />
              <stop offset="50%" stopColor="#9b59b6" />
              <stop offset="100%" stopColor="#4a1942" />
            </linearGradient>
          </defs>
          {/* Arrows between phases */}
          <path
            d="M 200 60 A 140 140 0 0 1 340 200"
            className={styles.connectionPath}
          />
          <path
            d="M 340 200 A 140 140 0 0 1 200 340"
            className={styles.connectionPath}
          />
          <path
            d="M 200 340 A 140 140 0 0 1 60 200"
            className={styles.connectionPath}
          />
          <path
            d="M 60 200 A 140 140 0 0 1 200 60"
            className={styles.connectionPath}
          />
        </svg>
      </div>

      {/* Phase details panel */}
      <div className={styles.detailsContainer}>
        {activePhase ? (
          <PhaseDetails phase={gamePhases.find((p) => p.id === activePhase)!} />
        ) : (
          <div className={styles.selectHint}>
            <span className={styles.hintIcon}>👆</span>
            <p>Выберите фазу для просмотра деталей</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface PhaseNodeProps {
  phase: GamePhase;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const phasePositionClasses = [
  styles.phaseNodeTop,
  styles.phaseNodeRight,
  styles.phaseNodeBottom,
  styles.phaseNodeLeft,
] as const;

const PhaseNode = ({ phase, index, isActive, onClick }: PhaseNodeProps) => {
  return (
    <button
      type="button"
      className={`${styles.phaseNode} ${phasePositionClasses[index]} ${
        isActive ? styles.active : ''
      }`}
      style={{ '--phase-color': phase.color } as React.CSSProperties}
      onClick={onClick}
    >
      <div className={styles.phaseNumber}>{phase.number}</div>
      <span className={styles.phaseIcon}>{phase.icon}</span>
      <span className={styles.phaseName}>{phase.name}</span>
    </button>
  );
};

interface PhaseDetailsProps {
  phase: GamePhase;
}

const PhaseDetails = ({ phase }: PhaseDetailsProps) => {
  return (
    <div
      className={styles.details}
      style={{ '--phase-color': phase.color } as React.CSSProperties}
    >
      <div className={styles.detailsHeader}>
        <span className={styles.detailsIcon}>{phase.icon}</span>
        <div>
          <h3 className={styles.detailsTitle}>
            {phase.number}. {phase.name}
          </h3>
          <p className={styles.detailsDescription}>{phase.description}</p>
        </div>
      </div>

      <ul className={styles.detailsList}>
        {phase.details.map((detail) => (
          <li key={detail} className={styles.detailItem}>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamePhases;
