// Mochila — Entrega A4. Junta os itens que Origem + Classe concederam
// no wizard, no formato que a aba Mochila espera (decisão "Itens de
// origem/classe já nascem no formato de Mochila", DECISOES-DESIGN.md).

import { origens } from '../data/rulesets/dnd2024/origens';
import { proficienciasIniciaisClasse } from '../data/rulesets/dnd2024/classesProficienciasIniciais';
import { buscarPesoItem } from '../data/rulesets/dnd2024/buscarDescricaoItem';
import { classeDaSelecao, type ExplicacaoCalculo } from './calculoPersonagem';
import { valorFinalAtributo, type WizardSelection } from './personagem';
import { identificarEquipamento } from './equipamento';

/**
 * Capacidade máxima de carga — confirmada na planilha mestra, aba
 * "Glossário de Regras", termo "Capacidade de Carga": a tabela oficial
 * (Livro do Jogador D&D 5e 2024) varia o multiplicador por Tamanho da
 * criatura — Minúsculo For×3,5kg; Pequeno/Médio For×7kg; Grande
 * For×13,5kg; Enorme For×27kg; Colossal For×54,5kg. Toda espécie
 * jogável deste projeto é Pequeno ou Médio (mesmo multiplicador —
 * índice 0 da tabela abaixo), então a fórmula não precisa ler o
 * Tamanho de verdade — só "quantos passos ACIMA do Pequeno/Médio"
 * (`passosTamanhoAcima`), hoje só usado por Golias: Porte Poderoso
 * (+1 passo, sempre) e Forma Grande (+1 passo A MAIS enquanto ativa —
 * ver `formaGrandeAtiva` abaixo). Ver DECISOES-FICHA.md.
 */
const MULTIPLICADOR_KG_POR_PASSO_DE_TAMANHO = [7, 13.5, 27, 54.5];

/** Quantos "passos de tamanho" acima do Pequeno/Médio contam pra
 * Capacidade de Carga — Porte Poderoso (Golias, sempre) + Forma
 * Grande (só enquanto o jogador marcou como ativa na Ficha, já que o
 * app não segue tempo real pra saber quando os 10 minutos acabam). */
function passosTamanhoAcimaParaCarga(selection: WizardSelection, formaGrandeAtiva: boolean): number {
  const portePoderoso = selection.especie === 'Golias' ? 1 : 0;
  const formaGrande = selection.especie === 'Golias' && formaGrandeAtiva ? 1 : 0;
  return portePoderoso + formaGrande;
}

function multiplicadorCarga(passosAcima: number): number {
  const indice = Math.min(passosAcima, MULTIPLICADOR_KG_POR_PASSO_DE_TAMANHO.length - 1);
  return MULTIPLICADOR_KG_POR_PASSO_DE_TAMANHO[indice];
}

/** `formaGrandeAtiva` — `true` só quando o Golias marcou a Forma
 * Grande como ativa na Ficha agora (ver `combat/BonusPanelContent`);
 * ausente/`false` em todo outro contexto (ex.: resumo do wizard, onde
 * a característica nem existe ainda). */
export function calcularCapacidadeMaxima(selection: WizardSelection, formaGrandeAtiva = false): number | null {
  const forValor = valorFinalAtributo(selection, 'FOR');
  if (forValor === null) return null;
  const multiplicador = multiplicadorCarga(passosTamanhoAcimaParaCarga(selection, formaGrandeAtiva));
  return Math.round(forValor * multiplicador);
}

export function explicarCapacidadeMaxima(selection: WizardSelection, formaGrandeAtiva = false): ExplicacaoCalculo {
  const forValor = valorFinalAtributo(selection, 'FOR');
  if (forValor === null) return { linhas: [], total: { label: 'Capacidade máxima de carga', valor: '—' } };
  const passos = passosTamanhoAcimaParaCarga(selection, formaGrandeAtiva);
  const multiplicador = multiplicadorCarga(passos);
  const linhas = [{ label: 'Força', valor: `${forValor}` }];
  if (passos === 0) {
    linhas.push({ label: `× ${multiplicador} kg (Tamanho Pequeno/Médio, tabela oficial)`, valor: '' });
  } else {
    const notaPorte = selection.especie === 'Golias' ? ' + Porte Poderoso' : '';
    const notaForma = formaGrandeAtiva ? ' + Forma Grande ativa' : '';
    linhas.push({
      label: `× ${multiplicador} kg (conta ${passos} tamanho${passos > 1 ? 's' : ''} acima de Pequeno/Médio${notaPorte}${notaForma}, tabela oficial)`,
      valor: '',
    });
  }
  return {
    linhas,
    total: { label: 'Capacidade máxima de carga', valor: `${calcularCapacidadeMaxima(selection, formaGrandeAtiva)} kg` },
  };
}

