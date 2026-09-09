import type { Magia } from '../data/rulesets/dnd2024/magias';

export interface CalculoDanoMagia {
  quantidade: number;
  lados: number;
  mod: number;
  tipo: string | null;
  /** `true` quando o círculo usado é maior que o círculo base da magia
   * mas o upcast não pôde ser somado automaticamente (`upcastTipo`
   * "formula-propria"/"outro", ou dado de upcast com tamanho de face
   * diferente do Dano Base) — os valores acima são só do Dano Base no
   * círculo mínimo da magia; a UI deve avisar que o efeito real usando
   * esse círculo é maior e mostrar `magia.upcastTexto` em vez de somar
   * sozinha. */
  upcastNaoAutomatico: boolean;
}

interface DadoParseado {
  quantidade: number;
  lados: number;
  mod: number;
}

function parsearDado(dado: string): DadoParseado | null {
  const m = dado.match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/);
  if (!m) return null;
  return { quantidade: Number(m[1]), lados: Number(m[2]), mod: m[3] ? Number(m[3]) : 0 };
}

/** Nº de "Aprimoramento de Truque" já alcançados pelo nível do
 * PERSONAGEM (0-3, nos níveis 5/11/17) — mesma tabela pra toda magia
 * com `escalaTruqueTipo: "dado"`, ver comentário desse campo em
 * `data/rulesets/dnd2024/magias.ts`. */
function tiersDeAprimoramentoTruque(nivelPersonagem: number): number {
  if (nivelPersonagem >= 17) return 3;
  if (nivelPersonagem >= 11) return 2;
  if (nivelPersonagem >= 5) return 1;
  return 0;
}

interface EscalonamentoBase {
  quantidade: number;
  lados: number;
  mod: number;
  upcastNaoAutomatico: boolean;
}

/** Motor genérico de "dado base + Upcast + Aprimoramento de Truque" —
 * usado tanto por dano (`danoBaseDado`) quanto por cura
 * (`curaBaseDado`), já que os dois seguem exatamente a mesma regra de
 * escalonamento (o Upcast estruturado da planilha descreve COMO o
 * efeito escala, não importa se é dano ou cura — ver comentário do
 * Upcast em `magias.ts`). `null` quando `dadoBase` está ausente ou não
 * segue o formato "NdM" / "NdM + F" esperado. Upcast (círculo) e
 * Aprimoramento de Truque (nível) nunca coexistem na mesma magia hoje
 * (truque nunca tem `upcastTipo`), mas a ordem abaixo — truque
 * primeiro, upcast depois — deixa o resultado certo mesmo se isso
 * mudar. */
function calcularEscalonamento(
  dadoBase: string | null,
  magia: Magia,
  circuloUsado: number,
  nivelPersonagem: number,
): EscalonamentoBase | null {
  if (!dadoBase) return null;
  const base = parsearDado(dadoBase);
  if (!base) return null;

  const baseEscalada: DadoParseado =
    magia.escalaTruqueTipo === 'dado'
      ? { ...base, quantidade: base.quantidade + tiersDeAprimoramentoTruque(nivelPersonagem) }
      : base;

  const resultadoBase: EscalonamentoBase = { ...baseEscalada, upcastNaoAutomatico: false };

  if (!magia.upcastTipo) return resultadoBase;

  const circuloBase = magia.upcastCirculoBase ?? magia.circulo;
  const niveisAcima = circuloUsado - circuloBase;
  if (niveisAcima <= 0) return resultadoBase;

  if (magia.upcastTipo === 'dado-por-circulo' && magia.upcastDado) {
    const extra = parsearDado(magia.upcastDado);
    if (extra && extra.lados === baseEscalada.lados) {
      return {
        quantidade: baseEscalada.quantidade + extra.quantidade * niveisAcima,
        lados: baseEscalada.lados,
        mod: baseEscalada.mod + extra.mod * niveisAcima,
        upcastNaoAutomatico: false,
      };
    }
  }

  if (magia.upcastTipo === 'flat-por-circulo' && magia.upcastFlat != null) {
    return {
      quantidade: baseEscalada.quantidade,
      lados: baseEscalada.lados,
      mod: baseEscalada.mod + magia.upcastFlat * niveisAcima,
      upcastNaoAutomatico: false,
    };
  }

  // 'alvo-por-circulo' só aumenta o nº de alvos atingidos — o dado por
  // alvo não muda, então o Dano/Cura Base (já escalado por truque, se
  // for o caso) já é o resultado final.
  if (magia.upcastTipo === 'alvo-por-circulo') return resultadoBase;

  // 'formula-propria' | 'outro', ou 'dado-por-circulo'/'flat-por-circulo'
  // com dado incompatível pro Dano/Cura Base: não dá pra somar sozinho.
  return { ...resultadoBase, upcastNaoAutomatico: true };
}

