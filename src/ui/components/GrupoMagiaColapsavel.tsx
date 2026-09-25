import { useState, type ReactNode } from 'react';
import styles from './GrupoMagiaColapsavel.module.css';

// Genérico desde 2026-09 (Multiclasse, ver EmDev.md) — o seletor de
// magia em Combate passa `MagiaComClasseOpcional[]` (magia + classe),
// não mais só `Magia[]`; o resto dos usos (Level Up, Memorizar Magia)
// continua passando `Magia[]` normal, sem mudar nada pra eles.
interface GrupoMagiaColapsavelProps<T> {
  label: string;
  magias: T[];
  children: (item: T) => ReactNode;
}

export default function GrupoMagiaColapsavel<T>({ label, magias, children }: GrupoMagiaColapsavelProps<T>) {
  const [expandido, setExpandido] = useState(true);

  if (magias.length === 0) return null;

  return (
    <>
      <div className={styles.grupoHeader} onClick={() => setExpandido((v) => !v)}>
        <span>
          {label} ({magias.length})
        </span>
        <span>{expandido ? '▾' : '▸'}</span>
      </div>
      {expandido && magias.map((m) => children(m))}
    </>
  );
}
