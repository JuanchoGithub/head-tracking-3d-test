import React from 'react';
import { HeadPosition } from '../../types';
import { useSmoothedValue } from '../../hooks/useSmoothedValue';

interface SceneProps {
  headPosition: HeadPosition;
}

const MAX_ROTATION = 20; // Max rotation in degrees
const NUM_LAYERS = 20;
const DEPTH_SPACING = 120;

const InfinityMirrorScene: React.FC<SceneProps> = ({ headPosition }) => {
  const smoothedX = useSmoothedValue(headPosition.x);
  const smoothedY = useSmoothedValue(headPosition.y);

  const rotateY = -smoothedX * MAX_ROTATION;
  const rotateX = smoothedY * MAX_ROTATION;

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-black"
      style={{ perspective: '600px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {Array.from({ length: NUM_LAYERS }).map((_, i) => {
            const opacity = 1 - (i / NUM_LAYERS) * 0.9;
            return (
                <div
                    key={i}
                    className="absolute top-1/2 left-1/2 border-2 rounded-3xl"
                    style={{
                        width: '70vw',
                        height: '70vh',
                        borderColor: `rgba(72, 187, 255, ${opacity})`,
                        boxShadow: `0 0 15px rgba(72, 187, 255, ${opacity * 0.7})`,
                        transform: `translateX(-50%) translateY(-50%) translateZ(${-i * DEPTH_SPACING}px)`,
                        opacity: opacity,
                    }}
                />
            )
        })}
      </div>
    </div>
  );
};

export default InfinityMirrorScene;