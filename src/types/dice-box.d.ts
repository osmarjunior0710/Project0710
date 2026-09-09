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

  export default class DiceBox {
    constructor(config: DiceBoxConfig);
    init(): Promise<void>;
    roll(notation: string): Promise<DiceBoxResultado[]> | void;
    onRollComplete?: (resultados: DiceBoxResultado[]) => void;
  }
}
