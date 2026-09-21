import { useState } from 'react';
import type { EstiloDeLuta } from '../../../data/rulesets/dnd2024/estilosDeLuta';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { OpcaoSubescolha } from '../../../data/rulesets/dnd2024/especies';
import type { CaracteristicaNivel } from '../../../core/levelUp';
import type { AtaqueResolvido } from '../../../core/ataque';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import { resolverVantagem } from '../../../core/calculoPersonagem';
import { danoComCritico } from '../../../core/danoCritico';
import type { EspacoDeMagiaAtivo, PoolDePonte } from '../../../core/magiasPersonagem';
import type { AcaoBase } from '../../../data/exampleCombat';
import type { Pet } from '../../../core/pets';
import { cdConjuracao } from '../../../core/magiasPersonagem';
import { calcularDanoMagia, calcularDanoCondicionalMagia, atributoSalvaguarda, rotuloBotaoDanoMagia } from '../../../core/magiaDano';
import { useRoll } from '../../roll/RollContext';
import InfoChip from '../../components/InfoChip';
import BarraDeVida from '../../components/BarraDeVida';
import ContadorUsos from '../../components/ContadorUsos';
import SidePanel from '../combat/SidePanel';
import PvManualModal from '../combat/PvManualModal';
import RecursosDeClasse from '../combat/RecursosDeClasse';
import type { RecursoVisivel } from '../../../core/recursosVisiveis';
import AcaoPanelContent from '../combat/AcaoPanelContent';
import EscolherEfeitoModal from '../../components/EscolherEfeitoModal';
import AtivarEfeitoModal from '../../components/AtivarEfeitoModal';
import BonusPanelContent from '../combat/BonusPanelContent';
import ReacaoPanelContent from '../combat/ReacaoPanelContent';
import SalvaguardaDoAlvoModal from '../combat/SalvaguardaDoAlvoModal';
import styles from './CombatTab.module.css';

/** Duração total da "piscada" de Fim do Turno (ver `fimDoTurno`) — os
 * 2 planos fecham na 1ª metade e abrem na 2ª. */
const DURACAO_PISCADA_MS = 500;

export type RecursoTurno = 'acao' | 'bonus' | 'reacao';
export type EstadoRecurso = 'disponivel' | 'usada';

/** Forma repetida por boa parte dos recursos "gasta e recupera" da
 * ficha (G4.2 do foco de saúde do projeto, ver `EmDevB.md`) — cada
 * característica nova de classe/espécie que só soma/consome usos
 * reaproveita esta forma em vez de 3 props soltas. */
interface RecursoContado {
  maximo: number;
  restantes: number;
  onUsar: () => boolean;
}

