import { useState } from 'react';
import { acoesBase, type AtaqueInfo } from '../../../data/exampleCombat';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { AtaqueResolvido } from '../../../core/ataque';
import type { EspacoDeMagiaAtivo, PoolDePonte } from '../../../core/magiasPersonagem';
import { resolverVantagem } from '../../../core/calculoPersonagem';
import { useRoll } from '../../roll/RollContext';
import { useUsarMagiaPainel } from './useUsarMagiaPainel';
import type { DanoPendente } from './DanoPendente';
import TickPips from '../../components/TickPips';
import styles from './PanelRows.module.css';

export type { DanoPendente };

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
  onEscolher: (nome: string, desc: string, dano?: DanoPendente) => void;
  onAtacar: (nome: string, desc: string, dano: DanoPendente) => void;
  /** Magia com `ataqueOuSalvaguarda` de tipo salvaguarda — abre o Modal
   * de Salvaguarda (CD + atributo + sucesso/falha), que vive em
   * CombatTab (persiste depois do painel fechar). `circuloUsado` é
   * pro upcast (igual `conjurarMagia` já calcula). */
  onAbrirSalvaguarda: (magia: Magia, circuloUsado: number) => void;
  gastarSlotCirculo: (circulo: number, classeNome: string) => boolean;
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
  /** Ataque Imprudente (Bárbaro, nível 2+) — `false` = não tem essa
   * característica. Só na 1ª jogada de ataque do turno
   * (`ataquesFeitos === 0`), tocar "Atacar" abre um mini-picker
   * "Ataque Normal"/"Ataque Imprudente" em vez de rolar direto; depois
   * disso `ataqueImprudenteAtivo` já decide sozinho pros ataques
   * seguintes do mesmo turno (Ataque Extra). */
  temAtaqueImprudente: boolean;
  ataqueImprudenteAtivo: boolean;
  onAtivarAtaqueImprudente: () => void;
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
  /** Chamado (além do fluxo normal de `onEscolher`/`onAtacar`) sempre
   * que uma magia de Necromancia é conjurada com espaço — o painel
   * fecha logo em seguida (mesmo `onEscolher`), então quem mostra o
   * banner de verdade é o `CombatTab` (que sobrevive ao fechamento). */
  onColheitaMacabraDisponivel: (cura: number) => void;
}

export default function AcaoPanelContent({
  aberto,
  desvantagemForcaDestreza,
  onEscolher,
  onAtacar,
  onAbrirSalvaguarda,
  gastarSlotCirculo,
  nivel,
  espacos,
  espacosGastosPorCirculo,
  classeAtivaNome,
  ponte,
  conjura,
  truques,
  magiasPreparadas,
  modAcertoConjuracao,
  truqueVinculadoAgonizante,
  modCarisma,
  numAtaques,
  ataquesFeitos,
  surtoMax,
  surtoRestantes,
  surtoUsadoTurno,
  onUsarSurto,
  ataqueAtual,
  temAtaqueImprudente,
  ataqueImprudenteAtivo,
  onAtivarAtaqueImprudente,
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
}: AcaoPanelContentProps) {
  const { rolarD20, rolarDados } = useRoll();
  const { picker, abrirLista } = useUsarMagiaPainel({
    aberto,
    desvantagemForcaDestreza,
    onEscolher,
    onAbrirSalvaguarda,
    gastarSlotCirculo,
    nivel,
    espacos,
    espacosGastosPorCirculo,
    classeAtivaNome,
    ponte,
    truques,
    magiasPreparadas,
    modAcertoConjuracao,
    truqueVinculadoAgonizante,
    modCarisma,
    colheitaMacabraDisponivel,
    onColheitaMacabraDisponivel,
  });

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

  /** `imprudente` — Ataque Imprudente (Bárbaro) já decidido pra esse
   * ataque (e o turno inteiro, ver `escolherAtaque`); só vira Vantagem
   * de verdade quando o ataque específico usa Força
   * (`ataque.usouForca`). Se coincidir com a Desvantagem de Armadura
   * sem treino, as duas se cancelam (`resolverVantagem`). */
  function rolarAtaque(
    nome: string,
    ataque: AtaqueInfo,
    finalizar: (nome: string, desc: string, dano: DanoPendente) => void,
    imprudente: boolean,
  ) {
    rolarD20({
      label: `Ataque — ${nome}`,
      formula: `1d20 + ${ataque.modAcerto}`,
      mod: ataque.modAcerto,
      explicacaoMod: ataque.explicacaoAcerto,
      vantagem: resolverVantagem(imprudente && ataque.usouForca, desvantagemForcaDestreza),
    });
    finalizar(`🗡 ${nome}`, `Rolagem de acerto feita. Toque "Rolar Dano" pra ver o dano ${ataque.danoTipo}.`, {
      label: `Dano — ${nome}`,
      quantidade: ataque.danoQuantidade,
      lados: ataque.danoLados,
      mod: ataque.danoMod,
      tipoDano: ataque.danoTipo,
    });
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
    rolarAtaque(`🗡 ${ataqueAtual.nome}`, ataqueAtual.info, onAtacar, ataqueImprudenteAtivo);
  }

  function escolherAtaque(imprudente: boolean) {
    if (!ataqueAtual) return;
    setEscolhendoAtaque(false);
    if (imprudente) onAtivarAtaqueImprudente();
    rolarAtaque(`🗡 ${ataqueAtual.nome}`, ataqueAtual.info, onAtacar, imprudente);
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
