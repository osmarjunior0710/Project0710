import { useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { Pet } from '../../../core/pets';
import { iconesMagia } from '../../../core/classificarMagia';
import { calcularDanoMagia, calcularCuraMagia, mecanicaDaMagia } from '../../../core/magiaDano';
import { cdConjuracao } from '../../../core/magiasPersonagem';
import { useRoll } from '../../roll/RollContext';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TickPips from '../../components/TickPips';
import styles from './PanelRows.module.css';
import type { DanoPendente } from './AcaoPanelContent';

interface ReacaoPanelContentProps {
  /** `true` = Armadura equipada sem treinamento — bloqueia conjurar
   * magia de Reação (SDD "Penalidades por Falta de Proficiência", ver
   * `core/proficienciaArmadura.ts`). */
  desvantagemForcaDestreza: boolean;
  onEscolher: (nome: string, desc: string, dano?: DanoPendente) => void;
  /** Magia com `ataqueOuSalvaguarda` de tipo salvaguarda — abre o Modal
   * de Salvaguarda (CD + atributo + sucesso/falha), que vive em
   * CombatTab. Reação nunca faz upcast, então `circuloUsado` é sempre
   * `magia.circulo`. */
  onAbrirSalvaguarda: (magia: Magia, circuloUsado: number) => void;
  gastarSlotCirculo: (circulo: number) => boolean;
  /** Nível do personagem — pro Aprimoramento de Truque (dano escala
   * nos níveis 5/11/17, ver `calcularDanoMagia`). */
  nivel: number;
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
  /** Colheita dos Mortos (Necromante, nível 10) — `true` = personagem
   * tem a característica (independe de estar Ensanguentado agora). */
  colheitaDosMortosDisponivel: boolean;
  /** `true` = PV atual em metade ou menos do máximo — só assim a
   * Reação pode ser usada de verdade (ver `personagemEnsanguentado`
   * em `core/necromante.ts`). */
  personagemEnsanguentado: boolean;
  /** Pets Morto-Vivo elegíveis, cada um já com a cura calculada pro
   * ND dele (ver `opcoesColheitaDosMortos`). */
  opcoesColheitaDosMortos: { pet: Pet; cura: number }[];
  onColheitaDosMortos: (petId: string, cura: number) => void;
  /** Mestre da Morte (Necromante, nível 14) — metade Reação: `true` =
   * característica desbloqueada (independe de ter algum Morto-Vivo em
   * 0 PV agora). */
  mestreDaMorteExplosaoDisponivel: boolean;
  /** `true` = existe pelo menos 1 Morto-Vivo controlado em 0 PV agora
   * (ver `algumMortoVivoEm0PV` em `core/necromante.ts`) — só assim a
   * Reação pode ser usada de verdade, independente de como o pet
   * chegou a 0 (dano manual na aba Pets ou Colheita dos Mortos). */
  mestreDaMorteExplosaoLiberada: boolean;
  /** Modificador de Inteligência do personagem — dano da explosão
   * (2d10 + esse valor). */
  modIntAtual: number;
}

export default function ReacaoPanelContent({
  desvantagemForcaDestreza,
  onEscolher,
  onAbrirSalvaguarda,
  gastarSlotCirculo,
  nivel,
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
  colheitaDosMortosDisponivel,
  personagemEnsanguentado,
  opcoesColheitaDosMortos,
  onColheitaDosMortos,
  mestreDaMorteExplosaoDisponivel,
  mestreDaMorteExplosaoLiberada,
  modIntAtual,
}: ReacaoPanelContentProps) {
  const [aviso, setAviso] = useState<string | null>(null);
  const [telaColheitaDosMortos, setTelaColheitaDosMortos] = useState(false);
  const { rolarD20, rolarDados } = useRoll();

  function usarColheitaDosMortos(petId: string, cura: number) {
    onColheitaDosMortos(petId, cura);
    setTelaColheitaDosMortos(false);
    onEscolher('💀 Colheita dos Mortos', `Morto-Vivo reduzido a 0 PV — você recupera ${cura} Pontos de Vida.`);
  }

  function conjurarMagia(m: Magia) {
    if (desvantagemForcaDestreza) return;
    if (m.circulo > 0) {
      const ok = gastarSlotCirculo(m.circulo);
      if (!ok) {
        setAviso(`Sem Espaço de Magia de ${m.circulo}º círculo disponível. Veja a aba Magias pra saber quando recupera.`);
        return;
      }
    }
    setAviso(null);
    const mecanica = mecanicaDaMagia(m);
    if (mecanica === 'ataque' && modAcertoConjuracao !== null) {
      rolarD20({
        label: `Ataque de Magia — ${m.nome}`,
        formula: `1d20 + ${modAcertoConjuracao}`,
        mod: modAcertoConjuracao,
      });
      const dano = calcularDanoMagia(m, m.circulo, nivel);
      if (dano) {
        onEscolher(`✨ ${m.nome}`, 'Rolagem de acerto feita. Toque "Rolar Dano" pra ver o dano.', {
          label: `Dano — ✨ ${m.nome}`,
          quantidade: dano.quantidade,
          lados: dano.lados,
          mod: dano.mod,
        });
        return;
      }
      onEscolher(`✨ ${m.nome}`, 'Rolagem de acerto feita. Veja a descrição da magia (ⓘ) pro dano.');
      return;
    }
    if (mecanica === 'salvaguarda') {
      onEscolher(`✨ ${m.nome}`, 'Alvo faz salvaguarda — veja o popup pra CD e dano.');
      onAbrirSalvaguarda(m, m.circulo);
      return;
    }
    if (mecanica === 'cura') {
      const cura = calcularCuraMagia(m, m.circulo, nivel);
      if (cura) {
        rolarDados({
          label: `Cura — ✨ ${m.nome}`,
          formula: `${cura.quantidade}d${cura.lados}${cura.mod ? ` + ${cura.mod}` : ''}`,
          quantidade: cura.quantidade,
          lados: cura.lados,
          mod: cura.mod,
        });
        onEscolher(`✨ ${m.nome}`, 'Cura rolada — aplique o total no alvo.');
        return;
      }
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

  function usarExplosaoMestreDaMorte() {
    rolarDados({
      label: 'Mestre da Morte — Explosão Necrótica',
      formula: `2d10 + ${modIntAtual}`,
      quantidade: 2,
      lados: 10,
      mod: modIntAtual,
    });
    const cd = modAcertoConjuracao !== null ? cdConjuracao(modAcertoConjuracao) : null;
    onEscolher(
      '💥 Mestre da Morte — Explosão',
      `Cada criatura à sua escolha a até 3m do Morto-Vivo sofre esse dano Necrótico${cd !== null ? ` (salvaguarda de Destreza, CD ${cd}, reduz à metade)` : ''}.`,
    );
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

  if (telaColheitaDosMortos) {
    return (
      <>
        <div className="section-title">Colheita dos Mortos — escolha o Morto-Vivo</div>
        <div className="label" style={{ marginBottom: 8 }}>
          Ele é reduzido a 0 Pontos de Vida; você recupera PV igual ao seu nível de Mago.
        </div>
        {opcoesColheitaDosMortos.map(({ pet, cura }) => (
          <div key={pet.id} className={styles.row} onClick={() => usarColheitaDosMortos(pet.id, cura)}>
            <div className={styles.rowName}>💀 {pet.nome}</div>
            {detalhesAtivo && <div className={styles.rowDesc}>Recupera {cura} Pontos de Vida.</div>}
          </div>
        ))}
        <div className={styles.row} onClick={() => setTelaColheitaDosMortos(false)}>
          <div className={styles.rowName}>← Voltar</div>
        </div>
      </>
    );
  }

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
      {colheitaDosMortosDisponivel && (
        <div
          className={styles.row}
          style={!personagemEnsanguentado || opcoesColheitaDosMortos.length === 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={() => setTelaColheitaDosMortos(true)}
        >
          <div className={styles.rowName}>💀 Colheita dos Mortos</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              {!personagemEnsanguentado
                ? 'Só disponível quando você fica Ensanguentado (PV igual ou menor que a metade do máximo).'
                : opcoesColheitaDosMortos.length === 0
                  ? 'Nenhum Morto-Vivo sob seu controle agora.'
                  : 'Reduz um Morto-Vivo sob seu controle a 0 PV e recupera PV igual ao seu nível de Mago.'}
            </div>
          )}
        </div>
      )}
      {mestreDaMorteExplosaoDisponivel && (
        <div
          className={styles.row}
          style={!mestreDaMorteExplosaoLiberada ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={usarExplosaoMestreDaMorte}
        >
          <div className={styles.rowName}>💥 Mestre da Morte — Explosão</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              {!mestreDaMorteExplosaoLiberada
                ? 'Só disponível quando um Morto-Vivo sob seu controle é reduzido a 0 PV.'
                : 'Causa 2d10 + seu mod. de Inteligência de dano Necrótico em criaturas à sua escolha a até 3m do Morto-Vivo (salvaguarda de Destreza reduz à metade).'}
            </div>
          )}
        </div>
      )}
      {conjura && magiasReacao.length > 0 && (
        <>
          {desvantagemForcaDestreza && (
            <div className="label" style={{ color: 'var(--danger)', marginBottom: 8 }}>
              Bloqueado — Armadura equipada sem treinamento impede conjurar magias.
            </div>
          )}
          {magiasReacao.map((m) => (
            <div
              key={m.id}
              className={styles.spellMiniRow}
              style={desvantagemForcaDestreza ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
              onClick={() => conjurarMagia(m)}
            >
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
