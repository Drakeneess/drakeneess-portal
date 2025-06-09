'use client';

import { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ajusta la ruta si es diferente
import '../../styles/bitacora.css';
import VolverInicioButton from '../../components/VolverInicioButton';

// Define el tipo del objeto bookRef
interface PageFlipRef {
  pageFlip: () => {
    flip: (index: number) => void;
  };
}

type Entry = {
  titulo: string;
  pensamiento: string;
  emocionInicial?: string;
  horaInicio?: string;
  emocionFinal?: string;
  acontecimiento?: string;
  horaFinal?: string;
  fecha: string;
};


export default function BitacoraPage() {
  const bookRef = useRef<PageFlipRef | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const goToEntry = (index: number) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flip(index + 2); // 0 portada, 1 índice
    }
  };

  function parseDateTime(fecha: any, hora: any = 0): Date {
    if (typeof fecha === 'number') {
        const base = new Date(1899, 11, 30); // Excel base date (local)
        const days = Math.floor(fecha);

        const dateOnly = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate() + days
        );

        // Hora como fracción de día
        const timeFraction = typeof hora === 'number' ? hora : 0;
        const totalMinutes = Math.round(timeFraction * 1440); // 1440 min por día
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        dateOnly.setHours(hours);
        dateOnly.setMinutes(minutes);
        dateOnly.setSeconds(0);
        dateOnly.setMilliseconds(0);

        return dateOnly;
    }

    // Firestore u otros
    const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha?.toDate?.();
    if (!dateObj || isNaN(dateObj.getTime())) return new Date(0);

    if (typeof hora === 'string' && hora.includes(':')) {
        const [h, m] = hora.split(':').map(Number);
        dateObj.setHours(h);
        dateObj.setMinutes(m);
        dateObj.setSeconds(0);
        dateObj.setMilliseconds(0);
    }

    return dateObj;
    }


    function formatDateTime(date: Date, type: 'fecha' | 'hora' | 'ambos' = 'ambos') {
        if (!(date instanceof Date) || isNaN(date.getTime())) return '-';

        const optionsFecha = { dateStyle: 'medium' as const };
        const optionsHora = { hour: '2-digit' as const, minute: '2-digit' as const, hour12: false };

        if (type === 'fecha') {
            return new Intl.DateTimeFormat('es-BO', optionsFecha).format(date);
        }

        if (type === 'hora') {
            return new Intl.DateTimeFormat('es-BO', optionsHora).format(date);
        }

        return new Intl.DateTimeFormat('es-BO', {
            ...optionsFecha,
            ...optionsHora,
        }).format(date);
    }


  useEffect(() => {
    const fetchEntries = async () => {
    try {
        const q = query(collection(db, 'bitacora'), orderBy('fecha'));
        const snapshot = await getDocs(q);

        const data = snapshot.docs
        .map(doc => doc.data() as Entry)
        .sort((a, b) => {
            const dateA = parseDateTime(a.fecha, a.horaInicio);
            const dateB = parseDateTime(b.fecha, b.horaInicio);
            return dateA.getTime() - dateB.getTime();
        });

        setEntries(data);
            } catch (err) {
                console.error("Error al obtener la bitácora:", err);
                setError("No se pudo cargar la bitácora.");
            } finally {
                setLoading(false);
            }
            };

            fetchEntries();
    }, []);

  if (loading) return <div className="bitacora-container">Cargando páginas...</div>;
  if (error) return <div className="bitacora-container">{error}</div>;

  return (
    <div className="ambient-light">
      <main className="bitacora-book-container">
        <HTMLFlipBook
          ref={bookRef}
          width={450}
          height={600}
          size="fixed"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1536}
          drawShadow={true}
          showCover={true}
          className="bitacora-book"
          style={{ margin: 'auto' }}
          startPage={0}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          maxShadowOpacity={0.5}
          mobileScrollSupport={true}
        >
          {/* Portada */}
          <div className="bitacora-page portada">
            <h1>Bitácora del Abismo</h1>
            <p className="autor">por Drakeneess</p>
            <VolverInicioButton/>
          </div>

          {/* Índice */}
          <div className="bitacora-page indice">
            <h2>Índice</h2>
            <ul>
              {entries.map((entry, i) => (
                <li key={i}>
                  <button
                    onClick={() => goToEntry(i)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#800000'
                    }}
                  >
                    <strong>{i + 1}.</strong> {entry.titulo}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Entradas */}
          {entries.map((entry, i) => (
            <div key={i} className="bitacora-page">
                <h2>{entry.titulo}</h2>
                <p>
                    <strong>Fecha:</strong>{' '}
                    {formatDateTime(parseDateTime(entry.fecha), 'fecha')}
                </p>
                {entry.emocionInicial && <p><strong>Emoción inicial:</strong> {entry.emocionInicial}</p>}
                {entry.horaInicio !== undefined && (
                <p>
                    <strong>Hora de inicio:</strong>{' '}
                    {formatDateTime(parseDateTime(entry.fecha, entry.horaInicio), 'hora')}
                </p>
                )}
                <p><strong>Pensamiento:</strong> {entry.pensamiento}</p>
                {entry.emocionFinal && <p><strong>Emoción final:</strong> {entry.emocionFinal}</p>}
                {entry.acontecimiento && <p><strong>Acontecimiento:</strong> {entry.acontecimiento}</p>}
                {entry.horaFinal !== undefined &&
                (entry.horaFinal !== '00:00' && entry.horaFinal !== '') && (
                    <p>
                    <strong>Hora final:</strong>{' '}
                    {formatDateTime(parseDateTime(entry.fecha, entry.horaFinal), 'hora')}
                    </p>
                )}
                <button
                    onClick={() => goToEntry(-1)} // usamos -1 como índice especial para ir al índice
                    style={{
                        marginTop: '1.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#800000',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                    >
                    ← Volver al índice
                </button>
            </div>
            ))}

          {/* Contraportada */}
          <div className="bitacora-page contraportada">
            <h2>Gracias por hojear esta sombra</h2>
            <p>Este libro no termina... solo cierra los ojos un momento.</p>
            <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>Nos volveremos a encontrar.</p>
          </div>
        </HTMLFlipBook>
      </main>
    </div>
  );
}
