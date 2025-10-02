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

const LilyFlowerSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <defs>
            <radialGradient id="petalGradient" cx="50%" cy="100%" r="100%" fx="50%" fy="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF'}} />
                <stop offset="80%" style={{stopColor: '#F8BBD0'}} />
            </radialGradient>
        </defs>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
             <path key={angle} d="M50 10 C 40 30, 40 50, 50 60 C 60 50, 60 30, 50 10 Z" fill="url(#petalGradient)" transform={`rotate(${angle} 50 50)`} transform-origin="50 50" />
        ))}
        <circle cx="50" cy="50" r="8" fill="#FFD700" />
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
      style={{ perspective: '1500px' }}
    >
        <style>{`
            @keyframes caustics {
                0% { background-position: 0% 0%; }
                100% { background-position: -200% -200%; }
            }
            @keyframes swim1 {
                0% { transform: translate(0px, 0px) rotate(20deg) translateZ(50px); }
                25% { transform: translate(150px, 80px) rotate(0deg) translateZ(45px); }
                50% { transform: translate(80px, 200px) rotate(-20deg) translateZ(55px); }
                75% { transform: translate(-80px, 120px) rotate(10deg) translateZ(50px); }
                100% { transform: translate(0px, 0px) rotate(20deg) translateZ(50px); }
            }
            @keyframes swim2 {
                0% { transform: translate(0, 0) rotate(-110deg) translateZ(30px); }
                33% { transform: translate(-120px, 90px) rotate(-90deg) translateZ(35px); }
                66% { transform: translate(60px, 150px) rotate(-130deg) translateZ(25px); }
                100% { transform: translate(0, 0) rotate(-110deg) translateZ(30px); }
            }
        `}</style>
        {/* SVG filter for water distortion */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                <filter id="water-distortion">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.04" numOctaves="2" seed="2" stitchTiles="stitch">
                        <animate attributeName="baseFrequency" dur="15s" keyTimes="0;0.5;1" values="0.01 0.04;0.02 0.06;0.01 0.04" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="15" />
                </filter>
            </defs>
        </svg>

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
                transformStyle: 'preserve-3d',
            }}
        >
            <div className="absolute w-40 h-32 bg-[#4a4a4a] rounded-full shadow-inner" style={{ top: '20%', left: '30%', transform: 'translateZ(15px) rotateX(20deg)' }}></div>
            <div className="absolute w-60 h-48 bg-[#3d3d3d] rounded-full shadow-inner" style={{ bottom: '10%', left: '10%', transform: 'translateZ(5px)' }}></div>
            <div className="absolute w-24 h-20 bg-[#555] rounded-full shadow-inner" style={{ top: '15%', right: '15%', transform: 'translateZ(20px)' }}></div>
            <div className="absolute rounded-full bg-gradient-to-r from-[#5a3a22] to-[#492e1a]" style={{ width: '400px', height: '40px', top: '50%', left: '60%', transform: 'translateZ(30px) rotate(-20deg)' }}></div>
            <div className="absolute w-40 h-32 bg-green-900/50 rounded-full blur-sm" style={{ top: '22%', left: '31%', transform: 'translateZ(16px)'}}></div>
            <div className="absolute w-32 h-24 bg-green-900/40 rounded-full blur-sm" style={{ top: '60%', left: '70%'}}></div>
            <div className="absolute w-24 h-20 bg-green-900/50 rounded-full blur-md" style={{ top: '75%', left: '15%'}}></div>
            <div className="absolute w-32" style={{ top: '30%', left: '60%', animation: 'swim1 18s ease-in-out infinite' }}><FishSVG /></div>
            <div className="absolute w-24" style={{ top: '65%', left: '25%', animation: 'swim2 25s ease-in-out infinite' }}><FishSVG /></div>
        </div>

        {/* Caustic Light Effect */}
         <div 
            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] opacity-20"
            style={{
                transform: 'translateX(-50%) translateY(-50%) translateZ(-400px)',
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px, 60px 60px',
                backgroundPosition: '0 0, 30px 30px',
                animation: 'caustics 10s linear infinite',
            }}
        />

        {/* Depth Fog Layers */}
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-cyan-900/5 backdrop-blur-px" style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(-100px)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-cyan-900/10 backdrop-blur-sm" style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(-300px)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-cyan-900/15 backdrop-blur-md" style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(-450px)' }}></div>


        {/* Water Tint Layer */}
         <div 
            className="absolute top-1/2 left-1/2 w-full h-full bg-cyan-800/20 overflow-hidden"
            style={{ 
                transform: 'translateX(-50%) translateY(-50%) translateZ(100px)',
                filter: 'url(#water-distortion)',
            }}
        >
        </div>

        {/* Lilypad 1 (with flower) */}
        <div className="absolute w-48 h-48" style={{ top: '20%', left: '15%', transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'translateZ(100px)'}}><LilypadSVG /></div>
             <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'translateZ(115px) scale(0.6)'}}><LilyFlowerSVG /></div>
            <div className="absolute top-1/2 left-1/2 bg-gradient-to-t from-green-900/80 to-green-800/70 w-2" style={{ height: '600px', transformOrigin: 'top', transform: 'translateX(-50%) translateZ(100px) rotateX(-90deg)' }} />
        </div>

        {/* Lilypad 2 */}
        <div className="absolute w-32 h-32" style={{ top: '55%', left: '40%', transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'translateZ(100px)'}}><LilypadSVG /></div>
            <div className="absolute top-1/2 left-1/2 bg-gradient-to-t from-green-900/80 to-green-800/70 w-1.5" style={{ height: '600px', transformOrigin: 'top', transform: 'translateX(-50%) translateZ(100px) rotateX(-90deg)' }} />
        </div>

        {/* Lilypad 3 */}
        <div className="absolute w-40 h-40" style={{ top: '30%', left: '70%', transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'translateZ(100px)'}}><LilypadSVG /></div>
            <div className="absolute top-1/2 left-1/2 bg-gradient-to-t from-green-900/80 to-green-800/70 w-2" style={{ height: '600px', transformOrigin: 'top', transform: 'translateX(-50%) translateZ(100px) rotateX(-90deg)' }} />
        </div>

      </div>
    </div>
  );
};

export default PondScene;
