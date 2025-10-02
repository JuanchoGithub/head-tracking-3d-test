import React from 'react';
import { SceneType } from '../types';

interface SceneSelectorProps {
  currentScene: SceneType;
  onSceneChange: (scene: SceneType) => void;
}

const scenes: { id: SceneType; name: string }[] = [
  { id: 'mirror', name: 'Infinity Mirror' },
  { id: 'pond', name: 'Koi Pond' },
];

const SceneSelector: React.FC<SceneSelectorProps> = ({ currentScene, onSceneChange }) => {
  return (
    <div className="absolute top-4 left-4 z-50 bg-gray-900/50 backdrop-blur-md p-2 rounded-lg border border-sky-500/20">
      <div className="flex flex-col gap-1">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSceneChange(scene.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              currentScene === scene.id
                ? 'bg-sky-500/80 text-white shadow-md shadow-sky-500/20'
                : 'text-sky-300/70 hover:bg-sky-500/20 hover:text-sky-200'
            }`}
          >
            {scene.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SceneSelector;