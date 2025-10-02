import React, { useRef, useEffect, useCallback, useState } from 'react';
import { HeadPosition } from '../types';

interface HeadTrackerProps {
  onHeadMove: (position: HeadPosition) => void;
  onLoaded: () => void;
  onError: (message: string) => void;
  isVisible: boolean;
  videoWidth?: number;
  videoHeight?: number;
}

const MODEL_URL = 'https://raw.githack.com/justadudewhohacks/face-api.js/master/weights/';

const HeadTracker: React.FC<HeadTrackerProps> = ({
  onHeadMove,
  onLoaded,
  onError,
  isVisible,
  videoWidth = 640,
  videoHeight = 480,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const faceDetector = useRef<FaceDetector | null>(null);
  const [trackerImpl, setTrackerImpl] = useState<'native' | 'fallback' | null>(null);

  const [lastTrackedFace, setLastTrackedFace] = useState<{x: number; y: number; width: number; height: number} | null>(null);

  useEffect(() => {
    const initializeTracker = async () => {
      // Attempt to use the modern, native API first
      if ('FaceDetector' in window) {
        try {
          faceDetector.current = new window.FaceDetector({ fastMode: true });
          setTrackerImpl('native');
          onLoaded();
          return;
        } catch (e) {
          console.warn("Native FaceDetector failed to initialize, trying fallback.", e);
        }
      }

      // Fallback to face-api.js if native API is not supported or failed
      if (typeof faceapi === 'undefined') {
        onError("Your browser is not supported, and the fallback detection library failed to load.");
        return;
      }

      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setTrackerImpl('fallback');
        onLoaded();
      } catch (err) {
        console.error("Error loading face-api.js models:", err);
        onError("Failed to load face detection models. Please check your internet connection and try again.");
      }
    };

    initializeTracker();
  }, [onLoaded, onError]);

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: videoWidth, height: videoHeight },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      onError("Camera access denied. Please enable camera permissions in your browser.");
    }
  }, [videoWidth, videoHeight, onError]);

  const detectFace = useCallback(async () => {
    if (!trackerImpl || !videoRef.current || videoRef.current.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(detectFace);
      return;
    }

    let faceBox: { x: number; y: number; width: number; height: number } | null = null;

    try {
      if (trackerImpl === 'native' && faceDetector.current) {
        const faces = await faceDetector.current.detect(videoRef.current);
        if (faces && faces.length > 0) {
          faceBox = faces[0].boundingBox;
        }
      } else if (trackerImpl === 'fallback') {
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
        if (detection) {
          faceBox = detection.box;
        }
      }

      if (faceBox) {
        setLastTrackedFace(faceBox);
        
        const centerX = faceBox.x + faceBox.width / 2;
        const centerY = faceBox.y + faceBox.height / 2;

        const normalizedX = (centerX / videoWidth - 0.5) * 2;
        const normalizedY = (centerY / videoHeight - 0.5) * 2;
        
        onHeadMove({ x: -normalizedX, y: normalizedY });
      } else {
        setLastTrackedFace(null);
      }
    } catch (err) {
      console.error("Face detection error:", err);
    }
    
    animationFrameId.current = requestAnimationFrame(detectFace);
  }, [trackerImpl, onHeadMove, videoWidth, videoHeight]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (lastTrackedFace) {
        context.strokeStyle = 'rgba(72, 187, 255, 0.8)';
        context.lineWidth = 2;
        context.strokeRect(lastTrackedFace.x, lastTrackedFace.y, lastTrackedFace.width, lastTrackedFace.height);
    }
  }, [lastTrackedFace]);

  useEffect(() => {
    if (!isVisible) return;

    const videoElement = videoRef.current;
    startVideo();
    
    const handleCanPlay = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(detectFace);
    }

    videoElement?.addEventListener('canplay', handleCanPlay);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      videoElement?.removeEventListener('canplay', handleCanPlay);
      if (videoElement?.srcObject) {
        (videoElement.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
      }
    };
  }, [isVisible, startVideo, detectFace]);

  return (
    <div className={`absolute bottom-4 right-4 border border-sky-500/30 rounded-lg overflow-hidden shadow-2xl shadow-sky-900/50 bg-gray-900 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <video
        ref={videoRef}
        width={videoWidth / 3}
        height={videoHeight / 3}
        autoPlay
        muted
        playsInline
        className="transform scaleX(-1)"
      />
      <canvas
        ref={canvasRef}
        width={videoWidth}
        height={videoHeight}
        className="absolute top-0 left-0 w-full h-full transform scaleX(-1)"
      />
    </div>
  );
};

export default HeadTracker;