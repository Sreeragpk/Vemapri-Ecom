import React, { useState, useEffect } from 'react';

const ScrollProgress = ({ 
  variant = 'gradient', // 'gradient' | 'solid' | 'dual' | 'animated'
  position = 'top', // 'top' | 'bottom'
  height = '1' // Tailwind height class number
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      const windowHeight = 
        document.documentElement.scrollHeight - 
        document.documentElement.clientHeight;
      
      if (windowHeight > 0) {
        const scrolled = (window.scrollY / windowHeight) * 100;
        setScrollProgress(scrolled);
        setIsVisible(window.scrollY > 50);
      }
    };

    updateScrollProgress();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  const variants = {
    gradient: {
      background: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
    },
    solid: {
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.3)',
    },
    dual: {
      background: 'linear-gradient(90deg, #f59e0b 0%, #0f172a 100%)',
      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
    },
    animated: {
      background: 'linear-gradient(90deg, #f59e0b, #f97316, #ef4444, #f59e0b)',
      backgroundSize: '200% 100%',
      animation: 'gradientShift 3s ease infinite',
      boxShadow: '0 2px 10px rgba(245, 158, 11, 0.5)',
    }
  };

  const positionClass = position === 'bottom' ? 'bottom-0' : 'top-0';
  const heightClass = `h-${height}`;

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      
      <div 
        className={`fixed ${positionClass} left-0 ${heightClass} z-[60] transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          width: `${scrollProgress}%`,
          ...variants[variant]
        }}
      />
    </>
  );
};

export default ScrollProgress;