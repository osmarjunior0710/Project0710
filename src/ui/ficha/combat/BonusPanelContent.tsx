import { useState } from 'react';
import type { AtaqueResolvido } from '../../../core/ataque';
import type { OpcaoSubescolha } from '../../../data/rulesets/dnd2024/especies';
import TickPips from '../../components/TickPips';
import styles from './PanelRows.module.css';

interface BonusPanelContentProps {
  usosFolegoMaximo: number;
  usosFolegoRestantes: number;
  onUsarRecuperarFolego: () => void;
  ataqueBonus: AtaqueResolvido | null;
  onUsarAtaqueBonus: () => void;
  usosInspiracaoMaximo: number;
  usosInspiracaoRestantes: number;
  tamanhoDadoInspiracao: number;
  fonteDeInspiracao: boolean;
  temEspacoDisponivel: boolean;
  /** Círculo que `onRecuperarInspiracaoComEspaco` vai gastar de
   * verdade (o de menor círculo com sobra) — `null` se não tiver
   * nenhum espaço disponível. */
  proximoCirculoParaGastar: number | null;
  onUsarInspiracao: () => void;
  onRecuperarInspiracaoComEspaco: () => void;
  detalhesAtivo: boolean;
  /** Conhecimento de Pedras (Anão) — 0 = espécie não é Anão. */
  usosConhecimentoDePedrasMaximo: number;
  usosConhecimentoDePedrasRestantes: number;
  onUsarConhecimentoDePedras: () => void;
  /** Pico de Adrenalina (Orc) — 0 = espécie não é Orc. */
  usosPicoDeAdrenalinaMaximo: number;
  usosPicoDeAdrenalinaRestantes: number;
  onUsarPicoDeAdrenalina: () => void;
  /** Voo Dracônico (Draconato, nível 5+) — `false` = não disponível. */
  vooDraconicoDisponivel: boolean;
  vooDraconicoGasto: boolean;
  onUsarVooDraconico: () => void;
  /** Salto da Nuvem (Golias, Ancestralidade Gigante) — só aparece
   * quando essa foi a opção escolhida na criação. */
  saltoDaNuvemDisponivel: boolean;
  usosSaltoDaNuvemMaximo: number;
  usosSaltoDaNuvemRestantes: number;
  onUsarSaltoDaNuvem: () => void;
  /** Forma Grande (Golias, nível 5+) — `false` = não disponível. */
  formaGrandeDisponivel: boolean;
  formaGrandeGasto: boolean;
  /** `true` = transformado agora. Diferente de `formaGrandeGasto`:
   * como o app não segue tempo real, quem ativa também controla
   * quando desliga (toggle) — ligar/desligar não mexe no uso gasto,
   * só o Descanso Longo desliga e devolve o uso junto. */
  formaGrandeAtiva: boolean;
  onUsarFormaGrande: () => void;
  /** Revelação Celestial (Aasimar, nível 3+) — natureza
   * `escolha_reutilizavel`: a forma é escolhida de novo a cada uso,
   * por isso as opções vêm daqui (não do wizard). */
  revelacaoCelestialDisponivel: boolean;
  revelacaoCelestialGasto: boolean;
  /** Forma ativa no momento (lembrança até o próximo Descanso Longo,
   * já que o app não rastreia tempo real) — `null` = nenhuma. */
  revelacaoCelestialFormaAtiva: string | null;
  opcoesRevelacaoCelestial: OpcaoSubescolha[];
  danoBonusRevelacaoCelestial: number;
  cdMantoNecrotico: number;
  onUsarRevelacaoCelestial: (formaEscolhida: string) => void;
}

