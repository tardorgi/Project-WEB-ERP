import { useRef } from 'react';

export function useDragScroll() {
  const scrollRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    dragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseLeave = () => {
    dragging.current = false;
    scrollRef.current.style.cursor = 'grab';
  };

  const onMouseUp = () => {
    dragging.current = false;
    scrollRef.current.style.cursor = 'grab';
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1; // velocidade
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return {
    scrollRef,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
  };
}
