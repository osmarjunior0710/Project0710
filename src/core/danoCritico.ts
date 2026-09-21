// Dano de Acerto Crítico (Livro do Jogador 2024, Cap. 1 — ver
// `DND-Regras.md`, "Acerto Crítico"): jogam-se os DADOS de dano duas
// vezes e o modificador entra UMA vez só. Vale pros dados extras do
// mesmo ataque também (Ataque Furtivo, Golpe Brutal...).

export interface GrupoDadosDano<L extends number = number> {
  quantidade: number;
  lados: L;
}

export interface DanoBase<L extends number = number> {
  quantidade: number;
  lados: number;
  mod: number;
  gruposExtras?: GrupoDadosDano<L>[];
}

export interface DanoMontado<L extends number = number> {
  quantidade: number;
  gruposExtras: GrupoDadosDano<L>[] | undefined;
  /** Texto pro popup (ex.: "2d8 + 3 + 4d10") — já com os dados dobrados. */
  formula: string;
}

/** Monta a rolagem de dano de um ataque; `critico` dobra a quantidade de
 * cada grupo de dados (nunca o modificador). */
export function danoComCritico<L extends number = number>(base: DanoBase<L>, critico: boolean): DanoMontado<L> {
  const fator = critico ? 2 : 1;
  const quantidade = base.quantidade * fator;
  const extras = base.gruposExtras?.map((g) => ({ quantidade: g.quantidade * fator, lados: g.lados }));
  const formula =
    `${quantidade}d${base.lados}` +
    (base.mod ? ` + ${base.mod}` : '') +
    (extras ?? []).map((g) => ` + ${g.quantidade}d${g.lados}`).join('');
  return { quantidade, gruposExtras: extras, formula };
}
