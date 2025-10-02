import React from 'react';
import { HeadPosition } from '../../types';
import { useSmoothedValue } from '../../hooks/useSmoothedValue';

interface SceneProps {
  headPosition: HeadPosition;
}

const MAX_ROTATION = 12;

const LilypadSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="#4A794A">
        <path d="M50 0 C 22.38 0 0 22.38 0 50 C 0 77.62 22.38 100 50 100 C 77.62 100 100 77.62 100 50 C 100 22.38 77.62 0 50 0 Z M 50 10 C 72.09 10 90 27.91 90 50 C 90 62.45 82.6 73.55 71.5 80.5 L 50 50 L 50 10 Z" />
    </svg>
);

const FishSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 150 70" className={className}>
        <defs>
            <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#ff8c00', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <path d="M10 35 Q 30 10, 75 20 T 140 35 Q 120 60, 75 50 T 10 35" fill="url(#fishGradient)" />
        <circle cx="125" cy="32" r="2" fill="black" />
    </svg>
);


const PondScene: React.FC<SceneProps> = ({ headPosition }) => {
  const smoothedX = useSmoothedValue(headPosition.x, 0.05);
  const smoothedY = useSmoothedValue(headPosition.y, 0.05);

  const rotateY = -smoothedX * MAX_ROTATION;
  const rotateX = smoothedY * MAX_ROTATION;

  return (
    <div
      className="w-full h-full overflow-hidden bg-[#2a3a3f]"
      style={{ 
        perspective: '1500px',
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformOrigin: 'center top',
        }}
      >
        {/* Pond Floor */}
        <div 
            className="absolute top-1/2 left-1/2 w-[150%] h-[150%]"
            style={{
                transform: 'translateX(-50%) translateY(-50%) translateZ(-500px)',
                background: 'radial-gradient(ellipse at center, #8A7F70 0%, #5E564E 100%)',
            }}
        >
            {/* Algae */}
            <div className="absolute w-40 h-32 bg-green-900/60 rounded-full blur-sm" style={{ top: '20%', left: '30%'}}></div>
            <div className="absolute w-32 h-24 bg-green-900/50 rounded-full blur-sm" style={{ top: '60%', left: '70%'}}></div>
            <div className="absolute w-24 h-20 bg-green-900/60 rounded-full blur-md" style={{ top: '75%', left: '15%'}}></div>

            {/* Fish */}
            <div className="absolute w-32" style={{ top: '30%', left: '60%', transform: 'translateZ(50px) rotate(20deg)'}}><FishSVG /></div>
            <div className="absolute w-24" style={{ top: '65%', left: '25%', transform: 'translateZ(30px) rotate(-110deg)'}}><FishSVG /></div>

        </div>

        {/* Water Tint Layer */}
         <div 
            className="absolute top-1/2 left-1/2 w-full h-full bg-cyan-800/20 backdrop-blur-sm"
            style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(100px)' }}
        ></div>

        {/* Lilypad 1 */}
        <div className="absolute w-48 h-48" style={{ top: '20%', left: '15%', transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'translateZ(100px)'}}><LilypadSVG /></div>
            <div 
                className="absolute top-1/2 left-1/2 bg-green-900/50 w-1"
                style={{
                    height: '600px', // Surface(100) to Floor(-500)
                    transformOrigin: 'top',
                    transform: 'translateX(-50%) translateZ(100px) rotateX(-90deg)'
                }}
            />
        </div>

        {/* Lilypad 2 */}
        <div className="absolute w-32 h-32" style={{ top: '55%', left: '40%', transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'translateZ(100px)'}}><LilypadSVG /></div>
            <div 
                className="absolute top-1/2 left-1/2 bg-green-900/50 w-0.5"
                style={{
                    height: '600px', // Surface(100) to Floor(-500)
                    transformOrigin: 'top',
                    transform: 'translateX(-50%) translateZ(100px) rotateX(-90deg)'
                }}
            />
        </div>

        {/* Lilypad 3 */}
        <div className="absolute w-40 h-40" style={{ top: '30%', left: '70%', transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'translateZ(100px)'}}><LilypadSVG /></div>
            <div 
                className="absolute top-1/2 left-1/2 bg-green-900/50 w-1"
                style={{
                    height: '600px', // Surface(100) to Floor(-500)
                    transformOrigin: 'top',
                    transform: 'translateX(-50%) translateZ(100px) rotateX(-90deg)'
                }}
            />
        </div>

      </div>
    </div>
  );
};

export default PondScene;