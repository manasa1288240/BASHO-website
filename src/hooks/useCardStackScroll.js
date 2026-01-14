import { useEffect, useRef } from 'react';

export function useCardStackScroll() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.card-stack-item');
    if (cards.length === 0) return;

    const handleScroll = () => {
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        
        // Calculate distance from viewport center
        const distance = Math.abs(cardCenter - viewportCenter);
        const maxDistance = window.innerHeight / 2;
        
        // Normalize distance (0 to 1, where 0 is at viewport center)
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        // Scale: cards at viewport center are full size (1), edges are smaller (0.85)
        const scale = 1 - (normalizedDistance * 0.15);
        
        // Opacity: cards at viewport center are full opacity (1), edges are dimmer (0.65)
        const opacity = 1 - (normalizedDistance * 0.35);
        
        // Z-index based on scroll position - cards above have higher z-index
        const zIndex = Math.round(100 - index - normalizedDistance * 10);
        
        card.style.transform = `scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return containerRef;
}


