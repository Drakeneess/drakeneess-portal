'use client';

import { useEffect, useState } from 'react';
import '../../styles/datastory.css';
import VolverInicioButton from '@/components/VolverInicioButton';

type Relato = {
  titulo: string;
  ruta: string;
};

export default function DataStoryIndex() {
  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/data/historias.json')
      .then((res) => res.json())
      .then(setRelatos);
  }, []);

  useEffect(() => {
    if (selected) {
      fetch(selected)
        .then((res) => res.text())
        .then(setHtmlContent);
    }
  }, [selected]);

  return (
    <main className="datastory-container">
      <div className="abyss-gradient" />
      <div className="volver-wrapper">
        <VolverInicioButton />
    </div>

      <h1 className="datastory-title">Historias con Datos</h1>

      {!selected ? (
        <ul className="datastory-list">
          {relatos.map((relato, index) => (
            <li key={index}>
              <button
                className="relato-button"
                style={{ animationDelay: `${0.2 * index}s` }}
                onClick={() => setSelected(relato.ruta)}
              >
                {relato.titulo}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div
            className="datastory-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="relato-button" onClick={() => setSelected(null)}>
              Volver al índice
            </button>
          </div>
        </>
      )}
    </main>
  );
}
