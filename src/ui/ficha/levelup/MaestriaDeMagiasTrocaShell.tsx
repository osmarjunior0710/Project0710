import { useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { magiasElegiveisMaestria, trocasMaestria } from '../../../core/maestriaDeMagias';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import styles from './LevelUpShell.module.css';

interface MaestriaDeMagiasTrocaShellProps {
  /** `{1: nomeMagia, 2: nomeMagia}` — escolha atual, antes da troca. */
  atuais: Record<number, string>;
  livroDeMagias: Magia[];
  onConfirmar: (escolha: Record<number, string>) => void;
  onFechar: () => void;
}

/** Maestria de Magias — troca no Descanso Longo (Entrega 6b): substitui
 * no máximo 1 das 2 escolhas por outra elegível do MESMO círculo do
 * Livro de Magias — opcional, não precisa mexer se não quiser. Mesmo
 * grid de escolha do passo de Level Up (`step === 'maestriaDeMagias'`
 * em `LevelUpShell.tsx`), CLAUDE.md §6.5. */
export default function MaestriaDeMagiasTrocaShell({
  atuais,
  livroDeMagias,
  onConfirmar,
  onFechar,
}: MaestriaDeMagiasTrocaShellProps) {
  const [escolha, setEscolha] = useState<Record<number, string>>(atuais);
  const trocas = trocasMaestria(atuais, escolha);
  const valido = trocas <= 1;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>Maestria de Magias — trocar</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className="label" style={{ marginBottom: 8 }}>
          Estude seu Livro de Magias e substitua no máximo 1 das 2 magias por outra elegível do mesmo círculo — não
          precisa mexer se não quiser.
        </div>
        {[1, 2].map((circulo) => (
          <div key={circulo}>
            <div className={styles.subHeader}>{circulo}º círculo</div>
            {magiasElegiveisMaestria(livroDeMagias, circulo as 1 | 2).map((m) => (
              <div
                key={m.id}
                className={`opt-card ${escolha[circulo] === m.nome ? 'selected' : ''}`}
                onClick={() => setEscolha((prev) => ({ ...prev, [circulo]: m.nome }))}
              >
                <div className="opt-card-name">
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
              </div>
            ))}
          </div>
        ))}
        {!valido && (
          <div className="label" style={{ color: 'var(--danger)', marginTop: 6 }}>
            ⚠️ {trocas} magias trocadas — só pode trocar 1 por Descanso Longo.
          </div>
        )}
      </div>

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={onFechar}>
          ← Cancelar
        </div>
        <div className={`btn btn-primary ${styles.pill}`} onClick={() => valido && onConfirmar(escolha)}>
          Confirmar ✓
        </div>
      </div>
    </div>
  );
}
