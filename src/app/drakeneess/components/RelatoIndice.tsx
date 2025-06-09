'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Relato = {
  id: string;
  titulo: string;
};

type Props = {
  onSelect: (relatoId: string) => void;
};

export default function RelatoIndice({ onSelect }: Props) {
  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatos = async () => {
      const q = query(collection(db, 'poemas'), orderBy('titulo'));
      const snapshot = await getDocs(q);
      const lista: Relato[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        titulo: doc.data().titulo
      }));
      setRelatos(lista);
      setLoading(false);
    };

    fetchRelatos();
  }, []);

  if (loading) return <p>Cargando relatos...</p>;

  return (
    <ul className="relatos-lista">
      {relatos.map((relato) => (
        <li
          key={relato.id}
          className="relato-item"
          onClick={() => onSelect(relato.id)}
        >
          {relato.titulo}
        </li>
      ))}
    </ul>
  );
}
