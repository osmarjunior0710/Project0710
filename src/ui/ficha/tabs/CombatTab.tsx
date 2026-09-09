import { useState } from 'react';
import type { EstiloDeLuta } from '../../../data/rulesets/dnd2024/estilosDeLuta';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { OpcaoSubescolha } from '../../../data/rulesets/dnd2024/especies';
import type { CaracteristicaNivel } from '../../../core/levelUp';
import type { AtaqueResolvido } from '../../../core/ataque';
import type { EspacoDeMagiaAtivo } from '../../../core/magiasPersonagem';
import type { AcaoBase } from '../../../data/exampleCombat';
import { cdConjuracao } from '../../../core/magiasPersonagem';
import { calcularDanoMagia, atributoSalvaguarda } from '../../../core/magiaDano';
import { useRoll } from '../../roll/RollContext';
import InfoChip from '../../components/InfoChip';
import LinearProgressBar from '../../components/LinearProgressBar';
import ContadorUsos from '../../components/ContadorUsos';
import SidePanel from '../combat/SidePanel';
import AcaoPanelContent, { type DanoPendente } from '../combat/AcaoPanelContent';
import BonusPanelContent from '../combat/BonusPanelContent';
import ReacaoPanelContent from '../combat/ReacaoPanelContent';
import LancarNoInfernoModal from '../combat/LancarNoInfernoModal';
import AtaqueDeSoproModal from '../combat/AtaqueDeSoproModal';
import MagiaSalvaguardaModal from '../combat/MagiaSalvaguardaModal';
import styles from './CombatTab.module.css';

/** Duração total da "piscada" de Fim do Turno (ver `fimDoTurno`) — os
 * 2 planos fecham na 1ª metade e abrem na 2ª. */
const DURACAO_PISCADA_MS = 500;

export type RecursoTurno = 'acao' | 'bonus' | 'reacao';
export type EstadoRecurso = 'disponivel' | 'usada';

interface CombatTabProps {
  /** `true` = Armadura equipada (Leve/Média/Pesada) sem treinamento —
   * Desvantagem em D20 de Força ou Destreza (SDD "Penalidades por
   * Falta de Proficiência", ver `core/proficienciaArmadura.ts`).
   * Afeta Iniciativa e qualquer rolagem de ataque (todo ataque com
   * arma/desarmado usa Força ou Destreza). */
  desvantagemForcaDestreza: boolean;
  pvAtual: number;
  pvMax: number;
  /** PV Temporário atual (ex: Vigor Ínfero/Vitalidade Vazia) — absorve
   * dano antes do PV normal. 0 = nenhum, linha some. */
  pvTemporario: number;
  onAlterarPv: (delta: number) => void;
  /** `true` só quando o personagem já tem Bênção do Tenebroso (Bruxo,
   * Patrono Ínfero, nível 3+) — controla se o botão manual aparece. */
  bencaoDoTenebrosoDisponivel: boolean;
  onAplicarBencaoDoTenebroso: () => void;
  /** Lançar no Inferno (Bruxo, Patrono Ínfero, nível 14) — 1x por
   * Descanso Longo, ou gasta 1 Espaço de Pacto pra recuperar o uso. */
  lancarNoInfernoDisponivel: boolean;
  lancarNoInfernoGasto: boolean;
  onUsarLancarNoInferno: () => boolean;
  onRecuperarLancarNoInfernoComEspacoDePacto: () => boolean;
  turnState: Record<RecursoTurno, EstadoRecurso>;
  onMarcarUsado: (categoria: RecursoTurno) => void;
  onFimDoTurno: () => void;
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  onGastarSlotCirculo: (circulo: number) => boolean;
  estiloDeLuta: EstiloDeLuta | null;
  nivel: number;
  usosFolegoMaximo: number;
  usosFolegoRestantes: number;
  onUsarUsoFolego: () => boolean;
  /** Conhecimento de Pedras (Anão) — 0 = espécie não é Anão. */
  usosConhecimentoDePedrasMaximo: number;
  usosConhecimentoDePedrasRestantes: number;
  onUsarConhecimentoDePedras: () => boolean;
  /** Pico de Adrenalina (Orc) — 0 = espécie não é Orc. */
  usosPicoDeAdrenalinaMaximo: number;
  usosPicoDeAdrenalinaRestantes: number;
  onUsarPicoDeAdrenalina: () => boolean;
  /** Ataque de Sopro (Draconato) — `false` = espécie não é Draconato. */
  ataqueDeSoproDisponivel: boolean;
  usosAtaqueDeSoproMaximo: number;
  usosAtaqueDeSoproRestantes: number;
  cdAtaqueDeSopro: number;
  numDadosAtaqueDeSopro: number;
  tipoDanoAtaqueDeSopro: string | null;
  onUsarAtaqueDeSopro: () => boolean;
  /** Voo Dracônico (Draconato, nível 5+) — `false` = não disponível. */
  vooDraconicoDisponivel: boolean;
  vooDraconicoGasto: boolean;
  onUsarVooDraconico: () => boolean;
  /** Ancestralidade Gigante (Golias) — nome da opção escolhida na
   * criação (ex.: "Arrepio do Gelo (Gigante do Gelo)"), `null` = não é
   * Golias. Mesmo contador de usos pras 6 opções possíveis. */
  ancestralidadeGiganteEscolhida: string | null;
  usosAncestralidadeGiganteMaximo: number;
  usosAncestralidadeGiganteRestantes: number;
  onUsarAncestralidadeGigante: () => boolean;
  modConstituicaoAtual: number;
  /** Forma Grande (Golias, nível 5+) — `false` = não disponível. */
  formaGrandeDisponivel: boolean;
  formaGrandeGasto: boolean;
  /** `true` = transformado agora (diferente de `formaGrandeGasto` —
   * ver comentário em `armazenamentoPersonagens.ts`). */
  formaGrandeAtiva: boolean;
  onUsarFormaGrande: () => boolean;
  /** Mãos Curativas (Aasimar) — `false` = espécie não é Aasimar. */
  maosCurativasDisponivel: boolean;
  maosCurativasGasto: boolean;
  dadosMaosCurativas: number;
  onUsarMaosCurativas: () => boolean;
  /** Revelação Celestial (Aasimar, nível 3+) — escolhida de novo a
   * cada uso (natureza `escolha_reutilizavel`), por isso a lista de
   * opções vem daqui, não do wizard. */
  revelacaoCelestialDisponivel: boolean;
  revelacaoCelestialGasto: boolean;
  revelacaoCelestialFormaAtiva: string | null;
  opcoesRevelacaoCelestial: OpcaoSubescolha[];
  danoBonusRevelacaoCelestial: number;
  cdMantoNecrotico: number;
  onUsarRevelacaoCelestial: (formaEscolhida: string) => boolean;
  /** Ações genéricas do Cap. 1 (ex.: Procurar/Analisar) que algum
   * Talento Geral (Analítico/Mente Aguçada) também libera como Ação
   * Bônus — continuam disponíveis na lista de Ação normal também, o
   * jogador escolhe qual usar a cada turno. Vazio = nenhum talento
   * desse tipo. */
  acoesGenericasBonus: AcaoBase[];
  /** Falar com Animais - Traço de Gnomo (Gnomo do Bosque) — `false` =
   * não é essa sub-escolha. */
  falarComAnimaisGnomoDisponivel: boolean;
  usosFalarComAnimaisGnomoMaximo: number;
  usosFalarComAnimaisGnomoRestantes: number;
  onUsarFalarComAnimaisGnomo: () => boolean;
  conjura: boolean;
  truques: Magia[];
  magiasPreparadasAcao: Magia[];
  magiasPreparadasReacao: Magia[];
  modAcertoConjuracao: number | null;
  numAtaques: number;
  indomavelMaximo: number;
  indomavelRestantes: number;
  onUsarIndomavel: () => boolean;
  pontosDeSorteMaximo: number;
  pontosDeSorteRestantes: number;
  onUsarPontoDeSorte: () => boolean;
  /** Valentão de Taverna (Dano Garantido) — `true` = pode rerolar 1 no
   * dano do Ataque Desarmado. */
  danoDesarmadoRerollDisponivel: boolean;
  /** Perfurador — `true` = pode rerolar 1 dado à escolha quando o dano
   * causado for Perfurante (ver `core/rerollDanoTalento.ts`). */
  perfuradorDisponivel: boolean;
  surtoMaximo: number;
  surtoRestantes: number;
  surtoUsadoTurno: boolean;
  onUsarSurto: () => boolean;
  mestreTatico: CaracteristicaNivel | null;
  ataquesEstudados: CaracteristicaNivel | null;
  ajusteTatico: CaracteristicaNivel | null;
  ataqueAtual: AtaqueResolvido | null;
  ataqueBonus: AtaqueResolvido | null;
  usosInspiracaoMaximo: number;
  usosInspiracaoRestantes: number;
  tamanhoDadoInspiracao: number;
  fonteDeInspiracao: boolean;
  onUsarInspiracao: () => boolean;
  onRecuperarInspiracaoComEspaco: () => boolean;
  contraEncantamentoDisponivel: boolean;
  palavrasDeInterrupcaoDisponivel: boolean;
  periciaInigualavelDisponivel: boolean;
  onDevolverUsoInspiracao: () => void;
  iniciativaMod: number | null;
  onRolarIniciativa?: () => void;
}

