import React from 'react';
import { HeadPosition, SceneType } from '../types';
import InfinityMirrorScene from './scenes/InfinityMirrorScene';
import PondScene from './scenes/PondScene';

interface SceneProps {
  headPosition: HeadPosition;
  scene: SceneType;
}

const Scene: React.FC<SceneProps> = ({ headPosition, scene }) => {
  const renderScene = () => {
    switch (scene) {
      case 'pond':
        return <PondScene headPosition={headPosition} />;
      case 'mirror':
      default:
        return <InfinityMirrorScene headPosition={headPosition} />;
    }
  };

  return <>{renderScene()}</>;
};

export default Scene;