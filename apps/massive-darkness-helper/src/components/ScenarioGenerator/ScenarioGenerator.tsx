import { useCallback, useState } from 'react';
import { generateScenario, randomSeed } from '../../data/scenario-generator';
import type {
  DifficultyLevel,
  GeneratedScenario,
  MapLayout,
  MapSize,
  PlacedTile,
  ScenarioConfig,
  TileRole,
} from '../../data/scenario-types';
import styles from './ScenarioGenerator.module.css';

const MAP_SIZE_OPTIONS: { value: MapSize; label: string; desc: string }[] = [
  { value: 'small', label: 'Малая', desc: '2 тайла' },
  { value: 'medium', label: 'Средняя', desc: '3 тайла' },
  { value: 'large', label: 'Большая', desc: '4-5 тайлов' },
];

const DIFFICULTY_OPTIONS: {
  value: DifficultyLevel;
  label: string;
  color: string;
}[] = [
  { value: 'easy', label: 'Легко', color: '#2ecc71' },
  { value: 'normal', label: 'Нормально', color: '#f39c12' },
  { value: 'hard', label: 'Сложно', color: '#e74c3c' },
  { value: 'nightmare', label: 'Кошмар', color: '#8e44ad' },
];

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Легко',
  normal: 'Нормально',
  hard: 'Сложно',
  nightmare: 'Кошмар',
};

const MAP_SIZE_LABELS: Record<MapSize, string> = {
  small: 'Малая',
  medium: 'Средняя',
  large: 'Большая',
};

