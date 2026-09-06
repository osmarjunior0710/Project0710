// Motor de cálculo da Ficha — Entrega A1. Fórmulas especificadas em
// PENDENCIAS.md ("Motor de cálculo da Ficha final ainda não existe").
// Zero constante de D&D hardcoded aqui: tudo lido de data/rulesets/.

import { atributosOrdem, type Atributo } from '../data/wizardFixtures';
import { classes, type Classe } from '../data/rulesets/dnd2024/classes';
import { origens } from '../data/rulesets/dnd2024/origens';
import { armaduras } from '../data/rulesets/dnd2024/armaduras';
import { pericias } from '../data/rulesets/dnd2024/pericias';
import { gruposFerramenta } from '../data/rulesets/dnd2024/ferramentas';
import { talentos, type EfeitoMecanicoTalento } from '../data/rulesets/dnd2024/talentos';
import { estilosDeLuta } from '../data/rulesets/dnd2024/estilosDeLuta';
import { proficienciasIniciaisClasse } from '../data/rulesets/dnd2024/classesProficienciasIniciais';
import { modificador, valorFinalAtributo, type WizardSelection } from './personagem';
import { resumoEquipado } from './equipamento';
import { caracteristicaDesbloqueada } from './levelUp';
import type { ItemMochila } from './mochila';

const ATRIBUTO_POR_NOME_COMPLETO: Record<string, Atributo> = {
  Força: 'FOR',
  Destreza: 'DES',
  Constituição: 'CON',
  Inteligência: 'INT',
  Sabedoria: 'SAB',
  Carisma: 'CAR',
};

/** Procura, entre os IDs de talento em `talentosAtuais`, um cujo
 * `efeitoMecanico.tipo` seja `tipo` — devolve o efeito inteiro (já
 * tipado) ou `null`. Usado pelos cálculos da Fase 4 (Alerta, Mestre
 * em Armaduras Médias, ...) pra não repetir o mesmo `.find()` em cada
 * função. */
export function efeitoMecanicoDoTalento<T extends EfeitoMecanicoTalento['tipo']>(
  talentosAtuais: string[] | undefined,
  tipo: T,
): Extract<EfeitoMecanicoTalento, { tipo: T }> | null {
  if (!talentosAtuais || talentosAtuais.length === 0) return null;
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === tipo) {
      return t.efeitoMecanico as Extract<EfeitoMecanicoTalento, { tipo: T }>;
    }
  }
  return null;
}

function temEfeitoMecanico(talentosAtuais: string[] | undefined, tipo: EfeitoMecanicoTalento['tipo']): boolean {
  return efeitoMecanicoDoTalento(talentosAtuais, tipo) !== null;
}

export function classeDaSelecao(selection: WizardSelection): Classe | null {
  return classes.find((c) => c.nome === selection.classe) ?? null;
}

function parseDadoDeVida(dado: string): number {
  return parseInt(dado.replace(/[^0-9]/g, ''), 10) || 8;
}

export function bonusProficiencia(classe: Classe, nivel: number): number {
  const linha = classe.progressao.find((p) => p.nivel === nivel) ?? classe.progressao[0];
  return parseInt(linha.bonusProficiencia.replace(/[^0-9]/g, ''), 10) || 2;
}

/** Tenacidade Anã (Anão): PV máximo +1 já no nível 1, e mais +1 a cada
 * nível ganho depois — único traço de espécie hoje que afeta PV
 * máximo diretamente (nenhuma sub-escolha envolvida, vale pra todo
 * Anão). Reaproveitado por `calcularPvMaximoNivel1`/
 * `explicarPvMaximoNivel1` (nível 1) e por quem soma PV de Level Up
 * (`LevelUpShell`, `levelUpAleatorio.ts`, `geradorPersonagemTeste.ts`)
 * — cada um soma esse mesmo valor 1x por nível ganho. */
export function bonusPvPorNivelDaEspecie(selection: WizardSelection): number {
  return selection.especie === 'Anão' ? 1 : 0;
}

/** Talento de Origem com `efeitoMecanico.tipo === 'bonus-pv-por-nivel'`
 * (hoje só Vigoroso, Origem Fazendeiro) — `null` se a origem atual não
 * tiver um. Só olha o talento da ORIGEM (nunca `talentosGeraisAtuais`)
 * porque esse tipo de talento é categoria "Origem": só alcançável pela
 * Origem ou pelo traço Versátil do Humano (ambos resolvidos no nível 1
 * da criação — ver `PENDENCIAS.md`/`EmDev.md` sobre o gap do Versátil). */
