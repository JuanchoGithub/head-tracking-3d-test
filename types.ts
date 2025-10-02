export interface HeadPosition {
  x: number; // Normalized from -1 (left) to 1 (right)
  y: number; // Normalized from -1 (top) to 1 (bottom)
}

export enum AppState {
  Idle,
  Loading,
  Tracking,
  Error,
}

// Add Shape Detection API types for FaceDetector to the global scope
// This avoids TypeScript errors for this modern, but not universally typed, API.

// Fix: Moved FaceDetector and related types into the `declare global` block to make them globally available.
// Since this file is a module (it uses 'export'), declarations must be inside `declare global` to be truly global.
declare global {
  // Type for the face-api.js library when used as a fallback
  const faceapi: any;

  interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  interface DetectedFace {
    boundingBox: BoundingBox;
    landmarks: {
      type: 'eye' | 'mouth' | 'nose';
      locations: { x: number; y: number }[];
    }[];
  }

  // Fix: Removed redundant `declare` modifier. `declare global` provides an ambient context already.
  class FaceDetector {
    constructor(options?: { fastMode?: boolean });
    detect(image: ImageBitmapSource): Promise<DetectedFace[]>;
  }

  interface Window {
    FaceDetector: typeof FaceDetector;
  }
}
