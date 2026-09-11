// A biblioteca não publica tipos TypeScript — declaração mínima só com
// o que o protótipo usa (ver DECISOES-COMBATE.md "Protótipo de dado 3D").
declare module '@3d-dice/dice-box' {
  export interface DiceBoxResultado {
    value: number;
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
    /** Precisa ser chamado (e aguardado) antes de rolar com um tema
     * ainda não usado nessa sessão — `roll()` acessa os dados do tema
     * de forma síncrona e quebra se ele não estiver carregado ainda.
     * Idempotente: retorna na hora se o tema já foi carregado antes. */
    loadTheme(tema: string): Promise<unknown>;
    onRollComplete?: (resultados: DiceBoxResultado[]) => void;
  }
}
