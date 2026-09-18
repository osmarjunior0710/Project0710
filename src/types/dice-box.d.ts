// A biblioteca não publica tipos TypeScript — declaração mínima só com
// o que o protótipo usa (ver DECISOES-COMBATE.md "Protótipo de dado 3D").
declare module '@3d-dice/dice-box' {
  /** `onRollComplete`/`getRollResults()` devolvem um objeto por GRUPO de
   * rolagem (não por dado) — `.value` do grupo já é a soma certa, mas
   * pra `reroll()` precisa do dado individual de verdade, que mora em
   * `.rolls[0]` (cada grupo que este app monta sempre tem `qty: 1`, um
   * grupo por dado — ver `especificacaoDados`/`ordenados` em
   * `RollContext.tsx`/`Dice3dFab.tsx`). Repassar o GRUPO inteiro pro
   * `reroll()` (em vez de `.rolls[0]`) faz a lib jogar erro internamente
   * (rollId no nível errado) — achado depurando "Inspiração Heroica só
   * troca o número, não rerola" (ver DECISOES-COMBATE.md). `[key:
   * string]: unknown` de propósito — o resto dos campos internos
   * minificados a gente nunca precisa NOMEAR, só guardar inteiro e
   * repassar de volta pra `reroll()` depois. */
  export interface DiceBoxResultado {
    value: number;
    rolls?: DiceBoxResultado[];
    [key: string]: unknown;
  }

  export interface DiceBoxConfig {
    container: string;
    assetPath: string;
    theme?: string;
    scale?: number;
    /** Sombra do dado físico no "chão" — a lib já vem com isso `true`
     * por padrão, mas o material que desenha a sombra fica com alpha 0
     * (invisível) se essa flag não chegar como `true` de verdade no
     * config interno dela (ver `diceBox3d.ts` pra contexto). Passar
     * explícito aqui remove qualquer dependência do default interno. */
    enableShadows?: boolean;
  }

  export interface DiceBoxRollOpcoes {
    theme?: string;
    themeColor?: string;
  }

  /** Forma alternativa de notação: um grupo por tipo de dado, cada um
   * com sua própria `themeColor` (a lib usa `grupo.themeColor` antes de
   * cair pro `themeColor` do nível da rolagem) — usado quando dados de
   * tipos diferentes precisam de cor fixa própria na MESMA rolagem
   * (ver `COR_POR_LADOS` em `diceBox3d.ts`). `sides` é sempre o
   * número de lados, INCLUSIVE d100 (100, número) — passar a STRING
   * "100" faz a lib entrar num modo diferente ("d100 de face única",
   * só a dezena) que não é o que queremos (achado testando no celular:
   * "d100 só rolando a dezena"); com número puro, ela soma um d10
   * físico "escondido" por trás e `onRollComplete` já devolve o valor
   * certo, 1 a 100. */
  export interface DiceBoxGrupoNotacao {
    qty: number;
    sides: number;
    themeColor?: string;
  }

  export type DiceBoxNotacao = string | string[] | DiceBoxGrupoNotacao | DiceBoxGrupoNotacao[];

  export default class DiceBox {
    constructor(config: DiceBoxConfig);
    init(): Promise<void>;
    roll(notation: DiceBoxNotacao, opcoes?: DiceBoxRollOpcoes): Promise<DiceBoxResultado[]> | void;
    /** Joga dado(s) A MAIS na cena SEM limpar os que já pararam
     * (diferente de `roll()`, que sempre limpa tudo primeiro) — usado
     * pra Vantagem/Desvantagem escolhida DEPOIS de ver o 1º resultado
     * (ver `sdd/sdd-dado-3d.md`). Mesma assinatura de `roll()`. */
    add(notation: DiceBoxNotacao, opcoes?: DiceBoxRollOpcoes): Promise<DiceBoxResultado[]> | void;
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
    /** Snapshot SÍNCRONO de todos os grupos vivos na cena agora (mesmo
     * formato do `onRollComplete`) — usado por `lancarGrupos()`
     * (`diceBox3d.ts`) pra saber, ANTES de `roll()`/`add()`, quais
     * `id`s já existiam, e assim identificar com certeza quais são os
     * grupos NOVOS quando o resultado chegar (em vez de adivinhar
     * posição no array). */
    getRollResults(): DiceBoxResultado[];
    onRollComplete?: (resultados: DiceBoxResultado[]) => void;
  }
}
