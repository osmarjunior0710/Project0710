import iconeLevelUp from '../../../assets/icones-ui/level-up.png';
import AnelDeProgresso from '../../components/AnelDeProgresso';
import { xpCompacto } from '../../../core/experiencia';
import type { ReservaDadoVida } from '../../../core/dadosDeVida';
import InfoTexto from '../../components/InfoTexto';
import {
  resolverVantagem,
  type AtributoFinal,
  type ExplicacaoCalculo,
  type FerramentaFinal,
  type PericiaFinal,
  type SalvaguardaFinal,
} from '../../../core/calculoPersonagem';
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
  /** As 6 Salvaguardas (teste de resistência) — diferente do box de
   * "teste de atributo" logo acima, soma o Bônus de Proficiência
   * quando a classe original (nunca classe extra de multiclasse,
   * regra real) tiver aquela salvaguarda. Aparecem no topo da lista
   * de Perícias (mesmo padrão de linha/rolagem). */
  salvaguardas: SalvaguardaFinal[];
  pericias: PericiaFinal[];
  /** `true` = Armadura equipada (Leve/Média/Pesada) sem treinamento —
   * Desvantagem em D20 de Força ou Destreza (SDD "Penalidades por
   * Falta de Proficiência", ver `core/proficienciaArmadura.ts`).
   * Afeta o box de atributo FOR/DES, perícias de FOR/DES e Iniciativa
   * — não afeta INT/SAB/CAR nem outras perícias. */
  desvantagemForcaDestreza: boolean;
  /** Sentido de Perigo (Bárbaro, nível 2+) — Vantagem na Salvaguarda
   * de Destreza. Se coincidir com `desvantagemForcaDestreza` na mesma
   * rolagem, as duas se cancelam (`resolverVantagem`). */
  temSentidoDePerigo: boolean;
  proficienciasFerramenta: FerramentaFinal[];
  /** Dados de Vida por tipo (soma de todas as classes) — só leitura aqui;
   * gasta-se no Descanso Curto (`DadosDeVidaModal`). */
  reservaDadosDeVida: ReservaDadoVida[];
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
  /** `false` = já trocou desde o último Descanso Longo — ícone 🔄
   * travado até o próximo (regra real: 1 troca por Descanso Longo). */
  maestriaArmaTrocaDisponivel: boolean;
  /** Slot EXTRA de Maestria do talento Mestre das Armas — `null` = sem
   * o talento (ou talento sem arma escolhida ainda), seção não mostra
   * essa linha. Pool de troca mais amplo que `armasParaMaestria`
   * (qualquer arma que o personagem seja proficiente, não só o
   * catálogo nativo da classe) — ver `core/maestriaArma.ts`. */
  maestriaArmaExtra: string | null;
  armasElegiveisMaestriaExtra: Arma[];
  onTrocarMaestriaArmaExtra: (armaNova: string) => void;
  /** Mesma trava de `maestriaArmaTrocaDisponivel`, mas independente —
   * o talento concede a troca separadamente do slot nativo. */
  maestriaArmaTalentoTrocaDisponivel: boolean;
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
  salvaguardas,
  pericias,
  desvantagemForcaDestreza,
  temSentidoDePerigo,
  proficienciasFerramenta,
  reservaDadosDeVida,
  onAbrirLevelUp,
  xpAtual,
  proximoMarcoXp,
  podeLevelUpPelaXp,
  onAbrirXpPopup,
  maestriaArma,
  armasParaMaestria,
  onTrocarArmaMaestria,
  maestriaArmaTrocaDisponivel,
  maestriaArmaExtra,
  armasElegiveisMaestriaExtra,
  onTrocarMaestriaArmaExtra,
  maestriaArmaTalentoTrocaDisponivel,
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
        {/* Caixa inteira abre o popup de XP; 2 metades: Level (esq.) e anel de
            progresso de XP (dir.). Level Up (quando liberado) fica no anel. */}
        <div className={`box-solid ${styles.levelBox}`} onClick={onAbrirXpPopup}>
          <div className={styles.levelEsq}>
            <div className="label">Level</div>
            <div className={styles.levelNumero}>{nivel}</div>
          </div>
          <div className={styles.levelDir}>
            {podeLevelUpPelaXp ? (
              <div
                className={styles.levelUpAnel}
                onClick={(e) => {
                  e.stopPropagation();
                  onAbrirLevelUp();
                }}
              >
                {/* Passou do marco de XP: o selo de Level Up ocupa o lugar do anel. */}
                <img src={iconeLevelUp} alt="Level Up disponível" className={styles.levelUpSelo} />
              </div>
            ) : (
              <AnelDeProgresso
                valor={proximoMarcoXp ? xpAtual : 1}
                maximo={proximoMarcoXp ? proximoMarcoXp.xpNecessario : 1}
                ariaLabel={proximoMarcoXp ? `${xpAtual} de ${proximoMarcoXp.xpNecessario} XP` : `${xpAtual} XP (máximo)`}
              >
                <span style={{ fontSize: 12 }}>{xpCompacto(xpAtual)}</span>
                <span style={{ fontSize: 8, color: 'var(--text-faint)' }}>XP</span>
              </AnelDeProgresso>
            )}
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
              explicacaoMod: explicacaoIniciativa,
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
                explicacaoMod: a.explicacao,
                categoria: 'atributoOuSalvaguarda',
                permiteForcaIndomavel: a.atributo === 'FOR',
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

      {reservaDadosDeVida.length > 0 && (
        <>
          <div className="section-title">
            Dados de Vida{' '}
            <InfoTexto
              titulo="Dados de Vida"
              paragrafos={[
                'Você ganha 1 Dado de Vida por nível, do tipo da sua classe (d6, d8, d10 ou d12). Com mais de uma classe, os dados somam: os do mesmo tipo se combinam e os de tipos diferentes ficam separados.',
                'Servem pra se curar num Descanso Curto: cada dado gasto rola o dado + seu modificador de Constituição e recupera esse total em Pontos de Vida (mínimo 1).',
                'Não há limite de dados por descanso — só a quantidade que você ainda tem. Você pode gastar todos os que restarem, um de cada vez, e para quando quiser.',
                'O Descanso Longo devolve todos os Dados de Vida gastos (e todos os seus PV).',
              ]}
            />
          </div>
          <div className="box" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', padding: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            {reservaDadosDeVida.map((r) => (
              <div key={r.tipo} style={{ fontSize: 14 }}>
                {r.tipo}{' '}
                <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>
                  {r.restantes}/{r.total}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="section-title">Perícias</div>
      {salvaguardas.map((sv) => (
        <div
          key={`salvaguarda-${sv.atributo}`}
          className={styles.skillRow}
          onClick={() =>
            rolarD20({
              label: sv.explicacao.total.label,
              formula: `1d20 ${sv.mod >= 0 ? '+' : '-'} ${Math.abs(sv.mod)}`,
              mod: sv.mod,
              explicacaoMod: sv.explicacao,
              categoria: 'atributoOuSalvaguarda',
              permiteForcaIndomavel: sv.atributo === 'FOR',
              vantagem: resolverVantagem(
                temSentidoDePerigo && sv.atributo === 'DES',
                desvantagemForcaDestreza && (sv.atributo === 'FOR' || sv.atributo === 'DES'),
              ),
            })
          }
        >
          <span>
            {sv.proficiente ? '🔵' : '⚫'} {sv.explicacao.total.label}
            {temSentidoDePerigo && sv.atributo === 'DES' && (
              <span className="label" style={{ marginLeft: 4 }}>
                (Vantagem — Sentido de Perigo)
              </span>
            )}{' '}
            🎲{' '}
            <InfoValor titulo={sv.explicacao.total.label} explicacao={sv.explicacao} />
          </span>
          <span>
            {sv.mod >= 0 ? '+' : ''}
            {sv.mod}
          </span>
        </div>
      ))}
      {pericias.map((p) => (
        <div
          key={p.nome}
          className={styles.skillRow}
          onClick={() =>
            rolarD20({
              label: p.nome,
              formula: `1d20 ${p.mod >= 0 ? '+' : '-'} ${Math.abs(p.mod)}`,
              mod: p.mod,
              explicacaoMod: p.explicacao,
              categoria: 'atributoOuSalvaguarda',
              permiteForcaIndomavel: p.atributo === 'FOR',
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

      {(maestriaArma.length > 0 || maestriaArmaExtra) && (
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
                    desabilitado={!maestriaArmaTrocaDisponivel}
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
          {maestriaArmaExtra && (
            <div className={styles.maestriaRow}>
              <div className={styles.maestriaTop}>
                <span>
                  {maestriaArmaExtra} <span className="label">(Mestre das Armas)</span>
                </span>
                <TrocarArmaMaestria
                  armaAtual={maestriaArmaExtra}
                  todasAsArmas={armasElegiveisMaestriaExtra}
                  jaEscolhidas={[maestriaArmaExtra]}
                  onTrocar={onTrocarMaestriaArmaExtra}
                  desabilitado={!maestriaArmaTalentoTrocaDisponivel}
                />
              </div>
              {(() => {
                const arma = armasElegiveisMaestriaExtra.find((a) => a.nome === maestriaArmaExtra);
                return (
                  arma && (
                    <div className={styles.maestriaDetalhe}>
                      {arma.dano} ·{' '}
                      <ItemComDescricao nome={arma.maestria} descricao={buscarDescricaoMaestria(arma.maestria)} variante="icone" />
                    </div>
                  )
                );
              })()}
            </div>
          )}
          <div className="label" style={{ marginTop: 2, marginBottom: 12 }}>
            {maestriaArma.length > 0 &&
              (maestriaArmaTrocaDisponivel
                ? 'você pode trocar 1 arma a cada Descanso Longo. '
                : 'já trocou desde o último Descanso Longo — disponível de novo depois de descansar. ')}
            {maestriaArmaExtra &&
              (maestriaArmaTalentoTrocaDisponivel
                ? 'a arma do Mestre das Armas também troca 1x por Descanso Longo, à parte.'
                : 'a arma do Mestre das Armas já foi trocada — disponível de novo depois de descansar.')}
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

    </>
  );
}