const LABELS: Record<RecursoTurno, { icone: string; nome: string }> = {
  acao: { icone: '⚔', nome: 'Ação' },
  bonus: { icone: '⚡', nome: 'Bônus' },
  reacao: { icone: '🛡', nome: 'Reação' },
};

export default function CombatTab({
  desvantagemForcaDestreza,
  pvAtual,
  pvMax,
  pvTemporario,
  onAlterarPv,
  bencaoDoTenebrosoDisponivel,
  onAplicarBencaoDoTenebroso,
  lancarNoInfernoDisponivel,
  lancarNoInfernoGasto,
  onUsarLancarNoInferno,
  onRecuperarLancarNoInfernoComEspacoDePacto,
  turnState,
  onMarcarUsado,
  onFimDoTurno,
  espacos,
  espacosGastosPorCirculo,
  onGastarSlotCirculo,
  estiloDeLuta,
  nivel,
  usosFolegoMaximo,
  usosFolegoRestantes,
  onUsarUsoFolego,
  usosConhecimentoDePedrasMaximo,
  usosConhecimentoDePedrasRestantes,
  onUsarConhecimentoDePedras,
  usosPicoDeAdrenalinaMaximo,
  usosPicoDeAdrenalinaRestantes,
  onUsarPicoDeAdrenalina,
  ataqueDeSoproDisponivel,
  usosAtaqueDeSoproMaximo,
  usosAtaqueDeSoproRestantes,
  cdAtaqueDeSopro,
  numDadosAtaqueDeSopro,
  tipoDanoAtaqueDeSopro,
  onUsarAtaqueDeSopro,
  vooDraconicoDisponivel,
  vooDraconicoGasto,
  onUsarVooDraconico,
  ancestralidadeGiganteEscolhida,
  usosAncestralidadeGiganteMaximo,
  usosAncestralidadeGiganteRestantes,
  onUsarAncestralidadeGigante,
  modConstituicaoAtual,
  formaGrandeDisponivel,
  formaGrandeGasto,
  formaGrandeAtiva,
  onUsarFormaGrande,
  maosCurativasDisponivel,
  maosCurativasGasto,
  dadosMaosCurativas,
  onUsarMaosCurativas,
  revelacaoCelestialDisponivel,
  revelacaoCelestialGasto,
  revelacaoCelestialFormaAtiva,
  opcoesRevelacaoCelestial,
  danoBonusRevelacaoCelestial,
  cdMantoNecrotico,
  onUsarRevelacaoCelestial,
  acoesGenericasBonus,
  falarComAnimaisGnomoDisponivel,
  usosFalarComAnimaisGnomoMaximo,
  usosFalarComAnimaisGnomoRestantes,
  onUsarFalarComAnimaisGnomo,
  conjura,
  truques,
  magiasPreparadasAcao,
  magiasPreparadasReacao,
  modAcertoConjuracao,
  numAtaques,
  indomavelMaximo,
  indomavelRestantes,
  onUsarIndomavel,
  pontosDeSorteMaximo,
  pontosDeSorteRestantes,
  onUsarPontoDeSorte,
  danoDesarmadoRerollDisponivel,
  perfuradorDisponivel,
  surtoMaximo,
  surtoRestantes,
  surtoUsadoTurno,
  onUsarSurto,
  mestreTatico,
  ataquesEstudados,
  ajusteTatico,
  ataqueAtual,
  ataqueBonus,
  usosInspiracaoMaximo,
  usosInspiracaoRestantes,
  tamanhoDadoInspiracao,
  fonteDeInspiracao,
  onUsarInspiracao,
  onRecuperarInspiracaoComEspaco,
  contraEncantamentoDisponivel,
  palavrasDeInterrupcaoDisponivel,
  periciaInigualavelDisponivel,
  onDevolverUsoInspiracao,
  iniciativaMod,
  onRolarIniciativa,
}: CombatTabProps) {
  const [painelAberto, setPainelAberto] = useState<RecursoTurno | null>(null);
  const [detalhesAtivo, setDetalhesAtivo] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [danoPendente, setDanoPendente] = useState<DanoPendente | null>(null);
  const [telaSalvaguarda, setTelaSalvaguarda] = useState<{ magia: Magia; circuloUsado: number } | null>(null);
  const [ataquesFeitos, setAtaquesFeitos] = useState(0);
  const [piscando, setPiscando] = useState(false);
  const [iniciativaValor, setIniciativaValor] = useState<number | null>(null);
  const [periciaInigualavelPendente, setPericiaInigualavelPendente] = useState(false);
  const [lancarNoInfernoAberto, setLancarNoInfernoAberto] = useState(false);
  const [ataqueDeSoproAberto, setAtaqueDeSoproAberto] = useState(false);
  const cdLancarNoInferno = modAcertoConjuracao !== null ? cdConjuracao(modAcertoConjuracao) : null;
  const temEspacoDePactoDisponivel = espacos.some((e) => (espacosGastosPorCirculo[e.circulo] ?? 0) < e.maximo);
  const { rolarD20, rolarDados } = useRoll();

  function alternarIniciativa() {
    if (iniciativaValor !== null) {
      setIniciativaValor(null);
      return;
    }
    if (iniciativaMod === null) return;
    rolarD20({
      label: 'Iniciativa',
      formula: `1d20 + ${iniciativaMod}`,
      mod: iniciativaMod,
      vantagem: desvantagemForcaDestreza ? 'desvantagem' : undefined,
      onResultado: (total) => setIniciativaValor(total),
    });
    onRolarIniciativa?.();
  }

  /** "Fim do Turno" = uma piscada de olho (pedido do Osmar) — 2 planos
   * pretos fecham por 250ms (metade da animação de 500ms), o reset de
   * verdade acontece bem no meio (tela coberta, ninguém vê o "salto"),
   * e os planos abrem de novo pelos mesmos 250ms restantes. Cada
   * turno de mesa dura no máximo 6s — a ideia é que resetar pareça
   * rápido/instantâneo assim como um piscar. */
  function fimDoTurno() {
    setPiscando(true);
    setTimeout(() => {
      onFimDoTurno();
      setFeedback(null);
      setDanoPendente(null);
      setAtaquesFeitos(0);
    }, DURACAO_PISCADA_MS / 2);
    setTimeout(() => setPiscando(false), DURACAO_PISCADA_MS);
  }

  function abrirPainel(categoria: RecursoTurno) {
    if (turnState[categoria] === 'usada') return;
    setFeedback(null);
    setDanoPendente(null);
    setPainelAberto(categoria);
  }

  function fecharPainel() {
    setPainelAberto(null);
  }

  function escolherNoPainel(categoria: RecursoTurno, nome: string, desc: string, dano?: DanoPendente) {
    onMarcarUsado(categoria);
    setPainelAberto(null);
    setFeedback(`${nome} — ${desc}`);
    setDanoPendente(dano ?? null);
  }

  function abrirSalvaguarda(magia: Magia, circuloUsado: number) {
    setTelaSalvaguarda({ magia, circuloUsado });
  }

  function rolarDanoSalvaguarda() {
    if (!telaSalvaguarda) return;
    const dano = calcularDanoMagia(telaSalvaguarda.magia, telaSalvaguarda.circuloUsado, nivel);
    setTelaSalvaguarda(null);
    if (!dano) return;
    rolarDados({
      label: `Dano — ✨ ${telaSalvaguarda.magia.nome}`,
      formula: `${dano.quantidade}d${dano.lados}${dano.mod ? ` + ${dano.mod}` : ''}`,
      quantidade: dano.quantidade,
      lados: dano.lados,
      mod: dano.mod,
    });
  }

  function usarConhecimentoDePedras() {
    if (!onUsarConhecimentoDePedras()) return;
    onMarcarUsado('bonus');
  }

  function usarPicoDeAdrenalina() {
    if (!onUsarPicoDeAdrenalina()) return;
    onMarcarUsado('bonus');
  }

  function usarVooDraconico() {
    if (!onUsarVooDraconico()) return;
    onMarcarUsado('bonus');
  }

  function usarAncestralidadeGiganteAoAcertar() {
    if (!onUsarAncestralidadeGigante()) return;
    if (ancestralidadeGiganteEscolhida === 'Arrepio do Gelo (Gigante do Gelo)') {
      rolarDados({ label: 'Arrepio do Gelo — Dano', formula: '1d6', quantidade: 1, lados: 6, mod: 0 });
      setFeedback('🧊 Arrepio do Gelo — soma esse dano Gélido e reduz o Deslocamento do alvo em 3m até o início do seu próximo turno.');
    } else if (ancestralidadeGiganteEscolhida === 'Queimadura de Fogo (Gigante de Fogo)') {
      rolarDados({ label: 'Queimadura de Fogo — Dano', formula: '1d10', quantidade: 1, lados: 10, mod: 0 });
      setFeedback('🔥 Queimadura de Fogo — soma esse dano Ígneo.');
    } else if (ancestralidadeGiganteEscolhida === 'Tombo da Colina (Gigante da Colina)') {
      setFeedback('⛰️ Tombo da Colina — o alvo (Grande ou menor) fica Caído, sem dano extra.');
    }
  }

  function usarSaltoDaNuvem() {
    if (!onUsarAncestralidadeGigante()) return;
    onMarcarUsado('bonus');
    setFeedback('☁️ Salto da Nuvem — teleporte até 9m pra um espaço desocupado à sua vista.');
  }

  function usarFormaGrande() {
    if (!onUsarFormaGrande()) return;
    onMarcarUsado('bonus');
  }

  function usarRevelacaoCelestial(formaEscolhida: string) {
    if (!onUsarRevelacaoCelestial(formaEscolhida)) return;
    onMarcarUsado('bonus');
  }

  function abrirAtaqueDeSopro() {
    if (!onUsarAtaqueDeSopro()) return;
    setAtaqueDeSoproAberto(true);
  }

  function rolarDanoAtaqueDeSopro() {
    setAtaqueDeSoproAberto(false);
    rolarDados({
      label: 'Ataque de Sopro — Dano',
      formula: `${numDadosAtaqueDeSopro}d10`,
      quantidade: numDadosAtaqueDeSopro,
      lados: 10,
      mod: 0,
    });
  }

  function usarRecuperarFolego() {
    if (!onUsarUsoFolego()) return;
    rolarDados({
      label: 'Recuperar Fôlego (cura)',
      formula: `1d10 + ${nivel}`,
      quantidade: 1,
      lados: 10,
      mod: nivel,
      onResultado: (total) => onAlterarPv(total),
    });
    onMarcarUsado('bonus');
    setPainelAberto(null);
    setFeedback('🩹 Recuperar Fôlego — cura aplicada ao seu PV automaticamente.');
  }

  function usarInspiracaoBardo() {
    if (!onUsarInspiracao()) return;
    onMarcarUsado('bonus');
    setPainelAberto(null);
    setFeedback(
      `🎵 Inspiração de Bardo — conceda 1 dado de Inspiração (d${tamanhoDadoInspiracao}) pra uma criatura que veja/ouça você a até 18m. Ela pode somar o dado a 1 D20 que falhar, dentro de 1h.`,
    );
  }

  function recuperarInspiracaoComEspaco() {
    if (!onRecuperarInspiracaoComEspaco()) return;
    setFeedback('🎵 Inspiração de Bardo — 1 uso recuperado gastando 1 Espaço de Magia (sem ação necessária).');
  }

  function usarAtaqueMaoSecundaria() {
    if (!ataqueBonus) return;
    rolarD20({
      label: `Ataque — ${ataqueBonus.nome} (Mão Secundária)`,
      formula: `1d20 + ${ataqueBonus.info.modAcerto}`,
      mod: ataqueBonus.info.modAcerto,
      vantagem: desvantagemForcaDestreza ? 'desvantagem' : undefined,
    });
    onMarcarUsado('bonus');
    setPainelAberto(null);
    setFeedback(`🗡 ${ataqueBonus.nome} (Mão Secundária) — ${ataqueBonus.descricao} Toque "Rolar Dano" pra ver o dano.`);
    setDanoPendente({
      label: `Dano — ${ataqueBonus.nome} (Mão Secundária)`,
      quantidade: ataqueBonus.info.danoQuantidade,
      lados: ataqueBonus.info.danoLados,
      mod: ataqueBonus.info.danoMod,
      tipoDano: ataqueBonus.info.danoTipo,
    });
  }

  function usarMenteTatica() {
    if (!onUsarUsoFolego()) return;
    rolarDados({ label: 'Mente Tática', formula: '1d10', quantidade: 1, lados: 10, mod: 0 });
    setFeedback('🧠 Mente Tática — some o resultado ao teste de atributo que falhou.');
  }

  function usarPontoDeSorte() {
    if (!onUsarPontoDeSorte()) return;
    setFeedback('🍀 Ponto de Sorte gasto — use o botão Vantagem/Desvantagem na rolagem.');
  }

  function usarIndomavel() {
    if (!onUsarIndomavel()) return;
    rolarD20({ label: 'Indomável (nova salvaguarda)', formula: `1d20 + ${nivel}`, mod: nivel, categoria: 'atributoOuSalvaguarda' });
    setFeedback('🛡️ Indomável — use esse resultado como sua nova salvaguarda.');
  }

  function abrirLancarNoInferno() {
    if (!onUsarLancarNoInferno()) return;
    setLancarNoInfernoAberto(true);
  }

  function rolarDanoLancarNoInferno() {
    setLancarNoInfernoAberto(false);
    rolarDados({ label: 'Lançar no Inferno — Dano', formula: '8d10', quantidade: 8, lados: 10, mod: 0 });
  }

  function usarPericiaInigualavel() {
    if (!onUsarInspiracao()) return;
    rolarDados({
      label: 'Perícia Inigualável',
      formula: `1d${tamanhoDadoInspiracao}`,
      quantidade: 1,
      lados: tamanhoDadoInspiracao,
      mod: 0,
    });
    setFeedback('🎓 Perícia Inigualável — some o resultado ao seu d20 que falhou.');
    setPericiaInigualavelPendente(true);
  }

  function confirmarPericiaInigualavel(aindaFalhou: boolean) {
    if (aindaFalhou) {
      onDevolverUsoInspiracao();
      setFeedback('🎓 Perícia Inigualável — ainda falhou, o uso de Inspiração foi devolvido.');
    } else {
      setFeedback('🎓 Perícia Inigualável — virou sucesso, uso de Inspiração gasto normalmente.');
    }
    setPericiaInigualavelPendente(false);
  }

  function registrarAtaque(nome: string, desc: string, dano: DanoPendente) {
    const proximo = ataquesFeitos + 1;
    setAtaquesFeitos(proximo);
    setFeedback(`${nome} — ${desc}`);
    setDanoPendente(dano);
    if (proximo >= numAtaques) {
      onMarcarUsado('acao');
      setPainelAberto(null);
    }
  }

  function usarSurtoDeAcao() {
    if (!onUsarSurto()) return;
    setFeedback('💥 Surto de Ação — você ganhou uma ação extra nesse turno (a Ação normal continua disponível).');
  }

  function rolarDanoPendente() {
    if (!danoPendente) return;
    const ehDanoDesarmado = danoPendente.label.endsWith('Ataque Desarmado');
    rolarDados({
      label: danoPendente.label,
      formula: `${danoPendente.quantidade}d${danoPendente.lados}${danoPendente.mod ? ` + ${danoPendente.mod}` : ''}`,
      quantidade: danoPendente.quantidade,
      lados: danoPendente.lados,
      mod: danoPendente.mod,
      rerollSe1: ehDanoDesarmado && danoDesarmadoRerollDisponivel ? { rotulo: 'Dano Garantido' } : undefined,
      rerollEscolhido: perfuradorDisponivel && danoPendente.tipoDano === 'Perfurante' ? { rotulo: 'Perfurador' } : undefined,
    });
  }

  const temEspacoDisponivel = espacos.some((e) => (espacosGastosPorCirculo[e.circulo] ?? 0) < e.maximo);
  // `espacos` já vem ordenado por círculo crescente (espacosDeMagiaAtivos,
  // core/magiasPersonagem.ts) — o primeiro com sobra é exatamente o que
  // `gastarQualquerSlot` (FichaShell.tsx) vai gastar de verdade.
  const proximoCirculoParaGastar = espacos.find((e) => (espacosGastosPorCirculo[e.circulo] ?? 0) < e.maximo)?.circulo ?? null;

  function ladoDoPainel(categoria: RecursoTurno): 'left' | 'right' | 'bottom' {
    if (categoria === 'acao') return 'left';
    if (categoria === 'bonus') return 'right';
    return 'bottom';
  }

  return (
    <>
      {piscando && (
        <div
          className={styles.piscadaOverlay}
          style={{ ['--duracao-piscada' as string]: `${DURACAO_PISCADA_MS}ms` }}
        >
          <div className={styles.piscadaTopo} />
          <div className={styles.piscadaBase} />
        </div>
      )}
      <div className={styles.splitBtns}>
        <div
          className={`${styles.splitBtn} ${styles.splitBtnIniciativa}`}
          style={iniciativaMod === null ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={alternarIniciativa}
        >
          {iniciativaValor === null ? (
            <>
              <div className={styles.sbIcon}>🎲</div>
              <div className={styles.sbLabel}>Iniciativa</div>
            </>
          ) : (
            <>
              <div className={styles.sbIcon} style={{ fontSize: 21 }}>
                {iniciativaValor}
              </div>
              <div className={styles.sbLabel}>Iniciativa</div>
              <div className={styles.sbHint}>(Aperte novamente para terminar o combate)</div>
            </>
          )}
        </div>
        <div className={`${styles.splitBtn} ${styles.splitBtnFimTurno}`} onClick={fimDoTurno}>
          <div className={styles.sbIcon}>↻</div>
          <div className={styles.sbLabel}>Fim do Turno</div>
          <div className={styles.sbState}>restaura os 3 botões</div>
        </div>
      </div>

      <div className={`box-solid ${styles.hpLive}`}>
        <div className={styles.hpHeader}>
          <div className="label">
            Pontos de Vida
            {pvTemporario > 0 && (
              <span className="tag" style={{ marginLeft: 6 }}>
                +{pvTemporario} temp
              </span>
            )}
          </div>
          <div className={styles.hpNum}>
            {pvAtual} / {pvMax}
          </div>
        </div>
        <LinearProgressBar valor={pvAtual} maximo={pvMax} temporario={pvTemporario} />
      </div>
      <div className={styles.hpBtnRow}>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(-5)}>
          −5
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(-1)}>
          −1
        </div>
        <div className={`${styles.hpBtnSmall} ${styles.hpBtnManual}`}>
          Manual <span className="tag">[PH]</span>
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(1)}>
          +1
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(5)}>
          +5
        </div>
      </div>

      {bencaoDoTenebrosoDisponivel && (
        <div className="opt-card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={onAplicarBencaoDoTenebroso}>
          <div className="opt-card-name">🩸 Bênção do Tenebroso</div>
          <div className="opt-card-desc">toque quando reduzir um inimigo a 0 PV (ou aliado a 3m) — ganha PV Temporário</div>
        </div>
      )}

      {lancarNoInfernoDisponivel && (
        <div
          className="opt-card"
          style={{ marginBottom: 12, cursor: lancarNoInfernoGasto ? 'default' : 'pointer', opacity: lancarNoInfernoGasto ? 0.5 : 1 }}
          onClick={lancarNoInfernoGasto ? undefined : abrirLancarNoInferno}
        >
          <div className="opt-card-name">🔥 Lançar no Inferno</div>
          <div className="opt-card-desc">
            {lancarNoInfernoGasto
              ? 'usado — disponível de novo no Descanso Longo'
              : 'toque ao acertar um ataque (1x por turno)'}
          </div>
          {lancarNoInfernoGasto && (
            <div
              className="btn"
              style={{
                marginTop: 8,
                padding: 8,
                fontSize: 12,
                opacity: temEspacoDePactoDisponivel ? 1 : 0.5,
                pointerEvents: temEspacoDePactoDisponivel ? 'auto' : 'none',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onRecuperarLancarNoInfernoComEspacoDePacto();
              }}
            >
              🔄 gastar 1 Espaço de Pacto pra recuperar
            </div>
          )}
        </div>
      )}

      {ataqueDeSoproDisponivel && (
        <div
          className="opt-card"
          style={{
            marginBottom: 12,
            cursor: usosAtaqueDeSoproRestantes > 0 ? 'pointer' : 'default',
            opacity: usosAtaqueDeSoproRestantes > 0 ? 1 : 0.5,
          }}
          onClick={usosAtaqueDeSoproRestantes > 0 ? abrirAtaqueDeSopro : undefined}
        >
          <div className="opt-card-name" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            🐉 Ataque de Sopro
            <ContadorUsos total={usosAtaqueDeSoproMaximo} usados={usosAtaqueDeSoproMaximo - usosAtaqueDeSoproRestantes} />
          </div>
          <div className="opt-card-desc">
            substitui um ataque — Cone de 4,5m ou Linha de 9m×1,5m (recarrega no Descanso Longo)
          </div>
        </div>
      )}

      {(ancestralidadeGiganteEscolhida === 'Arrepio do Gelo (Gigante do Gelo)' ||
        ancestralidadeGiganteEscolhida === 'Queimadura de Fogo (Gigante de Fogo)' ||
        ancestralidadeGiganteEscolhida === 'Tombo da Colina (Gigante da Colina)') && (
        <div
          className="opt-card"
          style={{
            marginBottom: 12,
            cursor: usosAncestralidadeGiganteRestantes > 0 ? 'pointer' : 'default',
            opacity: usosAncestralidadeGiganteRestantes > 0 ? 1 : 0.5,
          }}
          onClick={usosAncestralidadeGiganteRestantes > 0 ? usarAncestralidadeGiganteAoAcertar : undefined}
        >
          <div className="opt-card-name" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            🏔 {ancestralidadeGiganteEscolhida.split(' (')[0]}
            <ContadorUsos
              total={usosAncestralidadeGiganteMaximo}
              usados={usosAncestralidadeGiganteMaximo - usosAncestralidadeGiganteRestantes}
            />
          </div>
          <div className="opt-card-desc">toque ao acertar um ataque (recarrega no Descanso Longo)</div>
        </div>
      )}

      {(estiloDeLuta || mestreTatico || ataquesEstudados || ajusteTatico) && (
        <>
          <div className="section-title">Características</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            {estiloDeLuta && <InfoChip nome={estiloDeLuta.nome} descricao={estiloDeLuta.beneficios} />}
            {ajusteTatico && <InfoChip nome={ajusteTatico.nome} descricao={ajusteTatico.descricao} />}
            {mestreTatico && <InfoChip nome={mestreTatico.nome} descricao={mestreTatico.descricao} />}
            {ataquesEstudados && <InfoChip nome={ataquesEstudados.nome} descricao={ataquesEstudados.descricao} />}
          </div>
        </>
      )}

      {indomavelMaximo > 0 && (
        <>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>Indomável</span>
            <ContadorUsos total={indomavelMaximo} usados={indomavelMaximo - indomavelRestantes} />
          </div>
          <div
            className="box"
            style={{
              padding: 12,
              marginBottom: 12,
              cursor: indomavelRestantes > 0 ? 'pointer' : 'default',
              opacity: indomavelRestantes > 0 ? 1 : 0.5,
            }}
            onClick={indomavelRestantes > 0 ? usarIndomavel : undefined}
          >
            <div style={{ fontSize: 13 }}>🛡️ Ao falhar uma salvaguarda, toque aqui</div>
            <div className="label" style={{ marginTop: 2 }}>
              Rola de novo somando seu nível de Guerreiro (só recupera no Descanso Longo).
            </div>
          </div>
        </>
      )}

      {pontosDeSorteMaximo > 0 && (
        <>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>Pontos de Sorte</span>
            <ContadorUsos total={pontosDeSorteMaximo} usados={pontosDeSorteMaximo - pontosDeSorteRestantes} />
          </div>
          <div
            className="box"
            style={{
              padding: 12,
              marginBottom: 12,
              cursor: pontosDeSorteRestantes > 0 ? 'pointer' : 'default',
              opacity: pontosDeSorteRestantes > 0 ? 1 : 0.5,
            }}
            onClick={pontosDeSorteRestantes > 0 ? usarPontoDeSorte : undefined}
          >
            <div style={{ fontSize: 13 }}>🍀 Toque aqui pra gastar 1 ponto</div>
            <div className="label" style={{ marginTop: 2 }}>
              Dá Vantagem numa jogada sua de d20, ou impõe Desvantagem num ataque contra você — use
              os botões Vantagem/Desvantagem já disponíveis em qualquer rolagem (só recupera no
              Descanso Longo).
            </div>
          </div>
        </>
      )}

      {usosFolegoMaximo > 0 && (
        <>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>Mente Tática</span>
            <ContadorUsos total={usosFolegoMaximo} usados={usosFolegoMaximo - usosFolegoRestantes} />
          </div>
          <div
            className="box"
            style={{
              padding: 12,
              cursor: usosFolegoRestantes > 0 ? 'pointer' : 'default',
              opacity: usosFolegoRestantes > 0 ? 1 : 0.5,
            }}
            onClick={usosFolegoRestantes > 0 ? usarMenteTatica : undefined}
          >
            <div style={{ fontSize: 13 }}>🧠 Ao falhar um teste de atributo, toque aqui</div>
            <div className="label" style={{ marginTop: 2 }}>
              Gasta 1 uso de Recuperar Fôlego, joga 1d10 e soma ao teste (banco compartilhado com Recuperar Fôlego).
            </div>
          </div>
        </>
      )}

      {periciaInigualavelDisponivel && (
        <>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>Perícia Inigualável</span>
            <ContadorUsos total={usosInspiracaoMaximo} usados={usosInspiracaoMaximo - usosInspiracaoRestantes} />
          </div>
          {periciaInigualavelPendente ? (
            <div className="box" style={{ padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 13 }}>Somou o dado ao d20 e ainda assim falhou?</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <div className="btn" style={{ flex: 1, padding: '8px 0', textAlign: 'center' }} onClick={() => confirmarPericiaInigualavel(true)}>
                  Sim, ainda falhou
                </div>
                <div
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '8px 0', textAlign: 'center' }}
                  onClick={() => confirmarPericiaInigualavel(false)}
                >
                  Não, deu certo
                </div>
              </div>
            </div>
          ) : (
            <div
              className="box"
              style={{
                padding: 12,
                marginBottom: 12,
                cursor: usosInspiracaoRestantes > 0 ? 'pointer' : 'default',
                opacity: usosInspiracaoRestantes > 0 ? 1 : 0.5,
              }}
              onClick={usosInspiracaoRestantes > 0 ? usarPericiaInigualavel : undefined}
            >
              <div style={{ fontSize: 13 }}>🎓 Ao falhar um teste de atributo ou ataque, toque aqui</div>
              <div className="label" style={{ marginTop: 2 }}>
                Gasta 1 uso de Inspiração de Bardo (d{tamanhoDadoInspiracao}), soma ao d20 — se ainda assim falhar, o
                uso não é gasto.
              </div>
            </div>
          )}
        </>
      )}

      <div className="section-title">Ação · Ação Bônus · Reação — estado do turno</div>
      <div className={styles.splitBtns}>
        {(['acao', 'bonus'] as RecursoTurno[]).map((categoria) => (
          <div
            key={categoria}
            className={`${styles.splitBtn} ${styles[`splitBtn${categoria === 'acao' ? 'Acao' : 'Bonus'}`]} ${
              turnState[categoria] === 'usada' ? styles.splitBtnUsada : ''
            }`}
            onClick={() => abrirPainel(categoria)}
          >
            <div className={styles.sbIcon}>{LABELS[categoria].icone}</div>
            <div className={styles.sbLabel}>{LABELS[categoria].nome}</div>
            <div className={styles.sbState}>{turnState[categoria] === 'usada' ? 'usada' : 'ativo'}</div>
          </div>
        ))}
      </div>
      <div
        className={`${styles.splitBtnSmall} ${styles.splitBtnReacao} ${turnState.reacao === 'usada' ? styles.splitBtnUsada : ''}`}
        onClick={() => abrirPainel('reacao')}
      >
        <div className={styles.sbIcon}>{LABELS.reacao.icone}</div>
        <div className={styles.sbLabel}>{LABELS.reacao.nome}</div>
        <div className={styles.sbState}>{turnState.reacao === 'usada' ? 'usada' : 'ativo'}</div>
      </div>

      <div className="label">
        Ação abre da esquerda, Ação Bônus da direita, Reação sobe de baixo. Ao usar um, ele fica cinza/travado até
        "Fim do Turno".
      </div>

      {feedback && (
        <div className={styles.feedback}>
          {feedback}
          {danoPendente && (
            <div className="btn btn-primary" style={{ marginTop: 10, padding: '10px 14px', display: 'inline-block' }} onClick={rolarDanoPendente}>
              🎲 Rolar Dano
            </div>
          )}
        </div>
      )}

      <SidePanel
        open={painelAberto !== null}
        side={painelAberto ? ladoDoPainel(painelAberto) : 'left'}
        title={painelAberto ? `${LABELS[painelAberto].icone} ${LABELS[painelAberto].nome}` : ''}
        onClose={fecharPainel}
        detalhesAtivo={detalhesAtivo}
        onToggleDetalhes={() => setDetalhesAtivo((v) => !v)}
      >
        {painelAberto === 'acao' && (
          <AcaoPanelContent
            desvantagemForcaDestreza={desvantagemForcaDestreza}
            onEscolher={(nome, desc, dano) => escolherNoPainel('acao', nome, desc, dano)}
            onAtacar={registrarAtaque}
            onAbrirSalvaguarda={abrirSalvaguarda}
            gastarSlotCirculo={onGastarSlotCirculo}
            nivel={nivel}
            espacos={espacos}
            espacosGastosPorCirculo={espacosGastosPorCirculo}
            conjura={conjura}
            truques={truques}
            magiasPreparadas={magiasPreparadasAcao}
            modAcertoConjuracao={modAcertoConjuracao}
            numAtaques={numAtaques}
            ataquesFeitos={ataquesFeitos}
            surtoMax={surtoMaximo}
            surtoRestantes={surtoRestantes}
            surtoUsadoTurno={surtoUsadoTurno}
            onUsarSurto={usarSurtoDeAcao}
            ataqueAtual={ataqueAtual}
            detalhesAtivo={detalhesAtivo}
            maosCurativasDisponivel={maosCurativasDisponivel}
            maosCurativasGasto={maosCurativasGasto}
            dadosMaosCurativas={dadosMaosCurativas}
            onUsarMaosCurativas={onUsarMaosCurativas}
            falarComAnimaisGnomoDisponivel={falarComAnimaisGnomoDisponivel}
            usosFalarComAnimaisGnomoMaximo={usosFalarComAnimaisGnomoMaximo}
            usosFalarComAnimaisGnomoRestantes={usosFalarComAnimaisGnomoRestantes}
            onUsarFalarComAnimaisGnomo={onUsarFalarComAnimaisGnomo}
          />
        )}
        {painelAberto === 'bonus' && (
          <BonusPanelContent
            usosFolegoMaximo={usosFolegoMaximo}
            usosFolegoRestantes={usosFolegoRestantes}
            onUsarRecuperarFolego={usarRecuperarFolego}
            usosConhecimentoDePedrasMaximo={usosConhecimentoDePedrasMaximo}
            usosConhecimentoDePedrasRestantes={usosConhecimentoDePedrasRestantes}
            onUsarConhecimentoDePedras={usarConhecimentoDePedras}
            usosPicoDeAdrenalinaMaximo={usosPicoDeAdrenalinaMaximo}
            usosPicoDeAdrenalinaRestantes={usosPicoDeAdrenalinaRestantes}
            onUsarPicoDeAdrenalina={usarPicoDeAdrenalina}
            vooDraconicoDisponivel={vooDraconicoDisponivel}
            vooDraconicoGasto={vooDraconicoGasto}
            onUsarVooDraconico={usarVooDraconico}
            saltoDaNuvemDisponivel={ancestralidadeGiganteEscolhida === 'Salto da Nuvem (Gigante das Nuvens)'}
            usosSaltoDaNuvemMaximo={usosAncestralidadeGiganteMaximo}
            usosSaltoDaNuvemRestantes={usosAncestralidadeGiganteRestantes}
            onUsarSaltoDaNuvem={usarSaltoDaNuvem}
            formaGrandeDisponivel={formaGrandeDisponivel}
            formaGrandeGasto={formaGrandeGasto}
            formaGrandeAtiva={formaGrandeAtiva}
            onUsarFormaGrande={usarFormaGrande}
            revelacaoCelestialDisponivel={revelacaoCelestialDisponivel}
            revelacaoCelestialGasto={revelacaoCelestialGasto}
            revelacaoCelestialFormaAtiva={revelacaoCelestialFormaAtiva}
            opcoesRevelacaoCelestial={opcoesRevelacaoCelestial}
            danoBonusRevelacaoCelestial={danoBonusRevelacaoCelestial}
            cdMantoNecrotico={cdMantoNecrotico}
            onUsarRevelacaoCelestial={usarRevelacaoCelestial}
            acoesGenericasBonus={acoesGenericasBonus}
            onEscolher={(nome, desc) => escolherNoPainel('bonus', nome, desc)}
            ataqueBonus={ataqueBonus}
            onUsarAtaqueBonus={usarAtaqueMaoSecundaria}
            usosInspiracaoMaximo={usosInspiracaoMaximo}
            usosInspiracaoRestantes={usosInspiracaoRestantes}
            tamanhoDadoInspiracao={tamanhoDadoInspiracao}
            fonteDeInspiracao={fonteDeInspiracao}
            temEspacoDisponivel={temEspacoDisponivel}
            proximoCirculoParaGastar={proximoCirculoParaGastar}
            onUsarInspiracao={usarInspiracaoBardo}
            onRecuperarInspiracaoComEspaco={recuperarInspiracaoComEspaco}
            detalhesAtivo={detalhesAtivo}
          />
        )}
        {painelAberto === 'reacao' && (
          <ReacaoPanelContent
            desvantagemForcaDestreza={desvantagemForcaDestreza}
            onEscolher={(nome, desc, dano) => escolherNoPainel('reacao', nome, desc, dano)}
            onAbrirSalvaguarda={abrirSalvaguarda}
            gastarSlotCirculo={onGastarSlotCirculo}
            nivel={nivel}
            conjura={conjura}
            magiasReacao={magiasPreparadasReacao}
            modAcertoConjuracao={modAcertoConjuracao}
            detalhesAtivo={detalhesAtivo}
            contraEncantamentoDisponivel={contraEncantamentoDisponivel}
            palavrasDeInterrupcaoDisponivel={palavrasDeInterrupcaoDisponivel}
            usosInspiracaoMaximo={usosInspiracaoMaximo}
            usosInspiracaoRestantes={usosInspiracaoRestantes}
            tamanhoDadoInspiracao={tamanhoDadoInspiracao}
            onUsarInspiracao={onUsarInspiracao}
            resistenciaDaPedraDisponivel={ancestralidadeGiganteEscolhida === 'Resistência da Pedra (Gigante da Pedra)'}
            trovaoDaTempestadeDisponivel={ancestralidadeGiganteEscolhida === 'Trovão da Tempestade (Gigante da Tempestade)'}
            usosAncestralidadeGiganteMaximo={usosAncestralidadeGiganteMaximo}
            usosAncestralidadeGiganteRestantes={usosAncestralidadeGiganteRestantes}
            onUsarAncestralidadeGigante={onUsarAncestralidadeGigante}
            modConstituicaoAtual={modConstituicaoAtual}
          />
        )}
      </SidePanel>
      {lancarNoInfernoAberto && (
        <LancarNoInfernoModal
          cd={cdLancarNoInferno}
          onRolarDano={rolarDanoLancarNoInferno}
          onFechar={() => setLancarNoInfernoAberto(false)}
        />
      )}
      {ataqueDeSoproAberto && (
        <AtaqueDeSoproModal
          cd={cdAtaqueDeSopro}
          tipoDano={tipoDanoAtaqueDeSopro}
          numDados={numDadosAtaqueDeSopro}
          onRolarDano={rolarDanoAtaqueDeSopro}
          onFechar={() => setAtaqueDeSoproAberto(false)}
        />
      )}
      {telaSalvaguarda && (
        <MagiaSalvaguardaModal
          nomeMagia={telaSalvaguarda.magia.nome}
          atributo={atributoSalvaguarda(telaSalvaguarda.magia)}
          cd={modAcertoConjuracao !== null ? cdConjuracao(modAcertoConjuracao) : null}
          textoSucesso={telaSalvaguarda.magia.salvaguardaSucesso}
          textoFalha={telaSalvaguarda.magia.salvaguardaFalha}
          dano={calcularDanoMagia(telaSalvaguarda.magia, telaSalvaguarda.circuloUsado, nivel)}
          upcastTexto={telaSalvaguarda.magia.upcastTexto}
          onRolarDano={rolarDanoSalvaguarda}
          onFechar={() => setTelaSalvaguarda(null)}
        />
      )}
    </>
  );
}
