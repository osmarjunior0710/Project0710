import { useEffect, useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { opcoesGastoComPonte, type EspacoDeMagiaAtivo, type PoolDePonte } from '../../../core/magiasPersonagem';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import { decidirConjuracao } from '../../../core/conjurarMagia';
import { danoComCritico } from '../../../core/danoCritico';
import { useRoll } from '../../roll/RollContext';
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
  truques: Magia[];
  magiasPreparadas: Magia[];
  modAcertoConjuracao: number | null;
  /** Quebra do `modAcertoConjuracao` pro popup de rolagem (B7) —
   * `null` nos mesmos casos que `modAcertoConjuracao`. */
  explicacaoAcertoConjuracao: ExplicacaoCalculo | null;
  truqueVinculadoAgonizante: string | undefined;
  modCarisma: number;
  colheitaMacabraDisponivel: boolean;
  onColheitaMacabraDisponivel: (cura: number) => void;
  /** Aplica a cura rolada (`rollCura`) no PV do personagem E dispara
   * o efeito visual de Cura — ver `RollDadosOptions.confirmarAlvoCura`
   * ("Me curar") e `FichaShell.tsx` `onCuraDeMagiaAplicada`. */
  onCuraDeMagiaAplicada: (total: number) => void;
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
   * gasta espaço nenhum). */
  function conjurarMagia(m: Magia, circulo: number | null, classeDoEspaco: string = p.classeAtivaNome) {
    // Trava dupla — a linha "Usar Magia" já fica desabilitada quando
    // `desvantagemForcaDestreza` é true, mas essa checagem aqui é o
    // ponto único de verdade (SDD "Penalidades por Falta de
    // Proficiência": bloqueio de conjuração é pra impedir de verdade,
    // não só avisar).
    if (p.desvantagemForcaDestreza) return;
    if (circulo !== null) {
      const ok = p.gastarSlotCirculo(circulo, classeDoEspaco);
      if (!ok) return;
    }
    setTelaMagia(null);
    const circuloUsado = circulo ?? m.circulo;
    const resultado = decidirConjuracao(
      m,
      circuloUsado,
      p.nivel,
      p.modAcertoConjuracao,
      p.colheitaMacabraDisponivel,
      circulo !== null,
      p.truqueVinculadoAgonizante,
      p.modCarisma,
      p.explicacaoAcertoConjuracao,
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
          },
          onErrou: () => {},
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
        onFechar={() => setTelaMagia(null)}
        onEscolherTruque={(m) => conjurarMagia(m, null)}
        onEscolherMagia={(m, circulosDisponiveis) => setTelaMagia({ magia: m, circulos: circulosDisponiveis })}
      />
    ) : telaMagia ? (
      <EscolherCirculoShell
        magia={telaMagia.magia}
        opcoes={opcoesGastoComPonte(telaMagia.magia.circulo, p.classeAtivaNome, p.espacos, p.espacosGastosPorCirculo, p.ponte)}
        onVoltar={() => setTelaMagia('lista')}
        onConjurar={(circulo, classeNome) => conjurarMagia(telaMagia.magia, circulo, classeNome)}
      />
    ) : null;

  return { picker, abrirLista: () => setTelaMagia('lista') };
}