function talentoComBonusPvPorNivel(selection: WizardSelection) {
  const origemSelecionada = origens.find((o) => o.nome === selection.origem);
  const talento = origemSelecionada ? talentos.find((t) => t.id === origemSelecionada.talentoOrigemId) : undefined;
  return talento?.efeitoMecanico?.tipo === 'bonus-pv-por-nivel' ? talento : null;
}

/** Vigoroso: PV máximo +2 por nível de personagem. O livro descreve
 * como "+2x nível ao pegar o talento, +2 a cada nível seguinte" — como
 * só é alcançável no nível 1 da criação (ver `talentoComBonusPvPorNivel`),
 * isso colapsa num valor fixo por nível, mesmo padrão de
 * `bonusPvPorNivelDaEspecie` (Tenacidade Anã). Reaproveitado nos mesmos
 * lugares (nível 1 e cada Level Up). */
export function bonusPvPorNivelDoTalento(selection: WizardSelection): number {
  const talento = talentoComBonusPvPorNivel(selection);
  return talento?.efeitoMecanico?.tipo === 'bonus-pv-por-nivel' ? talento.efeitoMecanico.porNivel : 0;
}

/** Nome do talento por trás de `bonusPvPorNivelDoTalento` (ex.:
 * "Vigoroso") — `null` se nenhum ativo. Só pro texto explicativo. */
export function nomeTalentoBonusPvPorNivel(selection: WizardSelection): string | null {
  return talentoComBonusPvPorNivel(selection)?.nome ?? null;
}

/** Nomes de todo bônus fixo de PV-por-nível já ativo (espécie e/ou
 * talento) — usado só pra montar o texto explicativo ("Tenacidade Anã",
 * "Vigoroso", etc.), nunca pro valor em si. */
export function rotulosBonusPvPorNivel(selection: WizardSelection): string[] {
  const rotulos: string[] = [];
  if (bonusPvPorNivelDaEspecie(selection) > 0) rotulos.push('Tenacidade Anã');
  const nomeTalento = nomeTalentoBonusPvPorNivel(selection);
  if (nomeTalento) rotulos.push(nomeTalento);
  return rotulos;
}

/**
 * Nível 1 nunca rola nem tira média — dado de vida MÁXIMO + mod. CON.
 * Exceções de classe pra PV (nenhuma conhecida hoje) entrariam aqui.
 */
export function calcularPvMaximoNivel1(selection: WizardSelection): number | null {
  const classe = classeDaSelecao(selection);
  const conValor = valorFinalAtributo(selection, 'CON');
  if (!classe || conValor === null) return null;
  return (
    parseDadoDeVida(classe.dadoDeVida) +
    modificador(conValor) +
    bonusPvPorNivelDaEspecie(selection) +
    bonusPvPorNivelDoTalento(selection)
  );
}

/** Item de armadura (se houver) escolhido no equipamento inicial da classe. */
function armaduraEquipadaInicial(selection: WizardSelection): (typeof armaduras)[number] | null {
  const classe = classeDaSelecao(selection);
  if (!classe || !selection.equipamentoClasseEscolhido) return null;
  const proficiencias = proficienciasIniciaisClasse[classe.id];
  if (!proficiencias) return null;
  const opcao = proficiencias.equipamentoInicial.find((o) => o.rotulo === selection.equipamentoClasseEscolhido);
  if (!opcao) return null;
  for (const item of opcao.itens) {
    const armadura = armaduras.find((a) => a.nome === item.nome);
    if (armadura) return armadura;
  }
  return null;
}

/** `tetoDesOverride` substitui o teto de mod. Destreza lido da planilha
 * (ex: Mestre em Armaduras Médias eleva de 2 pra 3) — sem efeito em
 * armadura sem teto (Leve) ou de valor fixo (Pesada). */