export interface ItemMochila {
  /** Identidade estável da linha — precisa pra +/- quantidade e
   * remover funcionarem em React sem depender do índice do array
   * (que muda assim que qualquer item é removido). */
  id: string;
  nome: string;
  quantidade: number;
  peso: string | null;
  /** De onde o item veio — só metadado/histórico agora (a Mochila é
   * uma lista única, ver DECISOES-FICHA.md "Mochila — decisões de arquitetura"), não controla mais agrupamento visual. 'Manual' é item
   * que o jogador adicionou direto na tela (ganhou em jogo, achou,
   * etc), sem passar pelo wizard/Loja. */
  origemDoItem: 'Origem' | 'Classe' | 'Loja' | 'Manual';
  /** Slot onde o item está equipado (ver `core/equipamento.ts`) —
   * `null`/ausente = só guardado na Mochila, não equipado. Só existe
   * de verdade pra itens que o catálogo reconhece como arma/armadura/
   * escudo; outros itens nunca ganham esse campo preenchido nessa
   * entrega (E2). */
  slot?: 'maoPrincipal' | 'maoSecundaria' | 'armadura' | 'escudo' | null;
  /** Só faz sentido pra arma Versátil na Mão Principal: true quando o
   * jogador escolheu empunhar com as 2 mãos (dado de dano maior, mas
   * ocupa a Mão Secundária também) — ver DECISOES-FICHA.md "Equipamento — mecanismo de equipar/CA/Atacar/Sintonização". */
  duasMaosAtivo?: boolean;
  /** Item mágico sintonizado (ver DECISOES-FICHA.md "Itens Mágicos — catálogo + Sintonizar na Mochila") — só faz
   * sentido pra itens que `itemExigeSintonizacao` reconhece
   * (`core/sintonizacao.ts`). Limite de 3 simultâneos é aplicado na
   * hora de ligar, não é uma trava de tipo aqui. */
  sintonizado?: boolean;
  /** Arma de pacto do Bruxo (Invocação Mística Pacto da Lâmina, ver
   * `core/pactoDaLamina.ts`) — conjurada, não "possuída" de verdade:
   * some da Mochila ao desvincular, em vez de ficar guardada. Usa
   * Carisma pro ataque em vez de Força/Destreza (`core/ataque.ts`). */
  armaDePacto?: boolean;
}

let contadorId = 0;
function gerarIdItem(): string {
  contadorId += 1;
  return `item-${Date.now()}-${contadorId}`;
}

/** Item adicionado manualmente na aba Mochila (ganhou em jogo, achou,
 * etc) — peso vem do catálogo se o nome bater com algo conhecido,
 * senão fica sem peso cadastrado (mesmo tratamento de qualquer outro
 * item sem peso na planilha). */
export function criarItemManual(nome: string, quantidade: number): ItemMochila {
  return { id: gerarIdItem(), nome, quantidade, peso: buscarPesoItem(nome), origemDoItem: 'Manual' };
}

/** Placeholders de grupo de ferramenta (ver origens.ts) que precisam
 * virar o nome real escolhido no wizard. */
const PLACEHOLDERS_FERRAMENTA = ['Instrumento Musical', 'Ferramentas de Artesão', 'Kit de Jogos'];

/**
 * Kits de Equipamento de Aventura (ex: "Kit de Explorador de
 * Masmorras") vêm como 1 item na planilha, mas na verdade são um saco
 * de itens de verdade — o jogador consome cada um separado (a Tocha
 * acaba, a Corda pode ser cortada), não faz sentido a Mochila mostrar
 * "1× Kit" depois que a compra já foi feita. Desagregado item a item
 * contra a aba "Kits — Conteúdo" da planilha mestra (lista oficial,
 * não o texto solto de "Contém:" de outras abas) e contra o nome exato
 * de cada item em equipamentoAventura.ts (alguns têm nome diferente do
 * texto da planilha, ex: "Cantil" na lista é "Cantil (cheio)" como
 * item de verdade, "Fantasias"/"Roupas Finas" são "Roupas, Fantasia"/
 * "Roupas, Finas").
 *
 * Todos os 7 kits com lista de itens na aba "Kits — Conteúdo" estão
 * verificados. Kit de Curandeiro e Kit de Escalada NÃO são
 * desagregáveis (são item único de uso próprio, não um saco de itens)
 * — confirmado pela mesma aba, que não lista itens pra eles.
 */
