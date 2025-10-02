import React, { useRef, useEffect } from 'react';
import { HeadPosition } from '../../types';
import { useSmoothedValue } from '../../hooks/useSmoothedValue';

interface SceneProps {
  headPosition: HeadPosition;
}

const MAX_ROTATION = 18;

// Reusable drawing function for the Matrix effect
const setupMatrixCanvas = (canvas: HTMLCanvasElement, options: { fontSize: number, fillStyle: string, clearAlpha: string }) => {
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const alphabet = katakana + latin + nums;

  const { fontSize, fillStyle, clearAlpha } = options;
  const columns = Math.ceil(canvas.width / fontSize);

  const rainDrops: number[] = [];
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
  }

  let frameId: number;
  const draw = () => {
    context.fillStyle = clearAlpha;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = fillStyle;
    context.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
    frameId = requestAnimationFrame(draw);
  };

  draw();

  return () => {
    cancelAnimationFrame(frameId);
  };
};


const MatrixScene: React.FC<SceneProps> = ({ headPosition }) => {
  const canvasRefFore = useRef<HTMLCanvasElement>(null);
  const canvasRefBack = useRef<HTMLCanvasElement>(null);

  const smoothedX = useSmoothedValue(headPosition.x);
  const smoothedY = useSmoothedValue(headPosition.y);

  const rotateY = -smoothedX * MAX_ROTATION;
  const rotateX = smoothedY * MAX_ROTATION;

  // Effect for the foreground canvas
  useEffect(() => {
    if (!canvasRefFore.current) return;
    const cleanup = setupMatrixCanvas(canvasRefFore.current, {
      fontSize: 16,
      fillStyle: '#0F0',
      clearAlpha: 'rgba(0, 0, 0, 0.05)'
    });
    return cleanup;
  }, []);

  // Effect for the background canvas
  useEffect(() => {
    if (!canvasRefBack.current) return;
    const cleanup = setupMatrixCanvas(canvasRefBack.current, {
        fontSize: 12,
        fillStyle: '#0A0', // Darker green
        clearAlpha: 'rgba(0, 0, 0, 0.08)' // Slower fade
    });
    return cleanup;
  }, []);


  return (
    <div
      className="w-full h-full flex items-center justify-center bg-black"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <canvas 
            ref={canvasRefBack} 
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: 'translateZ(-200px)'}}
        />
        <canvas 
            ref={canvasRefFore} 
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: 'translateZ(0px)'}}
        />
      </div>
    </div>
  );
};

export default MatrixScene;