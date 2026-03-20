import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const isMobile = window.innerWidth < 768;
      const threshold = isMobile ? vh * 4 : vh * 2;
      const scrollingUp = y < lastY.current;

      setVisible(y > threshold && scrollingUp);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-24 right-4 z-40 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-90 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default ScrollToTop;
