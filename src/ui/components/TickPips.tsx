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
   * recurso que NÃO é o Espaço de Magia normal (ex.: pool
   * compartilhado de 1 uso do Ritual Rápido) — evita confundir com
   * contador de recurso base na mesma tela. `'vermelho'` = pip
   * vermelho (`--danger`), pra recurso com tema de cor própria
   * vermelho já estabelecido em outra parte da tela (ex.: Fúria, card
   * fixo do Combate). Cinza de "já gasto" continua igual nos 3 casos. */
  variante?: 'padrao' | 'especial' | 'vermelho' | 'roxo' | 'mostarda' | 'azul' | 'azul-claro';
}

/** Ticks/pips padronizados pra qualquer recurso "N usos, alguns já
 * gastos" (Espaços de Magia, Recuperar Fôlego, Inspiração de Bardo...).
 * Regra única em todo o app: quadradinho preenchido = ainda disponível
 * (azul por padrão, roxo/lavanda com `variante="especial"`); cinza =
 * já gasto. Sempre esvazia do ÚLTIMO pro primeiro (índice mais alto
 * fica cinza primeiro), nunca do primeiro pro último — ver
 * DECISOES-DESIGN.md. */
/** `'roxo'` é o mesmo roxo de `'especial'` (Magia de Pacto usa `'roxo'`; o
 * Ritual Rápido continua com `'especial'`). Cores por classe: `core/corRecursoClasse.ts`. */
const CLASSE_DA_VARIANTE: Record<string, string | null> = {
  padrao: null,
  azul: null,
  especial: 'pipEspecial',
  roxo: 'pipEspecial',
  vermelho: 'pipVermelho',
  mostarda: 'pipMostarda',
  'azul-claro': 'pipAzulClaro',
};

export default function TickPips({ total, usados, tamanho = 'sm', variante = 'padrao' }: TickPipsProps) {
  return (
    <div className={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const gasto = i >= total - usados;
        return (
          <div
            key={i}
            className={`${styles.pip} ${styles[tamanho]} ${
              gasto ? styles.pipUsado : CLASSE_DA_VARIANTE[variante] ? styles[CLASSE_DA_VARIANTE[variante] as string] : ''
            }`}
          />
        );
      })}
    </div>
  );
}
