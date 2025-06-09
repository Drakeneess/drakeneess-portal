'use client';

// DrakeneessPage.tsx
import { useState } from 'react';
import '../../styles/extradrake.css';
import VolverInicioButton from '../../components/VolverInicioButton';
import RelatoIndice from './components/RelatoIndice';
import RelatoDetalle from './components/RelatoDetalle';

export default function DrakeneessPage() {
  const [relatoId, setRelatoId] = useState<string | null>(null);
  const [mostrarUIFinal, setMostrarUIFinal] = useState(false);

  return (
    <main className="relatos-container">
      <div className="bruma-negra" />

      {!relatoId ? (
        <>
          <VolverInicioButton />
          <h1 className="relatos-titulo">El Extraño Mundo de Drakeneess</h1>
          <RelatoIndice onSelect={setRelatoId} />
        </>
      ) : (
        <>
          <RelatoDetalle id={relatoId} onFinish={() => {
            console.log("Callback recibido en DrakeneessPage");
            setMostrarUIFinal(true);
          }} />

          {mostrarUIFinal && (
            <div className="ui-final">
              <button className="volver-btn" onClick={() => {
                setRelatoId(null);
                setMostrarUIFinal(false);
              }}>
                Volver al índice
              </button>
              {/* Aquí puedes agregar más controles si deseas */}
            </div>
          )}
        </>
      )}
    </main>
  );
}

