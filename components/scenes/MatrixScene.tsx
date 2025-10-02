import React, { useRef, useEffect } from 'react';
import { HeadPosition } from '../../types';
import { useSmoothedValue } from '../../hooks/useSmoothedValue';

interface SceneProps {
  headPosition: HeadPosition;
}

const MAX_ROTATION = 18;

const MatrixScene: React.FC<SceneProps> = ({ headPosition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothedX = useSmoothedValue(headPosition.x);
  const smoothedY = useSmoothedValue(headPosition.y);

  const rotateY = smoothedX * MAX_ROTATION;
  const rotateX = -smoothedY * MAX_ROTATION;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if(!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    let frameId: number;
    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#0F0';
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
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
    </div>
  );
};

export default MatrixScene;