interface CombatTabProps {
  /** `true` = Armadura equipada (Leve/Média/Pesada) sem treinamento —
   * Desvantagem em D20 de Força ou Destreza (SDD "Penalidades por
   * Falta de Proficiência", ver `core/proficienciaArmadura.ts`).
   * Afeta Iniciativa e qualquer rolagem de ataque (todo ataque com
   * arma/desarmado usa Força ou Destreza). */
  desvantagemForcaDestreza: boolean;
  /** Bárbaro nível 7 (Instintos Primitivos) — Vantagem em Iniciativa.
   * Combinada com `desvantagemForcaDestreza` via `resolverVantagem`
   * (se coincidirem, cancelam — regra real). */
  temInstintosPrimitivos: boolean;
  pvAtual: number;
  pvMax: number;
  /** PV Temporário atual (ex: Vigor Ínfero/Vitalidade Vazia) — absorve
   * dano antes do PV normal. 0 = nenhum, linha some. */
  pvTemporario: number;
  /** Recursos de classe com contador de todas as classes (passivo, abaixo do HP). */
  recursosDeClasse: RecursoVisivel[];
  onAlterarPv: (delta: number) => void;
  /** Aplica a cura de magia no PV E dispara o efeito visual de Cura
   * (ver `FichaShell.tsx` `onCuraDeMagiaAplicada`) — diferente de
   * `onAlterarPv` puro (usado por Recuperar Fôlego e os botões
   * manuais de PV, que não disparam esse efeito). */
  onCuraDeMagiaAplicada: (total: number) => void;
  /** Bênção do Tenebroso (Bruxo, Patrono Ínfero, nível 3+). */
  bencaoDoTenebroso: { disponivel: boolean; onAplicar: () => void };
  /** Lançar no Inferno (Bruxo, Patrono Ínfero, nível 14) — 1x por
   * Descanso Longo, ou gasta 1 Espaço de Pacto pra recuperar o uso. */
  lancarNoInferno: {
    disponivel: boolean;
    gasto: boolean;
    onUsar: () => boolean;
    onRecuperarComEspacoDePacto: () => boolean;
  };
  turnState: Record<RecursoTurno, EstadoRecurso>;
  onMarcarUsado: (categoria: RecursoTurno) => void;
  onFimDoTurno: () => void;
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  onGastarSlotCirculo: (circulo: number, classeNome?: string) => boolean;
  /** Nome da classe ATIVA — dona do pool acima. Ver `MagiasTab.tsx`. */
  classeAtivaNome: string;
  /** Ponte de Magia de Pacto (SDD Multiclasse seção 8.5) — `null` pra
   * quem não tem Bruxo + outra classe conjuradora ao mesmo tempo. */
  ponte: PoolDePonte | null;
  estiloDeLuta: EstiloDeLuta | null;
  nivel: number;
  /** Recuperar Fôlego / Mente Tática (Guerreiro). */
  folego: RecursoContado;
  /** Conhecimento de Pedras (Anão) — `maximo` 0 = espécie não é Anão. */
  conhecimentoDePedras: RecursoContado;
  /** Pico de Adrenalina (Orc) — `maximo` 0 = espécie não é Orc. */
  picoDeAdrenalina: RecursoContado;
  /** Ataque de Sopro (Draconato) — `disponivel` `false` = espécie não
   * é Draconato. */
  ataqueDeSopro: RecursoContado & {
    disponivel: boolean;
    cd: number;
    explicacaoCd: ExplicacaoCalculo;
    numDados: number;
    tipoDano: string | null;
  };
  /** Voo Dracônico (Draconato, nível 5+) — `disponivel` `false` = não
   * disponível. */
  vooDraconico: { disponivel: boolean; gasto: boolean; onUsar: () => boolean };
  /** Ancestralidade Gigante (Golias) — `escolhida` é o nome da opção
   * escolhida na criação (ex.: "Arrepio do Gelo (Gigante do Gelo)"),
   * `null` = não é Golias. Mesmo contador de usos pras 6 opções
   * possíveis. */
  ancestralidadeGigante: RecursoContado & { escolhida: string | null };
  modConstituicaoAtual: number;
  /** Forma Grande (Golias, nível 5+) — `disponivel` `false` = não
   * disponível. `ativa` = transformado AGORA (diferente de `gasto` —
   * ver comentário em `armazenamentoPersonagens.ts`). */
  formaGrande: { disponivel: boolean; gasto: boolean; ativa: boolean; onUsar: () => boolean };
  /** Fúria (Bárbaro) — ver sdd/sdd-barbaro-furia.md. `disponivel` =
   * classe tem esse recurso (`maximo > 0`). Card fixo sempre visível
   * nesta aba (não só dentro do painel de Ação Bônus) — decisão
   * confirmada com o Osmar: ativar consome 1 uso no painel de Bônus,
   * mas o estado/efeitos ficam num card na tela principal do Combate,
   * com botão "Encerrar Fúria" ali mesmo. */
  furia: {
    disponivel: boolean;
    maximo: number;
    restantes: number;
    ativa: boolean;
    /** Dano da Fúria no nível atual — soma no dano de ataques baseados
     * em Força enquanto ativa (já embutido em `ataqueAtual`/
     * `ataqueBonus` quando `ativa`; aqui só pra exibir no card). */
    bonusDano: number;
    onUsar: () => boolean;
    /** Fúria Persistente (Bárbaro nível 15+) — `true` só quando: tem a
     * característica, já gastou pelo menos 1 uso de Fúria, e ainda não
     * usou essa recuperação desde o último Descanso Longo. Não trava
     * no instante exato de rolar Iniciativa (regra real) — vira um
     * botão sempre visível no card enquanto disponível, mesma ideia de
     * outros botões condicionais de card (ex.: Bênção do Tenebroso). */
    persistenteDisponivel: boolean;
    onRecuperarPersistente: () => void;
  };
  /** Ataque Imprudente (Bárbaro, nível 2+) — decidido só na 1ª jogada
   * de ataque do turno (o painel de Ação abre um mini-picker "Ataque
   * Normal"/"Ataque Imprudente" nesse momento), mas `ativo` vale pro
   * turno inteiro (Ataque Extra não pergunta de novo). Reseta sozinho
   * no Fim do Turno. `onAtivar` só liga — nunca desliga manualmente
   * (a regra real não dá esse controle; só acaba no fim do turno). */
  ataqueImprudente: { disponivel: boolean; ativo: boolean; onAtivar: () => void };
  /** Golpe Brutal (Bárbaro, nível 9+) — precisa do Ataque Imprudente
   * já ativo nesse turno (regra real). `dados` = 1 (nível 9-16) ou 2
   * (17+, "2d10"). `efeitosNivel13`/`escolhas` decidem quais efeitos
   * aparecem no picker pós-rolagem e se é 1 ou 2 escolhas (nível 17).
   * `usadoTurno` — 1x por turno, reseta no Fim do Turno (mesmo padrão
   * de `ataqueImprudente` acima, mas sem "desligar" manual). */
  golpeBrutal: {
    disponivel: boolean;
    dados: number;
    efeitosNivel13: boolean;
    escolhas: number;
    usadoTurno: boolean;
    onUsar: () => void;
  };
  /** Cortar (Mestre em Armas Grandes) — `disponivel` = talento presente
   * + arma Corpo a Corpo equipada (gate pro botão manual "Reduziu a 0
   * PV?"). `ataque` = MESMA arma do ataque principal, só não-`null`
   * quando o Crítico foi detectado sozinho OU o jogador confirmou
   * manualmente — vira a linha de Ação Bônus (mesmo padrão de
   * `ataqueBonus`). `onUsar` consome o uso (reseta pro próximo
   * Crítico/confirmação). Reseta sozinho no Fim do Turno. */
  cortar: {
    disponivel: boolean;
    ataque: AtaqueResolvido | null;
    onConfirmarReduziuAZero: () => void;
    onUsar: () => void;
  };
  /** Golpe de Escudo (Mestre em Escudos) — `disponivel` = talento +
   * arma Corpo a Corpo + Escudo equipado. Sem rolagem de dano (só
   * empurra/derruba) — o app mostra a CD, jogador resolve na mesa e
   * marca `onUsar` (1x por turno, reseta no Fim do Turno). */
  golpeDeEscudo: {
    disponivel: boolean;
    cd: number | null;
    explicacaoCd: ExplicacaoCalculo | null;
    usadoTurno: boolean;
    onUsar: () => void;
  };
  /** Esmagador/Talhador — `esmagadorDisponivel`/`talhadorDisponivel` =
   * talento + ataque PRINCIPAL causa o tipo de dano certo + ainda não
   * usado neste turno (checado em `FichaShell.tsx`). Segue o Fluxo
   * Acerto/Erro: ao ACERTAR o ataque normal, o popup de dano ganha um
   * botão do talento que abre `AtivarEfeitoModal` — "Ativar" chama
   * `onAtivarX` (marca o uso); "Não usar" só fecha (flag continua
   * livre pro próximo ataque do turno). Sem controle de Crítico
   * (Vantagem/Desvantagem contra o alvo) — decisão do Osmar, 2026-09,
   * fora de escopo (app não modela turno/alvo nesse nível). */
  golpeCondicional: {
    esmagadorDisponivel: boolean;
    talhadorDisponivel: boolean;
    onAtivarEsmagador: () => void;
    onAtivarTalhador: () => void;
  };
  /** Mãos Curativas (Aasimar) — `disponivel` `false` = espécie não é
   * Aasimar. */
  maosCurativas: { disponivel: boolean; gasto: boolean; dados: number; onUsar: () => boolean };
  /** Revelação Celestial (Aasimar, nível 3+) — escolhida de novo a
   * cada uso (natureza `escolha_reutilizavel`), por isso a lista de
   * `opcoes` vem daqui, não do wizard. */
  revelacaoCelestial: {
    disponivel: boolean;
    gasto: boolean;
    formaAtiva: string | null;
    opcoes: OpcaoSubescolha[];
    danoBonus: number;
    cdManto: number;
    onUsar: (formaEscolhida: string) => boolean;
  };
  /** Ações genéricas do Cap. 1 (ex.: Procurar/Analisar) que algum
   * Talento Geral (Analítico/Mente Aguçada) também libera como Ação
   * Bônus — continuam disponíveis na lista de Ação normal também, o
   * jogador escolhe qual usar a cada turno. Vazio = nenhum talento
   * desse tipo. */
  acoesGenericasBonus: AcaoBase[];
  /** Falar com Animais - Traço de Gnomo (Gnomo do Bosque) —
   * `disponivel` `false` = não é essa sub-escolha. */
  falarComAnimaisGnomo: RecursoContado & { disponivel: boolean };
  conjura: boolean;
  /** Truques/Magias Preparadas já roteados por Tempo de Conjuração
   * (Ação/Ação Bônus/Reação) — ver `useMagiasEConjuracao.ts`. Cada
   * painel do Combate só recebe a lista do seu próprio tipo. */
  truquesAcao: Magia[];
  truquesBonus: Magia[];
  magiasPreparadasAcao: Magia[];
  magiasPreparadasBonus: Magia[];
  magiasPreparadasReacao: Magia[];
  modAcertoConjuracao: number | null;
  /** Quebra do `modAcertoConjuracao` pro popup de rolagem (B7) —
   * `null` nos mesmos casos que `modAcertoConjuracao`. */
  explicacaoAcertoConjuracao: ExplicacaoCalculo | null;
  /** Quebra da CD de magia (B8) — usada nos popups de Salvaguarda de
   * Magia e Lançar no Inferno (mesma CD, ver `cdConjuracao`). `null`
   * nos mesmos casos que `modAcertoConjuracao`. */
  explicacaoCdConjuracao: ExplicacaoCalculo | null;
  /** NOME do truque vinculado a Explosão Agonizante + mod. de Carisma
   * — ver `MagiasTab.tsx`/`core/invocacoesMisticas.ts`. */
  truqueVinculadoAgonizante: string | undefined;
  modCarisma: number;
  numAtaques: number;
  indomavel: RecursoContado;
  pontosDeSorte: RecursoContado;
  /** Valentão de Taverna (Dano Garantido) — `true` = pode rerolar 1 no
   * dano do Ataque Desarmado. */
  danoDesarmadoRerollDisponivel: boolean;
  /** Perfurador — `true` = pode rerolar 1 dado à escolha quando o dano
   * causado for Perfurante (ver `core/rerollDanoTalento.ts`). */
  perfuradorDisponivel: boolean;
  surto: RecursoContado & { usadoTurno: boolean };
  mestreTatico: CaracteristicaNivel | null;
  ataquesEstudados: CaracteristicaNivel | null;
  ajusteTatico: CaracteristicaNivel | null;
  ataqueAtual: AtaqueResolvido | null;
  ataqueBonus: AtaqueResolvido | null;
  /** Inspiração de Bardo / Perícia Inigualável — mesmo banco de usos. */
  inspiracao: RecursoContado & {
    tamanhoDado: number;
    fonteDeInspiracao: boolean;
    onRecuperarComEspaco: () => boolean;
    onDevolverUso: () => void;
  };
  contraEncantamentoDisponivel: boolean;
  palavrasDeInterrupcaoDisponivel: boolean;
  periciaInigualavelDisponivel: boolean;
  iniciativaMod: number | null;
  /** Quebra do `iniciativaMod` (mesmo `ExplicacaoCalculo` já usado no
   * "ⓘ" de `AtributosTab`) — passada pro popup de rolagem (B7). */
  explicacaoIniciativa: ExplicacaoCalculo;
  onRolarIniciativa?: () => void;
  /** Colheita Macabra (Necromante, nível 3+) — o modal de verdade mora
   * no `FichaShell.tsx` (sobrevive à troca de aba); aqui só repassa pro
   * painel de Ação avisar quando a conjuração se qualifica, ver
   * `core/necromante.ts`. */
  colheitaMacabra: { disponivel: boolean; onDisponivel: (cura: number) => void };
  /** Colheita dos Mortos (Necromante, nível 10) — passo de escolha de
   * pet fica dentro do próprio painel de Reação (não precisa
   * sobreviver a troca de aba, diferente da Colheita Macabra: a
   * Reação inteira acontece sem fechar o painel no meio). */
  colheitaDosMortos: {
    disponivel: boolean;
    personagemEnsanguentado: boolean;
    opcoes: { pet: Pet; cura: number }[];
    onEscolher: (petId: string, cura: number) => void;
  };
  mestreDaMorte: {
    disponivel: boolean;
    pets: Pet[];
    pvTemp: number;
    onUsar: (petIds: string[]) => void;
    explosaoLiberada: boolean;
  };
  modIntAtual: number;
}

