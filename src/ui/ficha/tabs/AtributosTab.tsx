import type { AtributoFinal, ExplicacaoCalculo, FerramentaFinal, PericiaFinal } from '../../../core/calculoPersonagem';
import type { Arma } from '../../../data/rulesets/dnd2024/armas';
import { buscarDescricaoMaestria } from '../../../data/rulesets/dnd2024/propriedadesMaestria';
import { NOME_SENTIDO, type TipoSentido } from '../../../data/rulesets/dnd2024/sentidos';
import { sentidosAtivos } from '../../../core/sentidos';
import { tiposElegiveisResistenciaInfera } from '../../../core/resistenciaInfera';
import { useRoll } from '../../roll/RollContext';
import InfoValor from '../../components/InfoValor';
import ItemComDescricao from '../../components/ItemComDescricao';
import TickPips from '../../components/TickPips';
import TrocarArmaMaestria from '../../components/TrocarArmaMaestria';
import TrocarValorSimples from '../../components/TrocarValorSimples';
import styles from './AtributosTab.module.css';

interface AtributosTabProps {
  nivel: number;
  pvMax: number;
  pvAtual: number;
  ca: number | null;
  iniciativa: number | null;
  percepcaoPassiva: number | null;
  bonusProficiencia: number;
  explicacaoPv: ExplicacaoCalculo;
  explicacaoCa: ExplicacaoCalculo;
  explicacaoIniciativa: ExplicacaoCalculo;
  explicacaoPercepcaoPassiva: ExplicacaoCalculo;
  atributos: AtributoFinal[];
  pericias: PericiaFinal[];
  /** `true` = Armadura equipada (Leve/Média/Pesada) sem treinamento —
   * Desvantagem em D20 de Força ou Destreza (SDD "Penalidades por
   * Falta de Proficiência", ver `core/proficienciaArmadura.ts`).
   * Afeta o box de atributo FOR/DES, perícias de FOR/DES e Iniciativa
   * — não afeta INT/SAB/CAR nem outras perícias. */
  desvantagemForcaDestreza: boolean;
  proficienciasFerramenta: FerramentaFinal[];
  onDescansoLongo: () => void;
  onDescansoCurto: () => void;
  restStatus: string | null;
  onAbrirLevelUp: () => void;
  /** XP acumulado (ver `core/experiencia.ts`) — a "barra de xp" (toda
   * a área é clicável, abre popup de lançar XP em `XpShell.tsx`) e a
   * seta ⬆️ de Level Up só aparecem quando o XP já bate o marco do
   * próximo nível. "⚡ Level Up Rápido" (ferramenta de teste, ignora
   * XP de propósito) mudou de lugar — agora fica no menu do avatar
   * (`AvatarMenu.tsx`), pedido do Osmar (2026-09). */
  xpAtual: number;
  proximoMarcoXp: { nivel: number; xpNecessario: number } | null;
  podeLevelUpPelaXp: boolean;
  onAbrirXpPopup: () => void;
  maestriaArma: string[];
  armasParaMaestria: Arma[];
  onTrocarArmaMaestria: (armaAntiga: string, armaNova: string) => void;
  onRolarIniciativa?: () => void;
  /** Sentidos Especiais (Visão no Escuro/às Cegas/Verdadeira,
   * Sismiconsciência) já somados de espécie + Invocações Místicas —
   * ver `core/sentidos.ts`. Seção some sozinha se tudo for 0. */
  sentidos: Record<TipoSentido, number>;
  /** Resistência Ínfera (Bruxo, Patrono Ínfero, nível 10) — `null` =
   * característica não desbloqueada, seção some. */
  resistenciaInferaDisponivel: boolean;
  /** `null` = ainda não escolheu nenhum tipo. */
  resistenciaInferaAtual: string | null;
  /** `true` = já trocada desde o último Descanso — ícone 🔄 travado
   * até o próximo Descanso Curto ou Longo. */
  resistenciaInferaGasto: boolean;
  onTrocarResistenciaInfera: (tipo: string) => void;
  /** `true` só pra espécie Orc — controla se a seção aparece. */
  temVigorImplacavel: boolean;
  /** `true` = já disparou desde o último Descanso Longo. */
  vigorImplacavelGasto: boolean;
  /** Inspiração Heroica (recurso universal, flag booleano — nunca
   * contador). O jogador liga/desliga tocando na caixa. */
  inspiracaoHeroicaAtiva: boolean;
  onAlternarInspiracaoHeroica: () => void;
}

