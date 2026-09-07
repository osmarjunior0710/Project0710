// Loja — Entrega A5. Catálogo real (Armas, Armaduras, Escudos,
// Ferramentas, Instrumentos Musicais, Focos e Símbolos, Munição,
// Equipamento de Aventura) + cálculo de ouro/carrinho.
//
// Moeda: a planilha não tem uma tabela de conversão explícita (checado
// no Glossário de Regras) — usa a regra padrão oficial do sistema,
// confirmada com o Osmar: 1 PO = 10 PP = 100 PC.

import { armas } from '../data/rulesets/dnd2024/armas';
import { armaduras } from '../data/rulesets/dnd2024/armaduras';
import { equipamentoAventura } from '../data/rulesets/dnd2024/equipamentoAventura';
import { gruposFerramenta } from '../data/rulesets/dnd2024/ferramentas';
import { proficienciasArmaArmaduraClasse } from '../data/rulesets/dnd2024/proficienciasArmaArmaduraClasse';
import { classeDaSelecao } from './calculoPersonagem';
import { modificador, valorFinalAtributo, type WizardSelection } from './personagem';

export interface ItemCarrinho {
  nome: string;
  quantidade: number;
}

export type LojaGrupoId =
  | 'armas-simples-cac'
  | 'armas-simples-dist'
  | 'armas-marciais-cac'
  | 'armas-marciais-dist'
  | 'armadura-leve'
  | 'armadura-media'
  | 'armadura-pesada'
  | 'escudos'
  | 'ferramentas'
  | 'instrumentos-musicais'
  | 'focos-simbolos'
  | 'municao'
  | 'kits'
  | 'equipamento-aventura';

export interface LojaItem {
  nome: string;
  grupo: LojaGrupoId;
  custoTexto: string;
  custoPO: number | null;
  peso: string | null;
  dano?: string;
  propriedades?: string;
  classeArmadura?: string;
  furtividade?: string;
  atributo?: string;
  efeito?: string;
}

export interface GrupoLoja {
  id: LojaGrupoId;
  titulo: string;
  itens: LojaItem[];
}

/** "20 PO" / "5 PP" / "1.000 PO" / "1,6 PO" → valor em PO. `null` pra
 * "Varia"/"—"/formato não reconhecido (item não vendável na Loja). */
export function parseCustoPO(custo: string | null | undefined): number | null {
  if (!custo) return null;
  const m = custo.trim().match(/^([\d.,]+)\s*(PO|PP|PC)$/i);
  if (!m) return null;
  const semMilhar = m[1].replace(/\.(?=\d{3}(\D|$))/g, '');
  const numero = parseFloat(semMilhar.replace(',', '.'));
  if (Number.isNaN(numero)) return null;
  const unidade = m[2].toUpperCase();
  const fator = unidade === 'PO' ? 1 : unidade === 'PP' ? 0.1 : 0.01;
  return numero * fator;
}

export function formatarPO(valorPO: number): string {
  const arredondado = Math.round(valorPO * 100) / 100;
  return `${arredondado.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} PO`;
}

function grupoArma(categoria: string): LojaGrupoId | null {
  if (categoria === 'Armas Simples Corpo a Corpo') return 'armas-simples-cac';
  if (categoria === 'Armas Simples à Distância') return 'armas-simples-dist';
  if (categoria === 'Armas Marciais Corpo a Corpo') return 'armas-marciais-cac';
  if (categoria === 'Armas Marciais à Distância') return 'armas-marciais-dist';
  return null;
}

function grupoArmadura(categoria: string): LojaGrupoId | null {
  if (categoria.startsWith('Armadura Leve')) return 'armadura-leve';
  if (categoria.startsWith('Armadura Média')) return 'armadura-media';
  if (categoria.startsWith('Armadura Pesada')) return 'armadura-pesada';
  if (categoria.startsWith('Escudo')) return 'escudos';
  return null;
}

