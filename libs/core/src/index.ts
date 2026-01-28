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
// Store Types
export type {
  AlertConfig,
  AlertType,
  AssetInfo,
  ComponentPosition,
  ComponentRef,
  ComponentSize,
  ModalConfig,
  TechScreenConfig,
  TechScreenType,
} from './stores';
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
  ModalType,
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

// ViewModels
export { AppViewModelBase } from './view-models';
