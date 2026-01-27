// MobX utilities
export {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from 'mobx';
export { observer } from 'mobx-react-lite';

// Config
export { setupMobX } from './config';

// Stores
export {
  // Alert
  AlertStore,
  // App
  AppStore,
  // Component Registry
  ComponentRegistryStore,
  // Modal
  ModalPriority,
  ModalStore,
  // Preloader
  PreloaderStore,
  // Root
  RootStore,
  RootStoreProvider,
  // Tech Screen
  TechScreenStore,
  // Hooks
  useAlertStore,
  useAppStore,
  useComponentRegistry,
  useModalStore,
  usePreloaderStore,
  useRootStore,
  useTechScreenStore,
} from './stores';

// Store Types
export type {
  AlertConfig,
  AlertType,
  AssetInfo,
  ComponentPosition,
  ComponentRef,
  ComponentSize,
  ModalConfig,
  ModalPriorityValue,
  TechScreenConfig,
  TechScreenType,
} from './stores';

// ViewModels
export { AppViewModelBase } from './view-models';
