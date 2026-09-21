import { useState } from 'react';
import { acoesBase, type AtaqueInfo } from '../../../data/exampleCombat';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { AtaqueResolvido } from '../../../core/ataque';
import type { EspacoDeMagiaAtivo, PoolDePonte } from '../../../core/magiasPersonagem';
import { resolverVantagem } from '../../../core/calculoPersonagem';
import { danoComCritico } from '../../../core/danoCritico';
import { useRoll } from '../../roll/RollContext';
import { useUsarMagiaPainel } from './useUsarMagiaPainel';
import TickPips from '../../components/TickPips';
import styles from './PanelRows.module.css';

interface AcaoPanelContentProps {
  /** `SidePanel.open` do drawer — ver comentário em
   * `useUsarMagiaPainel.tsx` (reseta o picker de "Usar Magia" ao
   * fechar pela borda/backdrop, não só pelo "← Voltar" dele mesmo). */
  aberto: boolean;
  /** `true` = Armadura equipada sem treinamento — Desvantagem em
   * qualquer ataque com arma/desarmado (SDD "Penalidades por Falta de
   * Proficiência", ver `core/proficienciaArmadura.ts`). Ataque com
   * magia (`modAcertoConjuracao`) não é afetado — usa o atributo de
   * conjuração, não Força/Destreza. */
  desvantagemForcaDestreza: boolean;
  onEscolher: (nome: string, desc: string) => void;
  /** Magia com `ataqueOuSalvaguarda` de tipo salvaguarda — abre o Modal
   * de Salvaguarda (CD + atributo + sucesso/falha), que vive em
   * CombatTab (persiste depois do painel fechar). `circuloUsado` é
   * pro upcast (igual `conjurarMagia` já calcula). */
  onAbrirSalvaguarda: (magia: Magia, circuloUsado: number) => void;
  gastarSlotCirculo: (circulo: number, classeNome: string) => boolean;
  /** Aplica cura direto no PV do personagem ("Me curar", ver
   * `RollDadosOptions.confirmarAlvoCura`) — usado só por Mãos
   * Curativas (Aasimar), sem o efeito visual de Cura (esse é só pra
   * magia, ver `onCuraDeMagiaAplicada` abaixo — pedido do Osmar). */
  onAlterarPv: (delta: number) => void;
  /** Aplica a cura de MAGIA no PV E dispara o efeito visual de Cura
   * (ver `FichaShell.tsx` `onCuraDeMagiaAplicada`). */
  onCuraDeMagiaAplicada: (total: number) => void;
  /** Nível do personagem — pro Aprimoramento de Truque (dano escala
   * nos níveis 5/11/17, ver `calcularDanoMagia`). */
  nivel: number;
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  /** Nome da classe ATIVA — dona do pool acima. Ver `MagiasTab.tsx`. */
  classeAtivaNome: string;
  /** Ponte de Magia de Pacto (SDD Multiclasse seção 8.5) — `null` pra
   * quem não tem Bruxo + outra classe conjuradora ao mesmo tempo. */
  ponte: PoolDePonte | null;
  conjura: boolean;
  truques: Magia[];
  magiasPreparadas: Magia[];
  modAcertoConjuracao: number | null;
  /** Quebra do `modAcertoConjuracao` pro popup de rolagem (B7) —
   * `null` nos mesmos casos que `modAcertoConjuracao`. */
  explicacaoAcertoConjuracao: ExplicacaoCalculo | null;
  /** NOME do truque vinculado a Explosão Agonizante + mod. de Carisma
   * — ver `MagiasTab.tsx`/`core/invocacoesMisticas.ts`. */
  truqueVinculadoAgonizante: string | undefined;
  modCarisma: number;
  numAtaques: number;
  ataquesFeitos: number;
  surtoMax: number;
  surtoRestantes: number;
  surtoUsadoTurno: boolean;
  onUsarSurto: () => void;
  ataqueAtual: AtaqueResolvido | null;
  /** Valentão de Taverna (Dano Garantido) — `true` = pode rerolar 1 no
   * dano do Ataque Desarmado. */
  danoDesarmadoRerollDisponivel: boolean;
  /** Perfurador — `true` = pode rerolar 1 dado à escolha quando o dano
   * causado for Perfurante (ver `core/rerollDanoTalento.ts`). */
  perfuradorDisponivel: boolean;
  /** Ataque Imprudente (Bárbaro, nível 2+) — `false` = não tem essa
   * característica. Só na 1ª jogada de ataque do turno
   * (`ataquesFeitos === 0`), tocar "Atacar" abre um mini-picker
   * "Ataque Normal"/"Ataque Imprudente" em vez de rolar direto; depois
   * disso `ataqueImprudenteAtivo` já decide sozinho pros ataques
   * seguintes do mesmo turno (Ataque Extra). */
  temAtaqueImprudente: boolean;
  ataqueImprudenteAtivo: boolean;
  onAtivarAtaqueImprudente: () => void;
  /** Golpe Brutal (Bárbaro nível 9+) — só aparece como linha própria
   * (ao lado de "🗡 Atacar") quando o Ataque Imprudente já está ativo
   * nesse turno e ainda não foi usado. `golpeBrutalDados` = 1 (nível
   * 9-16) ou 2 (17+, "2d10"). Fluxo Acerto/Erro (ver
   * `DECISOES-COMBATE.md`): o ataque pergunta "Acertou?" de verdade
   * (`confirmarAcerto`); se sim, rola dano + dado extra JUNTOS
   * (`gruposExtras`) e o popup de dano já oferece o botão "🔨 Golpe
   * Brutal" (`confirmarFechamento`) — tocar nele avisa o `CombatTab`
   * (`onGolpeBrutalDanoConfirmado`) pra abrir o modal de escolha do
   * efeito, que segue morando lá (tem a lista/nível). */
  temGolpeBrutal: boolean;
  golpeBrutalDados: number;
  golpeBrutalUsadoTurno: boolean;
  onUsarGolpeBrutal: () => void;
  /** Bookkeeping do turno (ataquesFeitos/marcar Ação usada) pra
   * qualquer ataque — Fluxo Acerto/Erro sempre (retrofit 2026-09, ver
   * `DECISOES-COMBATE.md`), nunca mais usa `DanoPendente`/os botões
   * antigos de dano. */
  onAtacouSemDanoPendente: (nome: string, desc: string) => void;
  /** Chamado quando o jogador toca "🔨 Golpe Brutal" no popup de dano
   * (depois de acertar e rolar) — abre o modal de efeito no
   * `CombatTab`. */
  onGolpeBrutalDanoConfirmado: () => void;
  /** Esmagador/Talhador — ver `CombatTab.tsx` (`golpeCondicional`).
   * `onAbrirGolpeCondicional` chamado quando o jogador toca o botão do
   * talento no popup de dano (mesmo padrão do Golpe Brutal), o
   * `CombatTab` decide qual popup (`AtivarEfeitoModal`) mostrar. */
  esmagadorDisponivel: boolean;
  talhadorDisponivel: boolean;
  onAbrirGolpeCondicional: (talento: 'esmagador' | 'talhador') => void;
  /** Ancestralidade Gigante (Golias) — as 3 opções "ao acertar"
   * (Arrepio do Gelo/Queimadura de Fogo/Tombo da Colina), retrofit
   * 2026-09 pro Fluxo Acerto/Erro (antes era um card avulso solto na
   * tela, "toque ao acertar", ver `DECISOES-COMBATE.md`) — mesmo
   * padrão de Esmagador/Talhador: o popup de dano do ataque principal
   * já oferece o botão, `null`/0 usos = nenhuma disponível agora.
   * `onAtivarAncestralidadeGigante` já faz tudo (gasta o uso, rola o
   * dano certo, mostra o feedback) — mora no `CombatTab.tsx` porque é
   * quem tem o resto do estado (Salto da Nuvem usa o MESMO contador). */
  ancestralidadeGiganteEscolhida: string | null;
  usosAncestralidadeGiganteRestantes: number;
  onAtivarAncestralidadeGigante: () => void;
  detalhesAtivo: boolean;
  /** Mãos Curativas (Aasimar) — `false` = espécie não é Aasimar. */
  maosCurativasDisponivel: boolean;
  maosCurativasGasto: boolean;
  dadosMaosCurativas: number;
  onUsarMaosCurativas: () => boolean;
  /** Falar com Animais - Traço de Gnomo (Gnomo do Bosque) — `false` =
   * não é essa sub-escolha. Grátis, não gasta Espaço de Magia (por
   * isso fica fora da lista genérica de "Usar Magia"). */
  falarComAnimaisGnomoDisponivel: boolean;
  usosFalarComAnimaisGnomoMaximo: number;
  usosFalarComAnimaisGnomoRestantes: number;
  onUsarFalarComAnimaisGnomo: () => boolean;
  /** Colheita Macabra (Necromante, nível 3+) — `true` = personagem tem
   * a característica. Ver `core/necromante.ts`. */
  colheitaMacabraDisponivel: boolean;
  /** Chamado (além do fluxo normal de `onEscolher`) sempre
   * que uma magia de Necromancia é conjurada com espaço — o painel
   * fecha logo em seguida (mesmo `onEscolher`), então quem mostra o
   * banner de verdade é o `CombatTab` (que sobrevive ao fechamento). */
  onColheitaMacabraDisponivel: (cura: number) => void;
  /** Cortar (Mestre em Armas Grandes) — `podeOferecerCortar` = talento
   * + arma Corpo a Corpo equipada, mostra o botão manual "Reduziu a 0
   * PV?" ao lado de Atacar (Crítico já é detectado sozinho pelo
   * `FichaShell.tsx`, sem precisar de UI aqui). */
  podeOferecerCortar: boolean;
  onConfirmarCortarReduzirAZero: () => void;
  /** Golpe de Escudo (Mestre em Escudos) — `temGolpeDeEscudo` = talento
   * + arma Corpo a Corpo + Escudo equipado. Toque abre o popup padrão
   * de "salvaguarda do alvo" (CD, Sucesso/Falha) — mesmo padrão de
   * Ataque de Sopro/Lançar no Inferno, ver `SalvaguardaDoAlvoModal` em
   * `CombatTab.tsx` — e já marca o uso (1x/turno). */
  temGolpeDeEscudo: boolean;
  golpeDeEscudoUsadoTurno: boolean;
  onUsarGolpeDeEscudo: () => void;
}

