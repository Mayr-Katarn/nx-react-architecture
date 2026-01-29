# Миграция системы модальных окон: MobX → Zustand

## Обзор изменений

Система модальных окон успешно мигрирована с **MobX** на **Zustand**, сохраняя все функциональные возможности при упрощении кода и улучшении производительности.

## Что изменилось

### 1. **State Management**

#### Было (MobX):
```typescript
// Class-based store
export class ModalStore {
  modals: ModalConfig[] = [];
  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { modals: observable.shallow });
  }

  get currentModal(): ModalConfig | null {
    // ...
  }

  open(config: ModalConfig): void {
    // ...
  }
}

// Доступ через RootStore
const { modalStore } = useRootStore();
```

#### Стало (Zustand):
```typescript
// Function-based store с hooks
export const useModalStore = create<ModalStore>()((set, get) => ({
  modals: [],

  get currentModal() {
    const { modals } = get();
    // ...
  },

  open: (config) => {
    set({ modals: [...get().modals, config] });
  },
}));

// Прямой доступ через hook
const open = useModalStore((state) => state.open);
```

### 2. **Удаление зависимостей**

- ❌ Убрана зависимость от `RootStore`
- ❌ Не требуется `RootStoreProvider`
- ❌ Не нужен `observer` wrapper
- ✅ Store доступен глобально без провайдера

### 3. **Компоненты**

#### ModalLayer

**Было:**
```typescript
import { observer } from 'mobx-react-lite';
import { useModalStore } from '@nx-react-architecture/core';

export const ModalLayer = observer(() => {
  const modalStore = useModalStore();
  const current = modalStore.currentModal;
  // ...
});
```

**Стало:**
```typescript
import { useModalStore } from '@nx-react-architecture/core';

export const ModalLayer = () => {
  const currentModal = useModalStore((state) => state.currentModal);
  const close = useModalStore((state) => state.close);
  // ...
};
```

#### Использование в компонентах

**Было:**
```typescript
import { observer, useRootStore } from '@nx-react-architecture/core';

const Component = observer(() => {
  const { modalStore } = useRootStore();
  
  modalStore.open({
    id: ModalType.CONFIRM,
    component: ConfirmModal,
    priority: ModalPriority.HIGH,
  });
});
```

**Стало:**
```typescript
import { useModalStore } from '@nx-react-architecture/core';

const Component = () => {
  const open = useModalStore((state) => state.open);
  
  open({
    id: ModalType.CONFIRM,
    component: ConfirmModal,
    priority: ModalPriority.HIGH,
  });
};
```

## Преимущества миграции

### 🚀 Производительность

| Метрика | MobX | Zustand | Улучшение |
|---------|------|---------|-----------|
| Bundle size | ~16KB | ~1KB | **-94%** |
| Initial setup | Provider + makeAutoObservable | create() | **Проще** |
| Re-renders | Автоматические через observer | Селекторы (opt-in) | **Контролируемо** |
| DevTools | Нет из коробки | Redux DevTools | **Из коробки** |

### 📦 Простота кода

```typescript
// MobX: ~70 строк с классом, декораторами
class ModalStore {
  constructor() { makeAutoObservable(); }
  // ...
}

// Zustand: ~50 строк с функцией
const useModalStore = create()((set, get) => ({
  // ...
}));
```

### 🎯 Селекторы и оптимизация

```typescript
// Подписка только на нужное значение
const currentModal = useModalStore((state) => state.currentModal);

// Или выбрать несколько
const { open, close } = useModalStore();
```

## Файлы изменены

### Созданы/изменены:

1. **libs/core/src/stores/modal.store.ts** - полностью переписан на Zustand
2. **libs/core/src/stores/root.store.ts** - убран `modalStore`
3. **libs/core/src/stores/index.ts** - обновлены экспорты
4. **libs/core/src/index.ts** - обновлены экспорты
5. **libs/ui/src/components/ModalLayer/ModalLayer.tsx** - убран `observer`, используется Zustand hook
6. **libs/ui/src/components/Modal/Modal.tsx** - обновлён пример в комментариях
7. **apps/web-app/src/app/components/DemoPanel/DemoPanel.tsx** - обновлено использование
8. **apps/web-app/docs/modal-system.md** - полностью переписана документация

### Без изменений:

- **Modal** компонент (UI)
- **Enum** приоритетов и типов
- **Интерфейс** ModalConfig
- **Логика** приоритетов и очереди

## API остался прежним

### Открытие модалки:
```typescript
open({
  id: ModalType.CONFIRM,
  component: ConfirmModal,
  props: { message: 'Are you sure?' },
  priority: ModalPriority.HIGH,
});
```

### Закрытие:
```typescript
close(ModalType.CONFIRM);
closeCurrent();
closeAll();
```

### Проверка:
```typescript
isOpen(ModalType.CONFIRM);
```

## Что НЕ сломалось

✅ Приоритеты модалок  
✅ Очередь модальных окон  
✅ Enum типов (ModalType)  
✅ Enum приоритетов (ModalPriority)  
✅ Callbacks (onClose)  
✅ Props модалок  
✅ Overlay и Escape закрытие  
✅ Вся бизнес-логика  

## Шаги для использования

### 1. Импорт hook (вместо useRootStore)

```diff
- import { observer, useRootStore } from '@nx-react-architecture/core';
+ import { useModalStore, ModalType, ModalPriority } from '@nx-react-architecture/core';
```

### 2. Использование в компоненте

```diff
- const Component = observer(() => {
-   const { modalStore } = useRootStore();
-   modalStore.open({ ... });
- });

+ const Component = () => {
+   const open = useModalStore((state) => state.open);
+   open({ ... });
+ };
```

### 3. Убрать observer (если только для модалок)

```diff
- import { observer } from '@nx-react-architecture/core';
- export const Component = observer(() => { ... });

+ export const Component = () => { ... };
```

## Рекомендации по оптимизации

### ✅ Хорошо:
```typescript
// Селектор только для нужного значения
const currentModal = useModalStore((state) => state.currentModal);
```

### ⚠️ Осторожно:
```typescript
// Подписка на весь store (может вызвать лишние рендеры)
const store = useModalStore();
```

### 🎯 Оптимально:
```typescript
// Computed values и actions отдельно
const currentModal = useModalStore((state) => state.currentModal);
const hasModals = useModalStore((state) => state.hasModals);
const { open, close } = useModalStore();
```

## Совместимость

- ✅ React 19
- ✅ TypeScript 5.9+
- ✅ Zustand 5.0.10+
- ✅ Vite 7
- ✅ Существующий код (с минимальными изменениями)

## Дальнейшие шаги

Рассмотреть миграцию других stores на Zustand:
- [ ] AlertStore
- [ ] PreloaderStore
- [ ] TechScreenStore
- [ ] ComponentRegistryStore

Или оставить MobX для stores с более сложной логикой.

## Ресурсы

- [Zustand Документация](https://zustand.docs.pmnd.rs/)
- [Zustand vs MobX](https://zustand.docs.pmnd.rs/getting-started/comparison)
- [modal-system.md](./modal-system.md) - обновлённая документация

---

**Статус**: ✅ Миграция завершена  
**Дата**: 2026-01-27  
**Версия**: 1.0.0