const LABELS: Record<RecursoTurno, { icone: string; nome: string }> = {
  acao: { icone: '⚔', nome: 'Ação' },
  bonus: { icone: '⚡', nome: 'Bônus' },
  reacao: { icone: '🛡', nome: 'Reação' },
};

/** Partículas decorativas da vinheta de Fúria (pedido do Osmar) —
 * posições fixas espalhadas pelas 4 bordas da tela, cada uma com seu
 * próprio `dx`/`dy` (direção "pra dentro" da tela, ver
 * `.furiaParticula` no CSS) e atraso/duração pra não pulsarem todas
 * juntas. Lista fixa (não sorteada) — decoração puramente visual, não
 * precisa variar entre renders. */
const PARTICULAS_FURIA: { top: string; left: string; dx: string; dy: string; delay: string; duration: string }[] = [
  { top: '4%', left: '0%', dx: '46px', dy: '10px', delay: '0s', duration: '3.1s' },
  { top: '18%', left: '0%', dx: '50px', dy: '-6px', delay: '0.6s', duration: '2.6s' },
  { top: '38%', left: '0%', dx: '42px', dy: '4px', delay: '1.4s', duration: '3.4s' },
  { top: '62%', left: '0%', dx: '48px', dy: '-8px', delay: '0.2s', duration: '2.9s' },
  { top: '82%', left: '0%', dx: '44px', dy: '6px', delay: '1.8s', duration: '3.2s' },
  { top: '4%', left: '100%', dx: '-46px', dy: '10px', delay: '0.9s', duration: '2.8s' },
  { top: '24%', left: '100%', dx: '-50px', dy: '-4px', delay: '0.3s', duration: '3.3s' },
  { top: '48%', left: '100%', dx: '-42px', dy: '8px', delay: '1.6s', duration: '2.7s' },
  { top: '70%', left: '100%', dx: '-48px', dy: '-6px', delay: '1.1s', duration: '3.0s' },
  { top: '90%', left: '100%', dx: '-44px', dy: '4px', delay: '0.5s', duration: '2.5s' },
  { top: '0%', left: '15%', dx: '6px', dy: '46px', delay: '0.4s', duration: '3.1s' },
  { top: '0%', left: '45%', dx: '-4px', dy: '50px', delay: '1.3s', duration: '2.7s' },
  { top: '0%', left: '75%', dx: '5px', dy: '44px', delay: '0.8s', duration: '3.4s' },
  { top: '100%', left: '25%', dx: '-6px', dy: '-48px', delay: '1.7s', duration: '2.9s' },
  { top: '100%', left: '55%', dx: '4px', dy: '-44px', delay: '0.1s', duration: '3.2s' },
  { top: '100%', left: '85%', dx: '-5px', dy: '-50px', delay: '1.0s', duration: '2.6s' },
];

/** Efeitos de Golpe Brutal (Bárbaro nível 9+, "Fortalecido" no 13) —
 * texto derivado das descrições reais em `caracteristicasClasse.ts`
 * (Golpe Brutal/Golpe Brutal Fortalecido), encurtado só pro card de
 * escolha. Fica aqui (não em `data/`) porque é texto de exibição da UI
 * do Combate, não dado consumido por `core/` — mesmo raciocínio do
 * texto hardcoded do picker "Ataque Normal/Imprudente". Puramente
 * informativo: o app não rastreia alvo/Deslocamento/status de
 * inimigo, então escolher só atualiza o feedback com o lembrete —
 * nenhum efeito é aplicado de verdade (ver Backlog.md, "ferramenta de
 * tracking de status" parada de propósito). */
const EFEITOS_GOLPE_BRUTAL: { nome: string; texto: string; nivelMinimo: 9 | 13 }[] = [
  {
    nome: 'Golpe Debilitador',
    texto: 'O Deslocamento do alvo é reduzido em 4,5m até o início do seu próximo turno (só 1 de cada vez, o mais recente).',
    nivelMinimo: 9,
  },
  {
    nome: 'Golpe Poderoso',
    texto:
      'O alvo é empurrado 4,5m pra longe de você — em seguida, você pode se mover até metade do seu Deslocamento em direção a ele sem provocar Ataques de Oportunidade.',
    nivelMinimo: 9,
  },
  {
    nome: 'Golpe Atordoante',
    texto: 'O alvo tem Desvantagem na próxima salvaguarda que realizar e não pode fazer Ataques de Oportunidade até o início do seu próximo turno.',
    nivelMinimo: 13,
  },
  {
    nome: 'Golpe Destruidor',
    texto: 'Até o início do seu próximo turno, a PRÓXIMA jogada de ataque de outra criatura contra o alvo ganha +5 (só 1 bônus de cada vez).',
    nivelMinimo: 13,
  },
];

