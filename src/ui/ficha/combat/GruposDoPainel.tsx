import type { ReactNode } from 'react';
import PillClasse from '../../components/PillClasse';
import styles from './GruposDoPainel.module.css';

export interface BlocoPainel {
  /** `'topo'` = sem título, sempre primeiro (Atacar/Usar Magia); `'Espécie'`
   * e `'Outras'` vão depois das classes; qualquer outro valor é o NOME da
   * classe (grupo com selo, em ordem alfabética). */
  grupo: string;
  /** `false`/`null` = bloco desligado nesse personagem — não conta pro grupo. */
  no: ReactNode;
}

const FIXOS = ['topo', 'Espécie', 'Outras'];

/** Painel de Ação/Bônus/Reação organizado em grupos (pedido do Osmar,
 * 2026-10): topo fixo → 1 grupo por classe em ordem alfabética (selo da
 * classe, depois recurso com pips e habilidades) → Espécie → Outras.
 * Traço cheio entre grupos; o serrilhado entre habilidades do mesmo
 * grupo já vem de `PanelRows.module.css` (`.row`). */
export default function GruposDoPainel({ blocos }: { blocos: BlocoPainel[] }) {
  const ativos = blocos.filter((b) => b.no);
  const porGrupo = new Map<string, ReactNode[]>();
  for (const b of ativos) {
    const lista = porGrupo.get(b.grupo) ?? [];
    lista.push(b.no);
    porGrupo.set(b.grupo, lista);
  }
  const classes = [...porGrupo.keys()].filter((g) => !FIXOS.includes(g)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const ordem = ['topo', ...classes, 'Espécie', 'Outras'].filter((g) => porGrupo.has(g));
  return (
    <>
      {ordem.map((g) => (
        <div key={g} className={styles.grupo}>
          {g === 'Espécie' || g === 'Outras' ? (
            <div className={styles.titulo}>{g}</div>
          ) : g !== 'topo' ? (
            <div className={styles.titulo}>
              <PillClasse classe={g} />
            </div>
          ) : null}
          {porGrupo.get(g)!.map((no, i) => (
            <div key={i} className={styles.bloco}>
              {no}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
