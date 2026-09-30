import { useEffect, useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { opcoesGastoComPonte, type EspacoDeMagiaAtivo, type PoolDePonte, type MagiaComClasseOpcional } from '../../../core/magiasPersonagem';
import { circuloGratisMaestria } from '../../../core/maestriaDeMagias';
import { circuloGratisAssinatura } from '../../../core/assinaturaMagica';
import { circuloGratisMagiaFixaDeClasse, type MagiaFixaDeClasse } from '../../../core/magiasFixasDeClasse';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import { decidirConjuracao } from '../../../core/conjurarMagia';
import { truqueElegivelTruquePotente, sobrecargaElegivel, danoMaximoSobrecarga, danoNecroticoSobrecarga } from '../../../core/evocador';
import { danoComCritico } from '../../../core/danoCritico';
import { useRoll } from '../../roll/RollContext';
import type { PreferenciasPillsMagia } from '../../../core/preferenciasPillsMagia';
import SelecionarMagiaShell from './SelecionarMagiaShell';
import EscolherCirculoShell from './EscolherCirculoShell';

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
  onAbrirSalvaguarda: (magia: Magia, circuloUsado: number) => void;
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
  /** Convocar Montaria (Paladino, Montaria Fiel) desvia do fluxo normal
   * de dano/salvaguarda/cura — vira Pet em vez de rolagem, ver
   * `EscolherMontariaModal.tsx` (mesmo padrão de tela flutuante de
   * `onAbrirEscolhaSobrecarga`, vive em `CombatTab.tsx`). */
  onAbrirEscolhaDeMontaria: (circuloUsado: number) => void;
  colheitaMacabraDisponivel: boolean;
  onColheitaMacabraDisponivel: (cura: number) => void;
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
  const [telaMagia, setTelaMagia] = useState<'lista' | { magia: Magia; circulos: number[] } | null>(null);
  const { rolarD20, rolarDados } = useRoll();

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
  function conjurarMagia(m: Magia, circulo: number | null, classeDoEspaco: string = p.classeAtivaNome, gratis = false) {
    // Trava dupla — a linha "Usar Magia" já fica desabilitada quando
    // `desvantagemForcaDestreza` é true, mas essa checagem aqui é o
    // ponto único de verdade (SDD "Penalidades por Falta de
    // Proficiência": bloqueio de conjuração é pra impedir de verdade,
    // não só avisar).
    if (p.desvantagemForcaDestreza) return;
    if (gratis) p.onUsarMagiaGratisDeClasse(m.nome);
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
    const resultado = decidirConjuracao(
      m,
      circuloUsado,
      p.nivel,
      p.modAcertoConjuracao,
      p.colheitaMacabraDisponivel,
      circulo !== null && !gratis,
      p.truqueVinculadoAgonizante,
      p.modCarisma,
      p.explicacaoAcertoConjuracao,
      p.evocacaoPotencializadaAtiva,
      p.modIntAtual,
    );
    if (resultado.curaColheitaMacabra !== null) {
      p.onColheitaMacabraDisponivel(resultado.curaColheitaMacabra);
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
      p.onEscolher(`✨ ${m.nome}`, resultado.textoFeedback);
      return;
    }
    if (resultado.mecanica === 'salvaguarda') {
      p.onEscolher(`✨ ${m.nome}`, resultado.textoFeedback);
      p.onAbrirSalvaguarda(m, circuloUsado);
      return;
    }
    if (resultado.rollCura) {
      rolarDados({
        ...resultado.rollCura,
        confirmarAlvoCura: { onMeCurar: (total) => p.onCuraDeMagiaAplicada(total) },
      });
    }
    if (resultado.rollDano) {
      rolarDados({ ...resultado.rollDano, confirmarFechamento: {} });
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
        onFechar={() => setTelaMagia(null)}
        onEscolherTruque={(m) => conjurarMagia(m, null)}
        onEscolherMagia={(m, circulosDisponiveis) => setTelaMagia({ magia: m, circulos: circulosDisponiveis })}
        preferenciasPillsMagia={p.preferenciasPillsMagia}
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
            ),
        )}
        onVoltar={() => setTelaMagia('lista')}
        onConjurar={(circulo, classeNome, gratis) => conjurarMagia(telaMagia.magia, circulo, classeNome, gratis)}
      />
    ) : null;

  return { picker, abrirLista: () => setTelaMagia('lista') };
}
