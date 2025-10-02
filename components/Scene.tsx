import React from 'react';
import { HeadPosition, SceneType } from '../types';
import DefaultScene from './scenes/DefaultScene';
import InfinityMirrorScene from './scenes/InfinityMirrorScene';
import SpaceScene from './scenes/SpaceScene';
import MatrixScene from './scenes/MatrixScene';

interface SceneProps {
  headPosition: HeadPosition;
  scene: SceneType;
}

const Scene: React.FC<SceneProps> = ({ headPosition, scene }) => {
  const renderScene = () => {
    switch (scene) {
      case 'mirror':
        return <InfinityMirrorScene headPosition={headPosition} />;
      case 'space':
        return <SpaceScene headPosition={headPosition} />;
      case 'matrix':
        return <MatrixScene headPosition={headPosition} />;
      case 'default':
      default:
        return <DefaultScene headPosition={headPosition} />;
    }
  };

  return <>{renderScene()}</>;
};

export default Scene;