export default function BonusPanelContent({
  usosFolegoMaximo,
  usosFolegoRestantes,
  onUsarRecuperarFolego,
  ataqueBonus,
  onUsarAtaqueBonus,
  usosInspiracaoMaximo,
  usosInspiracaoRestantes,
  tamanhoDadoInspiracao,
  fonteDeInspiracao,
  temEspacoDisponivel,
  proximoCirculoParaGastar,
  onUsarInspiracao,
  onRecuperarInspiracaoComEspaco,
  detalhesAtivo,
  usosConhecimentoDePedrasMaximo,
  usosConhecimentoDePedrasRestantes,
  onUsarConhecimentoDePedras,
  usosPicoDeAdrenalinaMaximo,
  usosPicoDeAdrenalinaRestantes,
  onUsarPicoDeAdrenalina,
  vooDraconicoDisponivel,
  vooDraconicoGasto,
  onUsarVooDraconico,
  saltoDaNuvemDisponivel,
  usosSaltoDaNuvemMaximo,
  usosSaltoDaNuvemRestantes,
  onUsarSaltoDaNuvem,
  formaGrandeDisponivel,
  formaGrandeGasto,
  formaGrandeAtiva,
  onUsarFormaGrande,
  revelacaoCelestialDisponivel,
  revelacaoCelestialGasto,
  revelacaoCelestialFormaAtiva,
  opcoesRevelacaoCelestial,
  danoBonusRevelacaoCelestial,
  cdMantoNecrotico,
  onUsarRevelacaoCelestial,
}: BonusPanelContentProps) {
  const [escolhendoFormaRevelacao, setEscolhendoFormaRevelacao] = useState(false);

  if (
    usosFolegoMaximo === 0 &&
    usosInspiracaoMaximo === 0 &&
    usosConhecimentoDePedrasMaximo === 0 &&
    usosPicoDeAdrenalinaMaximo === 0 &&
    !vooDraconicoDisponivel &&
    !saltoDaNuvemDisponivel &&
    !formaGrandeDisponivel &&
    !revelacaoCelestialDisponivel &&
    !ataqueBonus
  ) {
    return (
      <div className="box" style={{ padding: 14, color: 'var(--text-faint)', fontSize: 12, textAlign: 'center' }}>
        Nenhuma ação bônus disponível pra este personagem no nível atual.
      </div>
    );
  }

  const semUsos = usosFolegoRestantes <= 0;
  const semUsosInspiracao = usosInspiracaoRestantes <= 0;
  const nadaParaRecuperar = usosInspiracaoRestantes >= usosInspiracaoMaximo;
  const recuperarDesabilitado = !temEspacoDisponivel || nadaParaRecuperar;

  if (escolhendoFormaRevelacao) {
    return (
      <>
        <div className="section-title">Revelação Celestial — escolha a forma</div>
        {opcoesRevelacaoCelestial.map((opcao) => (
          <div
            key={opcao.nome}
            className="opt-card"
            onClick={() => {
              onUsarRevelacaoCelestial(opcao.nome);
              setEscolhendoFormaRevelacao(false);
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="opt-card-name">{opcao.nome}</span>
              {opcao.tipoDano && <span className="label">Dano {opcao.tipoDano}</span>}
            </div>
            {opcao.descricaoEfeito && <div className="opt-card-desc">{opcao.descricaoEfeito}</div>}
          </div>
        ))}
        <div className="label" style={{ marginTop: 4 }}>
          Enquanto transformado: 1x por turno, ao causar dano com ataque ou magia, some +{danoBonusRevelacaoCelestial}{' '}
          de dano do tipo acima. Manto Necrótico também impõe Amedrontado (CD {cdMantoNecrotico}) a quem chegar perto.
        </div>
        <div className={styles.row} onClick={() => setEscolhendoFormaRevelacao(false)}>
          <div className={styles.rowName}>← Voltar</div>
        </div>
      </>
    );
  }

  return (
    <>
      {usosInspiracaoMaximo > 0 && (
        <>
          <div className={styles.slotCounter}>
            <span>Inspiração de Bardo (d{tamanhoDadoInspiracao}):</span>
            <TickPips total={usosInspiracaoMaximo} usados={usosInspiracaoMaximo - usosInspiracaoRestantes} />
            <span style={{ color: 'var(--text-faint)' }}>
              {usosInspiracaoRestantes}/{usosInspiracaoMaximo} disponíveis
            </span>
          </div>
          <div
            className={styles.row}
            style={semUsosInspiracao ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarInspiracao}
          >
            <div className={styles.rowName}>🎵 Inspiração de Bardo</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Concede 1 dado de Inspiração (d{tamanhoDadoInspiracao}) a uma criatura que veja/ouça você a até 18m.
                Gasta 1 uso — recupera tudo no Descanso Longo
                {fonteDeInspiracao ? ' (e no Curto, com Fonte de Inspiração)' : ''}.
              </div>
            )}
          </div>
          {fonteDeInspiracao && (
            <div
              className={styles.row}
              style={recuperarDesabilitado ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
              onClick={onRecuperarInspiracaoComEspaco}
            >
              <div className={styles.rowName}>🔁 Fonte de Inspiração</div>
              <div className={styles.rowDesc}>Recupera Inspiração com Espaço de Magia</div>
              {detalhesAtivo && (
                <div className={styles.rowDesc}>
                  Sem ação necessária — gasta 1 Espaço de Magia pra recuperar 1 uso gasto de Inspiração de Bardo
                  (Fonte de Inspiração).
                </div>
              )}
              {proximoCirculoParaGastar !== null && (
                <div className={styles.rowDesc} style={{ color: 'var(--text-faint)' }}>
                  Espaço de magia do {proximoCirculoParaGastar}º círculo será gasto.
                </div>
              )}
            </div>
          )}
          {semUsosInspiracao && (
            <div className="label" style={{ marginTop: 2, marginBottom: 6 }}>
              sem usos de Inspiração disponíveis — descanse pra recuperar
              {fonteDeInspiracao && temEspacoDisponivel ? ' ou gaste um Espaço de Magia acima' : ''}.
            </div>
          )}
        </>
      )}
      {ataqueBonus && (
        <div className={styles.row} onClick={onUsarAtaqueBonus}>
          <div className={styles.rowName}>🗡 Atacar — {ataqueBonus.nome} (Mão Secundária)</div>
          <div className={styles.rowDesc}>
            {ataqueBonus.descricao}
            {detalhesAtivo && ' Propriedade Leve nas duas mãos: sem bônus de atributo no dano (a menos que seja negativo).'}
          </div>
        </div>
      )}
      {usosFolegoMaximo > 0 && (
        <>
          <div className={styles.slotCounter}>
            <span>Recuperar Fôlego:</span>
            <TickPips total={usosFolegoMaximo} usados={usosFolegoMaximo - usosFolegoRestantes} />
            <span style={{ color: 'var(--text-faint)' }}>
              {usosFolegoRestantes}/{usosFolegoMaximo} disponíveis
            </span>
          </div>
          <div
            className={styles.row}
            style={semUsos ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarRecuperarFolego}
          >
            <div className={styles.rowName}>🩹 Recuperar Fôlego</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Recupera 1d10 + seu nível de Guerreiro em Pontos de Vida. Gasta 1 uso — 1 volta no Descanso Curto,
                todos no Descanso Longo.
              </div>
            )}
          </div>
          {semUsos && (
            <div className="label" style={{ marginTop: 6 }}>
              sem usos disponíveis — descanse pra recuperar.
            </div>
          )}
        </>
      )}
      {usosConhecimentoDePedrasMaximo > 0 && (
        <>
          <div className={styles.slotCounter}>
            <span>Conhecimento de Pedras:</span>
            <TickPips total={usosConhecimentoDePedrasMaximo} usados={usosConhecimentoDePedrasMaximo - usosConhecimentoDePedrasRestantes} />
            <span style={{ color: 'var(--text-faint)' }}>
              {usosConhecimentoDePedrasRestantes}/{usosConhecimentoDePedrasMaximo} disponíveis
            </span>
          </div>
          <div
            className={styles.row}
            style={usosConhecimentoDePedrasRestantes <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarConhecimentoDePedras}
          >
            <div className={styles.rowName}>🪨 Conhecimento de Pedras</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Adquire Sismiconsciência (18m) por 10 minutos — precisa estar em/tocando pedra. Gasta 1 uso, todos
                voltam no Descanso Longo.
              </div>
            )}
          </div>
          {usosConhecimentoDePedrasRestantes <= 0 && (
            <div className="label" style={{ marginTop: 6 }}>
              sem usos disponíveis — descanse pra recuperar.
            </div>
          )}
        </>
      )}
      {usosPicoDeAdrenalinaMaximo > 0 && (
        <>
          <div className={styles.slotCounter}>
            <span>Pico de Adrenalina:</span>
            <TickPips total={usosPicoDeAdrenalinaMaximo} usados={usosPicoDeAdrenalinaMaximo - usosPicoDeAdrenalinaRestantes} />
            <span style={{ color: 'var(--text-faint)' }}>
              {usosPicoDeAdrenalinaRestantes}/{usosPicoDeAdrenalinaMaximo} disponíveis
            </span>
          </div>
          <div
            className={styles.row}
            style={usosPicoDeAdrenalinaRestantes <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarPicoDeAdrenalina}
          >
            <div className={styles.rowName}>⚡ Pico de Adrenalina</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Executa a ação Correr como Ação Bônus e concede PV Temporário igual ao seu Bônus de Proficiência.
                Gasta 1 uso — todos voltam no Descanso Curto ou Longo.
              </div>
            )}
          </div>
          {usosPicoDeAdrenalinaRestantes <= 0 && (
            <div className="label" style={{ marginTop: 6 }}>
              sem usos disponíveis — descanse pra recuperar.
            </div>
          )}
        </>
      )}
      {vooDraconicoDisponivel && (
        <>
          <div
            className={styles.row}
            style={vooDraconicoGasto ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarVooDraconico}
          >
            <div className={styles.rowName}>🐲 Voo Dracônico</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Cria asas espectrais — Deslocamento de Voo igual ao seu Deslocamento por 10 minutos ou até retrair.
                1x — recupera no Descanso Longo.
              </div>
            )}
          </div>
          {vooDraconicoGasto && (
            <div className="label" style={{ marginTop: 6 }}>
              já usado — descanse pra recuperar.
            </div>
          )}
        </>
      )}
      {saltoDaNuvemDisponivel && (
        <>
          <div className={styles.slotCounter}>
            <span>Salto da Nuvem:</span>
            <TickPips total={usosSaltoDaNuvemMaximo} usados={usosSaltoDaNuvemMaximo - usosSaltoDaNuvemRestantes} />
            <span style={{ color: 'var(--text-faint)' }}>
              {usosSaltoDaNuvemRestantes}/{usosSaltoDaNuvemMaximo} disponíveis
            </span>
          </div>
          <div
            className={styles.row}
            style={usosSaltoDaNuvemRestantes <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarSaltoDaNuvem}
          >
            <div className={styles.rowName}>☁️ Salto da Nuvem</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Teleporte-se magicamente até 9m pra um espaço desocupado à sua vista. Gasta 1 uso — todos voltam no
                Descanso Longo.
              </div>
            )}
          </div>
          {usosSaltoDaNuvemRestantes <= 0 && (
            <div className="label" style={{ marginTop: 6 }}>
              sem usos disponíveis — descanse pra recuperar.
            </div>
          )}
        </>
      )}
      {formaGrandeDisponivel && (
        <>
          <div
            className={`${styles.row} ${styles.toggleRowLine}`}
            style={formaGrandeGasto && !formaGrandeAtiva ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarFormaGrande}
          >
            <div>
              <div className={styles.rowName}>🗿 Forma Grande</div>
              {detalhesAtivo && (
                <div className={styles.rowDesc}>
                  Tamanho vira Grande — Vantagem em testes de Força, Deslocamento +3m e +1 tamanho na Capacidade de
                  Carga enquanto ativa. Sem tempo real no app: você mesmo liga/desliga (desligar não devolve o uso).
                  1x — recupera (e desliga sozinha) no Descanso Longo.
                </div>
              )}
            </div>
            <div className={`${styles.switchTrack} ${formaGrandeAtiva ? styles.switchOn : ''}`}>
              <div className={styles.switchThumb} />
            </div>
          </div>
          {formaGrandeGasto && !formaGrandeAtiva && (
            <div className="label" style={{ marginTop: 6 }}>
              já usado — descanse pra recuperar.
            </div>
          )}
        </>
      )}
      {revelacaoCelestialDisponivel && (
        <>
          {revelacaoCelestialFormaAtiva ? (
            <div className="box" style={{ padding: 10, marginBottom: 8 }}>
              <div className={styles.rowName}>🔒 Transformado: {revelacaoCelestialFormaAtiva}</div>
              <div className={styles.rowDesc}>
                {opcoesRevelacaoCelestial.find((o) => o.nome === revelacaoCelestialFormaAtiva)?.descricaoEfeito}
              </div>
              <div className="label" style={{ marginTop: 4 }}>
                Lembrete até o Descanso Longo — some +{danoBonusRevelacaoCelestial} de dano 1x por turno ao acertar.
              </div>
            </div>
          ) : (
            <div
              className={styles.row}
              style={revelacaoCelestialGasto ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
              onClick={() => setEscolhendoFormaRevelacao(true)}
            >
              <div className={styles.rowName}>✨ Revelação Celestial</div>
              {detalhesAtivo && (
                <div className={styles.rowDesc}>
                  Transforme-se — escolha 1 de 3 formas. Dura até o Descanso Longo (o app não segue tempo real). 1x —
                  recupera no Descanso Longo.
                </div>
              )}
            </div>
          )}
          {revelacaoCelestialGasto && !revelacaoCelestialFormaAtiva && (
            <div className="label" style={{ marginTop: 6 }}>
              já usado — descanse pra recuperar.
            </div>
          )}
        </>
      )}
    </>
  );
}
