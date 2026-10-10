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
  /** Dados que entram SEM dobrar no crítico (já são o bônus do crítico, ex.: Crítico Melhorado do Perfurador). */
  gruposFixos?: GrupoDadosDano<L>[];
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
  const dobrados = base.gruposExtras?.map((g) => ({ quantidade: g.quantidade * fator, lados: g.lados })) ?? [];
  const todos = [...dobrados, ...(base.gruposFixos ?? [])];
  const extras = todos.length > 0 ? todos : undefined;
  const formula =
    `${quantidade}d${base.lados}` +
    (base.mod ? ` + ${base.mod}` : '') +
    (extras ?? []).map((g) => ` + ${g.quantidade}d${g.lados}`).join('');
  return { quantidade, gruposExtras: extras, formula };
}

/** Crítico Melhorado (talento Perfurador, Livro do Jogador Cap. 5): num Acerto Crítico que causa dano Perfurante, joga 1
 * dado de dano ADICIONAL (do mesmo tamanho do dado da arma), por cima do dobro normal. Automático (decisão do Osmar:
 * nunca há desvantagem em jogar o dado extra). Devolve `[]` fora dessas condições. */
export function dadoExtraPerfurador<L extends number>(
  critico: boolean,
  danoTipo: string | undefined,
  temPerfurador: boolean,
  lados: L,
): GrupoDadosDano<L>[] {
  if (!critico || !temPerfurador || danoTipo !== 'Perfurante') return [];
  return [{ quantidade: 1, lados }];
}
