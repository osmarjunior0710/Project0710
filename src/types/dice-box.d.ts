// A biblioteca não publica tipos TypeScript — declaração mínima só com
// o que o protótipo usa (ver DECISOES-COMBATE.md "Protótipo de dado 3D").
declare module '@3d-dice/dice-box' {
  /** `[key: string]: unknown` de propósito — a lib devolve um objeto com
   * campos internos minificados (`rollId`/`groupId`/etc, ver `reroll`
   * abaixo) que a gente nunca precisa NOMEAR, só guardar inteiro e
   * repassar de volta pra `reroll()` depois. */
  export interface DiceBoxResultado {
    value: number;
    [key: string]: unknown;
  }

  export interface DiceBoxConfig {
    container: string;
    assetPath: string;
    theme?: string;
    scale?: number;
  }

  export interface DiceBoxRollOpcoes {
    theme?: string;
    themeColor?: string;
  }

  export default class DiceBox {
    constructor(config: DiceBoxConfig);
    init(): Promise<void>;
    roll(notation: string | string[], opcoes?: DiceBoxRollOpcoes): Promise<DiceBoxResultado[]> | void;
    /** Joga dado(s) A MAIS na cena SEM limpar os que já pararam
     * (diferente de `roll()`, que sempre limpa tudo primeiro) — usado
     * pra Vantagem/Desvantagem escolhida DEPOIS de ver o 1º resultado
     * (ver `sdd/sdd-dado-3d.md`). Mesma assinatura de `roll()`. */
    add(notation: string | string[], opcoes?: DiceBoxRollOpcoes): Promise<DiceBoxResultado[]> | void;
    /** Rerola FISICAMENTE só o(s) dado(s) apontado(s) — passe de volta
     * o(s) `DiceBoxResultado` exatamente como veio de `onRollComplete`
     * (a lib usa os campos internos pra identificar qual dado é). Usado
     * pra Sorte/Inspiração Heroica/Perfurador. */
    reroll(
      resultado: DiceBoxResultado | DiceBoxResultado[],
      opcoes?: { remove?: boolean; hide?: boolean; newStartPoint?: boolean },
    ): Promise<DiceBoxResultado[]> | void;
    /** Precisa ser chamado (e aguardado) antes de rolar com um tema
     * ainda não usado nessa sessão — `roll()` acessa os dados do tema
     * de forma síncrona e quebra se ele não estiver carregado ainda.
     * Idempotente: retorna na hora se o tema já foi carregado antes. */
    loadTheme(tema: string): Promise<unknown>;
    onRollComplete?: (resultados: DiceBoxResultado[]) => void;
  }
}
