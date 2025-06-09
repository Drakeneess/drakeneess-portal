'use client';

import { useRouter } from 'next/navigation';

export default function VolverInicioButton({ texto = '← Volver al inicio' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')} // Cambia '/' si tu página principal es otra ruta
      style={{
        marginTop: '2rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        backgroundColor: '#111',
        color: '#fdfdfd',
        border: '2px solid #800000',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#800000')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#111')}
    >
      {texto}
    </button>
  );
}