export const ScenarioGenerator = () => {
  const [seed, setSeed] = useState(() => randomSeed());
  const [mapSize, setMapSize] = useState<MapSize>('medium');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [playerCount, setPlayerCount] = useState(3);
  const [scenario, setScenario] = useState<GeneratedScenario | null>(null);

  const handleGenerate = useCallback(() => {
    const config: ScenarioConfig = {
      seed: seed || randomSeed(),
      mapSize,
      difficulty,
      playerCount,
    };
    if (!seed) {
      setSeed(config.seed);
    }
    setScenario(generateScenario(config));
  }, [seed, mapSize, difficulty, playerCount]);

  const handleRandomSeed = useCallback(() => {
    const newSeed = randomSeed();
    setSeed(newSeed);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>
        {'\uD83C\uDFB2'} Генератор сценариев
      </h2>
      <p className={styles.sectionSubtitle}>
        Создавайте уникальные приключения на основе сида. Один сид — один
        неизменный сценарий.
      </p>

      {/* ===== Config Panel ===== */}
      <div className={styles.configPanel}>
        <div className={styles.configRow}>
          <div className={`${styles.configGroup} ${styles.seedGroup}`}>
            <span className={styles.configLabel}>Сид</span>
            <div className={styles.seedInputRow}>
              <input
                type="text"
                className={styles.seedInput}
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Введите сид..."
                maxLength={32}
              />
              <button
                type="button"
                className={styles.randomBtn}
                onClick={handleRandomSeed}
                title="Случайный сид"
              >
                {'\uD83C\uDFB2'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={styles.configGroup}>
            <span className={styles.configLabel}>Размер карты</span>
            <div className={styles.optionButtons}>
              {MAP_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.optionBtn} ${mapSize === opt.value ? styles.active : ''}`}
                  onClick={() => setMapSize(opt.value)}
                  title={opt.desc}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.configGroup}>
            <span className={styles.configLabel}>Сложность</span>
            <div className={styles.optionButtons}>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.optionBtn} ${difficulty === opt.value ? styles.active : ''}`}
                  onClick={() => setDifficulty(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.configGroup}>
            <span className={styles.configLabel}>Игроки</span>
            <div className={styles.optionButtons}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.playerBtn} ${playerCount === n ? styles.active : ''}`}
                  onClick={() => setPlayerCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.configRow}>
          <button
            type="button"
            className={styles.generateBtn}
            onClick={handleGenerate}
          >
            {'\u2694\uFE0F'} Создать сценарий
          </button>
        </div>
      </div>

      {/* ===== Result ===== */}
      {scenario && <ScenarioResult scenario={scenario} />}
    </div>
  );
};

/* ===== Sub-components ===== */

function ScenarioResult({ scenario }: { scenario: GeneratedScenario }) {
  return (
    <div className={styles.result}>
      {/* Adventure Header */}
      <div className={styles.adventureHeader}>
        <span className={styles.adventureIcon}>{scenario.icon}</span>
        <h3 className={styles.adventureName}>{scenario.name}</h3>
        <p className={styles.adventureNarrative}>{scenario.narrative}</p>
        <div className={styles.adventureMeta}>
          <span className={`${styles.metaTag} ${styles.seedTag}`}>
            {'\uD83C\uDFB2'} {scenario.seed}
          </span>
          <span className={styles.metaTag}>
            {'\uD83D\uDDFA\uFE0F'} {MAP_SIZE_LABELS[scenario.config.mapSize]} (
            {scenario.tiles.length} тайл.)
          </span>
          <span className={styles.metaTag}>
            {'\u2694\uFE0F'} {DIFFICULTY_LABELS[scenario.config.difficulty]}
          </span>
          <span className={styles.metaTag}>
            {'\uD83D\uDC65'} {scenario.config.playerCount} игр.
          </span>
        </div>
      </div>

      {/* Cards grid */}
      <div className={styles.cardsGrid}>
        {/* Visual Map */}
        <MapLayoutView mapLayout={scenario.mapLayout} connections={scenario.mapLayout.connections} />

        {/* Objectives */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>
            <span className={styles.cardIcon}>{'\uD83C\uDFAF'}</span>
            Задачи приключения
          </h4>
          {scenario.objectives.map((obj) => (
            <div key={obj.order} className={styles.objectiveItem}>
              <div className={styles.objectiveNumber}>{obj.order}</div>
              <div className={styles.objectiveContent}>
                <div className={styles.objectiveTitle}>
                  {obj.icon} {obj.title}
                </div>
                <div className={styles.objectiveDesc}>{obj.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Special rules */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>
            <span className={styles.cardIcon}>{'\u2728'}</span>
            Особые правила
          </h4>
          {scenario.specialRules.map((rule) => (
            <div key={rule.name} className={styles.ruleItem}>
              <div className={styles.ruleName}>
                {rule.icon} {rule.name}
              </div>
              <div className={styles.ruleDesc}>{rule.description}</div>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>
            <span className={styles.cardIcon}>{'\uD83C\uDFC6'}</span>
            Условия
          </h4>
          <div className={styles.conditionBlock}>
            <div className={`${styles.conditionLabel} ${styles.victoryLabel}`}>
              {'\u2705'} Победа
            </div>
            <div className={styles.conditionText}>
              {scenario.conditions.victory}
            </div>
          </div>
          <div className={styles.conditionBlock}>
            <div className={`${styles.conditionLabel} ${styles.defeatLabel}`}>
              {'\u274C'} Поражение
            </div>
            <div className={styles.conditionText}>
              {scenario.conditions.defeat}
            </div>
          </div>
        </div>

        {/* Summary token table */}
        <div className={`${styles.card} ${styles.fullWidthCard}`}>
          <h4 className={styles.cardTitle}>
            <span className={styles.cardIcon}>{'\uD83C\uDFAD'}</span>
            Сводная таблица жетонов
          </h4>
          <table className={styles.tokensTable}>
            <thead>
              <tr>
                <th>Жетон</th>
                <th>Всего</th>
              </tr>
            </thead>
            <tbody>
              {scenario.tokens.map((token) => (
                <tr key={token.name}>
                  <td>
                    <span className={styles.tokenName}>
                      <span className={styles.tokenIcon}>{token.icon}</span>
                      {token.name}
                    </span>
                  </td>
                  <td className={styles.tokenCount}>{token.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Difficulty modifiers */}
        <div className={`${styles.card} ${styles.fullWidthCard}`}>
          <h4 className={styles.cardTitle}>
            <span className={styles.cardIcon}>{'\u2699\uFE0F'}</span>
            Модификаторы сложности (
            {DIFFICULTY_LABELS[scenario.config.difficulty]})
          </h4>
          <ul className={styles.modifiersList}>
            {scenario.difficultyModifiers.map((mod) => (
              <li key={mod} className={styles.modifierItem}>
                <span className={styles.modifierBullet}>{'\u25C6'}</span>
                {mod}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ===== Map Layout Visual ===== */

const ROLE_LABELS: Record<TileRole, string> = {
  start: 'Старт',
  middle: 'Зал',
  objective: 'Цель',
  boss: 'Босс',
  exit: 'Выход',
};

const ROLE_CSS: Record<TileRole, string> = {
  start: styles.roleStart,
  middle: styles.roleMiddle,
  objective: styles.roleObjective,
  boss: styles.roleBoss,
  exit: styles.roleExit,
};

const TILE_CELL_CSS: Record<TileRole, string> = {
  start: styles.mapTileCellStart,
  middle: '',
  objective: styles.mapTileCellObjective,
  boss: styles.mapTileCellBoss,
  exit: styles.mapTileCellExit,
};

const DOOR_TYPE_LABELS: Record<string, string> = {
  normal: 'Обычная дверь',
  locked: 'Запертая дверь',
  gate: 'Запечатанные врата',
};

const DOOR_DOT_CSS: Record<string, string> = {
  normal: styles.connectionDotNormal,
  locked: styles.connectionDotLocked,
  gate: styles.connectionDotGate,
};

function MapLayoutView({
  mapLayout,
  connections,
}: {
  mapLayout: MapLayout;
  connections: MapLayout['connections'];
}) {
  const { placedTiles, gridSize } = mapLayout;

  // Строим lookup: "row,col" -> PlacedTile
  const tileMap = new Map<string, PlacedTile>();
  for (const tile of placedTiles) {
    tileMap.set(`${tile.position.row},${tile.position.col}`, tile);
  }

  // Сетка
  const gridCells: (PlacedTile | null)[][] = [];
  for (let r = 0; r < gridSize.rows; r++) {
    const row: (PlacedTile | null)[] = [];
    for (let c = 0; c < gridSize.cols; c++) {
      row.push(tileMap.get(`${r},${c}`) ?? null);
    }
    gridCells.push(row);
  }

  const tileWidth = Math.min(220, Math.floor(700 / gridSize.cols));

  return (
    <div className={`${styles.card} ${styles.mapCard}`}>
      <h4 className={styles.cardTitle}>
        <span className={styles.cardIcon}>{'\uD83D\uDDFA\uFE0F'}</span>
        Карта подземелья ({mapLayout.layoutType})
      </h4>

      <div
        className={styles.mapGrid}
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, ${tileWidth}px)`,
          gridTemplateRows: `repeat(${gridSize.rows}, auto)`,
        }}
      >
        {gridCells.flatMap((row, r) =>
          row.map((tile, c) => {
            const cellKey = tile ? tile.id : `empty-${r}-${c}`;
            return tile ? (
              <MapTileCell key={cellKey} tile={tile} />
            ) : (
              <div
                key={cellKey}
                className={`${styles.mapCell} ${styles.mapCellEmpty}`}
              />
            );
          }),
        )}
      </div>

      {/* Connections */}
      <div className={styles.connectionsLegend}>
        {connections.map((conn) => (
          <div key={`${conn.fromTileId}-${conn.toTileId}`} className={styles.connectionItem}>
            <span
              className={`${styles.connectionDot} ${DOOR_DOT_CSS[conn.doorType]}`}
            />
            <span>
              {conn.fromTileId} {'\u2194'} {conn.toTileId}
            </span>
            <span className={styles.connectionLine}>
              ({DOOR_TYPE_LABELS[conn.doorType]})
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.mapLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.legendStart}`} />
          Старт
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.legendObjective}`} />
          Цель
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.legendBoss}`} />
          Босс
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.legendExit}`} />
          Выход
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.legendMiddle}`} />
          Зал
        </div>
      </div>
    </div>
  );
}

function MapTileCell({ tile }: { tile: PlacedTile }) {
  return (
    <div
      className={`${styles.mapCell} ${styles.mapTileCell} ${TILE_CELL_CSS[tile.role]}`}
    >
      <div className={styles.mapTileHeader}>
        <span className={styles.mapTileId}>{tile.id}</span>
        <span className={styles.mapTileSide}>[{tile.side}]</span>
      </div>
      <span className={`${styles.mapTileRole} ${ROLE_CSS[tile.role]}`}>
        {ROLE_LABELS[tile.role]}
      </span>
      {tile.tokens.length > 0 && (
        <div className={styles.mapTileTokens}>
          {tile.tokens.map((token) => (
            <span key={token.name} className={styles.mapTokenBadge}>
              <span className={styles.mapTokenBadgeIcon}>{token.icon}</span>
              {token.count > 1 && (
                <span className={styles.mapTokenBadgeCount}>
                  {'\u00D7'}
                  {token.count}
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