function grupoEquipamentoAventura(categoria: string, nome: string): LojaGrupoId {
  if (categoria === 'Munição') return 'municao';
  if (categoria === 'Foco Arcano' || categoria === 'Foco Druídico' || categoria === 'Símbolo Sagrado') return 'focos-simbolos';
  if (nome.startsWith('Kit de ')) return 'kits';
  return 'equipamento-aventura';
}

export const GRUPOS_LOJA: { id: LojaGrupoId; titulo: string }[] = [
  { id: 'armas-simples-cac', titulo: 'Armas Simples — Corpo a Corpo' },
  { id: 'armas-simples-dist', titulo: 'Armas Simples — À Distância' },
  { id: 'armas-marciais-cac', titulo: 'Armas Marciais — Corpo a Corpo' },
  { id: 'armas-marciais-dist', titulo: 'Armas Marciais — À Distância' },
  { id: 'armadura-leve', titulo: 'Armadura Leve' },
  { id: 'armadura-media', titulo: 'Armadura Média' },
  { id: 'armadura-pesada', titulo: 'Armadura Pesada' },
  { id: 'escudos', titulo: 'Escudos' },
  { id: 'ferramentas', titulo: 'Ferramentas' },
  { id: 'instrumentos-musicais', titulo: 'Instrumentos Musicais' },
  { id: 'focos-simbolos', titulo: 'Focos e Símbolos' },
  { id: 'municao', titulo: 'Munição' },
  { id: 'kits', titulo: 'Kits' },
  { id: 'equipamento-aventura', titulo: 'Equipamento de Aventura' },
];

/** Monta o catálogo completo da Loja, agrupado por categoria — só
 * itens com preço em PO/PP/PC reconhecido entram (itens "Varia"/"—",
 * como os placeholders genéricos "Foco Arcano"/"Munição", ficam de
 * fora: quem compra de verdade é a variante concreta). */
