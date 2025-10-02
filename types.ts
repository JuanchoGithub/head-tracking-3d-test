export interface HeadPosition {
  x: number;
  y: number;
}

export enum AppState {
  Idle,
  Loading,
  Tracking,
  Error,
}

export type SceneType = 'mirror' | 'pond';