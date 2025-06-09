'use client'

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TestConnection() {
  const [docs, setDocs] = useState<any[]>([]);
  const [status, setStatus] = useState('Cargando...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'test'));
        const data = snapshot.docs.map(doc => doc.data());
        setDocs(data);
        setStatus('✅ Conectado correctamente a Firebase');
        console.log('Datos de prueba:', data);
      } catch (error) {
        setStatus('❌ Error al conectar con Firebase');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-2 text-cyan-400">{status}</h2>
      <ul className="list-disc pl-5">
        {docs.map((doc, index) => (
          <li key={index}>{JSON.stringify(doc)}</li>
        ))}
      </ul>
    </div>
  );
}
