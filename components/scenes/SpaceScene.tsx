import React, { useMemo } from 'react';
import { HeadPosition } from '../../types';
import { useSmoothedValue } from '../../hooks/useSmoothedValue';

interface SceneProps {
  headPosition: HeadPosition;
}

const MAX_ROTATION = 15;

// Function to generate random stars for the box-shadow property
const generateStars = (count: number, width: number, height: number) => {
  let boxShadow = '';
  for (let i = 0; i < count; i++) {
    boxShadow += `${Math.random() * width}px ${Math.random() * height}px #FFF${i === count - 1 ? '' : ','} `;
  }
  return boxShadow;
};

const StarLayer: React.FC<{ size: number; count: number; translateZ: number; animationDuration: string }> = 
({ size, count, translateZ, animationDuration }) => {
    const starStyle = useMemo(() => ({
        width: `${size}px`,
        height: `${size}px`,
        background: 'transparent',
        boxShadow: generateStars(count, 3000, 3000),
        borderRadius: '50%',
        animation: `animStar ${animationDuration} linear infinite`,
    }), [size, count, animationDuration]);

    return (
        <div 
          className="absolute top-1/2 left-1/2"
          style={{ 
            transform: `translateX(-50%) translateY(-50%) translateZ(${translateZ}px)`,
            width: '3000px',
            height: '3000px',
          }}
        >
            <div style={starStyle}></div>
            <div style={{ ...starStyle, transform: 'translateX(3000px)'}}></div>
             <style>{`
                @keyframes animStar {
                    from { transform: translateX(0px); }
                    to { transform: translateX(-3000px); }
                }
            `}</style>
        </div>
    );
}

const SpaceScene: React.FC<SceneProps> = ({ headPosition }) => {
  const smoothedX = useSmoothedValue(headPosition.x, 0.05);
  const smoothedY = useSmoothedValue(headPosition.y, 0.05);

  const rotateY = -smoothedX * MAX_ROTATION;
  const rotateX = smoothedY * MAX_ROTATION;

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden"
      style={{ 
        perspective: '1000px',
        background: 'radial-gradient(ellipse at center, #1b2735 0%, #090a0f 100%)'
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <StarLayer size={1} count={600} translateZ={-800} animationDuration="250s" />
        <StarLayer size={1} count={400} translateZ={-500} animationDuration="200s" />
        <StarLayer size={2} count={200} translateZ={-250} animationDuration="120s" />
        <StarLayer size={3} count={50}  translateZ={-100} animationDuration="60s" />
      </div>
    </div>
  );
};

export default SpaceScene;