function caPelaArmadura(classeArmadura: string, desMod: number, tetoDesOverride?: number): number {
  const fixo = classeArmadura.match(/^(\d+)$/);
  if (fixo) return parseInt(fixo[1], 10);
  const comTeto = classeArmadura.match(/^(\d+)\s*\+\s*modificador de Des\s*\(máx\.?\s*(\d+)\)$/i);
  if (comTeto) {
    const teto = tetoDesOverride ?? parseInt(comTeto[2], 10);
    return parseInt(comTeto[1], 10) + Math.min(desMod, teto);
  }
  const semTeto = classeArmadura.match(/^(\d+)\s*\+\s*modificador de Des$/i);
  if (semTeto) return parseInt(semTeto[1], 10) + desMod;
  return 10 + desMod;
}

/**
 * CA nível 1. Exceções de classe (Bárbaro/Monge, ver DECISOES-DESIGN.md
 * "Cálculo de CA") entram aqui como lookup por classeId, checado ANTES
 * da fórmula padrão — nenhuma das duas está importada ainda, então não
 * há entrada no lookup por enquanto.
 */
export function calcularCA(selection: WizardSelection): number | null {
  const desValor = valorFinalAtributo(selection, 'DES');
  if (desValor === null) return null;
  const desMod = modificador(desValor);
  const armadura = armaduraEquipadaInicial(selection);
  if (!armadura) return 10 + desMod;
  return caPelaArmadura(armadura.classeArmadura, desMod);
}

/** Bônus de CA de um Escudo, a partir do texto da coluna "Classe de
 * Armadura" na planilha (hoje sempre "+2", mas lido do dado mesmo
 * assim — zero constante de D&D hardcoded). */
