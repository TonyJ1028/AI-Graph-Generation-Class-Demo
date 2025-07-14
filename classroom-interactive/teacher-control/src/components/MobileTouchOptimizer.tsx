'use client';

import { useEffect, useRef } from 'react';

interface MobileTouchOptimizerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileTouchOptimizer({ children, className = '' }: MobileTouchOptimizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent default touch behaviors that might interfere with scrolling
    const handleTouchStart = (e: TouchEvent) => {
      // Allow normal touch behavior for form elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent horizontal scrolling on vertical scroll areas
      const target = e.target as HTMLElement;
      const scrollContainer = target.closest('.overflow-y-auto');
      
      if (scrollContainer && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - (touch as any).startX || 0);
        const deltaY = Math.abs(touch.clientY - (touch as any).startY || 0);
        
        // If it's more horizontal than vertical movement, prevent it
        if (deltaX > deltaY && deltaX > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Add haptic feedback simulation for buttons
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        target.classList.add('haptic-light');
        setTimeout(() => {
          target.classList.remove('haptic-light');
        }, 50);
      }
    };

    // Add passive event listeners for better performance
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`mobile-touch-optimized ${className}`}
      style={{
        touchAction: 'pan-y pinch-zoom',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  );
}