export default function AtributosTab({
  nivel,
  pvMax,
  pvAtual,
  ca,
  iniciativa,
  percepcaoPassiva,
  bonusProficiencia,
  explicacaoPv,
  explicacaoCa,
  explicacaoIniciativa,
  explicacaoPercepcaoPassiva,
  atributos,
  pericias,
  desvantagemForcaDestreza,
  proficienciasFerramenta,
  onDescansoLongo,
  onDescansoCurto,
  restStatus,
  onAbrirLevelUp,
  xpAtual,
  proximoMarcoXp,
  podeLevelUpPelaXp,
  onAbrirXpPopup,
  maestriaArma,
  armasParaMaestria,
  onTrocarArmaMaestria,
  onRolarIniciativa,
  sentidos,
  resistenciaInferaDisponivel,
  resistenciaInferaAtual,
  resistenciaInferaGasto,
  onTrocarResistenciaInfera,
  temVigorImplacavel,
  vigorImplacavelGasto,
  inspiracaoHeroicaAtiva,
  onAlternarInspiracaoHeroica,
}: AtributosTabProps) {
  const { rolarD20 } = useRoll();
  const sentidosParaExibir = sentidosAtivos(sentidos);

  return (
    <>
      <div className={styles.topRow}>
        <div className={`box-solid ${styles.levelBox}`}>
          <div>
            <div className="label">
              nível
              <br />
              atual
            </div>
            <div style={{ fontSize: 17 }}>{nivel}</div>
          </div>
          <div className={styles.xpArea}>
            {podeLevelUpPelaXp && (
              <div className="btn btn-primary" style={{ padding: '6px 10px' }} onClick={onAbrirLevelUp}>
                ⬆️ Level Up
              </div>
            )}
            <div className={styles.xpChip} onClick={onAbrirXpPopup}>
              <div className={styles.xpBarTrack}>
                <div
                  className={styles.xpBarFill}
                  style={{
                    width: proximoMarcoXp
                      ? `${Math.min(100, (xpAtual / proximoMarcoXp.xpNecessario) * 100)}%`
                      : '100%',
                  }}
                />
              </div>
              <div className={styles.xpChipLabel}>
                {proximoMarcoXp ? `${xpAtual}/${proximoMarcoXp.xpNecessario} XP` : `${xpAtual} XP (máx.)`}
              </div>
            </div>
          </div>
        </div>
        <div className={`box ${styles.hpBox}`}>
          <div className="label">
            PV <InfoValor titulo="Pontos de Vida máximos" explicacao={explicacaoPv} />
          </div>
          <div className={styles.hpNum}>
            {pvAtual}/{pvMax}
          </div>
        </div>
        <div className={`box ${styles.hpBox} ${styles.hpBoxAccent}`} onClick={onAlternarInspiracaoHeroica}>
          <div className="label">
            Ins.
            <br />
            Her.
          </div>
          <div className={styles.hpPipRow}>
            <TickPips total={1} usados={inspiracaoHeroicaAtiva ? 0 : 1} tamanho="lg" />
          </div>
        </div>
      </div>

      <div className={styles.hpRow}>
        <div className={`box ${styles.hpBox}`}>
          <div className="label">
            Bônus
            <br />
            Prof.
          </div>
          <div className={styles.hpNum}>
            {bonusProficiencia >= 0 ? '+' : ''}
            {bonusProficiencia}
          </div>
        </div>
        <div className={`box ${styles.hpBox}`}>
          <div className="label">
            Percepção
            <br />
            Passiva <InfoValor titulo="Percepção Passiva" explicacao={explicacaoPercepcaoPassiva} />
          </div>
          <div className={styles.hpNum}>{percepcaoPassiva ?? '—'}</div>
        </div>
        <div className={`box ${styles.hpBox}`}>
          <div className="label">
            CA <InfoValor titulo="Classe de Armadura" explicacao={explicacaoCa} />
          </div>
          <div className={styles.hpNum}>{ca ?? '—'}</div>
        </div>
        <div
          className={`box ${styles.hpBox} ${styles.hpBoxAccent}`}
          onClick={() => {
            if (iniciativa === null) return;
            rolarD20({
              label: 'Iniciativa',
              formula: `1d20 + ${iniciativa}`,
              mod: iniciativa,
              vantagem: desvantagemForcaDestreza ? 'desvantagem' : undefined,
            });
            onRolarIniciativa?.();
          }}
        >
          <div className="label">
            Iniciativa <InfoValor titulo="Iniciativa" explicacao={explicacaoIniciativa} />
          </div>
          <div className={styles.hpNum}>{iniciativa !== null ? `${iniciativa >= 0 ? '+' : ''}${iniciativa}` : '—'}</div>
        </div>
      </div>

      <div className="stat-grid">
        {atributos.map((a) => (
          <div
            key={a.atributo}
            className={`box stat-box ${styles.hpBoxAccent}`}
            onClick={() =>
              rolarD20({
                label: a.atributo,
                formula: `1d20 ${a.mod >= 0 ? '+' : '-'} ${Math.abs(a.mod)}`,
                mod: a.mod,
                categoria: 'atributoOuSalvaguarda',
                vantagem:
                  desvantagemForcaDestreza && (a.atributo === 'FOR' || a.atributo === 'DES') ? 'desvantagem' : undefined,
              })
            }
          >
            <div className="stat-name">{a.atributo}</div>
            <div className="stat-mod">{a.valor}</div>
            <div className="stat-val">
              {a.mod >= 0 ? '+' : ''}
              {a.mod}
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Perícias</div>
      {pericias.map((p) => (
        <div
          key={p.nome}
          className={styles.skillRow}
          onClick={() =>
            rolarD20({
              label: p.nome,
              formula: `1d20 ${p.mod >= 0 ? '+' : '-'} ${Math.abs(p.mod)}`,
              mod: p.mod,
              categoria: 'atributoOuSalvaguarda',
              vantagem:
                desvantagemForcaDestreza && (p.atributo === 'FOR' || p.atributo === 'DES') ? 'desvantagem' : undefined,
            })
          }
        >
          <span>
            {p.proficiente ? '🔵' : '⚫'} {p.especialista && '⭐ '}
            {p.nome} ({p.atributo}) 🎲 <InfoValor titulo={p.nome} explicacao={p.explicacao} />
          </span>
          <span>
            {p.mod >= 0 ? '+' : ''}
            {p.mod}
          </span>
        </div>
      ))}
      <div className="label" style={{ marginTop: 6, marginBottom: 12 }}>
        toque num atributo, perícia ou iniciativa pra rolar o dado.
      </div>

      {proficienciasFerramenta.length > 0 && (
        <>
          <div style={{ borderTop: '1px dashed var(--line)', margin: '4px 0 12px' }} />
          <div className="section-title">Proficiência com Ferramentas</div>
          {proficienciasFerramenta.map((f) => (
            <div key={f.nome} className={styles.skillRow}>
              <span>
                {f.nome}
                {f.atributo ? ` (${f.atributo})` : ''} <InfoValor titulo={f.nome} explicacao={f.explicacao} />
              </span>
              <span>
                {f.mod >= 0 ? '+' : ''}
                {f.mod}
              </span>
            </div>
          ))}
          <div className="label" style={{ marginTop: 6, marginBottom: 12 }}>
            valor = mod. de atributo da ferramenta + Bônus de Proficiência.
          </div>
        </>
      )}

      {maestriaArma.length > 0 && (
        <>
          <div className="section-title">Maestria em Arma</div>
          {maestriaArma.map((nome) => {
            const arma = armasParaMaestria.find((a) => a.nome === nome);
            return (
              <div key={nome} className={styles.maestriaRow}>
                <div className={styles.maestriaTop}>
                  <span>{nome}</span>
                  <TrocarArmaMaestria
                    armaAtual={nome}
                    todasAsArmas={armasParaMaestria}
                    jaEscolhidas={maestriaArma}
                    onTrocar={(nova) => onTrocarArmaMaestria(nome, nova)}
                  />
                </div>
                {arma && (
                  <div className={styles.maestriaDetalhe}>
                    {arma.dano} ·{' '}
                    <ItemComDescricao nome={arma.maestria} descricao={buscarDescricaoMaestria(arma.maestria)} variante="icone" />
                  </div>
                )}
              </div>
            );
          })}
          <div className="label" style={{ marginTop: 2, marginBottom: 12 }}>
            você pode trocar 1 arma a cada Descanso Longo.
          </div>
        </>
      )}

      {sentidosParaExibir.length > 0 && (
        <>
          <div className="section-title">Sentidos</div>
          {sentidosParaExibir.map(({ tipo, alcanceMetros }) => (
            <div key={tipo} className={styles.skillRow}>
              <span>{NOME_SENTIDO[tipo]}</span>
              <span>{alcanceMetros}m</span>
            </div>
          ))}
          <div className="label" style={{ marginTop: 6, marginBottom: 12 }}>
            já soma espécie + Invocações Místicas — o maior valor entre as fontes do mesmo tipo.
          </div>
        </>
      )}

      {resistenciaInferaDisponivel && (
        <>
          <div className="section-title">Resistência Ínfera</div>
          <div className={styles.maestriaRow}>
            <div className={styles.maestriaTop}>
              <span>{resistenciaInferaAtual ?? 'nenhum tipo escolhido'}</span>
              <TrocarValorSimples
                titulo="Resistência Ínfera — escolher tipo de dano"
                valorAtual={resistenciaInferaAtual ?? ''}
                opcoes={tiposElegiveisResistenciaInfera()}
                onTrocar={onTrocarResistenciaInfera}
                desabilitado={resistenciaInferaGasto}
              />
            </div>
          </div>
          <div className="label" style={{ marginTop: 2, marginBottom: 12 }}>
            {resistenciaInferaGasto
              ? 'Já trocada — disponível de novo após Descanso Curto ou Longo.'
              : 'Toque no 🔄 pra escolher — trava até o próximo Descanso Curto ou Longo.'}{' '}
            Informativo: a Ficha ainda não calcula dano recebido sozinha, então a redução é aplicada de cabeça na
            mesa.
          </div>
        </>
      )}

      {temVigorImplacavel && (
        <>
          <div className="section-title">Vigor Implacável</div>
          <div className="label" style={{ marginBottom: 12 }}>
            {vigorImplacavelGasto
              ? 'Já usado — disponível de novo após Descanso Longo.'
              : 'Disponível — ao ser reduzido a 0 PV, você fica com 1 em vez disso (automático, sem precisar tocar em nada).'}
          </div>
        </>
      )}

      <div className="section-title">Descanso</div>
      <div className={styles.actionGrid}>
        <div className={`box ${styles.actionBtn}`} onClick={onDescansoCurto}>
          <div className={styles.aName}>Descanso Curto</div>
          <div className={styles.aType}>1 hora</div>
        </div>
        <div className={`box ${styles.actionBtn}`} onClick={onDescansoLongo}>
          <div className={styles.aName}>Descanso Longo</div>
          <div className={styles.aType}>8 horas</div>
        </div>
      </div>
      {restStatus && <div className={styles.restStatus}>{restStatus}</div>}
    </>
  );
}
