import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import styles from './Counter.module.css';
import { CounterViewModel } from './counter.view-model';

/**
 * Counter - компонент счётчика, демонстрирующий MVVM паттерн.
 *
 * View (этот компонент):
 * - Только отображение данных из ViewModel
 * - Вызов методов ViewModel при действиях пользователя
 * - Минимум логики
 *
 * ViewModel (CounterViewModel):
 * - Хранение состояния (count, step)
 * - Логика изменения состояния (increment, decrement)
 * - Вычисляемые значения (doubled)
 */
export const Counter = observer(() => {
  const vm = useMemo(() => new CounterViewModel(), []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Counter (MVVM Example)</h2>

      <div className={styles.display}>
        <span className={styles.count}>{vm.count}</span>
        <span className={styles.doubled}>× 2 = {vm.doubled}</span>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={vm.decrement}
          aria-label="Decrease"
        >
          −
        </button>

        <button
          type="button"
          className={styles.buttonReset}
          onClick={vm.reset}
          aria-label="Reset"
        >
          Reset
        </button>

        <button
          type="button"
          className={styles.button}
          onClick={vm.increment}
          aria-label="Increase"
        >
          +
        </button>
      </div>

      <div className={styles.stepControl}>
        <label htmlFor="step">Step:</label>
        <input
          id="step"
          type="number"
          min="1"
          value={vm.step}
          onChange={(e) => vm.setStep(Number(e.target.value))}
          className={styles.stepInput}
        />
      </div>

      <div className={styles.status}>
        {vm.isPositive && <span className={styles.positive}>Positive</span>}
        {vm.isNegative && <span className={styles.negative}>Negative</span>}
        {vm.count === 0 && <span className={styles.zero}>Zero</span>}
      </div>
    </div>
  );
});

export default Counter;
