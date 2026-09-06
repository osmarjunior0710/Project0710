import { useState } from 'react';
import { acoesBase, type AtaqueInfo } from '../../../data/exampleCombat';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { AtaqueResolvido } from '../../../core/ataque';
import type { EspacoDeMagiaAtivo } from '../../../core/magiasPersonagem';
import { classificarMagia } from '../../../core/classificarMagia';
import { useRoll } from '../../roll/RollContext';
import SelecionarMagiaShell from './SelecionarMagiaShell';
import EscolherCirculoShell from './EscolherCirculoShell';
import TickPips from '../../components/TickPips';
import styles from './PanelRows.module.css';

export interface DanoPendente {
  label: string;
  quantidade: number;
  lados: number;
  mod: number;
}

interface AcaoPanelContentProps {
  onEscolher: (nome: string, desc: string, dano?: DanoPendente) => void;
  onAtacar: (nome: string, desc: string, dano: DanoPendente) => void;
  gastarSlotCirculo: (circulo: number) => boolean;
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  conjura: boolean;
  truques: Magia[];
  magiasPreparadas: Magia[];
  modAcertoConjuracao: number | null;
  numAtaques: number;
  ataquesFeitos: number;
  surtoMax: number;
  surtoRestantes: number;
  surtoUsadoTurno: boolean;
  onUsarSurto: () => void;
  ataqueAtual: AtaqueResolvido | null;
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
}

export default function AcaoPanelContent({
  onEscolher,
  onAtacar,
  gastarSlotCirculo,
  espacos,
  espacosGastosPorCirculo,
  conjura,
  truques,
  magiasPreparadas,
  modAcertoConjuracao,
  numAtaques,
  ataquesFeitos,
  surtoMax,
  surtoRestantes,
  surtoUsadoTurno,
  onUsarSurto,
  ataqueAtual,
  detalhesAtivo,
  maosCurativasDisponivel,
  maosCurativasGasto,
  dadosMaosCurativas,
  onUsarMaosCurativas,
  falarComAnimaisGnomoDisponivel,
  usosFalarComAnimaisGnomoMaximo,
  usosFalarComAnimaisGnomoRestantes,
  onUsarFalarComAnimaisGnomo,
}: AcaoPanelContentProps) {
  const [telaMagia, setTelaMagia] = useState<'lista' | { magia: Magia; circulos: number[] } | null>(null);
  const { rolarD20, rolarDados } = useRoll();

  function usarMaosCurativas() {
    if (!onUsarMaosCurativas()) return;
    rolarDados({ label: 'Mãos Curativas — Cura', formula: `${dadosMaosCurativas}d4`, quantidade: dadosMaosCurativas, lados: 4, mod: 0 });
    onEscolher('🙌 Mãos Curativas', 'Toque uma criatura — ela recupera o total mostrado em Pontos de Vida.');
  }

  function usarFalarComAnimaisGnomo() {
    if (!onUsarFalarComAnimaisGnomo()) return;
    onEscolher(
      '🐾 Falar com Animais (Traço de Gnomo)',
      'Por 10 minutos, você compreende e conversa com Feras — grátis, sem gastar Espaço de Magia.',
    );
  }

  function rolarAtaque(nome: string, ataque: AtaqueInfo, finalizar: (nome: string, desc: string, dano: DanoPendente) => void) {
    rolarD20({
      label: `Ataque — ${nome}`,
      formula: `1d20 + ${ataque.modAcerto}`,
      mod: ataque.modAcerto,
    });
    finalizar(`🗡 ${nome}`, `Rolagem de acerto feita. Toque "Rolar Dano" pra ver o dano ${ataque.danoTipo}.`, {
      label: `Dano — ${nome}`,
      quantidade: ataque.danoQuantidade,
      lados: ataque.danoLados,
      mod: ataque.danoMod,
    });
  }

  /** `circulo` é o espaço a gastar — pode ser maior que `m.circulo`
   * (upcast, ver `EscolherCirculoShell`); truque passa `null` (não
   * gasta espaço nenhum). */
  function conjurarMagia(m: Magia, circulo: number | null) {
    if (circulo !== null) {
      const ok = gastarSlotCirculo(circulo);
      if (!ok) return;
    }
    setTelaMagia(null);
    const classificacao = classificarMagia(m);
    if (classificacao.ataque && modAcertoConjuracao !== null) {
      rolarD20({
        label: `Ataque de Magia — ${m.nome}`,
        formula: `1d20 + ${modAcertoConjuracao}`,
        mod: modAcertoConjuracao,
      });
      onEscolher(`✨ ${m.nome}`, 'Rolagem de acerto feita. Veja a descrição da magia (ⓘ) pro dano.');
      return;
    }
    onEscolher(`✨ ${m.nome}`, m.descricaoCurta ?? '');
  }

  const surtoDesabilitado = surtoRestantes <= 0 || surtoUsadoTurno;

  if (telaMagia === 'lista') {
    return (
      <SelecionarMagiaShell
        titulo="Usar Magia"
        truques={truques}
        magiasPreparadas={magiasPreparadas}
        espacos={espacos}
        espacosGastosPorCirculo={espacosGastosPorCirculo}
        onFechar={() => setTelaMagia(null)}
        onEscolherTruque={(m) => conjurarMagia(m, null)}
        onEscolherMagia={(m, circulosDisponiveis) => setTelaMagia({ magia: m, circulos: circulosDisponiveis })}
      />
    );
  }

  if (telaMagia) {
    return (
      <EscolherCirculoShell
        magia={telaMagia.magia}
        circulosDisponiveis={telaMagia.circulos}
        espacos={espacos}
        espacosGastosPorCirculo={espacosGastosPorCirculo}
        onVoltar={() => setTelaMagia('lista')}
        onConjurar={(circulo) => conjurarMagia(telaMagia.magia, circulo)}
      />
    );
  }

  return (
    <>
      {ataqueAtual && (
        <div
          className={styles.row}
          onClick={() => rolarAtaque(`🗡 ${ataqueAtual.nome}`, ataqueAtual.info, onAtacar)}
        >
          <div className={styles.rowName}>
            🗡 Atacar — {ataqueAtual.nome}{' '}
            {numAtaques > 1 ? `(ataque ${Math.min(ataquesFeitos + 1, numAtaques)}/${numAtaques})` : ''}
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
        <div className={styles.row} onClick={() => setTelaMagia('lista')}>
          <div className={styles.rowName}>✨ Usar Magia</div>
          {detalhesAtivo && <div className={styles.rowDesc}>Conjurar Truque ou Magia Preparada</div>}
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
