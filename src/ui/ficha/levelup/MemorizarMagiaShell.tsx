import { useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { agruparMagiasPorCirculo, memorizarMagiaValida } from '../../../core/magiasPersonagem';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import GrupoMagiaColapsavel from '../../components/GrupoMagiaColapsavel';
import styles from './LevelUpShell.module.css';

interface MemorizarMagiaShellProps {
  /** Magias Preparadas atuais (nomes). */
  atuais: string[];
  /** Todo o Livro de Magias (grimório) — de onde a substituta pode vir. */
  catalogo: Magia[];
  onConfirmar: (novaLista: string[]) => void;
  onFechar: () => void;
}

/** "Memorizar Magia" (Mago, nível 5+) — troca EXATAMENTE 1 magia
 * preparada por outra do Livro de Magias, 1x por Descanso Curto (ver
 * `FichaShell.tsx`, reseta em `descansoCurto`/`descansoLongo`).
 * Diferente da redefinição livre do Descanso Longo (qualquer
 * quantidade): aqui o "Confirmar" só libera com exatamente 1 troca —
 * ver `memorizarMagiaValida`. */
export default function MemorizarMagiaShell({ atuais, catalogo, onConfirmar, onFechar }: MemorizarMagiaShellProps) {
  const [escolhidas, setEscolhidas] = useState<string[]>(atuais);

  function toggle(nome: string) {
    const i = escolhidas.indexOf(nome);
    if (i > -1) {
      setEscolhidas((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (escolhidas.length < atuais.length) {
      setEscolhidas((prev) => [...prev, nome]);
    }
  }

  const trocas = atuais.filter((nome) => !escolhidas.includes(nome)).length;
  const valido = memorizarMagiaValida(atuais, escolhidas);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>Memorizar Magia</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className="label" style={{ marginBottom: 8 }}>
          Estude seu Livro de Magias e substitua exatamente 1 das magias preparadas por outra do livro — desmarque
          uma e marque outra.
        </div>
        {agruparMagiasPorCirculo(catalogo).map((grupo) => (
          <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
            {(m) => {
              const jaTinha = atuais.includes(m.nome);
              const marcado = escolhidas.includes(m.nome);
              const removendo = jaTinha && !marcado;
              return (
                <div
                  key={m.id}
                  className={`check-row ${jaTinha ? (removendo ? styles.truqueRemovendo : styles.truqueAtual) : ''}`}
                  onClick={() => toggle(m.nome)}
                >
                  <div className={`check-box ${marcado ? 'checked' : ''}`} />
                  <span className="check-label">
                    <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                    {' '}
                    <span style={{ color: removendo ? 'var(--danger)' : 'var(--text-faint)', fontSize: 11 }}>
                      ({m.circulo}º círculo
                      {removendo ? ' · 🔻 será removida' : jaTinha ? ' · já tinha' : ''})
                    </span>
                  </span>
                </div>
              );
            }}
          </GrupoMagiaColapsavel>
        ))}
        {trocas > 1 && (
          <div className="label" style={{ color: 'var(--danger)', marginTop: 6 }}>
            ⚠️ {trocas} magias trocadas — Memorizar Magia só troca exatamente 1 por vez.
          </div>
        )}
      </div>

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={onFechar}>
          ← Cancelar
        </div>
        <div
          className={`btn btn-primary ${styles.pill}`}
          style={valido ? undefined : { opacity: 0.5, pointerEvents: 'none' }}
          onClick={() => onConfirmar(escolhidas)}
        >
          Confirmar ✓
        </div>
      </div>
    </div>
  );
}
