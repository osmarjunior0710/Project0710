import styles from './TrocarArmaMaestria.module.css';

export interface CartaoEfeitoDoGolpe {
  chave: string;
  titulo: string;
  descricao: string;
  /** `true` = já resolvido (ativado, escolhido ou "não usar") nesta
   * mesma tela — mostra o resultado em vez do botão de tocar. */
  resolvido: boolean;
  descricaoResolvido?: string;
  onTocar: () => void;
}

interface EfeitosDoGolpeModalProps {
  titulo: string;
  cartoes: CartaoEfeitoDoGolpe[];
  onFechar: () => void;
}

/** Popup de "mais de 1 efeito condicional qualifica no mesmo acerto"
 * (ver `DECISOES-COMBATE.md` "Fluxo Acerto/Erro sem 'renunciar'..." —
 * a premissa "nunca coexistem" quebrou com Raízes Devastadoras). Cada
 * cartão resolve INDEPENDENTE — tocar num abre o modal de verdade
 * daquele efeito (`AtivarEfeitoModal`/`EscolherEfeitoModal`, por cima
 * deste popup, que continua montado por baixo); depois de resolver,
 * este popup mostra o resultado no lugar do cartão, mas só fecha
 * quando o jogador tocar "Fechar" — dá pra usar os 2 efeitos, um
 * de cada vez, sem perder o outro. Mesmo estilo visual dos outros
 * popups do Fluxo Acerto/Erro (`TrocarArmaMaestria.module.css`).
 * Só entra em cena quando MAIS DE 1 efeito qualifica — com exatamente
 * 1, o botão do popup de dano continua indo direto pro modal daquele
 * efeito, sem passar por aqui. */
export default function EfeitosDoGolpeModal({ titulo, cartoes, onFechar }: EfeitosDoGolpeModalProps) {
  return (
    // SEM `zIndex` próprio (fica no 55 base do `.overlay`) — precisa
    // ficar ATRÁS de `AtivarEfeitoModal`/`EscolherEfeitoModal`/
    // `SalvaguardaDoAlvoModal` quando um deles abre por cima (o
    // cartão tocado abre o modal de verdade daquele efeito, este
    // popup continua montado por baixo). Ver ordem de JSX em
    // `CombatTab.tsx` — este componente precisa ser renderizado ANTES
    // dos outros 3 na árvore, senão o z-index empata e a ordem do DOM
    // decide (o mais recente no DOM pinta por cima).
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        {cartoes.map((c) =>
          c.resolvido ? (
            <div className="opt-card" key={c.chave}>
              <div className="opt-card-name">✓ {c.titulo}</div>
              <div className="opt-card-desc">{c.descricaoResolvido ?? c.descricao}</div>
            </div>
          ) : (
            <div className="opt-card" key={c.chave} onClick={c.onTocar}>
              <div className="opt-card-name">{c.titulo}</div>
              <div className="opt-card-desc">{c.descricao}</div>
            </div>
          ),
        )}
        <div className="btn btn-primary" style={{ marginTop: 10, textAlign: 'center' }} onClick={onFechar}>
          Fechar
        </div>
      </div>
    </div>
  );
}
