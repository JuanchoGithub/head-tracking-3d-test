import React from 'react';
import { HeadPosition } from '../../types';
import { useSmoothedValue } from '../../hooks/useSmoothedValue';
import { useWindowSize } from '../../hooks/useWindowSize';

interface SceneProps {
  headPosition: HeadPosition;
}

const MAX_ROTATION = 20; // Max rotation in degrees
const NUM_LAYERS = 20;
const DEPTH_SPACING = 120;
const SCALE_FACTOR = 1.15;

const InfinityMirrorScene: React.FC<SceneProps> = ({ headPosition }) => {
  const { width, height } = useWindowSize();
  const smoothedX = useSmoothedValue(headPosition.x);
  const smoothedY = useSmoothedValue(headPosition.y);

  const screenAspectRatio = width > 0 && height > 0 ? width / height : 1;
  const horizontalMultiplier = screenAspectRatio > 1 ? 1 + (screenAspectRatio - 1) * 0.5 : 1;
  const verticalMultiplier = screenAspectRatio < 1 ? 1 + (1 / screenAspectRatio - 1) * 0.5 : 1;

  const rotateY = -smoothedX * MAX_ROTATION * horizontalMultiplier;
  const rotateX = smoothedY * MAX_ROTATION * verticalMultiplier;

  return (
    <div
      className="w-full h-full bg-black"
      style={{ perspective: '600px' }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% {
            filter: brightness(0.9);
          }
          50% {
            filter: brightness(1.3);
          }
        }
      `}</style>
      <div
        className="relative w-full h-full transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${SCALE_FACTOR}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformOrigin: 'center top',
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
                        boxShadow: `0 0 20px rgba(72, 187, 255, ${opacity * 0.7})`,
                        transform: `translateX(-50%) translateY(-50%) translateZ(${-i * DEPTH_SPACING}px)`,
                        opacity: opacity,
                        animation: `pulse 4s infinite ease-in-out`,
                        animationDelay: `${i * 0.1}s`,
                    }}
                />
            )
        })}
      </div>
    </div>
  );
};

export default InfinityMirrorScene;