export default function AcaoPanelContent({
  aberto,
  desvantagemForcaDestreza,
  onEscolher,
  onAbrirSalvaguarda,
  gastarSlotCirculo,
  onAlterarPv,
  onCuraDeMagiaAplicada,
  nivel,
  espacos,
  espacosGastosPorCirculo,
  classeAtivaNome,
  ponte,
  conjura,
  truques,
  magiasPreparadas,
  modAcertoConjuracao,
  explicacaoAcertoConjuracao,
  truqueVinculadoAgonizante,
  modCarisma,
  numAtaques,
  ataquesFeitos,
  surtoMax,
  surtoRestantes,
  surtoUsadoTurno,
  onUsarSurto,
  ataqueAtual,
  danoDesarmadoRerollDisponivel,
  perfuradorDisponivel,
  temAtaqueImprudente,
  ataqueImprudenteAtivo,
  onAtivarAtaqueImprudente,
  temGolpeBrutal,
  golpeBrutalDados,
  golpeBrutalUsadoTurno,
  onUsarGolpeBrutal,
  onAtacouSemDanoPendente,
  onGolpeBrutalDanoConfirmado,
  esmagadorDisponivel,
  talhadorDisponivel,
  onAbrirGolpeCondicional,
  ancestralidadeGiganteEscolhida,
  usosAncestralidadeGiganteRestantes,
  onAtivarAncestralidadeGigante,
  detalhesAtivo,
  maosCurativasDisponivel,
  maosCurativasGasto,
  dadosMaosCurativas,
  onUsarMaosCurativas,
  falarComAnimaisGnomoDisponivel,
  usosFalarComAnimaisGnomoMaximo,
  usosFalarComAnimaisGnomoRestantes,
  onUsarFalarComAnimaisGnomo,
  colheitaMacabraDisponivel,
  onColheitaMacabraDisponivel,
  podeOferecerCortar,
  onConfirmarCortarReduzirAZero,
  temGolpeDeEscudo,
  golpeDeEscudoUsadoTurno,
  onUsarGolpeDeEscudo,
}: AcaoPanelContentProps) {
  const { rolarD20, rolarDados } = useRoll();
  const { picker, abrirLista } = useUsarMagiaPainel({
    aberto,
    desvantagemForcaDestreza,
    onEscolher,
    onAbrirSalvaguarda,
    gastarSlotCirculo,
    onCuraDeMagiaAplicada,
    nivel,
    espacos,
    espacosGastosPorCirculo,
    classeAtivaNome,
    ponte,
    truques,
    magiasPreparadas,
    modAcertoConjuracao,
    explicacaoAcertoConjuracao,
    truqueVinculadoAgonizante,
    modCarisma,
    colheitaMacabraDisponivel,
    onColheitaMacabraDisponivel,
  });

  function usarMaosCurativas() {
    if (!onUsarMaosCurativas()) return;
    rolarDados({
      label: 'Mãos Curativas — Cura',
      formula: `${dadosMaosCurativas}d4`,
      quantidade: dadosMaosCurativas,
      lados: 4,
      mod: 0,
      confirmarAlvoCura: { onMeCurar: (total) => onAlterarPv(total) },
    });
    onEscolher('🙌 Mãos Curativas', 'Toque uma criatura — ela recupera o total mostrado em Pontos de Vida.');
  }

  function usarFalarComAnimaisGnomo() {
    if (!onUsarFalarComAnimaisGnomo()) return;
    onEscolher(
      '🐾 Falar com Animais (Traço de Gnomo)',
      'Por 10 minutos, você compreende e conversa com Feras — grátis, sem gastar Espaço de Magia.',
    );
  }

  /** Golpe Brutal (Bárbaro nível 9+) segue o Fluxo Acerto/Erro
   * (`DECISOES-COMBATE.md`): renuncia à Vantagem NESSA jogada, popup
   * de ataque pergunta "Acertou?" de verdade — só rola dano (arma +
   * dado extra JUNTOS, `gruposExtras`) se "Acertei"; o popup de dano
   * já embute o botão "🔨 Golpe Brutal" pra abrir o modal de efeito
   * (`onGolpeBrutalDanoConfirmado`, o `CombatTab` decide o resto —
   * lista/nível). Bookkeeping do turno via `onAtacouSemDanoPendente`
   * (não usa mais `DanoPendente`). */
  function rolarAtaqueGolpeBrutal(nome: string, ataque: AtaqueInfo) {
    rolarD20({
      label: `${nome} — Ataque + Golpe Brutal`,
      formula: `1d20 + ${ataque.modAcerto}`,
      mod: ataque.modAcerto,
      explicacaoMod: ataque.explicacaoAcerto,
      confirmarAcerto: {
        onAcertou: ({ critico }) => {
          const dano = danoComCritico(
            {
              quantidade: ataque.danoQuantidade,
              lados: ataque.danoLados,
              mod: ataque.danoMod,
              gruposExtras: [{ quantidade: golpeBrutalDados, lados: 10 }],
            },
            critico,
          );
          rolarDados({
            label: `${nome} — Dano + Golpe Brutal${critico ? ' (Crítico)' : ''}`,
            formula: dano.formula,
            quantidade: dano.quantidade,
            lados: ataque.danoLados,
            mod: ataque.danoMod,
            gruposExtras: dano.gruposExtras,
            confirmarFechamento: { rotulo: '🔨 Golpe Brutal', aoTocar: onGolpeBrutalDanoConfirmado },
          });
        },
        onErrou: () => {},
      },
    });
    onAtacouSemDanoPendente(
      `🗡 ${nome}`,
      'Rolagem de acerto feita — renunciou à Vantagem do Ataque Imprudente pro Golpe Brutal.',
    );
  }

  /** Esmagador/Talhador — qual dos 2 (se algum) entra em jogo NESSE
   * ataque específico, olhando o tipo de dano REAL da arma usada
   * agora (`ataque.danoTipo`) — `esmagadorDisponivel`/
   * `talhadorDisponivel` (vindo do `FichaShell.tsx`) já garantem talento
   * + ainda não usado no turno; só falta bater o tipo de dano. Nunca os
   * 2 ao mesmo tempo (Contundente e Cortante são mutuamente exclusivos
   * pra uma mesma arma). */
  function talentoGolpeCondicionalAtivavel(ataque: AtaqueInfo): 'esmagador' | 'talhador' | null {
    if (esmagadorDisponivel && ataque.danoTipo === 'Contundente') return 'esmagador';
    if (talhadorDisponivel && ataque.danoTipo === 'Cortante') return 'talhador';
    return null;
  }

  const ROTULO_GOLPE_CONDICIONAL: Record<'esmagador' | 'talhador', string> = {
    esmagador: '🔨 Esmagador',
    talhador: '🗡️ Talhador',
  };

  const ROTULO_ANCESTRALIDADE_GIGANTE: Record<string, string> = {
    'Arrepio do Gelo (Gigante do Gelo)': '🧊 Arrepio do Gelo',
    'Queimadura de Fogo (Gigante de Fogo)': '🔥 Queimadura de Fogo',
    'Tombo da Colina (Gigante da Colina)': '⛰️ Tombo da Colina',
  };

  /** `confirmarFechamento` do popup de dano do ataque principal —
   * Esmagador/Talhador (por tipo de dano da arma) tem prioridade;
   * sem nenhum dos 2, oferece Ancestralidade Gigante se disponível
   * (`ancestralidadeGiganteEscolhida` é uma das 3 opções "ao acertar"
   * E ainda sobra uso); sem nada aplicável, fica só o "OK". Os 2
   * "talentos" nunca coexistem numa mesma arma (Contundente vs.
   * Cortante são mutuamente exclusivos) — Ancestralidade Gigante
   * TEORICAMENTE poderia coincidir com um dos 2 (espécie Golias +
   * Talento Geral), mas o popup só tem espaço pra 1 botão extra; nesse
   * caso raro, o talento (ligado à arma) ganha prioridade. */
  function confirmarFechamentoDoAtaque(talento: 'esmagador' | 'talhador' | null): {
    rotulo?: string;
    aoTocar?: () => void;
  } {
    if (talento) {
      return { rotulo: ROTULO_GOLPE_CONDICIONAL[talento], aoTocar: () => onAbrirGolpeCondicional(talento) };
    }
    const rotuloAncestralidade = ancestralidadeGiganteEscolhida
      ? ROTULO_ANCESTRALIDADE_GIGANTE[ancestralidadeGiganteEscolhida]
      : undefined;
    if (rotuloAncestralidade && usosAncestralidadeGiganteRestantes > 0) {
      return { rotulo: rotuloAncestralidade, aoTocar: onAtivarAncestralidadeGigante };
    }
    return {};
  }

  /** `imprudente` — Ataque Imprudente (Bárbaro) já decidido pra esse
   * ataque (e o turno inteiro, ver `escolherAtaque`); só vira Vantagem
   * de verdade quando o ataque específico usa Força
   * (`ataque.usouForca`). Se coincidir com a Desvantagem de Armadura
   * sem treino, as duas se cancelam (`resolverVantagem`).
   *
   * Fluxo Acerto/Erro SEMPRE (retrofit 2026-09, pedido do Osmar — ver
   * `DECISOES-COMBATE.md`) — antes só ativava com Esmagador/Talhador
   * disponíveis, senão caía no "atira e esquece" antigo
   * (`DanoPendente`/botão "Rolar Dano" manual). Sem talento aplicável,
   * `confirmarFechamento` fica sem `rotulo`/`aoTocar` — popup de dano
   * mostra só "OK". */
  function rolarAtaque(nome: string, ataque: AtaqueInfo, imprudente: boolean) {
    const vantagem = resolverVantagem(imprudente && ataque.usouForca, desvantagemForcaDestreza);
    const talento = talentoGolpeCondicionalAtivavel(ataque);
    // Ver `AcaoPanelContentProps.danoDesarmadoRerollDisponivel`/
    // `perfuradorDisponivel` — os 2 rerolls de dano do ataque comum
    // (checados aqui, não em `rerollDanoTalento.ts`, porque dependem
    // do `nome`/`danoTipo` DESSE ataque específico).
    const ehDanoDesarmado = nome.endsWith('Ataque Desarmado');
    rolarD20({
      label: `Ataque — ${nome}`,
      formula: `1d20 + ${ataque.modAcerto}`,
      mod: ataque.modAcerto,
      explicacaoMod: ataque.explicacaoAcerto,
      vantagem,
      confirmarAcerto: {
        onAcertou: ({ critico }) => {
          const dano = danoComCritico(
            { quantidade: ataque.danoQuantidade, lados: ataque.danoLados, mod: ataque.danoMod },
            critico,
          );
          rolarDados({
            label: `Dano — ${nome}${critico ? ' (Crítico)' : ''}`,
            formula: dano.formula,
            quantidade: dano.quantidade,
            lados: ataque.danoLados,
            mod: ataque.danoMod,
            rerollSe1: ehDanoDesarmado && danoDesarmadoRerollDisponivel ? { rotulo: 'Dano Garantido' } : undefined,
            rerollEscolhido: perfuradorDisponivel && ataque.danoTipo === 'Perfurante' ? { rotulo: 'Perfurador' } : undefined,
            confirmarFechamento: confirmarFechamentoDoAtaque(talento),
          });
        },
        onErrou: () => {},
      },
    });
    onAtacouSemDanoPendente(`🗡 ${nome}`, 'Rolagem de acerto feita.');
  }

  const surtoDesabilitado = surtoRestantes <= 0 || surtoUsadoTurno;

  /** `true` quando a 1ª jogada de ataque do turno ainda não decidiu
   * Normal/Imprudente — some depois de escolhido, pros ataques
   * seguintes do mesmo turno (Ataque Extra) rolarem direto. */
  const [escolhendoAtaque, setEscolhendoAtaque] = useState(false);

  /** Toque em "Atacar" — só abre o mini-picker Normal/Imprudente na 1ª
   * jogada do turno de quem tem Ataque Imprudente; senão rola direto
   * usando o que já foi decidido esse turno (`ataqueImprudenteAtivo`). */
  function tocarAtacar() {
    if (!ataqueAtual) return;
    if (temAtaqueImprudente && ataquesFeitos === 0) {
      setEscolhendoAtaque(true);
      return;
    }
    rolarAtaque(`🗡 ${ataqueAtual.nome}`, ataqueAtual.info, ataqueImprudenteAtivo);
  }

  function escolherAtaque(imprudente: boolean) {
    if (!ataqueAtual) return;
    setEscolhendoAtaque(false);
    if (imprudente) onAtivarAtaqueImprudente();
    rolarAtaque(`🗡 ${ataqueAtual.nome}`, ataqueAtual.info, imprudente);
  }

  /** Golpe Brutal (Bárbaro nível 9+) — linha própria, separada de
   * "Atacar" (o jogador escolhe qual das duas tocar em cada ataque do
   * turno, mesmo padrão de "Usar Magia" ao lado de "Atacar"). Só
   * aparece com o Ataque Imprudente já ativo nesse turno (regra real)
   * e ainda não usado — 1x por turno, reseta no Fim do Turno. */
  function usarGolpeBrutal() {
    if (!ataqueAtual) return;
    onUsarGolpeBrutal();
    rolarAtaqueGolpeBrutal(`🗡 ${ataqueAtual.nome}`, ataqueAtual.info);
  }

  if (picker) return picker;

  if (escolhendoAtaque && ataqueAtual) {
    return (
      <>
        <div className="section-title">Atacar — {ataqueAtual.nome}</div>
        <div className="opt-card" onClick={() => escolherAtaque(false)}>
          <div className="opt-card-name">🗡 Ataque Normal</div>
        </div>
        <div className="opt-card" onClick={() => escolherAtaque(true)}>
          <div className="opt-card-name">😤 Ataque Imprudente</div>
          <div className="opt-card-desc">
            Vantagem em jogadas de ataque baseadas em Força até o início do seu próximo turno — mas jogadas de ataque
            contra você também têm Vantagem nesse período (o app não simula ataques de inimigos). Vale pro turno
            inteiro, não só esse ataque.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {ataqueAtual && (
        <div className={styles.row} onClick={tocarAtacar}>
          <div className={styles.rowName}>
            🗡 Atacar — {ataqueAtual.nome}{' '}
            {numAtaques > 1 ? `(ataque ${Math.min(ataquesFeitos + 1, numAtaques)}/${numAtaques})` : ''}
            {ataqueImprudenteAtivo && ataquesFeitos > 0 ? ' · 😤 Imprudente' : ''}
          </div>
          <div className={styles.rowDesc}>
            {ataqueAtual.descricao}
            {detalhesAtivo && (
              <>
                {' '}
                {numAtaques > 1
                  ? `Ataque Extra: você tem direito a ${numAtaques} ataques nesse turno — toque de novo depois de rolar o dano.`
                  : 'Equipe uma arma na Mochila pra trocar; sem nada na Mão Principal, é Ataque Desarmado.'}
              </>
            )}
          </div>
        </div>
      )}

      {ataqueAtual && temGolpeBrutal && ataqueImprudenteAtivo && !golpeBrutalUsadoTurno && (
        <div className={styles.row} onClick={usarGolpeBrutal}>
          <div className={styles.rowName}>🔨 Golpe Brutal — {ataqueAtual.nome}</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Renuncia à Vantagem do Ataque Imprudente NESSE ataque. Se acertar, +{golpeBrutalDados}d10 de dano e você
              escolhe o efeito depois de rolar. 1x por turno.
            </div>
          )}
        </div>
      )}

      {ataqueAtual && podeOferecerCortar && (
        <div className={styles.row} onClick={onConfirmarCortarReduzirAZero}>
          <div className={styles.rowName}>☠ Reduziu o alvo a 0 PV?</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Confirma manualmente (o app não sabe o PV do inimigo) — libera "Cortar" na Ação Bônus: 1 ataque extra
              com a mesma arma. Acerto Crítico já libera sozinho.
            </div>
          )}
        </div>
      )}

      {ataqueAtual && temGolpeDeEscudo && !golpeDeEscudoUsadoTurno && (
        <div className={styles.row} onClick={onUsarGolpeDeEscudo}>
          <div className={styles.rowName}>🛡 Golpe de Escudo</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Ao acertar com essa arma: Salv. Força do alvo — falha empurra 1,5m ou derruba (Caído), à sua escolha.
              1x por turno.
            </div>
          )}
        </div>
      )}

      {surtoMax > 0 && (
        <div
          className={styles.row}
          style={surtoDesabilitado ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={onUsarSurto}
        >
          <div className={styles.rowName}>💥 Surto de Ação</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Ganha uma ação extra nesse turno — não gasta sua Ação normal. {surtoRestantes}/{surtoMax} usos
              {surtoUsadoTurno ? ' (já usado nesse turno)' : ''}.
            </div>
          )}
        </div>
      )}

      {conjura && (
        <div
          className={styles.row}
          style={desvantagemForcaDestreza ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={abrirLista}
        >
          <div className={styles.rowName}>✨ Usar Magia</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              {desvantagemForcaDestreza
                ? 'Bloqueado — Armadura equipada sem treinamento impede conjurar magias.'
                : 'Conjurar Truque ou Magia Preparada'}
            </div>
          )}
        </div>
      )}

      {maosCurativasDisponivel && (
        <>
          <div
            className={styles.row}
            style={maosCurativasGasto ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={usarMaosCurativas}
          >
            <div className={styles.rowName}>🙌 Mãos Curativas</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Ação Usar Magia — toque uma criatura, jogue {dadosMaosCurativas}d4 e ela recupera esse total em
                Pontos de Vida. 1x — recupera no Descanso Longo.
              </div>
            )}
          </div>
          {maosCurativasGasto && (
            <div className="label" style={{ marginTop: 6 }}>
              já usado — descanse pra recuperar.
            </div>
          )}
        </>
      )}

      {falarComAnimaisGnomoDisponivel && (
        <>
          <div className={styles.slotCounter}>
            <span>Falar com Animais (Traço de Gnomo):</span>
            <TickPips total={usosFalarComAnimaisGnomoMaximo} usados={usosFalarComAnimaisGnomoMaximo - usosFalarComAnimaisGnomoRestantes} />
            <span style={{ color: 'var(--text-faint)' }}>
              {usosFalarComAnimaisGnomoRestantes}/{usosFalarComAnimaisGnomoMaximo} disponíveis
            </span>
          </div>
          <div
            className={styles.row}
            style={usosFalarComAnimaisGnomoRestantes <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={usarFalarComAnimaisGnomo}
          >
            <div className={styles.rowName}>🐾 Falar com Animais (Traço de Gnomo)</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Grátis (sem gastar Espaço de Magia) — compreende e conversa com Feras por 10 minutos. Gasta 1 uso,
                todos voltam no Descanso Longo.
              </div>
            )}
          </div>
          {usosFalarComAnimaisGnomoRestantes <= 0 && (
            <div className="label" style={{ marginTop: 6 }}>
              sem usos grátis disponíveis — descanse pra recuperar.
            </div>
          )}
        </>
      )}

      <div
        className={styles.row}
        onClick={() =>
          onEscolher('💨 Desengajar', 'Seu movimento não provoca Ataques de Oportunidade pelo resto do turno.')
        }
      >
        <div className={styles.rowName}>💨 Desengajar</div>
        {detalhesAtivo && (
          <div className={styles.rowDesc}>Seu movimento não provoca Ataques de Oportunidade pelo resto do turno</div>
        )}
      </div>

      {acoesBase.map((a) => (
        <div key={a.nome} className={styles.row} onClick={() => onEscolher(`${a.icone} ${a.nome}`, a.desc)}>
          <div className={styles.rowName}>
            {a.icone} {a.nome}
          </div>
          {detalhesAtivo && <div className={styles.rowDesc}>{a.desc}</div>}
        </div>
      ))}
    </>
  );
}
