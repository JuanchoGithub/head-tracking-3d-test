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

  const tunnelWidth = '70vw';
  const tunnelHeight = '70vh';
  const tunnelDepth = NUM_LAYERS * DEPTH_SPACING;

  const baseGridStyles: React.CSSProperties = {
      position: 'absolute',
      backgroundImage: `
        linear-gradient(to right, rgba(72, 187, 255, 0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(72, 187, 255, 0.15) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
  };

  const floorCeilingGridStyles: React.CSSProperties = {
      ...baseGridStyles,
      width: tunnelWidth,
      height: `${tunnelDepth}px`,
  };
  
  const wallGridStyles: React.CSSProperties = {
      ...baseGridStyles,
      width: `${tunnelDepth}px`,
      height: tunnelHeight,
  };


  return (
    <div
      className="w-full h-full bg-black"
      style={{ perspective: '1000px' }}
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
          transformOrigin: 'center center',
        }}
      >
        {/* Grid Floor */}
        <div
            className="absolute top-1/2 left-1/2"
            style={{
                ...floorCeilingGridStyles,
                maskImage: 'linear-gradient(to bottom, white 25%, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, white 25%, transparent 85%)',
                transform: `translateX(-50%) translateY(calc(${tunnelHeight} / 2)) rotateX(90deg)`,
                transformOrigin: 'top center',
            }}
        />
        {/* Grid Ceiling */}
        <div
            className="absolute top-1/2 left-1/2"
            style={{
                ...floorCeilingGridStyles,
                // Mask fades into the distance (towards element's top)
                maskImage: 'linear-gradient(to top, white 25%, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to top, white 25%, transparent 85%)',
                transform: `translateX(-50%) translateY(calc(-${tunnelHeight} / 2)) rotateX(-90deg)`,
                transformOrigin: 'bottom center',
            }}
        />
        {/* Grid Left Wall */}
        <div
            className="absolute top-1/2 left-1/2"
            style={{
                ...wallGridStyles,
                // Mask fades into the distance (towards element's left)
                maskImage: 'linear-gradient(to left, white 25%, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to left, white 25%, transparent 85%)',
                transform: `translateY(-50%) translateX(calc(-${tunnelWidth} / 2)) rotateY(90deg)`,
                transformOrigin: 'right center',
            }}
        />
        {/* Grid Right Wall */}
        <div
            className="absolute top-1/2 left-1/2"
            style={{
                ...wallGridStyles,
                // Mask fades into the distance (towards element's right)
                maskImage: 'linear-gradient(to right, white 25%, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to right, white 25%, transparent 85%)',
                transform: `translateY(-50%) translateX(calc(${tunnelWidth} / 2)) rotateY(-90deg)`,
                transformOrigin: 'left center',
            }}
        />

        {/* Glowing Frames */}
        {Array.from({ length: NUM_LAYERS }).map((_, i) => {
            const opacity = 1 - (i / NUM_LAYERS) * 0.9;
            return (
                <div
                    key={i}
                    className="absolute top-1/2 left-1/2 border-2 rounded-3xl"
                    style={{
                        width: tunnelWidth,
                        height: tunnelHeight,
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