function bonusEscudo(classeArmaduraEscudo: string): number {
  const m = classeArmaduraEscudo.match(/\+(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * CA lida do que está EQUIPADO AGORA na Mochila (Armadura + Escudo nos
 * slots — ver `core/equipamento.ts`), não da escolha do wizard na
 * criação (essa continua em `calcularCA`, usada só no Resumo do
 * wizard, antes da Mochila existir como estado). Sem armadura
 * equipada = 10 + mod. Destreza (padrão "sem armadura").
 */
/** Bônus de CA dos talentos/Estilo de Luta já implementados na Fase 4
 * (Defensivo, Mestre em Armaduras Médias) — reaproveitado por
 * `calcularCAEquipado` e `explicarCAEquipado`. */
function bonusCaFase4(
  armaduraCatalogo: (typeof armaduras)[number] | undefined,
  desValor: number,
  estiloDeLutaEscolhido: string | null | undefined,
  talentosAtuais: string[] | undefined,
) {
  const estilo = estiloDeLutaEscolhido ? estilosDeLuta.find((e) => e.nome === estiloDeLutaEscolhido) : undefined;
  const defensivoBonus =
    armaduraCatalogo && estilo?.efeitoMecanico?.tipo === 'bonus-ca-com-armadura' ? estilo.efeitoMecanico.bonus : 0;
  const mestreArmadurasMedias = efeitoMecanicoDoTalento(talentosAtuais, 'teto-des-armadura-media');
  const usaTetoMestre =
    mestreArmadurasMedias !== null && armaduraCatalogo?.categoria.startsWith('Armadura Média') === true && desValor >= mestreArmadurasMedias.desMinima;
  return { defensivoBonus, tetoDesOverride: usaTetoMestre ? mestreArmadurasMedias.tetoDes : undefined };
}

export function calcularCAEquipado(
  itensMochila: ItemMochila[],
  desValor: number,
  estiloDeLutaEscolhido?: string | null,
  talentosAtuais?: string[],
): number {
  const desMod = modificador(desValor);
  const { armadura, escudo } = resumoEquipado(itensMochila);
  const armaduraCatalogo = armadura ? armaduras.find((a) => a.nome === armadura.nome) : undefined;
  const { defensivoBonus, tetoDesOverride } = bonusCaFase4(armaduraCatalogo, desValor, estiloDeLutaEscolhido, talentosAtuais);
  const base = armaduraCatalogo ? caPelaArmadura(armaduraCatalogo.classeArmadura, desMod, tetoDesOverride) : 10 + desMod;
  const escudoCatalogo = escudo ? armaduras.find((a) => a.nome === escudo.nome) : undefined;
  const bonus = escudoCatalogo ? bonusEscudo(escudoCatalogo.classeArmadura) : 0;
  return base + bonus + defensivoBonus;
}

/** Explicação estruturada da `calcularCAEquipado`, pro popup do "ⓘ". */
export function explicarCAEquipado(
  itensMochila: ItemMochila[],
  desValor: number,
  estiloDeLutaEscolhido?: string | null,
  talentosAtuais?: string[],
): ExplicacaoCalculo {
  const desMod = modificador(desValor);
  const { armadura, escudo } = resumoEquipado(itensMochila);
  const armaduraCatalogo = armadura ? armaduras.find((a) => a.nome === armadura.nome) : undefined;
  const escudoCatalogo = escudo ? armaduras.find((a) => a.nome === escudo.nome) : undefined;
  const bonus = escudoCatalogo ? bonusEscudo(escudoCatalogo.classeArmadura) : 0;
  const { defensivoBonus, tetoDesOverride } = bonusCaFase4(armaduraCatalogo, desValor, estiloDeLutaEscolhido, talentosAtuais);

  const linhas: LinhaExplicacao[] = [];
  let base: number;
  if (!armaduraCatalogo) {
    linhas.push({ label: 'Sem armadura (base)', valor: '10' });
    linhas.push({ label: 'mod. Destreza', valor: fmtMod(desMod) });
    base = 10 + desMod;
  } else {
    const ca = caPelaArmadura(armaduraCatalogo.classeArmadura, desMod, tetoDesOverride);
    const teto = armaduraCatalogo.classeArmadura.match(/máx\.?\s*(\d+)/i);
    const baseMatch = armaduraCatalogo.classeArmadura.match(/^(\d+)/);
    const baseArmadura = baseMatch ? parseInt(baseMatch[1], 10) : ca - desMod;
    linhas.push({ label: `${armaduraCatalogo.nome} (base)`, valor: `${baseArmadura}` });
    linhas.push({
      label: teto
        ? `mod. Destreza (máx. ${tetoDesOverride ?? teto[1]}${tetoDesOverride !== undefined ? ' — Mestre em Armaduras Médias' : ''})`
        : 'mod. Destreza',
      valor: fmtMod(ca - baseArmadura),
    });
    base = ca;
  }
  if (escudoCatalogo) {
    linhas.push({ label: `${escudoCatalogo.nome} equipado`, valor: fmtMod(bonus) });
  }
  if (defensivoBonus > 0) {
    linhas.push({ label: 'Estilo de Luta: Defensivo', valor: fmtMod(defensivoBonus) });
  }
  return {
    linhas,
    total: { label: 'Classe de Armadura', valor: `${base + bonus + defensivoBonus}` },
  };
}

function proficienteEmPericia(selection: WizardSelection, pericia: string): boolean {
  const origem = origens.find((o) => o.nome === selection.origem);
  if (origem?.pericias.includes(pericia)) return true;
  return selection.periciasClasseEscolhidas.includes(pericia);
}

export function calcularPercepcaoPassiva(selection: WizardSelection, nivel: number = 1): number | null {
  const sabValor = valorFinalAtributo(selection, 'SAB');
  const classe = classeDaSelecao(selection);
  if (sabValor === null || !classe) return null;
  const proficiente = proficienteEmPericia(selection, 'Percepção');
  const bonus = proficiente ? bonusProficiencia(classe, nivel) : 0;
  return 10 + modificador(sabValor) + bonus;
}

/** `classe`/`nivel`/`talentosAtuais` só entram no cálculo pro bônus do
 * talento Alerta (Fase 4) — opcionais porque `calcularIniciativa`
 * também é chamada no Resumo do wizard, antes de o personagem ter
 * nível/talentos de verdade. */
export function calcularIniciativa(
  selection: WizardSelection,
  classe?: Classe | null,
  nivel?: number,
  talentosAtuais?: string[],
): number | null {
  const desValor = valorFinalAtributo(selection, 'DES');
  if (desValor === null) return null;
  const temAlerta = temEfeitoMecanico(talentosAtuais, 'bonus-iniciativa-bonus-proficiencia');
  const bonusAlerta = temAlerta && classe && nivel ? bonusProficiencia(classe, nivel) : 0;
  return modificador(desValor) + bonusAlerta;
}

export interface AtributoFinal {
  atributo: Atributo;
  valor: number;
  mod: number;
}

export function calcularAtributosFinais(selection: WizardSelection): AtributoFinal[] {
  return atributosOrdem
    .map((atributo) => {
      const valor = valorFinalAtributo(selection, atributo);
      return valor === null ? null : { atributo, valor, mod: modificador(valor) };
    })
    .filter((a): a is AtributoFinal => a !== null);
}

export interface LinhaExplicacao {
  label: string;
  valor: string;
}

/** Explicação estruturada pro popup do "ⓘ": cada linha é uma parcela
 * da conta (efeito à esquerda, valor à direita), `total` é a última
 * linha, destacada. */
export interface ExplicacaoCalculo {
  linhas: LinhaExplicacao[];
  total: LinhaExplicacao;
}

function fmtMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export interface PericiaFinal {
  nome: string;
  atributo: Atributo;
  mod: number;
  proficiente: boolean;
  especialista: boolean;
  explicacao: ExplicacaoCalculo;
}

/** Nomes das perícias em que o personagem é proficiente (Origem fixa +
 * escolha de Classe) — mesmo conjunto usado por `calcularPericias`,
 * exposto à parte porque o Level Up (Etapa "Especialista" do Bardo)
 * precisa saber quais perícias dá pra escolher pra Especialização sem
 * duplicar essa lógica. */
export function periciasProficientes(selection: WizardSelection): string[] {
  const origem = origens.find((o) => o.nome === selection.origem);
  const periciaEspecie = selection.periciaEspecieEscolhida ? [selection.periciaEspecieEscolhida] : [];
  const nomesPericias = new Set(pericias.map((p) => p.nome));
  const periciasDoTalento = [
    ...selection.proficienciasTalentoOrigemEscolhidas,
    ...selection.proficienciasTalentoEspecieEscolhidas,
  ].filter((nome) => nomesPericias.has(nome));
  return [
    ...new Set<string>([...(origem?.pericias ?? []), ...selection.periciasClasseEscolhidas, ...periciaEspecie, ...periciasDoTalento]),
  ];
}

/** As 18 perícias do jogo, sempre — não só as proficientes. Cada uma
 * traz o Bônus de Proficiência certo pro estado do personagem:
 * dobrado se for Especialista, inteiro se só proficiente, metade
 * (arredondado pra baixo) se a classe tiver "Pau pra Toda Obra"
 * (Bardo nível 2 — característica genérica por nome, igual
 * `niveisComEspecialista`, não hardcoded pra Bardo) e não for
 * proficiente, ou nenhum bônus nos outros casos. */
export function calcularPericias(
  selection: WizardSelection,
  nivel: number,
  periciasEspecialista: string[] = [],
  periciasBonusExtras: string[] = [],
): PericiaFinal[] {
  const classe = classeDaSelecao(selection);
  if (!classe) return [];
  const proficientes = new Set([...periciasProficientes(selection), ...periciasBonusExtras]);
  const bonus = bonusProficiencia(classe, nivel);
  const temPauParaTodaObra = caracteristicaDesbloqueada(classe, 'Pau pra Toda Obra', nivel) !== null;
  const resultado: PericiaFinal[] = [];
  for (const pericia of pericias) {
    const atributo = ATRIBUTO_POR_NOME_COMPLETO[pericia.atributo];
    const valorAtributo = atributo ? valorFinalAtributo(selection, atributo) : null;
    if (!atributo || valorAtributo === null) continue;
    const atribMod = modificador(valorAtributo);
    const proficiente = proficientes.has(pericia.nome);
    const especialista = proficiente && periciasEspecialista.includes(pericia.nome);
    let bonusFinal = 0;
    let labelBonus = 'Sem proficiência';
    if (especialista) {
      bonusFinal = bonus * 2;
      labelBonus = 'Bônus de Proficiência (Especialista, dobrado)';
    } else if (proficiente) {
      bonusFinal = bonus;
      labelBonus = 'Bônus de Proficiência (proficiente)';
    } else if (temPauParaTodaObra) {
      bonusFinal = Math.floor(bonus / 2);
      labelBonus = 'Metade do Bônus de Proficiência (Pau pra Toda Obra, arredondado pra baixo)';
    }
    resultado.push({
      nome: pericia.nome,
      atributo,
      mod: atribMod + bonusFinal,
      proficiente,
      especialista,
      explicacao: {
        linhas: [
          { label: `mod. ${atributo}`, valor: fmtMod(atribMod) },
          ...(bonusFinal !== 0 ? [{ label: labelBonus, valor: fmtMod(bonusFinal) }] : []),
        ],
        total: { label: pericia.nome, valor: fmtMod(atribMod + bonusFinal) },
      },
    });
  }
  return resultado;
}

/** Atributo (nome completo) de cada ferramenta do catálogo, achatando
 * `gruposFerramenta` — mesma ferramenta pode aparecer em mais de um
 * grupo (ex: "Ferramentas de Ladrão"), sempre com o mesmo atributo. */
const ATRIBUTO_DA_FERRAMENTA: Record<string, string | null> = Object.fromEntries(
  Object.values(gruposFerramenta)
    .flat()
    .map((f) => [f.nome, f.atributo]),
);

/** Nomes das ferramentas em que o personagem é proficiente — Origem
 * (fixa ou escolhida), Classe, e a parte de
 * `proficienciasTalentoOrigemEscolhidas`/`proficienciasTalentoEspecieEscolhidas`
 * (Versátil) que não é nome de perícia (ex: as 3 escolhas de
 * Habilidoso, quando o jogador mistura perícia e ferramenta). */
export function ferramentasProficientes(selection: WizardSelection): string[] {
  const origem = origens.find((o) => o.nome === selection.origem);
  const nomesPericias = new Set(pericias.map((p) => p.nome));
  const ferramentasDoTalento = [
    ...selection.proficienciasTalentoOrigemEscolhidas,
    ...selection.proficienciasTalentoEspecieEscolhidas,
  ].filter((nome) => !nomesPericias.has(nome));
  const daOrigem: string[] = [];
  if (origem) {
    if (origem.ferramenta.categoria === 'fixa') {
      daOrigem.push(origem.ferramenta.nome);
    } else if (selection.ferramentaOrigemEscolhida) {
      daOrigem.push(selection.ferramentaOrigemEscolhida);
    }
  }
  return [...new Set([...daOrigem, ...selection.ferramentasClasseEscolhidas, ...ferramentasDoTalento])];
}

export interface FerramentaFinal {
  nome: string;
  atributo: Atributo | null;
  mod: number;
  explicacao: ExplicacaoCalculo;
}

/** Só as ferramentas em que o personagem É proficiente (diferente de
 * `calcularPericias`, que lista as 18 sempre) — a lista de proficiência
 * de ferramenta não tem um catálogo fechado pra "todas, marcando quem
 * tem", então só faz sentido mostrar o que o personagem realmente tem. */
export function calcularProficienciasFerramenta(selection: WizardSelection, nivel: number): FerramentaFinal[] {
  const classe = classeDaSelecao(selection);
  if (!classe) return [];
  const bonus = bonusProficiencia(classe, nivel);
  const resultado: FerramentaFinal[] = [];
  for (const nome of ferramentasProficientes(selection)) {
    const atributoCompleto = ATRIBUTO_DA_FERRAMENTA[nome] ?? null;
    const atributo = atributoCompleto ? (ATRIBUTO_POR_NOME_COMPLETO[atributoCompleto] ?? null) : null;
    const valorAtributo = atributo ? valorFinalAtributo(selection, atributo) : null;
    const atribMod = valorAtributo !== null ? modificador(valorAtributo) : 0;
    resultado.push({
      nome,
      atributo,
      mod: atribMod + bonus,
      explicacao: {
        linhas: [
          ...(atributo ? [{ label: `mod. ${atributo}`, valor: fmtMod(atribMod) }] : []),
          { label: 'Bônus de Proficiência', valor: fmtMod(bonus) },
        ],
        total: { label: nome, valor: fmtMod(atribMod + bonus) },
      },
    });
  }
  return resultado;
}

/** Explicação estruturada pro "ⓘ" ao lado de cada número calculado —
 * mesma lógica das funções calcular*, formatada em linhas pro popup. */
export function explicarPvMaximoNivel1(selection: WizardSelection): ExplicacaoCalculo {
  const classe = classeDaSelecao(selection);
  const conValor = valorFinalAtributo(selection, 'CON');
  if (!classe || conValor === null) {
    return { linhas: [], total: { label: 'Pontos de Vida máximos', valor: '—' } };
  }
  const dado = parseDadoDeVida(classe.dadoDeVida);
  const conMod = modificador(conValor);
  const bonusEspecie = bonusPvPorNivelDaEspecie(selection);
  const bonusTalento = bonusPvPorNivelDoTalento(selection);
  const linhas = [
    { label: `Dado de Vida máximo da classe (${classe.dadoDeVida})`, valor: `${dado}` },
    { label: 'mod. Constituição', valor: fmtMod(conMod) },
  ];
  if (bonusEspecie > 0) linhas.push({ label: 'Tenacidade Anã', valor: fmtMod(bonusEspecie) });
  if (bonusTalento > 0) linhas.push({ label: nomeTalentoBonusPvPorNivel(selection)!, valor: fmtMod(bonusTalento) });
  return {
    linhas,
    total: { label: 'Pontos de Vida máximos', valor: `${dado + conMod + bonusEspecie + bonusTalento}` },
  };
}

/** Explicação de PV pra Ficha (pós-criação) — diferente de
 * `explicarPvMaximoNivel1` (usada só no resumo do wizard, nível 1),
 * essa reflete o PV máximo ATUAL do personagem (`pvMaxAtual`, já
 * somando todo Level Up feito). Bug reportado pelo Osmar: o popup ⓘ
 * da Ficha usava a função de nível 1 direto, então sempre mostrava só
 * o dado inicial mesmo com o personagem em nível mais alto. Não dá
 * pra detalhar quanto cada Level Up individual deu (isso não fica
 * guardado — só o total acumulado em `pvMaxAtual`), então a linha
 * extra soma tudo depois do nível 1 num valor só. */
export function explicarPvMaximo(selection: WizardSelection, pvMaxAtual: number): ExplicacaoCalculo {
  const classe = classeDaSelecao(selection);
  const conValor = valorFinalAtributo(selection, 'CON');
  if (!classe || conValor === null) {
    return { linhas: [], total: { label: 'Pontos de Vida máximos', valor: '—' } };
  }
  const dado = parseDadoDeVida(classe.dadoDeVida);
  const conMod = modificador(conValor);
  const bonusEspecie = bonusPvPorNivelDaEspecie(selection);
  const bonusTalento = bonusPvPorNivelDoTalento(selection);
  const baseNivel1 = dado + conMod + bonusEspecie + bonusTalento;
  const ganhoPosterior = pvMaxAtual - baseNivel1;
  const rotulosBonus = rotulosBonusPvPorNivel(selection);
  const rotuloNivel1 =
    rotulosBonus.length > 0
      ? `Nível 1 (Dado de Vida máximo da classe (${classe.dadoDeVida}) + mod. Constituição + ${rotulosBonus.join(' + ')})`
      : `Nível 1 (Dado de Vida máximo da classe (${classe.dadoDeVida}) + mod. Constituição)`;
  const linhas = [{ label: rotuloNivel1, valor: `${baseNivel1}` }];
  if (ganhoPosterior > 0) {
    linhas.push({ label: 'Ganho em Level Ups seguintes', valor: fmtMod(ganhoPosterior) });
  }
  return {
    linhas,
    total: { label: 'Pontos de Vida máximos', valor: `${pvMaxAtual}` },
  };
}

export function explicarCA(selection: WizardSelection): ExplicacaoCalculo {
  const desValor = valorFinalAtributo(selection, 'DES');
  if (desValor === null) return { linhas: [], total: { label: 'Classe de Armadura', valor: '—' } };
  const desMod = modificador(desValor);
  const armadura = armaduraEquipadaInicial(selection);
  if (!armadura) {
    return {
      linhas: [
        { label: 'Sem armadura (base)', valor: '10' },
        { label: 'mod. Destreza', valor: fmtMod(desMod) },
      ],
      total: { label: 'Classe de Armadura', valor: `${10 + desMod}` },
    };
  }
  const ca = caPelaArmadura(armadura.classeArmadura, desMod);
  const teto = armadura.classeArmadura.match(/máx\.?\s*(\d+)/i);
  const baseMatch = armadura.classeArmadura.match(/^(\d+)/);
  const base = baseMatch ? parseInt(baseMatch[1], 10) : ca - desMod;
  return {
    linhas: [
      { label: `${armadura.nome} (base)`, valor: `${base}` },
      {
        label: teto ? `mod. Destreza (máx. ${teto[1]})` : 'mod. Destreza',
        valor: fmtMod(ca - base),
      },
    ],
    total: { label: 'Classe de Armadura', valor: `${ca}` },
  };
}

export function explicarPercepcaoPassiva(selection: WizardSelection, nivel: number = 1): ExplicacaoCalculo {
  const sabValor = valorFinalAtributo(selection, 'SAB');
  const classe = classeDaSelecao(selection);
  if (sabValor === null || !classe) return { linhas: [], total: { label: 'Percepção Passiva', valor: '—' } };
  const sabMod = modificador(sabValor);
  const proficiente = proficienteEmPericia(selection, 'Percepção');
  const bonus = proficiente ? bonusProficiencia(classe, nivel) : 0;
  return {
    linhas: [
      { label: 'Base', valor: '10' },
      { label: 'mod. Sabedoria', valor: fmtMod(sabMod) },
      {
        label: proficiente ? 'Bônus de Proficiência (proficiente em Percepção)' : 'Bônus de Proficiência (não proficiente)',
        valor: fmtMod(bonus),
      },
    ],
    total: { label: 'Percepção Passiva', valor: `${10 + sabMod + bonus}` },
  };
}

export function explicarIniciativa(
  selection: WizardSelection,
  classe?: Classe | null,
  nivel?: number,
  talentosAtuais?: string[],
): ExplicacaoCalculo {
  const desValor = valorFinalAtributo(selection, 'DES');
  if (desValor === null) return { linhas: [], total: { label: 'Iniciativa', valor: '—' } };
  const mod = modificador(desValor);
  const temAlerta = temEfeitoMecanico(talentosAtuais, 'bonus-iniciativa-bonus-proficiencia');
  const bonusAlerta = temAlerta && classe && nivel ? bonusProficiencia(classe, nivel) : 0;
  const linhas: LinhaExplicacao[] = [{ label: 'mod. Destreza', valor: fmtMod(mod) }];
  if (temAlerta) linhas.push({ label: 'Bônus de Proficiência (talento Alerta)', valor: fmtMod(bonusAlerta) });
  return {
    linhas,
    total: { label: 'Iniciativa', valor: fmtMod(mod + bonusAlerta) },
  };
}

export function explicarOuroInicial(selection: WizardSelection): ExplicacaoCalculo {
  const linhas: LinhaExplicacao[] = [];
  const origem = origens.find((o) => o.nome === selection.origem);
  if (origem && selection.equipamentoOrigemEscolhido) {
    const ouro =
      selection.equipamentoOrigemEscolhido === 'A' ? origem.equipamentoOpcaoA.ouro : origem.equipamentoOpcaoB.ouro;
    linhas.push({ label: `Origem (${origem.nome}, opção ${selection.equipamentoOrigemEscolhido})`, valor: `${ouro} PO` });
  }
  const classe = classeDaSelecao(selection);
  if (classe && selection.equipamentoClasseEscolhido) {
    const proficiencias = proficienciasIniciaisClasse[classe.id];
    const opcao = proficiencias?.equipamentoInicial.find((o) => o.rotulo === selection.equipamentoClasseEscolhido);
    if (opcao) {
      linhas.push({ label: `Classe (${classe.nome}, opção ${selection.equipamentoClasseEscolhido})`, valor: `${opcao.ouro} PO` });
    }
  }
  return { linhas, total: { label: 'Ouro inicial', valor: `${calcularOuroInicial(selection)} PO` } };
}

/** Soma o ouro residual de Origem + Classe pra opção escolhida em cada uma. */
export function calcularOuroInicial(selection: WizardSelection): number {
  let total = 0;
  const origem = origens.find((o) => o.nome === selection.origem);
  if (origem && selection.equipamentoOrigemEscolhido) {
    total +=
      selection.equipamentoOrigemEscolhido === 'A'
        ? origem.equipamentoOpcaoA.ouro
        : origem.equipamentoOpcaoB.ouro;
  }
  const classe = classeDaSelecao(selection);
  if (classe && selection.equipamentoClasseEscolhido) {
    const proficiencias = proficienciasIniciaisClasse[classe.id];
    const opcao = proficiencias?.equipamentoInicial.find((o) => o.rotulo === selection.equipamentoClasseEscolhido);
    if (opcao) total += opcao.ouro;
  }
  return total;
}