/** Combina `danoBaseDado`/`danoBaseTipo` da magia com o Upcast
 * estruturado (`upcastTipo`/`upcastCirculoBase`/`upcastDado`/
 * `upcastFlat`) pro círculo de espaço de magia usado, e com
 * "Aprimoramento de Truque" (`escalaTruqueTipo`) pro nível do
 * personagem — ver PENDENCIAS.md "Motor de rolagem de dano de Magia".
 * `null` quando a magia não causa dano direto num alvo (`danoBaseDado`
 * ausente) ou o texto do dado não segue o formato "NdM" / "NdM + F"
 * esperado. */
export function calcularDanoMagia(magia: Magia, circuloUsado: number, nivelPersonagem: number): CalculoDanoMagia | null {
  const escalonamento = calcularEscalonamento(magia.danoBaseDado, magia, circuloUsado, nivelPersonagem);
  if (!escalonamento) return null;
  return { ...escalonamento, tipo: magia.danoBaseTipo };
}

export interface CalculoCuraMagia {
  quantidade: number;
  lados: number;
  mod: number;
  /** Ver `CalculoDanoMagia.upcastNaoAutomatico` — mesmo conceito,
   * aplicado à cura. */
  upcastNaoAutomatico: boolean;
}

/** Espelha `calcularDanoMagia`, mas pra `curaBaseDado` — mesmo motor
 * de Upcast por baixo (`calcularEscalonamento`), já que as 2 mecânicas
 * escalam do mesmo jeito. `null` quando a magia não tem cura em
 * formato de dado único (ver comentário de `curaBaseDado` em
 * `magias.ts`). */
export function calcularCuraMagia(magia: Magia, circuloUsado: number, nivelPersonagem: number): CalculoCuraMagia | null {
  return calcularEscalonamento(magia.curaBaseDado, magia, circuloUsado, nivelPersonagem);
}

export type MecanicaMagia = 'ataque' | 'salvaguarda' | 'cura' | 'nenhuma';

/** Deriva do campo estruturado `ataqueOuSalvaguarda` (extraído do
 * livro, ver DECISOES-DADOS.md) qual dos 2 modais de Combat mostrar ao
 * usar a magia — não usa a heurística de regex de `classificarMagia`
 * (essa serve só pro ícone ⚔️ da lista, não pra decidir qual jogada
 * acontece; usar as duas fontes pra decisão levaria a discordância
 * entre elas em alguns casos). `'cura'` (`curaBaseDado` presente) é
 * checado ANTES de ataque/salvaguarda — nenhuma das 7 magias de cura
 * de hoje tem `ataqueOuSalvaguarda` preenchido, mas a ordem já deixa
 * certo se isso mudar (ex.: uma magia que ataca E cura o conjurador,
 * tipo Toque Vampírico, continua caindo em 'ataque' porque não tem
 * `curaBaseDado` — só ganharia 'cura' aqui se a cura dela virasse um
 * dado próprio simples também). */
export function mecanicaDaMagia(magia: Magia): MecanicaMagia {
  if (magia.curaBaseDado) return 'cura';
  if (magia.ataqueOuSalvaguarda === 'Ataque à Distância' || magia.ataqueOuSalvaguarda === 'Ataque Corpo a Corpo') {
    return 'ataque';
  }
  if (magia.ataqueOuSalvaguarda === null) return 'nenhuma';
  return 'salvaguarda'; // "Salvaguarda de <Atributo>" ou "aleatório"
}

/** Atributo de salvaguarda pra mostrar no Modal de Salvaguarda.
 * "aleatório" (Rajada Prismática/Muralha Prismática — o tipo é
 * sorteado pela própria magia, 1 por raio/camada) vira um texto
 * explicando, em vez do nome de um atributo fixo que não existe. */
export function atributoSalvaguarda(magia: Magia): string {
  if (magia.ataqueOuSalvaguarda === 'aleatório') return 'variável (sorteado pela magia, veja descrição)';
  return magia.ataqueOuSalvaguarda?.replace(/^Salvaguarda de /, '') ?? '';
}
