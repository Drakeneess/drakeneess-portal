'use client';

import { useEffect, useState } from 'react';

export default function MouseTorch() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        WebkitMaskImage: `radial-gradient(circle 250px at ${position.x}px ${position.y}px, transparent 0%, black 70%)`,
        maskImage: `radial-gradient(circle 250px at ${position.x}px ${position.y}px, transparent 0%, black 70%)`,
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        mixBlendMode: 'normal',
      }}
    />
  );
}
