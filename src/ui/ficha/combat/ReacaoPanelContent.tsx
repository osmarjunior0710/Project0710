import { useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { classificarMagia, iconesMagia } from '../../../core/classificarMagia';
import { useRoll } from '../../roll/RollContext';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TickPips from '../../components/TickPips';
import styles from './PanelRows.module.css';

interface ReacaoPanelContentProps {
  onEscolher: (nome: string, desc: string) => void;
  gastarSlotCirculo: (circulo: number) => boolean;
  conjura: boolean;
  magiasReacao: Magia[];
  modAcertoConjuracao: number | null;
  detalhesAtivo: boolean;
  contraEncantamentoDisponivel: boolean;
  palavrasDeInterrupcaoDisponivel: boolean;
  usosInspiracaoMaximo: number;
  usosInspiracaoRestantes: number;
  tamanhoDadoInspiracao: number;
  onUsarInspiracao: () => boolean;
  /** Ancestralidade Gigante (Golias) — só aparece quando a opção
   * escolhida na criação for uma dessas 2 (reação). */
  resistenciaDaPedraDisponivel: boolean;
  trovaoDaTempestadeDisponivel: boolean;
  usosAncestralidadeGiganteMaximo: number;
  usosAncestralidadeGiganteRestantes: number;
  onUsarAncestralidadeGigante: () => boolean;
  modConstituicaoAtual: number;
}

export default function ReacaoPanelContent({
  onEscolher,
  gastarSlotCirculo,
  conjura,
  magiasReacao,
  modAcertoConjuracao,
  detalhesAtivo,
  contraEncantamentoDisponivel,
  palavrasDeInterrupcaoDisponivel,
  usosInspiracaoMaximo,
  usosInspiracaoRestantes,
  tamanhoDadoInspiracao,
  onUsarInspiracao,
  resistenciaDaPedraDisponivel,
  trovaoDaTempestadeDisponivel,
  usosAncestralidadeGiganteMaximo,
  usosAncestralidadeGiganteRestantes,
  onUsarAncestralidadeGigante,
  modConstituicaoAtual,
}: ReacaoPanelContentProps) {
  const [aviso, setAviso] = useState<string | null>(null);
  const { rolarD20, rolarDados } = useRoll();

  function conjurarMagia(m: Magia) {
    if (m.circulo > 0) {
      const ok = gastarSlotCirculo(m.circulo);
      if (!ok) {
        setAviso(`Sem Espaço de Magia de ${m.circulo}º círculo disponível. Veja a aba Magias pra saber quando recupera.`);
        return;
      }
    }
    setAviso(null);
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

  function usarContraEncantamento() {
    rolarD20({
      label: 'Contra-Encantamento (nova salvaguarda)',
      formula: '1d20 com Vantagem + seu mod. de salvaguarda',
      mod: 0,
      vantagem: 'vantagem',
      categoria: 'atributoOuSalvaguarda',
    });
    onEscolher(
      '🎶 Contra-Encantamento',
      'Some seu modificador de salvaguarda (ou o de quem está sendo protegido, se não for você) ao resultado mostrado.',
    );
  }

  function usarResistenciaDaPedra() {
    if (!onUsarAncestralidadeGigante()) return;
    rolarDados({
      label: 'Resistência da Pedra — Redução de Dano',
      formula: `1d12 + ${modConstituicaoAtual}`,
      quantidade: 1,
      lados: 12,
      mod: modConstituicaoAtual,
    });
    onEscolher('🪨 Resistência da Pedra', 'Reduza o dano que você sofreu pelo total mostrado.');
  }

  function usarTrovaoDaTempestade() {
    if (!onUsarAncestralidadeGigante()) return;
    rolarDados({ label: 'Trovão da Tempestade — Dano', formula: '1d8', quantidade: 1, lados: 8, mod: 0 });
    onEscolher('⚡ Trovão da Tempestade', 'Causa esse dano Trovejante à criatura que te acertou (até 18m).');
  }

  function usarPalavrasDeInterrupcao() {
    if (!onUsarInspiracao()) return;
    rolarDados({
      label: 'Palavras de Interrupção',
      formula: `1d${tamanhoDadoInspiracao}`,
      quantidade: 1,
      lados: tamanhoDadoInspiracao,
      mod: 0,
    });
    onEscolher(
      '🗯 Palavras de Interrupção',
      'Subtraia o resultado mostrado do dano, ou do resultado do teste/ataque da criatura (pode virar fracasso).',
    );
  }

  const semUsosInspiracao = usosInspiracaoRestantes <= 0;

  return (
    <>
      {usosInspiracaoMaximo > 0 && (
        <div className={styles.slotCounter}>
          <span>Inspiração de Bardo (d{tamanhoDadoInspiracao}):</span>
          <TickPips total={usosInspiracaoMaximo} usados={usosInspiracaoMaximo - usosInspiracaoRestantes} />
          <span style={{ color: 'var(--text-faint)' }}>
            {usosInspiracaoRestantes}/{usosInspiracaoMaximo} disponíveis
          </span>
        </div>
      )}
      {palavrasDeInterrupcaoDisponivel && (
        <div
          className={styles.row}
          style={semUsosInspiracao ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={usarPalavrasDeInterrupcao}
        >
          <div className={styles.rowName}>🗯 Palavras de Interrupção</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Criatura à vista a até 18m rolou dano ou foi bem-sucedida em teste/ataque — gasta 1 uso da sua
              Inspiração de Bardo (d{tamanhoDadoInspiracao}), subtraia o resultado do dela ({usosInspiracaoRestantes}{' '}
              uso{usosInspiracaoRestantes === 1 ? '' : 's'} restante{usosInspiracaoRestantes === 1 ? '' : 's'}).
            </div>
          )}
        </div>
      )}
      {contraEncantamentoDisponivel && (
        <div className={styles.row} onClick={usarContraEncantamento}>
          <div className={styles.rowName}>🎶 Contra-Encantamento</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Você ou uma criatura a até 9m falhou salvaguarda contra Amedrontado/Enfeitiçado — role de novo, com
              Vantagem. Sem custo de recurso.
            </div>
          )}
        </div>
      )}
      {resistenciaDaPedraDisponivel && (
        <div
          className={styles.row}
          style={usosAncestralidadeGiganteRestantes <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={usarResistenciaDaPedra}
        >
          <div className={styles.rowName}>🪨 Resistência da Pedra</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Você sofreu dano — gasta 1 uso da Ancestralidade Gigante ({usosAncestralidadeGiganteRestantes}/
              {usosAncestralidadeGiganteMaximo} restantes) e reduz o dano pelo resultado de 1d12 + seu mod. de
              Constituição.
            </div>
          )}
        </div>
      )}
      {trovaoDaTempestadeDisponivel && (
        <div
          className={styles.row}
          style={usosAncestralidadeGiganteRestantes <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={usarTrovaoDaTempestade}
        >
          <div className={styles.rowName}>⚡ Trovão da Tempestade</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Criatura a até 18m te acertou com ataque — gasta 1 uso da Ancestralidade Gigante (
              {usosAncestralidadeGiganteRestantes}/{usosAncestralidadeGiganteMaximo} restantes) e causa 1d8 de dano
              Trovejante nela.
            </div>
          )}
        </div>
      )}
      {conjura && magiasReacao.length > 0 && (
        <>
          {magiasReacao.map((m) => (
            <div key={m.id} className={styles.spellMiniRow} onClick={() => conjurarMagia(m)}>
              <span>
                <MagiaComDescricao magia={m} /> {iconesMagia(m)}
              </span>
              <span className="tag">{m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`}</span>
            </div>
          ))}
          {aviso && (
            <div className="label" style={{ color: 'var(--danger)', marginBottom: 8, marginTop: 8 }}>
              {aviso}
            </div>
          )}
        </>
      )}
      <div
        className={styles.row}
        onClick={() =>
          onEscolher(
            '⚔ Ataque de Oportunidade',
            'Disponível por padrão pra qualquer personagem, quando um inimigo visível sai do seu alcance.',
          )
        }
      >
        <div className={styles.rowName}>⚔ Ataque de Oportunidade</div>
        {detalhesAtivo && (
          <div className={styles.rowDesc}>Disponível por padrão pra qualquer personagem, sem precisar de característica de classe</div>
        )}
      </div>
    </>
  );
}
