import { Fragment } from 'react';
import type { CorClasse } from '../../core/corRecursoClasse';
import styles from './TickPips.module.css';

interface TickPipsProps {
  /** Quanto o recurso tem no total (ex: máximo de Espaços de Magia). */
  total: number;
  /** Quanto já foi gasto/usado — esvazia de trás pra frente, como um
   * tanque de combustível (o último quadradinho é o primeiro a ficar
   * cinza). */
  usados: number;
  tamanho?: 'sm' | 'lg';
  /** `'especial'` = pip roxo/lavanda em vez do azul padrão, pra
   * recurso que NÃO é de nenhuma classe específica (ex.: pool
   * compartilhado de 1 uso do Ritual Rápido) — evita confundir com
   * contador de recurso base na mesma tela. Cinza de "já gasto"
   * continua igual em qualquer variante/cor. */
  variante?: 'padrao' | 'especial';
  /** Cor do recurso da classe (`core/corRecursoClasse.ts`) — pip usa o
   * hex direto (inline style), sem depender de token de design
   * compartilhado. `null`/omitido = cor padrão do app (azul). Ignorado
   * se `variante="especial"`. */
  cor?: CorClasse | null;
  /** Máximo de pips por linha (ex: 10) — em vez de depender da largura
   * do container pra decidir quando quebrar. Pensado pra recursos com
   * bastante uso (ex: Pontos de Foco do Monge, até 20 — pedido do
   * Osmar: nunca uma linha só). O número de linhas é `ceil(total /
   * quebrarACada)`, mas a quantidade REAL por linha é recalculada pra
   * ficar equilibrada entre as linhas (ex: 8 pips com `quebrarACada=6`
   * vira 4+4, não 6+2) — pedido do Osmar depois de ver 5+1+2 em 3
   * linhas desiguais. */
  quebrarACada?: number;
}

/** Ticks/pips padronizados pra qualquer recurso "N usos, alguns já
 * gastos" (Espaços de Magia, Recuperar Fôlego, Inspiração de Bardo...).
 * Regra única em todo o app: quadradinho preenchido = ainda disponível
 * (azul por padrão, roxo/lavanda com `variante="especial"`, ou a cor
 * da classe via `cor`); cinza = já gasto. Sempre esvazia do ÚLTIMO pro
 * primeiro (índice mais alto fica cinza primeiro), nunca do primeiro
 * pro último — ver DECISOES-DESIGN.md. */
export default function TickPips({ total, usados, tamanho = 'sm', variante = 'padrao', cor, quebrarACada }: TickPipsProps) {
  const corPip = variante !== 'especial' ? cor : null;
  // Com `quebrarACada`, o container vira flex-wrap de VERDADE (não só
  // "larga o suficiente que nunca quebra") — sem largura própria, um
  // flex item com várias linhas internas ocupa a largura MÁXIMA
  // disponível do pai (até caber todos os pips numa linha só), então
  // `justify-content: flex-end` no pai (ver `RecursosDeClasse.tsx`)
  // não tem o que empurrar. Fixar a largura em pixels pro tamanho
  // exato de uma linha (`quebrarACada` pips) resolve — cada linha
  // interna já fica alinhada à direita dentro desse bloco.
  const pipPx = tamanho === 'lg' ? 22 : 16;
  const gapPx = 4; // var(--space-1)
  const linhas = quebrarACada && total > 0 ? Math.ceil(total / quebrarACada) : 0;
  const porLinha = linhas > 0 ? Math.ceil(total / linhas) : quebrarACada;
  const largura = porLinha ? porLinha * pipPx + (porLinha - 1) * gapPx : undefined;
  return (
    <div className={styles.row} style={largura ? { width: largura, flexShrink: 0 } : undefined}>
      {Array.from({ length: total }).map((_, i) => {
        const gasto = i >= total - usados;
        const quebraAntes = porLinha && i > 0 && i % porLinha === 0;
        return (
          <Fragment key={i}>
            {quebraAntes && <div style={{ flexBasis: '100%', height: 0 }} />}
            <div
              className={`${styles.pip} ${styles[tamanho]} ${
                gasto ? styles.pipUsado : variante === 'especial' ? styles.pipEspecial : ''
              }`}
              style={!gasto && corPip ? { background: corPip.hex } : undefined}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
