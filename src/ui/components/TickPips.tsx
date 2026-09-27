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
}

/** Ticks/pips padronizados pra qualquer recurso "N usos, alguns já
 * gastos" (Espaços de Magia, Recuperar Fôlego, Inspiração de Bardo...).
 * Regra única em todo o app: quadradinho preenchido = ainda disponível
 * (azul por padrão, roxo/lavanda com `variante="especial"`, ou a cor
 * da classe via `cor`); cinza = já gasto. Sempre esvazia do ÚLTIMO pro
 * primeiro (índice mais alto fica cinza primeiro), nunca do primeiro
 * pro último — ver DECISOES-DESIGN.md. */
export default function TickPips({ total, usados, tamanho = 'sm', variante = 'padrao', cor }: TickPipsProps) {
  const corPip = variante !== 'especial' ? cor : null;
  return (
    <div className={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const gasto = i >= total - usados;
        return (
          <div
            key={i}
            className={`${styles.pip} ${styles[tamanho]} ${
              gasto ? styles.pipUsado : variante === 'especial' ? styles.pipEspecial : ''
            }`}
            style={!gasto && corPip ? { background: corPip.hex } : undefined}
          />
        );
      })}
    </div>
  );
}
