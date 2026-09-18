import { useState } from 'react';
import type { Arma } from '../../data/rulesets/dnd2024/armas';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import styles from './TrocarArmaMaestria.module.css';

interface TrocarArmaMaestriaProps {
  armaAtual: string;
  todasAsArmas: Arma[];
  jaEscolhidas: string[];
  onTrocar: (novaArma: string) => void;
  /** `true` = ícone fica opaco e não abre o popup — já trocou a arma
   * permitida desde o último Descanso Longo, trava até o próximo (ver
   * `DECISOES-CLASSES.md` "Maestria em Arma — a troca é 1x por
   * Descanso Longo de verdade"). */
  desabilitado?: boolean;
}

/** Ícone "🔄" ao lado de uma arma de Maestria já escolhida — abre um
 * popup com a lista de armas elegíveis (excluindo as que já ocupam
 * outro slot de Maestria) pra trocar por essa. Regra: Guerreiro/
 * Bárbaro (e o talento Mestre das Armas) trocam 1 arma de Maestria a
 * cada Descanso Longo — ver `desabilitado`. */
export default function TrocarArmaMaestria({ armaAtual, todasAsArmas, jaEscolhidas, onTrocar, desabilitado }: TrocarArmaMaestriaProps) {
  const [aberto, setAberto] = useState(false);
  useLockBodyScroll(aberto);

  const opcoes = todasAsArmas.filter((a) => a.nome === armaAtual || !jaEscolhidas.includes(a.nome));

  return (
    <>
      <span
        className={styles.icon}
        style={desabilitado ? { opacity: 0.35, pointerEvents: 'none' } : undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (!desabilitado) setAberto(true);
        }}
      >
        🔄
      </span>
      {aberto && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            e.stopPropagation();
            setAberto(false);
          }}
        >
          <div className={styles.card} onClick={(e) => e.stopPropagation()}>
            <div className={styles.title}>Trocar {armaAtual} por…</div>
            <div className={styles.lista}>
              {opcoes.map((a) => (
                <div
                  key={a.id}
                  className={`${styles.opcao} ${a.nome === armaAtual ? styles.opcaoAtual : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (a.nome !== armaAtual) onTrocar(a.nome);
                    setAberto(false);
                  }}
                >
                  <span>{a.nome}</span>
                  <span className={styles.detalhe}>
                    {a.dano} · {a.maestria}
                  </span>
                </div>
              ))}
            </div>
            <div
              className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                setAberto(false);
              }}
            >
              cancelar
            </div>
          </div>
        </div>
      )}
    </>
  );
}
