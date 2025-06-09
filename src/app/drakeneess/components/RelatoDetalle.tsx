'use client';

import { useEffect, useRef, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

type Props = {
  id: string;
  onFinish?: () => void;
};

type RelatoData = {
  titulo: string;
  url: string;
  texto: string[];
};

export default function RelatoDetalle({ id, onFinish }: Props) {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [texto, setTexto] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  const [estrofaIndex, setEstrofaIndex] = useState(0);
  const [versoIndex, setVersoIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [visibleEstrofas, setVisibleEstrofas] = useState<string[][]>([]);

  const [completo, setCompleto] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fetchRelato = async () => {
      const docRef = doc(db, 'poemas', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as RelatoData;
        setTitulo(data.titulo);
        setUrl(data.url);
        const estrofas = data.texto.map((estrofa: string) => estrofa.split('<§>'));
        setTexto(estrofas);
        setVisibleEstrofas([[""]]);
      }
      setLoading(false);
    };

    fetchRelato();
  }, [id]);

  useEffect(() => {
    if (!scrollRef.current || !cursorRef.current || completo) return;

    const container = scrollRef.current;
    const cursor = cursorRef.current;

    const containerRect = container.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();

    const offset = cursorRect.top - containerRect.top;
    const middle = container.clientHeight / 2;

    container.scrollTop += offset - middle + cursor.offsetHeight / 2;
  }, [visibleEstrofas, completo]);

  useEffect(() => {
    if (loading || texto.length === 0 || completo) return;

    const currentEstrofa = texto[estrofaIndex];
    const currentVerso = currentEstrofa?.[versoIndex] ?? "";

    if (charIndex < currentVerso.length) {
      const timer = setTimeout(() => {
        const updated = [...visibleEstrofas];
        updated[estrofaIndex] = [...updated[estrofaIndex]];
        updated[estrofaIndex][versoIndex] = currentVerso.slice(0, charIndex + 1);
        setVisibleEstrofas(updated);
        setCharIndex((i) => i + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else {
      if (versoIndex < currentEstrofa.length - 1) {
        const pause = setTimeout(() => {
          const updated = [...visibleEstrofas];
          updated[estrofaIndex][versoIndex + 1] = "";
          setVisibleEstrofas(updated);
          setVersoIndex((v) => v + 1);
          setCharIndex(0);
        }, 300);
        return () => clearTimeout(pause);
      } else if (estrofaIndex < texto.length - 1) {
        const longerPause = setTimeout(() => {
          const updated = [...visibleEstrofas];
          updated[estrofaIndex + 1] = [""];
          setVisibleEstrofas(updated);
          setEstrofaIndex((e) => e + 1);
          setVersoIndex(0);
          setCharIndex(0);
        }, 1200);
        return () => clearTimeout(longerPause);
      } else {
        setCompleto(true);
        onFinish?.();
        console.log("Fin del relato, mostrando UI final");
      }
    }

    if (scrollRef.current && !completo) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [
    charIndex,
    versoIndex,
    estrofaIndex,
    texto,
    loading,
    visibleEstrofas,
    completo,
    onFinish,
  ]);

  if (loading) return <p className="verso">Cargando relato...</p>;

  return (
    <div className="relato-detalle minimal">
      <h2 className="titulo-centrado">{titulo}</h2>

      <div className="poema-scroll-wrapper" ref={scrollRef}>
        <section className="poema-cuerpo">
          {visibleEstrofas.map((estrofa, i) => (
            <div key={i} className="estrofa">
              {estrofa.map((verso, j) => (
                <p
                  key={j}
                  className="verso"
                  ref={i === estrofaIndex && j === versoIndex ? cursorRef : null}
                >
                  {verso}
                  {(i === estrofaIndex && j === versoIndex && charIndex % 2 === 0) && (
                    <span className="cursor">|</span>
                  )}
                </p>
              ))}

              {(i === estrofaIndex && !completo) && (
                <button
                  className="boton-skip-visible"
                  onClick={() => {
                    setVisibleEstrofas(texto);
                    setCompleto(true);
                    onFinish?.();
                  }}
                >
                  saltar relato
                </button>
              )}
            </div>
          ))}
        </section>
      </div>

      {completo && url && (
        <Image
          src={url}
          alt={titulo}
          className="poema-imagen"
          width={800}
          height={600}
        />
      )}
    </div>
  );
}