const DESAGREGACAO_KITS: Record<string, { nome: string; quantidade: number }[]> = {
  'Kit de Explorador de Masmorras': [
    { nome: 'Caixa para Fogo', quantidade: 1 },
    { nome: 'Cantil (cheio)', quantidade: 1 },
    { nome: 'Corda', quantidade: 1 },
    { nome: 'Estrepes', quantidade: 1 },
    { nome: 'Mochila', quantidade: 1 },
    { nome: 'Óleo', quantidade: 2 },
    { nome: 'Pé de Cabra', quantidade: 1 },
    { nome: 'Rações', quantidade: 10 },
    { nome: 'Tocha', quantidade: 10 },
  ],
  'Kit de Artista': [
    { nome: 'Caixa para Fogo', quantidade: 1 },
    { nome: 'Cantil (cheio)', quantidade: 1 },
    { nome: 'Espelho', quantidade: 1 },
    { nome: 'Roupas, Fantasia', quantidade: 3 },
    { nome: 'Lanterna Foca-facho', quantidade: 1 },
    { nome: 'Mochila', quantidade: 1 },
    { nome: 'Óleo', quantidade: 8 },
    { nome: 'Rações', quantidade: 9 },
    { nome: 'Saco de Dormir', quantidade: 1 },
    { nome: 'Sino', quantidade: 1 },
  ],
  'Kit de Assaltante': [
    { nome: 'Caixa para Fogo', quantidade: 1 },
    { nome: 'Cantil (cheio)', quantidade: 1 },
    { nome: 'Corda', quantidade: 1 },
    { nome: 'Esferas de Metal', quantidade: 1 },
    { nome: 'Lanterna Coberta', quantidade: 1 },
    { nome: 'Mochila', quantidade: 1 },
    { nome: 'Óleo', quantidade: 7 },
    { nome: 'Pé de Cabra', quantidade: 1 },
    { nome: 'Rações', quantidade: 5 },
    { nome: 'Sino', quantidade: 1 },
    { nome: 'Vela', quantidade: 10 },
  ],
  'Kit de Aventureiro': [
    { nome: 'Caixa para Fogo', quantidade: 1 },
    { nome: 'Cantil (cheio)', quantidade: 1 },
    { nome: 'Corda', quantidade: 1 },
    { nome: 'Mochila', quantidade: 1 },
    { nome: 'Óleo', quantidade: 2 },
    { nome: 'Rações', quantidade: 10 },
    { nome: 'Saco de Dormir', quantidade: 1 },
    { nome: 'Tocha', quantidade: 10 },
  ],
  'Kit de Diplomata': [
    { nome: 'Baú', quantidade: 1 },
    { nome: 'Caixa para Fogo', quantidade: 1 },
    { nome: 'Caneta Tinteiro', quantidade: 5 },
    { nome: 'Estojo, Mapa ou Pergaminho', quantidade: 2 },
    { nome: 'Lâmpada', quantidade: 1 },
    { nome: 'Óleo', quantidade: 4 },
    { nome: 'Perfume', quantidade: 1 },
    { nome: 'Papel', quantidade: 5 },
    { nome: 'Pergaminho', quantidade: 5 },
    { nome: 'Roupas, Finas', quantidade: 1 },
    { nome: 'Tinta', quantidade: 1 },
  ],
  'Kit de Erudito': [
    { nome: 'Caixa para Fogo', quantidade: 1 },
    { nome: 'Caneta Tinteiro', quantidade: 1 },
    { nome: 'Lâmpada', quantidade: 1 },
    { nome: 'Livro', quantidade: 1 },
    { nome: 'Mochila', quantidade: 1 },
    { nome: 'Óleo', quantidade: 10 },
    { nome: 'Pergaminho', quantidade: 10 },
    { nome: 'Tinta', quantidade: 1 },
  ],
  'Kit de Sacerdote': [
    { nome: 'Água Benta', quantidade: 1 },
    { nome: 'Caixa para Fogo', quantidade: 1 },
    { nome: 'Cobertor', quantidade: 1 },
    { nome: 'Lâmpada', quantidade: 1 },
    { nome: 'Mochila', quantidade: 1 },
    { nome: 'Rações', quantidade: 7 },
    { nome: 'Túnica', quantidade: 1 },
  ],
};

/**
 * Armadura/Escudo do equipamento inicial já nascem equipados (é o que
 * o jogador está vestindo ao começar a aventura) — só a primeira
 * Armadura e o primeiro Escudo que aparecerem, se já não tiver algo
 * no slot. Arma não entra aqui de propósito: "o que está na mão" é
 * uma escolha mais explícita do jogador, fica pra ele equipar na
 * Mochila (ver DECISOES-FICHA.md "Equipamento — mecanismo de equipar/CA/Atacar/Sintonização").
 */