export default function CombatTab({
  desvantagemForcaDestreza,
  temInstintosPrimitivos,
  pvAtual,
  pvMax,
  pvTemporario,
  recursosDeClasse,
  onAlterarPv,
  onCuraDeMagiaAplicada,
  bencaoDoTenebroso: { disponivel: bencaoDoTenebrosoDisponivel, onAplicar: onAplicarBencaoDoTenebroso },
  lancarNoInferno: {
    disponivel: lancarNoInfernoDisponivel,
    gasto: lancarNoInfernoGasto,
    onUsar: onUsarLancarNoInferno,
    onRecuperarComEspacoDePacto: onRecuperarLancarNoInfernoComEspacoDePacto,
  },
  turnState,
  onMarcarUsado,
  onFimDoTurno,
  espacos,
  espacosGastosPorCirculo,
  onGastarSlotCirculo,
  classeAtivaNome,
  ponte,
  estiloDeLuta,
  nivel,
  folego: { maximo: usosFolegoMaximo, restantes: usosFolegoRestantes, onUsar: onUsarUsoFolego },
  conhecimentoDePedras: {
    maximo: usosConhecimentoDePedrasMaximo,
    restantes: usosConhecimentoDePedrasRestantes,
    onUsar: onUsarConhecimentoDePedras,
  },
  picoDeAdrenalina: {
    maximo: usosPicoDeAdrenalinaMaximo,
    restantes: usosPicoDeAdrenalinaRestantes,
    onUsar: onUsarPicoDeAdrenalina,
  },
  ataqueDeSopro: {
    disponivel: ataqueDeSoproDisponivel,
    maximo: usosAtaqueDeSoproMaximo,
    restantes: usosAtaqueDeSoproRestantes,
    cd: cdAtaqueDeSopro,
    explicacaoCd: explicacaoCdAtaqueDeSopro,
    numDados: numDadosAtaqueDeSopro,
    tipoDano: tipoDanoAtaqueDeSopro,
    onUsar: onUsarAtaqueDeSopro,
  },
  vooDraconico: { disponivel: vooDraconicoDisponivel, gasto: vooDraconicoGasto, onUsar: onUsarVooDraconico },
  ancestralidadeGigante: {
    escolhida: ancestralidadeGiganteEscolhida,
    maximo: usosAncestralidadeGiganteMaximo,
    restantes: usosAncestralidadeGiganteRestantes,
    onUsar: onUsarAncestralidadeGigante,
  },
  modConstituicaoAtual,
  formaGrande: {
    disponivel: formaGrandeDisponivel,
    gasto: formaGrandeGasto,
    ativa: formaGrandeAtiva,
    onUsar: onUsarFormaGrande,
  },
  furia: {
    disponivel: furiaDisponivel,
    maximo: furiaMaximo,
    restantes: furiaRestantes,
    ativa: furiaAtiva,
    bonusDano: furiaBonusDano,
    onUsar: onUsarFuria,
    persistenteDisponivel: furiaPersistenteDisponivel,
    onRecuperarPersistente: onRecuperarFuriaPersistente,
  },
  ataqueImprudente: {
    disponivel: ataqueImprudenteDisponivel,
    ativo: ataqueImprudenteAtivo,
    onAtivar: onAtivarAtaqueImprudente,
  },
  golpeBrutal: {
    disponivel: golpeBrutalDisponivel,
    dados: golpeBrutalDados,
    efeitosNivel13: golpeBrutalEfeitosNivel13,
    escolhas: golpeBrutalEscolhas,
    usadoTurno: golpeBrutalUsadoTurno,
    onUsar: onUsarGolpeBrutal,
  },
  cortar: {
    disponivel: cortarDisponivel,
    ataque: cortarAtaque,
    onConfirmarReduziuAZero: onConfirmarCortarReduzirAZero,
    onUsar: onUsarCortar,
  },
  golpeDeEscudo: {
    disponivel: golpeDeEscudoDisponivel,
    cd: cdGolpeDeEscudo,
    explicacaoCd: explicacaoCdGolpeDeEscudo,
    usadoTurno: golpeDeEscudoUsadoTurno,
    onUsar: onUsarGolpeDeEscudo,
  },
  golpeCondicional: {
    esmagadorDisponivel,
    talhadorDisponivel,
    onAtivarEsmagador,
    onAtivarTalhador,
  },
  maosCurativas: {
    disponivel: maosCurativasDisponivel,
    gasto: maosCurativasGasto,
    dados: dadosMaosCurativas,
    onUsar: onUsarMaosCurativas,
  },
  revelacaoCelestial: {
    disponivel: revelacaoCelestialDisponivel,
    gasto: revelacaoCelestialGasto,
    formaAtiva: revelacaoCelestialFormaAtiva,
    opcoes: opcoesRevelacaoCelestial,
    danoBonus: danoBonusRevelacaoCelestial,
    cdManto: cdMantoNecrotico,
    onUsar: onUsarRevelacaoCelestial,
  },
  acoesGenericasBonus,
  falarComAnimaisGnomo: {
    disponivel: falarComAnimaisGnomoDisponivel,
    maximo: usosFalarComAnimaisGnomoMaximo,
    restantes: usosFalarComAnimaisGnomoRestantes,
    onUsar: onUsarFalarComAnimaisGnomo,
  },
  conjura,
  truquesAcao,
  truquesBonus,
  magiasPreparadasAcao,
  magiasPreparadasBonus,
  magiasPreparadasReacao,
  modAcertoConjuracao,
  explicacaoAcertoConjuracao,
  explicacaoCdConjuracao,
  truqueVinculadoAgonizante,
  modCarisma,
  numAtaques,
  indomavel: { maximo: indomavelMaximo, restantes: indomavelRestantes, onUsar: onUsarIndomavel },
  pontosDeSorte: { maximo: pontosDeSorteMaximo, restantes: pontosDeSorteRestantes, onUsar: onUsarPontoDeSorte },
  danoDesarmadoRerollDisponivel,
  perfuradorDisponivel,
  surto: { maximo: surtoMaximo, restantes: surtoRestantes, usadoTurno: surtoUsadoTurno, onUsar: onUsarSurto },
  mestreTatico,
  ataquesEstudados,
  ajusteTatico,
  ataqueAtual,
  ataqueBonus,
  inspiracao: {
    maximo: usosInspiracaoMaximo,
    restantes: usosInspiracaoRestantes,
    tamanhoDado: tamanhoDadoInspiracao,
    fonteDeInspiracao,
    onUsar: onUsarInspiracao,
    onRecuperarComEspaco: onRecuperarInspiracaoComEspaco,
    onDevolverUso: onDevolverUsoInspiracao,
  },
  contraEncantamentoDisponivel,
  palavrasDeInterrupcaoDisponivel,
  periciaInigualavelDisponivel,
  iniciativaMod,
  explicacaoIniciativa,
  onRolarIniciativa,
  colheitaMacabra: { disponivel: colheitaMacabraDisponivel, onDisponivel: onColheitaMacabraDisponivel },
  colheitaDosMortos: {
    disponivel: colheitaDosMortosDisponivel,
    personagemEnsanguentado,
    opcoes: opcoesColheitaDosMortos,
    onEscolher: onColheitaDosMortos,
  },
  mestreDaMorte: {
    disponivel: mestreDaMorteDisponivel,
    pets: petsMortoVivo,
    pvTemp: pvTempMestreDaMorte,
    onUsar: onUsarMestreDaMorte,
    explosaoLiberada: mestreDaMorteExplosaoLiberada,
  },
  modIntAtual,
}: CombatTabProps) {
  const [pvManualAberto, setPvManualAberto] = useState(false);
  const [painelAberto, setPainelAberto] = useState<RecursoTurno | null>(null);
  const [detalhesAtivo, setDetalhesAtivo] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  /** Golpe Brutal (Bárbaro nível 9+) — `true` depois de confirmar o
   * popup de dano (botão "🔨 Golpe Brutal", `confirmarFechamento`),
   * abre o modal de escolha de efeito (`EscolherEfeitoModal`). Só
   * textual (o app não rastreia alvo/status de inimigo) — escolher só
   * atualiza o feedback com o lembrete da regra. */
  const [golpeBrutalEfeitoPendente, setGolpeBrutalEfeitoPendente] = useState(false);
  // `danoRolado: null` = magia sem fórmula de dano própria (não tem o
  // que rolar); `number` = já rolou sozinho ao abrir (ver
  // `abrirSalvaguarda` — Fluxo Acerto/Erro estendido pra Salvaguarda do
  // Alvo, 2026-09, ver DECISOES-COMBATE.md).
  const [telaSalvaguarda, setTelaSalvaguarda] = useState<{
    magia: Magia;
    circuloUsado: number;
    danoRolado: number | null;
    upcastNaoAutomatico: boolean;
  } | null>(null);
  const [ataquesFeitos, setAtaquesFeitos] = useState(0);
  const [piscando, setPiscando] = useState(false);
  const [iniciativaValor, setIniciativaValor] = useState<number | null>(null);
  const [periciaInigualavelPendente, setPericiaInigualavelPendente] = useState(false);
  // `null` = popup fechado; `number` = aberto com esse total já rolado
  // (mesmo padrão de `telaSalvaguarda.danoRolado`).
  const [lancarNoInfernoDano, setLancarNoInfernoDano] = useState<number | null>(null);
  const [ataqueDeSoproDano, setAtaqueDeSoproDano] = useState<number | null>(null);
  const [golpeDeEscudoAberto, setGolpeDeEscudoAberto] = useState(false);
  // Esmagador/Talhador — qual popup de "Ativar efeito" está aberto
  // agora (`null` = nenhum), disparado pelo botão do talento no popup
  // de dano (mesmo padrão de `golpeBrutalEfeitoPendente`).
  const [golpeCondicionalPendente, setGolpeCondicionalPendente] = useState<'esmagador' | 'talhador' | null>(null);
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
      explicacaoMod: explicacaoIniciativa,
      vantagem: resolverVantagem(temInstintosPrimitivos, desvantagemForcaDestreza),
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
      setAtaquesFeitos(0);
      setGolpeBrutalEfeitoPendente(false);
    }, DURACAO_PISCADA_MS / 2);
    setTimeout(() => setPiscando(false), DURACAO_PISCADA_MS);
  }

  function abrirPainel(categoria: RecursoTurno) {
    if (turnState[categoria] === 'usada') return;
    setFeedback(null);
    setGolpeBrutalEfeitoPendente(false);
    setPainelAberto(categoria);
  }

  function fecharPainel() {
    setPainelAberto(null);
  }

  function escolherNoPainel(categoria: RecursoTurno, nome: string, desc: string) {
    onMarcarUsado(categoria);
    setPainelAberto(null);
    setFeedback(`${nome} — ${desc}`);
  }

  // Fluxo Acerto/Erro estendido pra Salvaguarda do Alvo (2026-09, ver
  // DECISOES-COMBATE.md "Salvaguarda do Alvo — popup único"): quando a
  // magia tem fórmula de dano própria, já rola sozinho ao abrir (sem
  // botão manual de "Rolar Dano") — o popup final só abre depois que o
  // dado resolve, com Falha/Sucesso já calculados.
  function abrirSalvaguarda(magia: Magia, circuloUsado: number) {
    const dano = calcularDanoMagia(magia, circuloUsado, nivel);
    if (!dano) {
      setTelaSalvaguarda({ magia, circuloUsado, danoRolado: null, upcastNaoAutomatico: false });
      return;
    }
    let totalRolado = 0;
    rolarDados({
      label: `Dano — ✨ ${magia.nome}`,
      formula: `${dano.quantidade}d${dano.lados}${dano.mod ? ` + ${dano.mod}` : ''}`,
      quantidade: dano.quantidade,
      lados: dano.lados,
      mod: dano.mod,
      explicacaoMod: dano.explicacao,
      onResultado: (total) => {
        totalRolado = total;
      },
      confirmarFechamento: {
        aoTocar: () =>
          setTelaSalvaguarda({ magia, circuloUsado, danoRolado: totalRolado, upcastNaoAutomatico: dano.upcastNaoAutomatico }),
      },
    });
  }

  // Ver `danoCondicionalDado` em magias.ts — só Badalar Fúnebre hoje
  // (dano diferente se o alvo já estiver ferido, algo que o app não
  // rastreia). Diferente do dano principal (`abrirSalvaguarda`), esse
  // continua manual/à parte — fecha o popup e rola direto, sem juntar
  // no Falha/Sucesso.
  function rolarDanoCondicionalSalvaguarda() {
    if (!telaSalvaguarda) return;
    const dano = calcularDanoCondicionalMagia(telaSalvaguarda.magia, telaSalvaguarda.circuloUsado, nivel);
    const texto = telaSalvaguarda.magia.danoCondicionalTexto;
    setTelaSalvaguarda(null);
    if (!dano) return;
    rolarDados({
      label: `Dano (${texto}) — ✨ ${telaSalvaguarda.magia.nome}`,
      formula: `${dano.quantidade}d${dano.lados}${dano.mod ? ` + ${dano.mod}` : ''}`,
      quantidade: dano.quantidade,
      lados: dano.lados,
      mod: dano.mod,
      explicacaoMod: dano.explicacao,
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

  /** Ancestralidade Gigante "ao acertar" (Arrepio do Gelo/Queimadura de
   * Fogo/Tombo da Colina) — retrofit 2026-09 (ver `DECISOES-COMBATE.md`):
   * chamado pelo `confirmarFechamento` do popup de dano do ataque
   * principal (`AcaoPanelContent.tsx`), não mais um card avulso solto
   * na tela. Continua morando aqui (não em `AcaoPanelContent.tsx`)
   * porque só o `CombatTab` tem o resto do estado (Salto da Nuvem usa
   * o MESMO contador de usos). */
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

  /** Ativar Fúria gasta a Ação Bônus (marca 'bonus' como usada);
   * encerrar (o mesmo toggle, quando já ativa) é de graça — a regra
   * real não cobra nada pra sair da Fúria voluntariamente. */
  function usarFuria() {
    const ativandoAgora = !furiaAtiva;
    if (!onUsarFuria()) return;
    if (ativandoAgora) onMarcarUsado('bonus');
  }

  function usarRevelacaoCelestial(formaEscolhida: string) {
    if (!onUsarRevelacaoCelestial(formaEscolhida)) return;
    onMarcarUsado('bonus');
  }

  function abrirAtaqueDeSopro() {
    if (!onUsarAtaqueDeSopro()) return;
    let totalRolado = 0;
    rolarDados({
      label: 'Ataque de Sopro — Dano',
      formula: `${numDadosAtaqueDeSopro}d10`,
      quantidade: numDadosAtaqueDeSopro,
      lados: 10,
      mod: 0,
      onResultado: (total) => {
        totalRolado = total;
      },
      confirmarFechamento: { aoTocar: () => setAtaqueDeSoproDano(totalRolado) },
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

  /** Fluxo Acerto/Erro sempre (retrofit 2026-09, ver
   * `DECISOES-COMBATE.md`) — igual ao ataque principal
   * (`AcaoPanelContent.tsx` `rolarAtaque`), sem botão de talento (essa
   * dupla nunca teve Esmagador/Talhador ligado, fora de escopo desta
   * rodada). */
  function usarAtaqueMaoSecundaria() {
    if (!ataqueBonus) return;
    rolarD20({
      label: `Ataque — ${ataqueBonus.nome} (Mão Secundária)`,
      formula: `1d20 + ${ataqueBonus.info.modAcerto}`,
      mod: ataqueBonus.info.modAcerto,
      explicacaoMod: ataqueBonus.info.explicacaoAcerto,
      vantagem: desvantagemForcaDestreza ? 'desvantagem' : undefined,
      confirmarAcerto: {
        onAcertou: ({ critico }) => {
          const dano = danoComCritico(
            { quantidade: ataqueBonus.info.danoQuantidade, lados: ataqueBonus.info.danoLados, mod: ataqueBonus.info.danoMod },
            critico,
          );
          rolarDados({
            label: `Dano — ${ataqueBonus.nome} (Mão Secundária)${critico ? ' (Crítico)' : ''}`,
            formula: dano.formula,
            quantidade: dano.quantidade,
            lados: ataqueBonus.info.danoLados,
            mod: ataqueBonus.info.danoMod,
            rerollSe1:
              ataqueBonus.nome.endsWith('Ataque Desarmado') && danoDesarmadoRerollDisponivel
                ? { rotulo: 'Dano Garantido' }
                : undefined,
            rerollEscolhido:
              perfuradorDisponivel && ataqueBonus.info.danoTipo === 'Perfurante' ? { rotulo: 'Perfurador' } : undefined,
            confirmarFechamento: {},
          });
        },
        onErrou: () => {},
      },
    });
    onMarcarUsado('bonus');
    setPainelAberto(null);
    setFeedback(`🗡 ${ataqueBonus.nome} (Mão Secundária) — ${ataqueBonus.descricao}`);
  }

  function usarCortarAtaque() {
    if (!cortarAtaque) return;
    rolarD20({
      label: `Ataque — ${cortarAtaque.nome} (Cortar)`,
      formula: `1d20 + ${cortarAtaque.info.modAcerto}`,
      mod: cortarAtaque.info.modAcerto,
      explicacaoMod: cortarAtaque.info.explicacaoAcerto,
      vantagem: desvantagemForcaDestreza ? 'desvantagem' : undefined,
      confirmarAcerto: {
        onAcertou: ({ critico }) => {
          const dano = danoComCritico(
            { quantidade: cortarAtaque.info.danoQuantidade, lados: cortarAtaque.info.danoLados, mod: cortarAtaque.info.danoMod },
            critico,
          );
          rolarDados({
            label: `Dano — ${cortarAtaque.nome} (Cortar)${critico ? ' (Crítico)' : ''}`,
            formula: dano.formula,
            quantidade: dano.quantidade,
            lados: cortarAtaque.info.danoLados,
            mod: cortarAtaque.info.danoMod,
            rerollSe1:
              cortarAtaque.nome.endsWith('Ataque Desarmado') && danoDesarmadoRerollDisponivel
                ? { rotulo: 'Dano Garantido' }
                : undefined,
            rerollEscolhido:
              perfuradorDisponivel && cortarAtaque.info.danoTipo === 'Perfurante' ? { rotulo: 'Perfurador' } : undefined,
            confirmarFechamento: {},
          });
        },
        onErrou: () => {},
      },
    });
    onUsarCortar();
    onMarcarUsado('bonus');
    setPainelAberto(null);
    setFeedback(`🗡 ${cortarAtaque.nome} (Cortar) — ${cortarAtaque.descricao}`);
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
    let totalRolado = 0;
    rolarDados({
      label: 'Lançar no Inferno — Dano',
      formula: '8d10',
      quantidade: 8,
      lados: 10,
      mod: 0,
      onResultado: (total) => {
        totalRolado = total;
      },
      confirmarFechamento: { aoTocar: () => setLancarNoInfernoDano(totalRolado) },
    });
  }

  /** Golpe de Escudo (Mestre em Escudos) — mesmo padrão de
   * `abrirAtaqueDeSopro`/`abrirLancarNoInferno`: marca o uso (1x/turno)
   * e abre o popup padrão de "salvaguarda do alvo" junto, na mesma
   * ação de tocar a linha no painel de Ação. */
  function abrirGolpeDeEscudo() {
    onUsarGolpeDeEscudo();
    setGolpeDeEscudoAberto(true);
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

  /** Bookkeeping do turno pro ataque principal — Fluxo Acerto/Erro
   * sempre (retrofit 2026-09, ver `DECISOES-COMBATE.md`), o popup de
   * dano já resolve tudo sozinho, sem os botões antigos de dano (ver
   * `AcaoPanelContent.tsx`). */
  function registrarAtaqueSemDanoPendente(nome: string, desc: string) {
    const proximo = ataquesFeitos + 1;
    setAtaquesFeitos(proximo);
    setFeedback(`${nome} — ${desc}`);
    if (proximo >= numAtaques) {
      onMarcarUsado('acao');
      setPainelAberto(null);
    }
  }

  function usarSurtoDeAcao() {
    if (!onUsarSurto()) return;
    setFeedback('💥 Surto de Ação — você ganhou uma ação extra nesse turno (a Ação normal continua disponível).');
  }

  const efeitosGolpeBrutalDisponiveis = EFEITOS_GOLPE_BRUTAL.filter(
    (e) => e.nivelMinimo === 9 || golpeBrutalEfeitosNivel13,
  );

  /** Chamado pelo `EscolherEfeitoModal` (ver `DECISOES-COMBATE.md`
   * "Fluxo Acerto/Erro") — só texto de lembrete, o app não rastreia
   * alvo/status de inimigo (decisão antiga, ver Backlog.md). */
  function finalizarEfeitosGolpeBrutal(nomes: string[]) {
    const textos = nomes.map((nome) => efeitosGolpeBrutalDisponiveis.find((e) => e.nome === nome)?.texto ?? '');
    setFeedback(`🔨 ${nomes.join(' + ')} — ${textos.join(' ')}`);
    setGolpeBrutalEfeitoPendente(false);
  }

  const TEXTOS_GOLPE_CONDICIONAL: Record<'esmagador' | 'talhador', { titulo: string; textoEfeito: string }> = {
    esmagador: {
      titulo: '🔨 Esmagador',
      textoEfeito: 'Empurra o alvo 1,5m pra um espaço livre (se ele não for maior que você).',
    },
    talhador: {
      titulo: '🗡️ Talhador',
      textoEfeito: 'Reduz o Deslocamento do alvo em 3m até o início do seu próximo turno.',
    },
  };

  function ativarGolpeCondicional() {
    if (!golpeCondicionalPendente) return;
    const { titulo, textoEfeito } = TEXTOS_GOLPE_CONDICIONAL[golpeCondicionalPendente];
    if (golpeCondicionalPendente === 'esmagador') onAtivarEsmagador();
    else onAtivarTalhador();
    setFeedback(`${titulo} — ${textoEfeito}`);
    setGolpeCondicionalPendente(null);
  }

  const temEspacoDisponivel = espacos.some((e) => (espacosGastosPorCirculo[e.circulo] ?? 0) < e.maximo);
  // `espacos` já vem ordenado por círculo crescente (espacosDeMagiaAtivos,
  // core/magiasPersonagem.ts) — o primeiro com sobra é exatamente o que
  // `gastarQualquerSlot` (FichaShell.tsx) vai gastar de verdade.
  const proximoCirculoParaGastar = espacos.find((e) => (espacosGastosPorCirculo[e.circulo] ?? 0) < e.maximo)?.circulo ?? null;

  const danoCondicionalSalvaguarda = telaSalvaguarda
    ? calcularDanoCondicionalMagia(telaSalvaguarda.magia, telaSalvaguarda.circuloUsado, nivel)
    : null;
  const avisoUpcastSalvaguarda =
    telaSalvaguarda?.upcastNaoAutomatico && telaSalvaguarda?.magia.upcastTexto
      ? `Círculo usado é maior que o base — dano acima NÃO inclui o upcast. Efeito real: ${telaSalvaguarda.magia.upcastTexto}`
      : null;
  // `${total} — ${texto original}` (nunca reescreve/assume a estrutura
  // do texto da planilha — ver PENDENCIAS.md "Salvaguarda do Alvo":
  // reconhecer TIPO de sucesso (metade/nenhum/cheio) precisa de coluna
  // nova, mas mostrar o valor JÁ rolado ao lado do texto de Falha não
  // depende disso, porque Falha é sempre "dano completo").
  const textoFalhaSalvaguarda = telaSalvaguarda
    ? telaSalvaguarda.danoRolado !== null
      ? `${telaSalvaguarda.danoRolado} — ${telaSalvaguarda.magia.salvaguardaFalha}`
      : telaSalvaguarda.magia.salvaguardaFalha
    : null;

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
      {furiaAtiva && (
        <div className={styles.furiaVinheta} aria-hidden="true">
          {PARTICULAS_FURIA.map((p, i) => (
            <span
              key={i}
              className={styles.furiaParticula}
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                ['--fp-dx' as string]: p.dx,
                ['--fp-dy' as string]: p.dy,
              }}
            />
          ))}
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
        <BarraDeVida valor={pvAtual} maximo={pvMax} temporario={pvTemporario} />
      </div>
      <div className={styles.hpBtnRow}>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(-5)}>
          −5
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(-1)}>
          −1
        </div>
        <div className={styles.hpBtnSmall} onClick={() => setPvManualAberto(true)}>
          Manual
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(1)}>
          +1
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(5)}>
          +5
        </div>
      </div>

      <RecursosDeClasse recursos={recursosDeClasse} />

      {furiaDisponivel && (
        <div className="opt-card" style={{ marginBottom: 12, borderColor: furiaAtiva ? '#b23b3b' : undefined }}>
          <div className="opt-card-name">😡 Fúria {furiaAtiva ? 'ATIVA' : ''}</div>
          {furiaAtiva ? (
            <>
              <div className="opt-card-desc">
                Resistência a dano Contundente, Cortante e Perfurante
                <br />+{furiaBonusDano} no dano de ataques baseados em Força
                <br />
                Vantagem em testes/salvaguardas de Força · não pode conjurar magia nem manter Concentração.
              </div>
              <div className="label" style={{ marginTop: 4 }}>
                Encerra sozinha ao vestir Armadura Pesada — ou toque abaixo pra encerrar manualmente.
              </div>
              <div
                className="btn"
                style={{ marginTop: 8, background: 'rgba(178, 59, 59, 0.16)', borderColor: '#b23b3b' }}
                onClick={usarFuria}
              >
                Encerrar Fúria
              </div>
            </>
          ) : (
            <div className="opt-card-desc">
              {furiaRestantes} de {furiaMaximo} usos disponíveis — ative no painel de Ação Bônus.
            </div>
          )}
          {furiaPersistenteDisponivel && (
            <div className="btn" style={{ marginTop: 8 }} onClick={onRecuperarFuriaPersistente}>
              🔥 Recuperar Fúria (Fúria Persistente)
            </div>
          )}
        </div>
      )}

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
            <ContadorUsos total={usosInspiracaoMaximo} usados={usosInspiracaoMaximo - usosInspiracaoRestantes} variante="mostarda" />
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

      {feedback && <div className={styles.feedback}>{feedback}</div>}

      {golpeBrutalEfeitoPendente && (
        <EscolherEfeitoModal
          titulo={golpeBrutalEscolhas > 1 ? `🔨 Golpe Brutal — escolha ${golpeBrutalEscolhas} efeitos` : '🔨 Golpe Brutal — escolha 1 efeito'}
          opcoes={efeitosGolpeBrutalDisponiveis}
          maxEscolhas={golpeBrutalEscolhas}
          onEscolher={finalizarEfeitosGolpeBrutal}
          onFechar={() => setGolpeBrutalEfeitoPendente(false)}
        />
      )}


      {pvManualAberto && <PvManualModal onAplicar={onAlterarPv} onFechar={() => setPvManualAberto(false)} />}

      <SidePanel
        open={painelAberto === 'acao'}
        side="left"
        title={`${LABELS.acao.icone} ${LABELS.acao.nome}`}
        onClose={fecharPainel}
        detalhesAtivo={detalhesAtivo}
        onToggleDetalhes={() => setDetalhesAtivo((v) => !v)}
      >
        <AcaoPanelContent
          aberto={painelAberto === 'acao'}
          desvantagemForcaDestreza={desvantagemForcaDestreza}
          onEscolher={(nome, desc) => escolherNoPainel('acao', nome, desc)}
          onAbrirSalvaguarda={abrirSalvaguarda}
          gastarSlotCirculo={onGastarSlotCirculo}
          onAlterarPv={onAlterarPv}
          onCuraDeMagiaAplicada={onCuraDeMagiaAplicada}
          nivel={nivel}
          espacos={espacos}
          espacosGastosPorCirculo={espacosGastosPorCirculo}
          classeAtivaNome={classeAtivaNome}
          ponte={ponte}
          conjura={conjura}
          truques={truquesAcao}
          magiasPreparadas={magiasPreparadasAcao}
          modAcertoConjuracao={modAcertoConjuracao}
          explicacaoAcertoConjuracao={explicacaoAcertoConjuracao}
          truqueVinculadoAgonizante={truqueVinculadoAgonizante}
          modCarisma={modCarisma}
          numAtaques={numAtaques}
          ataquesFeitos={ataquesFeitos}
          surtoMax={surtoMaximo}
          surtoRestantes={surtoRestantes}
          surtoUsadoTurno={surtoUsadoTurno}
          onUsarSurto={usarSurtoDeAcao}
          ataqueAtual={ataqueAtual}
          danoDesarmadoRerollDisponivel={danoDesarmadoRerollDisponivel}
          perfuradorDisponivel={perfuradorDisponivel}
          temAtaqueImprudente={ataqueImprudenteDisponivel}
          ataqueImprudenteAtivo={ataqueImprudenteAtivo}
          onAtivarAtaqueImprudente={onAtivarAtaqueImprudente}
          temGolpeBrutal={golpeBrutalDisponivel}
          golpeBrutalDados={golpeBrutalDados}
          golpeBrutalUsadoTurno={golpeBrutalUsadoTurno}
          onUsarGolpeBrutal={onUsarGolpeBrutal}
          onAtacouSemDanoPendente={registrarAtaqueSemDanoPendente}
          onGolpeBrutalDanoConfirmado={() => setGolpeBrutalEfeitoPendente(true)}
          podeOferecerCortar={cortarDisponivel}
          onConfirmarCortarReduzirAZero={onConfirmarCortarReduzirAZero}
          temGolpeDeEscudo={golpeDeEscudoDisponivel}
          golpeDeEscudoUsadoTurno={golpeDeEscudoUsadoTurno}
          onUsarGolpeDeEscudo={abrirGolpeDeEscudo}
          esmagadorDisponivel={esmagadorDisponivel}
          talhadorDisponivel={talhadorDisponivel}
          onAbrirGolpeCondicional={setGolpeCondicionalPendente}
          ancestralidadeGiganteEscolhida={ancestralidadeGiganteEscolhida}
          usosAncestralidadeGiganteRestantes={usosAncestralidadeGiganteRestantes}
          onAtivarAncestralidadeGigante={usarAncestralidadeGiganteAoAcertar}
          detalhesAtivo={detalhesAtivo}
          maosCurativasDisponivel={maosCurativasDisponivel}
          maosCurativasGasto={maosCurativasGasto}
          dadosMaosCurativas={dadosMaosCurativas}
          onUsarMaosCurativas={onUsarMaosCurativas}
          falarComAnimaisGnomoDisponivel={falarComAnimaisGnomoDisponivel}
          usosFalarComAnimaisGnomoMaximo={usosFalarComAnimaisGnomoMaximo}
          usosFalarComAnimaisGnomoRestantes={usosFalarComAnimaisGnomoRestantes}
          onUsarFalarComAnimaisGnomo={onUsarFalarComAnimaisGnomo}
          colheitaMacabraDisponivel={colheitaMacabraDisponivel}
          onColheitaMacabraDisponivel={onColheitaMacabraDisponivel}
        />
      </SidePanel>
      <SidePanel
        open={painelAberto === 'bonus'}
        side="right"
        title={`${LABELS.bonus.icone} ${LABELS.bonus.nome}`}
        onClose={fecharPainel}
        detalhesAtivo={detalhesAtivo}
        onToggleDetalhes={() => setDetalhesAtivo((v) => !v)}
      >
        <BonusPanelContent
          aberto={painelAberto === 'bonus'}
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
          furiaDisponivel={furiaDisponivel}
          furiaMaximo={furiaMaximo}
          furiaRestantes={furiaRestantes}
          furiaAtiva={furiaAtiva}
          onUsarFuria={usarFuria}
          revelacaoCelestialDisponivel={revelacaoCelestialDisponivel}
          revelacaoCelestialGasto={revelacaoCelestialGasto}
          revelacaoCelestialFormaAtiva={revelacaoCelestialFormaAtiva}
          opcoesRevelacaoCelestial={opcoesRevelacaoCelestial}
          danoBonusRevelacaoCelestial={danoBonusRevelacaoCelestial}
          cdMantoNecrotico={cdMantoNecrotico}
          onUsarRevelacaoCelestial={usarRevelacaoCelestial}
          acoesGenericasBonus={acoesGenericasBonus}
          mestreDaMorteDisponivel={mestreDaMorteDisponivel}
          petsMortoVivo={petsMortoVivo}
          pvTempMestreDaMorte={pvTempMestreDaMorte}
          onUsarMestreDaMorte={onUsarMestreDaMorte}
          onEscolher={(nome, desc) => escolherNoPainel('bonus', nome, desc)}
          desvantagemForcaDestreza={desvantagemForcaDestreza}
          conjura={conjura}
          truques={truquesBonus}
          magiasPreparadas={magiasPreparadasBonus}
          espacos={espacos}
          espacosGastosPorCirculo={espacosGastosPorCirculo}
          onGastarSlotCirculo={onGastarSlotCirculo}
          onCuraDeMagiaAplicada={onCuraDeMagiaAplicada}
          classeAtivaNome={classeAtivaNome}
          ponte={ponte}
          nivel={nivel}
          modAcertoConjuracao={modAcertoConjuracao}
          explicacaoAcertoConjuracao={explicacaoAcertoConjuracao}
          truqueVinculadoAgonizante={truqueVinculadoAgonizante}
          modCarisma={modCarisma}
          onAbrirSalvaguarda={abrirSalvaguarda}
          colheitaMacabraDisponivel={colheitaMacabraDisponivel}
          onColheitaMacabraDisponivel={onColheitaMacabraDisponivel}
          ataqueBonus={ataqueBonus}
          onUsarAtaqueBonus={usarAtaqueMaoSecundaria}
          cortarAtaque={cortarAtaque}
          onUsarCortar={usarCortarAtaque}
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
      </SidePanel>
      <SidePanel
        open={painelAberto === 'reacao'}
        side="bottom"
        title={`${LABELS.reacao.icone} ${LABELS.reacao.nome}`}
        onClose={fecharPainel}
        detalhesAtivo={detalhesAtivo}
        onToggleDetalhes={() => setDetalhesAtivo((v) => !v)}
      >
        <ReacaoPanelContent
          desvantagemForcaDestreza={desvantagemForcaDestreza}
          onEscolher={(nome, desc) => escolherNoPainel('reacao', nome, desc)}
          onAbrirSalvaguarda={abrirSalvaguarda}
          gastarSlotCirculo={onGastarSlotCirculo}
          espacos={espacos}
          espacosGastosPorCirculo={espacosGastosPorCirculo}
          onCuraDeMagiaAplicada={onCuraDeMagiaAplicada}
          nivel={nivel}
          conjura={conjura}
          magiasReacao={magiasPreparadasReacao}
          modAcertoConjuracao={modAcertoConjuracao}
          explicacaoAcertoConjuracao={explicacaoAcertoConjuracao}
          truqueVinculadoAgonizante={truqueVinculadoAgonizante}
          modCarisma={modCarisma}
          colheitaMacabraDisponivel={colheitaMacabraDisponivel}
          onColheitaMacabraDisponivel={onColheitaMacabraDisponivel}
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
          colheitaDosMortosDisponivel={colheitaDosMortosDisponivel}
          personagemEnsanguentado={personagemEnsanguentado}
          opcoesColheitaDosMortos={opcoesColheitaDosMortos}
          onColheitaDosMortos={onColheitaDosMortos}
          mestreDaMorteExplosaoDisponivel={mestreDaMorteDisponivel}
          mestreDaMorteExplosaoLiberada={mestreDaMorteExplosaoLiberada}
          modIntAtual={modIntAtual}
        />
      </SidePanel>
      {lancarNoInfernoDano !== null && (
        <SalvaguardaDoAlvoModal
          titulo="Lançar no Inferno"
          atributo="Carisma"
          cd={cdLancarNoInferno}
          explicacaoCd={explicacaoCdConjuracao}
          textoSucesso="evita a magia"
          textoFalha={`${lancarNoInfernoDano} de dano Psíquico (Ínferos não sofrem) + Incapacitado até o final do seu próximo turno`}
          onFechar={() => setLancarNoInfernoDano(null)}
        />
      )}
      {ataqueDeSoproDano !== null && (
        <SalvaguardaDoAlvoModal
          titulo="Ataque de Sopro"
          atributo="Destreza"
          cd={cdAtaqueDeSopro}
          explicacaoCd={explicacaoCdAtaqueDeSopro}
          textoSucesso={`${Math.floor(ataqueDeSoproDano / 2)} de dano ${tipoDanoAtaqueDeSopro ?? '—'} (metade)`}
          textoFalha={`${ataqueDeSoproDano} de dano ${tipoDanoAtaqueDeSopro ?? '—'} (Cone de 4,5m ou Linha de 9m×1,5m, à sua escolha)`}
          onFechar={() => setAtaqueDeSoproDano(null)}
        />
      )}
      {telaSalvaguarda && (
        <SalvaguardaDoAlvoModal
          titulo={telaSalvaguarda.magia.nome}
          atributo={atributoSalvaguarda(telaSalvaguarda.magia)}
          cd={modAcertoConjuracao !== null ? cdConjuracao(modAcertoConjuracao) : null}
          explicacaoCd={explicacaoCdConjuracao}
          textoSucesso={telaSalvaguarda.magia.salvaguardaSucesso}
          textoFalha={textoFalhaSalvaguarda}
          aviso={avisoUpcastSalvaguarda}
          acaoSecundaria={
            danoCondicionalSalvaguarda
              ? {
                  label: rotuloBotaoDanoMagia(danoCondicionalSalvaguarda, `🎲 Rolar Dano — ${telaSalvaguarda.magia.danoCondicionalTexto}`),
                  onClick: rolarDanoCondicionalSalvaguarda,
                }
              : null
          }
          semAcaoTexto={telaSalvaguarda.danoRolado === null ? 'Veja a descrição da magia (ⓘ) pro efeito.' : null}
          onFechar={() => setTelaSalvaguarda(null)}
        />
      )}
      {golpeDeEscudoAberto && (
        <SalvaguardaDoAlvoModal
          titulo="Golpe de Escudo"
          atributo="Força"
          cd={cdGolpeDeEscudo}
          explicacaoCd={explicacaoCdGolpeDeEscudo}
          textoSucesso="nada acontece"
          textoFalha="empurra 1,5m ou é derrubado (Caído), à sua escolha"
          onFechar={() => setGolpeDeEscudoAberto(false)}
        />
      )}
      {golpeCondicionalPendente && (
        <AtivarEfeitoModal
          titulo={TEXTOS_GOLPE_CONDICIONAL[golpeCondicionalPendente].titulo}
          textoEfeito={TEXTOS_GOLPE_CONDICIONAL[golpeCondicionalPendente].textoEfeito}
          restricaoTexto="Este efeito só pode ser usado uma vez por turno."
          onAtivar={ativarGolpeCondicional}
          onNaoUsar={() => setGolpeCondicionalPendente(null)}
        />
      )}
    </>
  );
}
