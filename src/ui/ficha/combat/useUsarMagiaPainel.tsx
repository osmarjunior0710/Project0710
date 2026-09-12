import { useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { opcoesGastoComPonte, type EspacoDeMagiaAtivo, type PoolDePonte } from '../../../core/magiasPersonagem';
import { decidirConjuracao } from '../../../core/conjurarMagia';
import { useRoll } from '../../roll/RollContext';
import SelecionarMagiaShell from './SelecionarMagiaShell';
import EscolherCirculoShell from './EscolherCirculoShell';
import type { DanoPendente } from './DanoPendente';

interface UsarMagiaPainelParams {
  desvantagemForcaDestreza: boolean;
  onEscolher: (nome: string, desc: string, dano?: DanoPendente) => void;
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
  truqueVinculadoAgonizante: string | undefined;
  modCarisma: number;
  colheitaMacabraDisponivel: boolean;
  onColheitaMacabraDisponivel: (cura: number) => void;
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
    );
    if (resultado.curaColheitaMacabra !== null) {
      p.onColheitaMacabraDisponivel(resultado.curaColheitaMacabra);
    }
    if (resultado.rollAcerto) {
      rolarD20(resultado.rollAcerto);
      p.onEscolher(`✨ ${m.nome}`, resultado.textoFeedback, resultado.danoPendente);
      return;
    }
    if (resultado.mecanica === 'salvaguarda') {
      p.onEscolher(`✨ ${m.nome}`, resultado.textoFeedback);
      p.onAbrirSalvaguarda(m, circuloUsado);
      return;
    }
    if (resultado.rollCura) {
      rolarDados(resultado.rollCura);
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
