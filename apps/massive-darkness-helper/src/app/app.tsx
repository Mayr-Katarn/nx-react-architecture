import { observer, useAppStore } from '@nx-react-architecture/core';
import { useState } from 'react';
import {
  EnemyCard,
  GamePhases,
  GameSetup,
  HeroActions,
  HeroesSection,
  QuickRules,
  ScenarioGenerator,
} from '../components';
import { bosses, mobs, roamingMonsters } from '../data';
import styles from './app.module.css';

type TabId =
  | 'rules'
  | 'actions'
  | 'heroes'
  | 'enemies'
  | 'phases'
  | 'reference'
  | 'scenarios';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'rules', label: 'Правила', icon: '📜' },
  { id: 'scenarios', label: 'Сценарии', icon: '🎲' },
  { id: 'actions', label: 'Действия', icon: '🎯' },
  { id: 'heroes', label: 'Герои', icon: '🎭' },
  { id: 'enemies', label: 'Враги', icon: '👹' },
  { id: 'phases', label: 'Фазы', icon: '🔄' },
  { id: 'reference', label: 'Справочник', icon: '📚' },
];

/**
 * Главный компонент приложения Massive Darkness Helper.
 * Помощник для настольной игры "Кромешная Тьма: Преисподня"
 */
export const App = observer(() => {
  const [activeTab, setActiveTab] = useState<TabId>('rules');
  const appStore = useAppStore();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚔️</span>
            <div className={styles.logoText}>
              <h1 className={styles.title}>Кромешная Тьма</h1>
              <span className={styles.subtitle}>Преисподня</span>
            </div>
          </div>
          <p className={styles.tagline}>Помощник для настольной игры</p>
        </div>
      </header>

      <nav className={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.navIcon}>{tab.icon}</span>
            <span className={styles.navLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {activeTab === 'rules' && <RulesSection />}
        {activeTab === 'scenarios' && <ScenarioGenerator />}
        {activeTab === 'actions' && <HeroActions />}
        {activeTab === 'heroes' && <HeroesSection />}
        {activeTab === 'enemies' && <EnemiesSection />}
        {activeTab === 'phases' && <GamePhases />}
        {activeTab === 'reference' && <QuickRules />}
      </main>

      <footer className={styles.footer}>
        <p>
          Massive Darkness 2: Hellscape © CMON. Это неофициальный фанатский
          помощник.
        </p>
        <p className={styles.tech}>
          Powered by <strong>React</strong> + <strong>MobX</strong> +{' '}
          <strong>Nx</strong>
        </p>
      </footer>
    </div>
  );
});

const RulesSection = () => {
  const [showSetup, setShowSetup] = useState(false);

  return (
    <div className={styles.section}>
      <div className={styles.welcomeCard}>
        <h2 className={styles.sectionTitle}>
          🏰 Добро пожаловать в Преисподню
        </h2>
        <p className={styles.welcomeText}>
          <strong>«Кромешная тьма: Преисподняя»</strong> — это кооперативная
          игра для 1-6 игроков, где вы берёте на себя роли Светоносных —
          избранных героев, обученных бороться с нарастающей Тьмой.
        </p>
      </div>

      {/* Переключатель между обзором и подготовкой */}
      <div className={styles.filterButtons}>
        <button
          type="button"
          className={`${styles.filterBtn} ${!showSetup ? styles.active : ''}`}
          onClick={() => setShowSetup(false)}
        >
          📖 Обзор игры
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${showSetup ? styles.active : ''}`}
          onClick={() => setShowSetup(true)}
        >
          📋 Подготовка к игре
        </button>
      </div>

      {!showSetup ? (
        <>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewIcon}>🎯</span>
              <h3>Цель игры</h3>
              <p>
                Выполните задачу приключения до того, как Тьма поглотит героев.
                Исследуйте подземелья, сражайтесь с монстрами и находите
                сокровища.
              </p>
            </div>

            <div className={styles.overviewCard}>
              <span className={styles.overviewIcon}>👥</span>
              <h3>Игроки</h3>
              <p>
                1-6 игроков. Каждый управляет уникальным героем с особыми
                способностями и механиками класса.
              </p>
            </div>

            <div className={styles.overviewCard}>
              <span className={styles.overviewIcon}>🎲</span>
              <h3>Механики</h3>
              <p>
                Кубики атаки и защиты, сумрачные способности в тёмных зонах,
                повышение уровня и сбор экипировки.
              </p>
            </div>

            <div className={styles.overviewCard}>
              <span className={styles.overviewIcon}>⚡</span>
              <h3>Победа и поражение</h3>
              <p>
                Победа — выполнение условия приключения. Поражение — если нет
                жетонов искры жизни при оглушении героя.
              </p>
            </div>
          </div>

          <div className={styles.storyCard}>
            <h3 className={styles.storyTitle}>📖 Предыстория</h3>
            <p className={styles.storyText}>
              Минуло десять лет после первого вторжения Кромешной тьмы.
              Светоносные основали гильдию героев для защиты мира. Но демоны и
              ангелы хлынули сквозь новые разломы между измерениями. Кромешная
              тьма вернулась, и теперь героям предстоит спуститься в саму
              Преисподнюю, чтобы найти источник Тьмы и покончить с ней раз и
              навсегда.
            </p>
          </div>
        </>
      ) : (
        <GameSetup />
      )}
    </div>
  );
};

const EnemiesSection = () => {
  const [enemyFilter, setEnemyFilter] = useState<
    'all' | 'mob' | 'roaming' | 'boss'
  >('all');

  const filteredEnemies = {
    all: [...mobs, ...roamingMonsters, ...bosses],
    mob: mobs,
    roaming: roamingMonsters,
    boss: bosses,
  }[enemyFilter];

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>👹 Враги подземелья</h2>

      <div className={styles.filterButtons}>
        <button
          type="button"
          className={`${styles.filterBtn} ${enemyFilter === 'all' ? styles.active : ''}`}
          onClick={() => setEnemyFilter('all')}
        >
          Все
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${enemyFilter === 'mob' ? styles.active : ''}`}
          onClick={() => setEnemyFilter('mob')}
        >
          🗡️ Отряды
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${enemyFilter === 'roaming' ? styles.active : ''}`}
          onClick={() => setEnemyFilter('roaming')}
        >
          🐉 Бродячие монстры
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${enemyFilter === 'boss' ? styles.active : ''}`}
          onClick={() => setEnemyFilter('boss')}
        >
          💀 Вожаки
        </button>
      </div>

      <div className={styles.enemiesGrid}>
        {filteredEnemies.map((enemy) => (
          <EnemyCard key={enemy.id} enemy={enemy} />
        ))}
      </div>
    </div>
  );
};

export default App;
