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

/** Combina `danoBaseDado`/`danoBaseTipo` da magia com o Upcast
 * estruturado (`upcastTipo`/`upcastCirculoBase`/`upcastDado`/
 * `upcastFlat`) pro círculo de espaço de magia usado — ver
 * PENDENCIAS.md "Motor de rolagem de dano de Magia". `null` quando a
 * magia não causa dano direto num alvo (`danoBaseDado` ausente) ou o
 * texto do dado não segue o formato "NdM" / "NdM + F" esperado. */
export function calcularDanoMagia(magia: Magia, circuloUsado: number): CalculoDanoMagia | null {
  if (!magia.danoBaseDado) return null;
  const base = parsearDado(magia.danoBaseDado);
  if (!base) return null;

  const resultadoBase: CalculoDanoMagia = { ...base, tipo: magia.danoBaseTipo, upcastNaoAutomatico: false };

  if (!magia.upcastTipo) return resultadoBase;

  const circuloBase = magia.upcastCirculoBase ?? magia.circulo;
  const niveisAcima = circuloUsado - circuloBase;
  if (niveisAcima <= 0) return resultadoBase;

  if (magia.upcastTipo === 'dado-por-circulo' && magia.upcastDado) {
    const extra = parsearDado(magia.upcastDado);
    if (extra && extra.lados === base.lados) {
      return {
        quantidade: base.quantidade + extra.quantidade * niveisAcima,
        lados: base.lados,
        mod: base.mod + extra.mod * niveisAcima,
        tipo: magia.danoBaseTipo,
        upcastNaoAutomatico: false,
      };
    }
  }

  if (magia.upcastTipo === 'flat-por-circulo' && magia.upcastFlat != null) {
    return {
      quantidade: base.quantidade,
      lados: base.lados,
      mod: base.mod + magia.upcastFlat * niveisAcima,
      tipo: magia.danoBaseTipo,
      upcastNaoAutomatico: false,
    };
  }

  // 'alvo-por-circulo' só aumenta o nº de alvos atingidos — o dado por
  // alvo não muda, então o Dano Base já é o resultado final.
  if (magia.upcastTipo === 'alvo-por-circulo') return resultadoBase;

  // 'formula-propria' | 'outro', ou 'dado-por-circulo'/'flat-por-circulo'
  // com dado incompatível pro Dano Base: não dá pra somar sozinho.
  return { ...resultadoBase, upcastNaoAutomatico: true };
}

export type MecanicaMagia = 'ataque' | 'salvaguarda' | 'nenhuma';

/** Deriva do campo estruturado `ataqueOuSalvaguarda` (extraído do
 * livro, ver DECISOES-DADOS.md) qual dos 2 modais de Combat mostrar ao
 * usar a magia — não usa a heurística de regex de `classificarMagia`
 * (essa serve só pro ícone ⚔️ da lista, não pra decidir qual jogada
 * acontece; usar as duas fontes pra decisão levaria a discordância
 * entre elas em alguns casos). */
export function mecanicaDaMagia(magia: Magia): MecanicaMagia {
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
