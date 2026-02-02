import { useState } from 'react';
import { heroes } from '../../data/heroes';
import type { Hero } from '../../data/types';
import styles from './HeroCard.module.css';

type TabId = 'abilities' | 'mechanic' | 'components' | 'tips';

interface HeroCardProps {
  hero?: Hero;
}

/**
 * Полная секция героев с выбором и детальным просмотром
 */
export const HeroesSection = () => {
  const [selectedHero, setSelectedHero] = useState<Hero>(heroes[0]);
  const [activeTab, setActiveTab] = useState<TabId>('abilities');

  return (
    <div className={styles.heroesLayout}>
      {/* Список героев (левая панель) */}
      <div className={styles.heroList}>
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className={`${styles.heroListItem} ${selectedHero.id === hero.id ? styles.active : ''}`}
            style={{ '--hero-color': hero.color } as React.CSSProperties}
            onClick={() => setSelectedHero(hero)}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedHero(hero)}
            role="button"
            tabIndex={0}
          >
            <span className={styles.heroListIcon}>{hero.icon}</span>
            <div className={styles.heroListInfo}>
              <h4 className={styles.heroListName}>{hero.name}</h4>
              <span className={styles.heroListClass}>{hero.classNameRu}</span>
            </div>
            <div className={styles.heroListStats}>
              <span className={styles.heroListStat}>❤️ {hero.health}</span>
              <span className={styles.heroListStat}>💧 {hero.mana}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Детальная панель героя (правая сторона) */}
      <HeroDetailPanel
        hero={selectedHero}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

interface HeroDetailPanelProps {
  hero: Hero;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const HeroDetailPanel = ({
  hero,
  activeTab,
  onTabChange,
}: HeroDetailPanelProps) => {
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'abilities', label: 'Способности', icon: '⚔️' },
    { id: 'mechanic', label: 'Механика', icon: '⚙️' },
    { id: 'components', label: 'Компоненты', icon: '📦' },
    { id: 'tips', label: 'Советы', icon: '💡' },
  ];

  return (
    <div
      className={styles.heroDetail}
      style={{ '--hero-color': hero.color } as React.CSSProperties}
    >
      {/* Заголовок героя */}
      <div className={styles.heroHeader}>
        <div className={styles.heroHeaderContent}>
          <span className={styles.heroIconLarge}>{hero.icon}</span>
          <div className={styles.heroTitleBlock}>
            <h2 className={styles.heroName}>{hero.name}</h2>
            <span className={styles.heroClassName}>{hero.classNameRu}</span>
            <p className={styles.heroDescription}>{hero.description}</p>
          </div>
        </div>
      </div>

      {/* Панель характеристик */}
      <div className={styles.statsBar}>
        <div className={styles.statBlock}>
          <span className={styles.statIcon}>❤️</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{hero.health}</span>
            <span className={styles.statLabel}>Здоровье</span>
          </div>
        </div>
        <div className={styles.statBlock}>
          <span className={styles.statIcon}>💧</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{hero.mana}</span>
            <span className={styles.statLabel}>Мана</span>
          </div>
        </div>
      </div>

      {/* Навигация по вкладкам */}
      <div className={styles.tabsNav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент вкладки */}
      <div className={styles.tabContent}>
        {activeTab === 'abilities' && <AbilitiesTab hero={hero} />}
        {activeTab === 'mechanic' && <MechanicTab hero={hero} />}
        {activeTab === 'components' && <ComponentsTab hero={hero} />}
        {activeTab === 'tips' && <TipsTab hero={hero} />}
      </div>
    </div>
  );
};

const AbilitiesTab = ({ hero }: { hero: Hero }) => (
  <div className={styles.abilitiesGrid}>
    <div className={styles.abilityCard}>
      <div className={styles.abilityIcon}>🌙</div>
      <div className={styles.abilityContent}>
        <span className={styles.abilityLabel}>Сумрачная способность</span>
        <p className={styles.abilityText}>{hero.shadowAbility}</p>
      </div>
    </div>

    <div className={styles.abilityCard}>
      <div className={styles.abilityIcon}>⚔️</div>
      <div className={styles.abilityContent}>
        <span className={styles.abilityLabel}>Героическая способность</span>
        <p className={styles.abilityText}>{hero.heroicAbility}</p>
      </div>
    </div>
  </div>
);

const MechanicTab = ({ hero }: { hero: Hero }) => (
  <>
    <div className={styles.mechanicCard}>
      <h4 className={styles.mechanicTitle}>
        <span>⚙️</span> Особая механика класса
      </h4>
      <p className={styles.mechanicText}>{hero.specialMechanic}</p>
    </div>

    <div className={styles.skillsSection}>
      <h4 className={styles.sectionTitle}>
        <span>📜</span> Навыки 1-го уровня на выбор
      </h4>
      <div className={styles.skillsList}>
        {hero.startingSkills.map((skill) => (
          <div key={skill} className={styles.skillItem}>
            <div className={styles.skillBullet} />
            <span className={styles.skillText}>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  </>
);

const ComponentsTab = ({ hero }: { hero: Hero }) => {
  const getComponentIcon = (component: string): string => {
    if (component.toLowerCase().includes('планшет')) return '📋';
    if (component.toLowerCase().includes('жетон')) return '🪙';
    if (component.toLowerCase().includes('карт')) return '🃏';
    if (component.toLowerCase().includes('мешок')) return '👝';
    if (component.toLowerCase().includes('амулет')) return '📿';
    if (component.toLowerCase().includes('маркер')) return '🎯';
    if (component.toLowerCase().includes('колода')) return '🎴';
    return '📦';
  };

  return (
    <>
      <h4 className={styles.sectionTitle}>
        <span>📦</span> Компоненты для подготовки к игре
      </h4>
      <div className={styles.componentsList}>
        {hero.setupComponents.map((component) => (
          <div key={component} className={styles.componentItem}>
            <span className={styles.componentIcon}>
              {getComponentIcon(component)}
            </span>
            <span className={styles.componentText}>{component}</span>
          </div>
        ))}
      </div>
    </>
  );
};

const TipsTab = ({ hero }: { hero: Hero }) => (
  <>
    <h4 className={styles.sectionTitle}>
      <span>💡</span> Советы по игре за {hero.classNameRu.toLowerCase()}а
    </h4>
    <div className={styles.tipsList}>
      {hero.gameplayTips.map((tip, index) => (
        <div key={tip} className={styles.tipItem}>
          <span className={styles.tipIcon}>
            {index === 0
              ? '⭐'
              : index === 1
                ? '🎯'
                : index === 2
                  ? '💎'
                  : '✨'}
          </span>
          <span className={styles.tipText}>{tip}</span>
        </div>
      ))}
    </div>
  </>
);

/**
 * Компактная карточка героя для использования в других местах
 */
export const HeroCard = ({ hero }: HeroCardProps) => {
  if (!hero) return null;

  return (
    <div
      className={styles.heroListItem}
      style={{ '--hero-color': hero.color } as React.CSSProperties}
    >
      <span className={styles.heroListIcon}>{hero.icon}</span>
      <div className={styles.heroListInfo}>
        <h4 className={styles.heroListName}>{hero.name}</h4>
        <span className={styles.heroListClass}>{hero.classNameRu}</span>
      </div>
      <div className={styles.heroListStats}>
        <span className={styles.heroListStat}>❤️ {hero.health}</span>
        <span className={styles.heroListStat}>💧 {hero.mana}</span>
      </div>
    </div>
  );
};

export default HeroCard;
