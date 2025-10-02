import React from 'react';
import { HeadPosition } from '../../types';
import { useSmoothedValue } from '../../hooks/useSmoothedValue';

interface SceneProps {
  headPosition: HeadPosition;
}

const MAX_ROTATION = 18; // Max rotation in degrees

const DefaultScene: React.FC<SceneProps> = ({ headPosition }) => {
  const smoothedX = useSmoothedValue(headPosition.x);
  const smoothedY = useSmoothedValue(headPosition.y);

  const rotateY = -smoothedX * MAX_ROTATION;
  const rotateX = smoothedY * MAX_ROTATION;

  return (
    <div
      className="w-full h-full"
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformOrigin: 'center top',
        }}
      >
        {/* Backmost Layer */}
        <div
          className="absolute top-1/2 left-1/2 w-[120%] h-[120%] p-8 border border-sky-900/50 rounded-3xl bg-gray-800/10 backdrop-blur-sm"
          style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(-400px)' }}
        >
           <img src="https://picsum.photos/800/600" alt="background" className="w-full h-full object-cover rounded-2xl opacity-40"/>
        </div>
        
        {/* Mid Layer */}
        <div
          className="absolute top-1/2 left-1/2 w-full h-full p-8 border border-sky-500/30 rounded-3xl bg-sky-900/10 backdrop-blur-md flex items-center justify-center text-center shadow-2xl shadow-sky-900/50"
          style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(0px)' }}
        >
            <div className="flex flex-col items-center">
                 <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500">
                    True3D
                </h1>
                <p className="mt-2 text-lg text-sky-200/80">No glasses required.</p>
            </div>
        </div>

        {/* Front Layer */}
         <div
          className="absolute top-1/2 left-1/2 w-1/2 h-1/2 p-4 border-2 border-sky-400/80 rounded-2xl bg-sky-800/20 flex items-end justify-end shadow-[0_0_30px_rgba(72,187,255,0.4)]"
          style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(200px)' }}
        >
           <p className="text-xs text-sky-300/70 p-2">UI Layer 01</p>
        </div>

        {/* Floating element */}
         <div
          className="absolute top-[20%] left-[80%] w-24 h-24 border border-blue-500/50 rounded-full bg-blue-900/30 flex items-center justify-center"
          style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(120px)' }}
        >
           <div className="w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(100,200,255,0.8)]"></div>
        </div>

        {/* Fore-foreground "glass" layer */}
        <div
          className="absolute top-1/2 left-1/2 w-[95%] h-[95%] border border-sky-500/10 rounded-3xl bg-transparent"
          style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(300px)' }}
        >
        </div>
      </div>
    </div>
  );
};

export default DefaultScene;