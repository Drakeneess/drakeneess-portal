'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MouseTorch from '@/components/MouseTorch';
import AbyssParticles from '@/components/AbyssParticles';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <AbyssParticles />
      <MouseTorch />
      <main className="main-container">
        <motion.h1
          className="main-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          El Archivo del Abismo
        </motion.h1>

        <motion.div 
          className="intro-drakeneess"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 3 }}
        >
          Puedes llamarme Drakeneess.<br />
          Aunque ese nombre ya ha muerto muchas veces.<br /><br />
          Converso con el fuego y acecho en la sombra.<br />
          Abro puertas sin marco y camino donde no hay camino.<br /><br />
          Si llegaste hasta aquí...<br />
          Algo en ti ya empezó a romperse.<br />
          Bienvenido.
        </motion.div>

        <div className="button-group">
        {[
          { href: "/bitacora", label: "Pensamientos del Abismo" },
          { href: "/datastory", label: "Historias con Datos" },
          { href: "/drakeneess", label: "El Extraño Mundo de Drakeneess" },
        ].map((item, index) => (
          <Link key={index} href={item.href}>
            <motion.button
              className="link-button"
              whileHover={{ scale: 1.1 }}
            >
              {item.label}
            </motion.button>
          </Link>
        ))}
      </div>


        <motion.footer
          className="footer-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          &quot;No es un portal para todos. Pero si sientes que el mundo ya no es suficiente, estás en el lugar correcto.&quot;
        </motion.footer>
      </main>
    </>
  );
}
