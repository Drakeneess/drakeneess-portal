'use client';

import { useEffect, useState } from 'react';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
  points: string;
};

function generatePoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  const sides = 10 + Math.floor(Math.random() * 4); // 5 a 8 lados
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides;
    const r = size * (0.4 + Math.random() * 0.6); // irregularidad
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }).map((_, i) => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.random() * 40 + 15;

    return {
      id: i,
      x,
      y,
      size,
      color: 'rgba(159, 151, 151, 0.5)',
      speed: Math.random() * 0.3 + 0.2,
      direction: Math.random() * 360,
      points: generatePoints(x, y, size),
    };
  });
};

export default function AbyssParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateParticles(50));

    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => {
          const newX = (p.x + Math.cos(p.direction) * p.speed + window.innerWidth) % window.innerWidth;
          const newY = (p.y + Math.sin(p.direction) * p.speed + window.innerHeight) % window.innerHeight;
          return {
            ...p,
            x: newX,
            y: newY,
            points: translatePoints(p.points, newX - p.x, newY - p.y),
          };
        })
      );
    }, 33); // ~30 FPS

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[40]">
      <svg className="w-full h-full">
        {particles.map(p => (
          <polygon
            key={p.id}
            points={p.points}
            fill={p.color}
            opacity={0.19}
          />
        ))}
      </svg>
    </div>
  );
}

function translatePoints(points: string, dx: number, dy: number): string {
  return points
    .split(' ')
    .map(point => {
      const [x, y] = point.split(',').map(Number);
      return `${x + dx},${y + dy}`;
    })
    .join(' ');
}
