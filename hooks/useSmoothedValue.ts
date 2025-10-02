import { useState, useEffect, useRef } from 'react';

export const useSmoothedValue = (targetValue: number, smoothingFactor = 0.08): number => {
    const [currentValue, setCurrentValue] = useState(targetValue);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const animate = () => {
            setCurrentValue(prev => {
                const diff = targetValue - prev;
                if (Math.abs(diff) < 0.001) {
                    if (animationFrameId.current) {
                        cancelAnimationFrame(animationFrameId.current);
                        animationFrameId.current = null;
                    }
                    return targetValue;
                }
                return prev + diff * smoothingFactor;
            });
            animationFrameId.current = requestAnimationFrame(animate);
        };

        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [targetValue, smoothingFactor]);

    return currentValue;
};