export function construirCatalogoLoja(): GrupoLoja[] {
  const porGrupo = new Map<LojaGrupoId, LojaItem[]>();
  const add = (grupo: LojaGrupoId, item: LojaItem) => {
    if (item.custoPO === null) return;
    if (!porGrupo.has(grupo)) porGrupo.set(grupo, []);
    porGrupo.get(grupo)!.push(item);
  };

  for (const a of armas) {
    const grupo = grupoArma(a.categoria);
    if (!grupo) continue;
    add(grupo, {
      nome: a.nome,
      grupo,
      custoTexto: a.custo,
      custoPO: parseCustoPO(a.custo),
      peso: a.peso,
      dano: a.dano,
      propriedades: a.propriedades,
    });
  }

  for (const ar of armaduras) {
    const grupo = grupoArmadura(ar.categoria);
    if (!grupo) continue;
    add(grupo, {
      nome: ar.nome,
      grupo,
      custoTexto: ar.custo,
      custoPO: parseCustoPO(ar.custo),
      peso: ar.peso,
      classeArmadura: ar.classeArmadura,
      furtividade: ar.furtividade,
    });
  }

  for (const it of equipamentoAventura) {
    const grupo = grupoEquipamentoAventura(it.categoria, it.nome);
    add(grupo, {
      nome: it.nome,
      grupo,
      custoTexto: it.custo ?? '—',
      custoPO: parseCustoPO(it.custo),
      peso: it.peso,
      efeito: it.descricaoCurta ?? undefined,
    });
  }

  for (const [nomeGrupo, opcoes] of Object.entries(gruposFerramenta)) {
    const grupo: LojaGrupoId = nomeGrupo === 'Instrumento Musical' ? 'instrumentos-musicais' : 'ferramentas';
    for (const op of opcoes) {
      add(grupo, {
        nome: op.nome,
        grupo,
        custoTexto: op.preco ?? '—',
        custoPO: parseCustoPO(op.preco),
        peso: op.peso,
        atributo: op.atributo ?? undefined,
        efeito: op.descricao ?? undefined,
      });
    }
  }

  return GRUPOS_LOJA.map((g) => ({ ...g, itens: (porGrupo.get(g.id) ?? []).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')) })).filter(
    (g) => g.itens.length > 0,
  );
}

/** Bônus de ataque (mod. de atributo + proficiência se aplicável) pra
 * uma arma, dado o personagem em construção — Acuidade usa o maior
 * entre Força/Destreza; À Distância usa Destreza; Corpo a Corpo sem
 * Acuidade usa Força. `null` se os atributos ainda não foram rolados. */
export function calcularModAtaque(
  selection: WizardSelection,
  arma: { grupo: LojaGrupoId; propriedades: string },
): { mod: number; proficiente: boolean } | null {
  const forValor = valorFinalAtributo(selection, 'FOR');
  const desValor = valorFinalAtributo(selection, 'DES');
  const temAcuidade = arma.propriedades.includes('Acuidade');
  const eDistancia = arma.grupo.endsWith('-dist');

  let modAtributo: number | null = null;
  if (temAcuidade) {
    const forMod = forValor !== null ? modificador(forValor) : null;
    const desMod = desValor !== null ? modificador(desValor) : null;
    if (forMod !== null && desMod !== null) modAtributo = Math.max(forMod, desMod);
    else modAtributo = forMod ?? desMod;
  } else if (eDistancia) {
    modAtributo = desValor !== null ? modificador(desValor) : null;
  } else {
    modAtributo = forValor !== null ? modificador(forValor) : null;
  }
  if (modAtributo === null) return null;

  const classe = classeDaSelecao(selection);
  let proficiente = false;
  if (classe) {
    const linha = proficienciasArmaArmaduraClasse.find((p) => p.classe === classe.nome);
    if (linha) {
      const ehMarcial = arma.grupo.startsWith('armas-marciais');
      const textoProf = linha.proficienciaArmas;
      proficiente = ehMarcial ? textoProf.includes('Marciais') : textoProf.includes('Simples') || textoProf.includes('Marciais');
    }
  }
  const bonusProf = proficiente ? 2 : 0; // nível 1: bônus de proficiência sempre +2
  return { mod: modAtributo + bonusProf, proficiente };
}

/** Verifica se a classe do personagem é treinada na categoria de arma
 * ou armadura do item (pro filtro "só o que a classe usa bem"). */
export function classeEhProficiente(selection: WizardSelection, item: LojaItem): boolean {
  const classe = classeDaSelecao(selection);
  if (!classe) return true;
  const linha = proficienciasArmaArmaduraClasse.find((p) => p.classe === classe.nome);
  if (!linha) return true;
  if (item.grupo.startsWith('armas-marciais')) return linha.proficienciaArmas.includes('Marciais');
  if (item.grupo.startsWith('armas-simples')) return linha.proficienciaArmas.includes('Simples') || linha.proficienciaArmas.includes('Marciais');
  if (item.grupo === 'armadura-leve') return linha.treinamentoArmadura.includes('Leve');
  if (item.grupo === 'armadura-media') return linha.treinamentoArmadura.includes('Média');
  if (item.grupo === 'armadura-pesada') return linha.treinamentoArmadura.includes('Pesada');
  if (item.grupo === 'escudos') return linha.treinamentoArmadura.includes('Escudo');
  return true;
}

/** Soma o custo (em PO) dos itens no carrinho, usando o catálogo pra
 * achar o preço de cada nome. Itens não encontrados no catálogo (não
 * deveria acontecer, carrinho só adiciona itens da Loja) não somam. */
export function calcularCustoCarrinho(carrinho: ItemCarrinho[], catalogo: GrupoLoja[]): number {
  const precoPorNome = new Map<string, number>();
  for (const grupo of catalogo) {
    for (const item of grupo.itens) {
      if (item.custoPO !== null) precoPorNome.set(item.nome, item.custoPO);
    }
  }
  let total = 0;
  for (const it of carrinho) {
    const preco = precoPorNome.get(it.nome);
    if (preco !== undefined) total += preco * it.quantidade;
  }
  return total;
}