function slotInicialAutomatico(itensJaAdicionados: ItemMochila[], nome: string): ItemMochila['slot'] {
  const info = identificarEquipamento(nome);
  if (info.tipo === 'armadura' && !itensJaAdicionados.some((it) => it.slot === 'armadura')) return 'armadura';
  if (info.tipo === 'escudo' && !itensJaAdicionados.some((it) => it.slot === 'escudo')) return 'escudo';
  return null;
}

function adicionarItem(itens: ItemMochila[], nome: string, quantidade: number, origemDoItem: 'Origem' | 'Classe' | 'Loja') {
  const componentes = DESAGREGACAO_KITS[nome];
  if (componentes) {
    for (const c of componentes) {
      itens.push({
        id: gerarIdItem(),
        nome: c.nome,
        quantidade: c.quantidade * quantidade,
        peso: buscarPesoItem(c.nome),
        origemDoItem,
      });
    }
    return;
  }
  itens.push({
    id: gerarIdItem(),
    nome,
    quantidade,
    peso: buscarPesoItem(nome),
    origemDoItem,
    slot: slotInicialAutomatico(itens, nome),
  });
}

export function calcularItensIniciais(selection: WizardSelection): ItemMochila[] {
  const itens: ItemMochila[] = [];

  const origem = origens.find((o) => o.nome === selection.origem);
  if (origem && selection.equipamentoOrigemEscolhido === 'A') {
    for (const item of origem.equipamentoOpcaoA.itens) {
      const nome =
        PLACEHOLDERS_FERRAMENTA.includes(item.nome) && selection.ferramentaOrigemEscolhida
          ? selection.ferramentaOrigemEscolhida
          : item.nome;
      adicionarItem(itens, nome, item.quantidade, 'Origem');
    }
  }

  const classe = classeDaSelecao(selection);
  if (classe && selection.equipamentoClasseEscolhido) {
    const proficiencias = proficienciasIniciaisClasse[classe.id];
    const opcao = proficiencias?.equipamentoInicial.find((o) => o.rotulo === selection.equipamentoClasseEscolhido);
    if (opcao) {
      for (const item of opcao.itens) {
        const nome =
          PLACEHOLDERS_FERRAMENTA.includes(item.nome) && selection.ferramentasClasseEscolhidas[0]
            ? selection.ferramentasClasseEscolhidas[0]
            : item.nome;
        adicionarItem(itens, nome, item.quantidade, 'Classe');
      }
    }
  }

  for (const item of selection.itens) {
    adicionarItem(itens, item.nome, item.quantidade, 'Loja');
  }

  return itens;
}

/** "12,5 kg" → 12.5. "250 g" → 0.25 (planilha usa gramas pra itens
 * leves — bug real: antes só reconhecia "kg", então "Espelho" (250 g)
 * e outros itens sub-1kg caíam em "sem peso cadastrado" mesmo tendo
 * peso de verdade). "—" (sem peso, item negligenciável) → 0. Peso
 * desconhecido (não cadastrado na planilha) → null. */
function parseKg(peso: string): number | null {
  if (peso.trim() === '—') return 0;
  const matchKg = peso.match(/([\d.,]+)\s*kg/i);
  if (matchKg) return parseFloat(matchKg[1].replace(',', '.'));
  const matchG = peso.match(/([\d.,]+)\s*g\b/i);
  if (matchG) return parseFloat(matchG[1].replace(',', '.')) / 1000;
  return null;
}

/** Peso da LINHA (peso unitário × quantidade), formatado — ex: "1×" em
 * "8× Azagaia" a 1 kg cada mostrava só "1 kg" antes, o que parecia
 * "não calcular nada"; agora mostra "8 kg" (o total daquela linha). */
export function pesoDaLinha(item: ItemMochila): string {
  if (!item.peso) return '— (sem peso cadastrado)';
  const valor = parseKg(item.peso);
  if (valor === null) return '— (sem peso cadastrado)';
  const total = Math.round(valor * item.quantidade * 100) / 100;
  return `${total.toString().replace('.', ',')} kg`;
}

export interface CargaTotal {
  kg: number;
  itensSemPeso: number;
}

/** Soma o peso de todos os itens (× quantidade). Itens sem peso
 * cadastrado na planilha entram na contagem `itensSemPeso` em vez de
 * serem tratados como 0 kg — não é pra fingir uma carga exata que a
 * gente não tem como calcular direito ainda. */
export function calcularCargaTotal(itens: ItemMochila[]): CargaTotal {
  let kg = 0;
  let itensSemPeso = 0;
  for (const item of itens) {
    if (!item.peso) {
      itensSemPeso += 1;
      continue;
    }
    const valor = parseKg(item.peso);
    if (valor === null) {
      itensSemPeso += 1;
      continue;
    }
    kg += valor * item.quantidade;
  }
  return { kg: Math.round(kg * 10) / 10, itensSemPeso };
}
