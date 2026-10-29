import { useEffect, useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import {
  opcoesGastoComPonte,
  modAcertoConjuracaoPorClasse,
  type EspacoDeMagiaAtivo,
  type PoolDePonte,
  type MagiaComClasseOpcional,
  type ResumoConjuracaoPorClasse,
} from '../../../core/magiasPersonagem';
import { circuloGratisMaestria } from '../../../core/maestriaDeMagias';
import { circuloGratisAssinatura } from '../../../core/assinaturaMagica';
import { circuloGratisMagiaFixaDeClasse, type MagiaFixaDeClasse } from '../../../core/magiasFixasDeClasse';
import { circuloGratisTelecineseIntensificada, AVISO_TELECINESE_INTENSIFICADA_SEM_CONCENTRACAO } from '../../../core/telecineseIntensificada';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import { decidirConjuracao, type DisciplinaPosConjuracaoPendente } from '../../../core/conjurarMagia';
import { truqueElegivelTruquePotente, sobrecargaElegivel, danoMaximoSobrecarga, danoNecroticoSobrecarga } from '../../../core/evocador';
import { danoComCritico } from '../../../core/danoCritico';
import { useRoll } from '../../roll/RollContext';
import { ofertaMenteAgucada } from '../../roll/ofertaMenteAgucada';
import type { PreferenciasPillsMagia } from '../../../core/preferenciasPillsMagia';
import { elegivelTrocaTipoDeDanoTalentoSelvagem } from '../../../core/talentosSelvagens';
import SelecionarMagiaShell from './SelecionarMagiaShell';
import EscolherCirculoShell from './EscolherCirculoShell';
import type { PedidoEscolhaDeEfeito } from '../../components/EscolherEfeitoModal';

interface UsarMagiaPainelParams {
  /** `SidePanel.open` do drawer que hospeda este painel — o painel de
   * Ação/Bônus fica MONTADO mesmo depois de fechar o drawer (só
   * `ultimoPainel` some ao trocar de categoria, `fecharPainel()` não
   * mexe nisso), então sem isso o picker de "Usar Magia" (e o painel
   * "Espaços", que sai por Portal pro `document.body` — ver
   * `SelecionarMagiaShell.tsx`) fica preso no meio da tela mesmo com o
   * drawer já fechado, se o jogador fechar pela borda/backdrop em vez
   * do "← Voltar" do próprio picker. */
  aberto: boolean;
  desvantagemForcaDestreza: boolean;
  onEscolher: (nome: string, desc: string) => void;
  /** Magia com `ataqueOuSalvaguarda` de tipo salvaguarda — abre o Modal
   * de Salvaguarda (CD + atributo + sucesso/falha), que vive em
   * CombatTab (persiste depois do painel fechar). */
  onAbrirSalvaguarda: (magia: Magia, circuloUsado: number, avisoDisciplina?: string | null, classeDonaDaMagia?: string | null) => void;
  gastarSlotCirculo: (circulo: number, classeNome: string) => boolean;
  /** Nível do personagem — pro Aprimoramento de Truque (dano escala
   * nos níveis 5/11/17, ver `calcularDanoMagia`). */
  nivel: number;
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  classeAtivaNome: string;
  ponte: PoolDePonte | null;
  truques: MagiaComClasseOpcional[];
  magiasPreparadas: MagiaComClasseOpcional[];
  modAcertoConjuracao: number | null;
  /** Resumo de conjuração por classe — ver `CombatTab.tsx`. Usado pra
   * resolver o mod./CD pela classe DONA da magia escolhida (ver
   * `conjurarMagia`), não pela classe ativa — PENDENCIAS.md
   * "Multiclasse — acerto/CD de magia...". */
  resumosPorClasse: ResumoConjuracaoPorClasse[];
  /** Quebra do `modAcertoConjuracao` pro popup de rolagem (B7) —
   * `null` nos mesmos casos que `modAcertoConjuracao`. */
  explicacaoAcertoConjuracao: ExplicacaoCalculo | null;
  truqueVinculadoAgonizante: string | undefined;
  modCarisma: number;
  /** Truque Potente (Mago/Evocador, nível 3, regra oficial — ver
   * `core/evocador.ts`) — metade de dano no erro de truque com dano,
   * sem efeitos adicionais. */
  truquePotenteAtivo: boolean;
  /** Evocação Potencializada (Mago/Evocador, nível 10, regra oficial —
   * ver `core/evocador.ts`) — soma o mod. de Inteligência ao dano de
   * magia de Evocação de Mago. */
  evocacaoPotencializadaAtiva: boolean;
  modIntAtual: number;
  /** Sobrecarga (Mago/Evocador, nível 14, regra oficial — ver
   * `core/evocador.ts`) — pode causar dano máximo em vez de rolar
   * (magia de Mago com dano, espaço de 1º a 5º círculo). */
  sobrecargaAtiva: boolean;
  sobrecargaUsosDesdeDescanso: number;
  onUsarSobrecarga: () => void;
  /** Aplica dano direto ao PV (delta negativo) — usado pelo dano
   * Necrótico auto-infligido de Sobrecarga. Mesma função pura de
   * `FichaShell.tsx` `alterarPv`. */
  onAlterarPv: (delta: number) => void;
  /** Grupo A dos Talentos Selvagens (Atmocinese/Criocinese/Pirocinese)
   * — "1x/turno, ao conjurar magia com dano Contundente/Cortante/
   * Perfurante/Psíquico, pode mudar o tipo pra X". `tipoDanoTrocaTalentoSelvagem`
   * = o novo tipo (ou `null` sem o talento) — ver
   * `core/talentosSelvagens.ts`. */
  tipoDanoTrocaTalentoSelvagem: string | null;
  trocaTipoDeDanoTalentoSelvagemUsadaTurno: boolean;
  onUsarTrocaTipoDeDanoTalentoSelvagem: () => void;
  /** Abre a tela de escolha "Rolar Dano vs. Sobrecarga" — vive em
   * `CombatTab.tsx` (mesmo padrão de `onAbrirSalvaguarda`), NUNCA
   * renderizada aqui dentro: este painel fica montado dentro de um
   * `SidePanel` com `transform` (slide-in), que quebra o
   * `position: fixed` da `SobrecargaEscolha` (o popup ficava preso
   * dentro do painel em vez de cobrir a tela toda — bug achado pelo
   * Osmar). `null` fecha a tela. */
  onAbrirEscolhaSobrecarga: (
    dados: { nomeMagia: string; danoMaximo: number; aoRolarNormal: () => void; aoUsarSobrecarga: () => void } | null,
  ) => void;
  /** Mesmo motivo/padrão de `onAbrirEscolhaSobrecarga` acima, só que
   * genérico — qualquer escolha "Normal vs. Opção X" (ex.: Grupo A dos
   * Talentos Selvagens logo abaixo) passa por aqui em vez de guardar
   * estado/`EscolherEfeitoModal` próprio neste arquivo. */
  onAbrirEscolhaDeEfeito: (pedido: PedidoEscolhaDeEfeito) => void;
  /** Convocar Montaria (Paladino, Montaria Fiel) desvia do fluxo normal
   * de dano/salvaguarda/cura — vira Pet em vez de rolagem, ver
   * `EscolherMontariaModal.tsx` (mesmo padrão de tela flutuante de
   * `onAbrirEscolhaSobrecarga`, vive em `CombatTab.tsx`). */
  onAbrirEscolhaDeMontaria: (circuloUsado: number) => void;
  /** Telecinese Intensificada (Psiônico, subclasse Psicinético, nível 14, E6c-g) — mesmo padrão de
   * tela flutuante de `onAbrirEscolhaSobrecarga` (precisa escapar do `SidePanel`). */
  telecineseIntensificadaDisponivel: boolean;
  dadosEnergiaRestantes: number;
  onGastarTelecineseIntensificada: () => boolean;
  onAbrirEscolhaTelecineseIntensificada: (dados: { aoConjurarNormal: () => void; aoConjurarSemConcentracao: () => void } | null) => void;
  colheitaMacabraDisponivel: boolean;
  onColheitaMacabraDisponivel: (cura: number) => void;
  /** Ids das Disciplinas Psiônicas conhecidas (Psiônico UA, E4c) — `[]` pra
   * quem não é Psiônico. */
  disciplinasPsionicasConhecidas: string[];
  /** `true` quando já usou uma Disciplina Psiônica "comum" neste turno
   * (regra de 1 por turno, ver `core/disciplinasPsionicas.ts`
   * `algumaDisciplinaComumUsadaNoTurno`) — conjurar pela aba Combate TEM
   * conceito de turno, diferente da aba Magias. */
  disciplinaPsionicaBloqueadaNoTurno: boolean;
  /** Mesmo padrão de `onColheitaMacabraDisponivel` — ver
   * `DisciplinaPosConjuracaoModal.tsx`. */
  onDisciplinaPosConjuracaoDisponivel: (d: DisciplinaPosConjuracaoPendente) => void;
  /** Aplica a cura rolada (`rollCura`) no PV do personagem E dispara
   * o efeito visual de Cura — ver `RollDadosOptions.confirmarAlvoCura`
   * ("Me curar") e `FichaShell.tsx` `onCuraDeMagiaAplicada`. */
  onCuraDeMagiaAplicada: (total: number) => void;
  /** Maestria de Magias (Mago, nível 18) — `{1: nomeMagia, 2: nomeMagia}`,
   * `{}` pra quem não tem a característica. Marca a opção de círculo
   * base como "Conjurar Grátis" (ver `EscolherCirculoShell`). */
  maestriaDeMagiasAtuais: Record<number, string>;
  /** Assinatura Mágica (Mago, nível 20) — as 2 magias escolhidas, `[]`
   * pra quem não tem. Mesmo tratamento de "Conjurar Grátis" de
   * Maestria, mas limitado a 1x por magia até o próximo Descanso
   * (ver `assinaturaMagicaGastas`/`core/assinaturaMagica.ts`). */
  assinaturaMagicaAtuais: string[];
  assinaturaMagicaGastas: string[];
  /** Magia fixa de classe base (Destruição Divina do Paladino...) —
   * mesmo tratamento de "Conjurar Grátis", sempre no círculo BASE da
   * magia (sem upcast). Ver `core/magiasFixasDeClasse.ts`. */
  magiasFixasClasseAtuais: MagiaFixaDeClasse[];
  magiasFixasClasseGastas: Record<string, number>;
  /** Chamado sempre que uma magia conjura de graça (Maestria OU
   * Assinatura) — quem chama decide se precisa marcar "gasta". */
  onUsarMagiaGratisDeClasse: (nomeMagia: string) => void;
  /** Quais pills de info aparecem em cada linha de magia — preferência
   * do aparelho (ver `core/preferenciasPillsMagia.ts`). */
  preferenciasPillsMagia: PreferenciasPillsMagia;
  /** Mente Aguçada (Psiônico UA, E4d-b) — "Modo de Ataque": trocar o menor
   * dado de um dano Psíquico pelo número anotado, 1x por turno. Ver
   * `ui/roll/ofertaMenteAgucada.ts`. */
  menteAgucadaAtiva: boolean;
  /** Transe Destrutivo (Psiônico, Psicinético nível 6, E6c-f) — ver `core/transeDestrutivo.ts`. */
  transeDestrutivoAtiva: boolean;
  menteAgucadaAnotado: number | null;
  menteAgucadaUsadaNoTurno: boolean;
  onMenteAgucadaTrocada: () => void;
}

/** Fluxo completo de "Usar Magia" dentro de um painel do Combate
 * (picker Truque/Magia Preparada → escolher círculo, se for o caso →
 * conjurar) — extraído de `AcaoPanelContent.tsx` (2026-09, pedido do
 * Osmar: "magias podem ter Ação, Ação Bônus ou Reação" — o painel de
 * Ação Bônus precisava do MESMO fluxo, não um novo). `picker` não-nulo
 * substitui TODO o conteúdo normal do painel (mesmo padrão de antes:
 * quem chama faz `if (picker) return picker;` antes do resto do JSX).
 * `abrirLista` é o `onClick` da linha "✨ Usar Magia" de cada painel. */
export function useUsarMagiaPainel(p: UsarMagiaPainelParams) {
  const [telaMagia, setTelaMagia] = useState<'lista' | { magia: Magia; circulos: number[]; classeDonaDaMagia: string | null } | null>(
    null,
  );
  const { rolarD20, rolarDados } = useRoll();
  /** Grupo A dos Talentos Selvagens, lado de MAGIA — ver `core/talentosSelvagens.ts`. Intercepta
   * ANTES de `conjurarMagia`: se a magia qualifica (dano Contundente/Cortante/Perfurante/
   * Psíquico) e o talento ainda não foi usado nesse turno, abre a escolha via
   * `p.onAbrirEscolhaDeEfeito` (NUNCA um `EscolherEfeitoModal` guardado aqui dentro — mesmo motivo
   * de `onAbrirEscolhaSobrecarga` acima); senão já chama `continuar` direto, sem popup. `continuar`
   * recebe o `avisoExtra` já pronto (ou `null` sem troca), seguindo o MESMO formato que
   * `conjurarMagia` já aceita (ver Telecinese Intensificada, mesmo padrão). */
  function conjurarComEscolhaDeTipo(m: Magia, continuar: (avisoExtra: string | null) => void) {
    if (!elegivelTrocaTipoDeDanoTalentoSelvagem(m.danoBaseTipo, p.tipoDanoTrocaTalentoSelvagem, p.trocaTipoDeDanoTalentoSelvagemUsadaTurno)) {
      continuar(null);
      return;
    }
    p.onAbrirEscolhaDeEfeito({
      titulo: '🎯 Qual tipo de dano foi dado?',
      opcoes: [
        { nome: 'Normal', texto: 'O tipo de dano normal da magia.' },
        { nome: p.tipoDanoTrocaTalentoSelvagem!, texto: 'Talento Selvagem: troca o tipo de dano (1x/turno) — efeito só narrativo.' },
      ],
      onEscolher: (nomes) => {
        const escolhido = nomes[0];
        if (escolhido === p.tipoDanoTrocaTalentoSelvagem) {
          p.onUsarTrocaTipoDeDanoTalentoSelvagem();
          continuar(`🎯 Tipo de dano: ${escolhido}.`);
        } else {
          continuar(null);
        }
      },
      onFechar: () => continuar(null),
    });
  }

  // Fechar o drawer (backdrop/borda) não desmonta o painel — reseta o
  // picker manualmente pra não deixar `SelecionarMagiaShell`/seu Portal
  // "Espaços" presos na tela depois do drawer sumir.
  useEffect(() => {
    if (!p.aberto) setTelaMagia(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.aberto]);

  /** `circulo` é o espaço a gastar — pode ser maior que `m.circulo`
   * (upcast, ver `EscolherCirculoShell`); truque passa `null` (não
   * gasta espaço nenhum). `gratis` (Maestria de Magias) pula o
   * desconto de Espaço mesmo com `circulo` definido. */
  function conjurarMagia(
    m: Magia,
    circulo: number | null,
    classeDoEspaco: string = p.classeAtivaNome,
    gratis = false,
    classeDonaDaMagia: string | null = null,
    viaTelecineseIntensificadaJaResolvida = false,
    avisoExtra: string | null = null,
  ) {
    // Trava dupla — a linha "Usar Magia" já fica desabilitada quando
    // `desvantagemForcaDestreza` é true, mas essa checagem aqui é o
    // ponto único de verdade (SDD "Penalidades por Falta de
    // Proficiência": bloqueio de conjuração é pra impedir de verdade,
    // não só avisar).
    if (p.desvantagemForcaDestreza) return;
    // Telecinese Intensificada (E6c-g): a "opção grátis" de Telecinese só é a Intensificada
    // quando nenhuma outra fonte (Maestria/Assinatura/Magia Fixa) já cobre essa magia — essas
    // continuam de graça de verdade, sem gastar Dado de Energia nenhum. `viaTelecineseIntensificadaJaResolvida`
    // evita reabrir o popup na chamada recursiva de baixo (depois que o jogador já escolheu).
    const viaTelecineseIntensificada =
      !viaTelecineseIntensificadaJaResolvida &&
      gratis &&
      m.nome === 'Telecinese' &&
      circulo === m.circulo &&
      circuloGratisMaestria(m.nome, p.maestriaDeMagiasAtuais) === null &&
      circuloGratisAssinatura(m.nome, p.assinaturaMagicaAtuais, p.assinaturaMagicaGastas) === null &&
      circuloGratisMagiaFixaDeClasse(m.nome, m.circulo, p.magiasFixasClasseAtuais, p.magiasFixasClasseGastas) === null;
    if (viaTelecineseIntensificada) {
      setTelaMagia(null);
      p.onAbrirEscolhaTelecineseIntensificada({
        aoConjurarNormal: () => {
          p.onAbrirEscolhaTelecineseIntensificada(null);
          if (!p.onGastarTelecineseIntensificada()) return;
          conjurarMagia(m, circulo, classeDoEspaco, true, classeDonaDaMagia, true);
        },
        aoConjurarSemConcentracao: () => {
          p.onAbrirEscolhaTelecineseIntensificada(null);
          if (!p.onGastarTelecineseIntensificada()) return;
          conjurarMagia(m, circulo, classeDoEspaco, true, classeDonaDaMagia, true, AVISO_TELECINESE_INTENSIFICADA_SEM_CONCENTRACAO);
        },
      });
      return;
    }
    // A conjuração via Telecinese Intensificada já gastou os 4 Dados de Energia acima — nunca
    // marca "uso grátis" da Maestria/Assinatura/Magia Fixa pra essa conjuração específica.
    if (gratis && !viaTelecineseIntensificadaJaResolvida) p.onUsarMagiaGratisDeClasse(m.nome);
    if (circulo !== null && !gratis) {
      const ok = p.gastarSlotCirculo(circulo, classeDoEspaco);
      if (!ok) return;
    }
    setTelaMagia(null);
    const circuloUsado = circulo ?? m.circulo;
    // Convocar Montaria não roda a mecânica normal de dano/salvaguarda/
    // cura — vira Pet (ver EscolherMontariaModal.tsx). Espaço/uso
    // grátis já foi descontado acima, igual qualquer outra magia.
    if (m.nome === 'Convocar Montaria') {
      p.onAbrirEscolhaDeMontaria(circuloUsado);
      return;
    }
    // Resolve o mod. pela classe DONA da magia (multiclasse), não pela
    // classe ativa — ver PENDENCIAS.md "Multiclasse — acerto/CD de
    // magia...".
    const { mod: modAcertoReal, explicacao: explicacaoReal } = modAcertoConjuracaoPorClasse(
      p.resumosPorClasse,
      classeDonaDaMagia,
      p.modAcertoConjuracao,
      p.explicacaoAcertoConjuracao,
    );
    const resultado = decidirConjuracao(
      m,
      circuloUsado,
      p.nivel,
      modAcertoReal,
      p.colheitaMacabraDisponivel,
      circulo !== null && !gratis,
      p.truqueVinculadoAgonizante,
      p.modCarisma,
      explicacaoReal,
      p.evocacaoPotencializadaAtiva,
      p.modIntAtual,
      p.disciplinasPsionicasConhecidas,
      p.disciplinaPsionicaBloqueadaNoTurno,
    );
    if (resultado.curaColheitaMacabra !== null) {
      p.onColheitaMacabraDisponivel(resultado.curaColheitaMacabra);
    }
    // Insinuação do Id/Pensamentos Destrutivos sempre vêm de magia com
    // salvaguarda — abrir os 2 popups juntos fazia o resultado da
    // Disciplina "sumir" atrás do de Salvaguarda (pedido do Osmar,
    // 2026-10). Em vez disso, SÓ abre a Salvaguarda depois que a
    // Disciplina resolver, já com o texto pronto pra virar linha extra.
    if (resultado.disciplinaPosConjuracao) {
      // Ação/Ação Bônus na aba Combate — TEM conceito de turno (ver
      // `DisciplinaPosConjuracaoPendente.temContextoDeTurno`).
      if (resultado.mecanica === 'salvaguarda') {
        p.onEscolher(`✨ ${m.nome}`, resultado.textoFeedback);
        p.onDisciplinaPosConjuracaoDisponivel({
          ...resultado.disciplinaPosConjuracao,
          temContextoDeTurno: true,
          aoResolverSalvaguarda: (aviso) =>
            p.onAbrirSalvaguarda(m, circuloUsado, [aviso, avisoExtra].filter(Boolean).join('\n\n') || null, classeDonaDaMagia),
        });
        return;
      }
      p.onDisciplinaPosConjuracaoDisponivel({ ...resultado.disciplinaPosConjuracao, temContextoDeTurno: true });
    }
    if (resultado.rollAcerto) {
      const dano = resultado.danoPendente;
      rolarD20({
        ...resultado.rollAcerto,
        confirmarAcerto: {
          onAcertou: ({ critico }) => {
            if (!dano) return;
            const rolarNormal = () => {
              const montado = danoComCritico({ quantidade: dano.quantidade, lados: dano.lados, mod: dano.mod }, critico);
              rolarDados({
                label: `${dano.label}${critico ? ' (Crítico)' : ''}`,
                formula: montado.formula,
                quantidade: montado.quantidade,
                lados: dano.lados,
                mod: dano.mod,
                explicacaoMod: dano.explicacaoMod,
                confirmarFechamento: {},
                // Ação/Ação Bônus na aba Combate — TEM conceito de turno.
                ofertaTrocaDeDado: ofertaMenteAgucada(
                  dano.tipo,
                  p.menteAgucadaAtiva,
                  p.menteAgucadaAnotado,
                  p.menteAgucadaUsadaNoTurno,
                  true,
                  p.onMenteAgucadaTrocada,
                ),
              });
            };
            if (sobrecargaElegivel(m, circuloUsado, p.sobrecargaAtiva)) {
              p.onAbrirEscolhaSobrecarga({
                nomeMagia: m.nome,
                danoMaximo: danoMaximoSobrecarga(dano.quantidade, dano.lados, dano.mod, critico),
                aoRolarNormal: () => {
                  p.onAbrirEscolhaSobrecarga(null);
                  rolarNormal();
                },
                aoUsarSobrecarga: () => {
                  p.onAbrirEscolhaSobrecarga(null);
                  const max = danoMaximoSobrecarga(dano.quantidade, dano.lados, dano.mod, critico);
                  p.onEscolher(`✨ ${m.nome}`, `☠️ Sobrecarga — ${max} de dano máximo${critico ? ' (Crítico)' : ''}`);
                  const necrotico = danoNecroticoSobrecarga(p.sobrecargaUsosDesdeDescanso, circuloUsado);
                  p.onUsarSobrecarga();
                  if (necrotico) {
                    let totalNecrotico = 0;
                    rolarDados({
                      label: '☠️ Sobrecarga — Dano Necrótico auto-infligido',
                      formula: `${necrotico.quantidade}d12`,
                      quantidade: necrotico.quantidade,
                      lados: necrotico.lados,
                      mod: 0,
                      onResultado: (total) => {
                        totalNecrotico = total;
                      },
                      confirmarFechamento: { aoTocar: () => p.onAlterarPv(-totalNecrotico) },
                    });
                  }
                },
              });
              return;
            }
            rolarNormal();
          },
          onErrou: () => {
            if (!dano || !p.truquePotenteAtivo || !truqueElegivelTruquePotente(m)) return;
            let totalRolado = 0;
            rolarDados({
              label: dano.label,
              formula: `${dano.quantidade}d${dano.lados}${dano.mod ? ` + ${dano.mod}` : ''}`,
              quantidade: dano.quantidade,
              lados: dano.lados,
              mod: dano.mod,
              explicacaoMod: dano.explicacaoMod,
              onResultado: (total) => {
                totalRolado = total;
              },
              confirmarFechamento: {
                rotulo: 'Aplicar Truque Potente ✓',
                aoTocar: () =>
                  p.onEscolher(`✨ ${m.nome}`, `Truque Potente — ${Math.floor(totalRolado / 2)} de dano (metade, sem efeitos adicionais)`),
              },
            });
          },
        },
      });
      // `avisoExtra` (ex.: Talento Selvagem trocou o tipo de dano) nunca tinha aparecido
      // pro mecanismo de ataque — só o de salvaguarda (`onAbrirSalvaguarda`) mostrava. Corrigido
      // concatenando aqui também, mesmo texto final de sempre.
      p.onEscolher(`✨ ${m.nome}`, [resultado.textoFeedback, avisoExtra].filter(Boolean).join(' '));
      return;
    }
    if (resultado.mecanica === 'salvaguarda') {
      p.onEscolher(`✨ ${m.nome}`, resultado.textoFeedback);
      p.onAbrirSalvaguarda(m, circuloUsado, avisoExtra, classeDonaDaMagia);
      return;
    }
    if (resultado.rollCura) {
      rolarDados({
        ...resultado.rollCura,
        confirmarAlvoCura: { onMeCurar: (total) => p.onCuraDeMagiaAplicada(total) },
      });
    }
    if (resultado.rollDano) {
      rolarDados({
        ...resultado.rollDano,
        confirmarFechamento: {},
        // Ataque-acerto na aba Combate — TEM conceito de turno.
        ofertaTrocaDeDado: ofertaMenteAgucada(
          resultado.rollDano.tipo,
          p.menteAgucadaAtiva,
          p.menteAgucadaAnotado,
          p.menteAgucadaUsadaNoTurno,
          true,
          p.onMenteAgucadaTrocada,
        ),
        // Transe Destrutivo (Psicinético nível 6, E6c-f) — mesmo par
        // `circuloUsado`/`circulo !== null && !gratis` já usado acima em `decidirConjuracao`.
        transeDestrutivoElegivel: p.transeDestrutivoAtiva && circulo !== null && !gratis && circuloUsado > 0,
      });
    }
    p.onEscolher(`✨ ${m.nome}`, resultado.textoFeedback);
  }

  const picker =
    telaMagia === 'lista' ? (
      <SelecionarMagiaShell
        titulo="Usar Magia"
        truques={p.truques}
        magiasPreparadas={p.magiasPreparadas}
        espacos={p.espacos}
        espacosGastosPorCirculo={p.espacosGastosPorCirculo}
        ponte={p.ponte}
        maestriaDeMagiasAtuais={p.maestriaDeMagiasAtuais}
        assinaturaMagicaAtuais={p.assinaturaMagicaAtuais}
        assinaturaMagicaGastas={p.assinaturaMagicaGastas}
        magiasFixasClasseAtuais={p.magiasFixasClasseAtuais}
        magiasFixasClasseGastas={p.magiasFixasClasseGastas}
        telecineseIntensificadaDisponivel={p.telecineseIntensificadaDisponivel}
        dadosEnergiaRestantes={p.dadosEnergiaRestantes}
        onFechar={() => setTelaMagia(null)}
        onEscolherTruque={(m, classe) =>
          conjurarComEscolhaDeTipo(m, (avisoExtra) => conjurarMagia(m, null, p.classeAtivaNome, false, classe, false, avisoExtra))
        }
        onEscolherMagia={(m, circulosDisponiveis, classe) =>
          setTelaMagia({ magia: m, circulos: circulosDisponiveis, classeDonaDaMagia: classe })
        }
        preferenciasPillsMagia={p.preferenciasPillsMagia}
        resumosPorClasse={p.resumosPorClasse}
      />
    ) : telaMagia ? (
      <EscolherCirculoShell
        magia={telaMagia.magia}
        nivelPersonagem={p.nivel}
        opcoes={opcoesGastoComPonte(
          telaMagia.magia.circulo,
          p.classeAtivaNome,
          p.espacos,
          p.espacosGastosPorCirculo,
          p.ponte,
          circuloGratisMaestria(telaMagia.magia.nome, p.maestriaDeMagiasAtuais) ??
            circuloGratisAssinatura(telaMagia.magia.nome, p.assinaturaMagicaAtuais, p.assinaturaMagicaGastas) ??
            circuloGratisMagiaFixaDeClasse(
              telaMagia.magia.nome,
              telaMagia.magia.circulo,
              p.magiasFixasClasseAtuais,
              p.magiasFixasClasseGastas,
            ) ??
            circuloGratisTelecineseIntensificada(
              telaMagia.magia.nome,
              telaMagia.magia.circulo,
              p.telecineseIntensificadaDisponivel,
              p.dadosEnergiaRestantes,
            ),
        )}
        onVoltar={() => setTelaMagia('lista')}
        onConjurar={(circulo, classeNome, gratis) =>
          conjurarComEscolhaDeTipo(telaMagia.magia, (avisoExtra) =>
            conjurarMagia(telaMagia.magia, circulo, classeNome, gratis, telaMagia.classeDonaDaMagia, false, avisoExtra),
          )
        }
      />
    ) : null;

  return { picker, abrirLista: () => setTelaMagia('lista') };
}
