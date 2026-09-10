import { useState } from 'react';
import type { Pet } from '../../core/pets';
import styles from './TrocarArmaMaestria.module.css';

interface ColheitaMacabraModalProps {
  /** PV que a cura concede (já calculado, ver `curaColheitaMacabra`). */
  cura: number;
  /** Só os pets elegíveis (Morto-Vivo) — ver `petsElegiveisColheitaMacabra`. */
  petsElegiveis: Pet[];
  onCurar: (petId: string) => void;
  onFechar: () => void;
}

/** Modal pós-conjuração de magia de Necromancia com espaço (Colheita
 * Macabra, Necromante nível 3 — ver `core/necromante.ts`) — mesmo
 * padrão visual de popup centralizado de `MagiaSalvaguardaModal`/
 * `TrocarValorSimples` (reaproveita `TrocarArmaMaestria.module.css`).
 * Vive em `FichaShell.tsx` (não dentro da aba Magias/Combate) — assim
 * sobrevive à troca de aba e aparece igual não importa de onde a magia
 * foi conjurada. `z-index` mais baixo que o Modal de Salvaguarda/
 * Rolagem (55/60) de propósito: se a magia também abrir um desses
 * popups, ele aparece por cima primeiro — fechá-lo revela a Colheita
 * Macabra embaixo, sem precisar sequenciar isso manualmente. */
export default function ColheitaMacabraModal({ cura, petsElegiveis, onCurar, onFechar }: ColheitaMacabraModalProps) {
  const [petId, setPetId] = useState(petsElegiveis[0]?.id ?? '');

  const selectStyle = {
    width: '100%',
    padding: 10,
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--shape-sm)',
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: 14,
    marginBottom: 10,
  };

  return (
    <div className={styles.overlay} style={{ zIndex: 50 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>🩸 Colheita Macabra</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14 }}>
          Você conjurou uma magia de Necromancia usando um espaço de magia — um Morto-Vivo aliado à sua escolha, a
          até 18 metros, recupera {cura} Pontos de Vida.
        </div>
        {petsElegiveis.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 4 }}>
            Nenhum Morto-Vivo sob seu controle agora.
          </div>
        ) : (
          <>
            <select value={petId} onChange={(e) => setPetId(e.target.value)} style={selectStyle}>
              {petsElegiveis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            <div className="btn btn-primary" style={{ padding: 12, textAlign: 'center' }} onClick={() => petId && onCurar(petId)}>
              Curar {cura} PV
            </div>
          </>
        )}
        <div className={styles.close} onClick={onFechar}>
          dispensar
        </div>
      </div>
    </div>
  );
}
