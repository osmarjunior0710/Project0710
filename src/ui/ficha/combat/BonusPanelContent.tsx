import { useState } from 'react';
import type { AtaqueResolvido } from '../../../core/ataque';
import type { Pet } from '../../../core/pets';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { OpcaoSubescolha } from '../../../data/rulesets/dnd2024/especies';
import type { AcaoBase } from '../../../data/exampleCombat';
import type { EspacoDeMagiaAtivo, PoolDePonte } from '../../../core/magiasPersonagem';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import { useUsarMagiaPainel } from './useUsarMagiaPainel';
import TickPips from '../../components/TickPips';
import styles from './PanelRows.module.css';

interface BonusPanelContentProps {
  usosFolegoMaximo: number;
  usosFolegoRestantes: number;
  onUsarRecuperarFolego: () => void;
  /** Aplica a cura de magia no PV E dispara o efeito visual de Cura
   * ("Me curar", ver `RollDadosOptions.confirmarAlvoCura` e
   * `FichaShell.tsx` `onCuraDeMagiaAplicada`). */
  onCuraDeMagiaAplicada: (total: number) => void;
  ataqueBonus: AtaqueResolvido | null;
  onUsarAtaqueBonus: () => void;
  /** Cortar (Mestre em Armas Grandes) — `null` = ainda não liberado
   * (esperando Crítico ou confirmação manual de "reduziu a 0 PV", ver
   * `CombatTab.tsx`). Mesma arma do ataque principal. */
  cortarAtaque: AtaqueResolvido | null;
  onUsarCortar: () => void;
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
  /** Fúria (Bárbaro) — ver sdd/sdd-barbaro-furia.md. `false` = classe
   * não tem esse recurso. O toggle aqui só ATIVA (gasta 1 uso); encerrar
   * já ativa acontece pelo card fixo da tela principal do Combate, não
   * aqui — este painel fecha assim que a Ação Bônus é gasta. */
  furiaDisponivel: boolean;
  furiaMaximo: number;
  furiaRestantes: number;
  furiaAtiva: boolean;
  onUsarFuria: () => void;
  /** Percorrer a Árvore (Bárbaro, Trilha da Árvore do Mundo, nível 14)
   * — `disponivel` = Fúria ativa + nível 14+. 2 cards (pedido do
   * Osmar, 2026-09): a versão BASE (18m) é um Ação Bônus normal, pode
   * usar todo turno (só a economia genérica de Ação Bônus trava);
   * "Longa Distância" (45m + até 6 criaturas) é 1x por FÚRIA
   * (`estendidaDisponivel`, reseta ao reativar). */
  percorrerArvoreDisponivel: boolean;
  percorrerArvoreEstendidaDisponivel: boolean;
  onUsarPercorrerArvore: () => void;
  onUsarPercorrerArvoreLongaDistancia: () => void;
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
  /** Ações genéricas do Cap. 1 (ex.: Procurar/Analisar) que algum
   * Talento Geral (Analítico/Mente Aguçada) também libera como Ação
   * Bônus — não substituem a lista de Ação normal, o jogador escolhe
   * qual usar a cada turno. Vazio = nenhum talento desse tipo. */
  acoesGenericasBonus: AcaoBase[];
  /** Mestre da Morte (Necromante, nível 14) — `false` = característica
   * ainda não desbloqueada, esconde a linha inteira. */
  mestreDaMorteDisponivel: boolean;
  /** Pets Morto-Vivo sob controle agora (pool da multi-seleção). */
  petsMortoVivo: Pet[];
  /** PV Temporário concedido a cada um dos marcados (ver
   * `bonusPvTempMestreDaMorte` em `core/necromante.ts`). */
  pvTempMestreDaMorte: number;
  onUsarMestreDaMorte: (petIds: string[]) => void;
  onEscolher: (nome: string, desc: string) => void;
  /** `SidePanel.open` do drawer — ver comentário em
   * `useUsarMagiaPainel.tsx` (reseta o picker de "Usar Magia" ao
   * fechar pela borda/backdrop, não só pelo "← Voltar" dele mesmo). */
  aberto: boolean;
  /** `true` = Armadura equipada sem treinamento — bloqueia conjurar
   * magia (SDD "Penalidades por Falta de Proficiência", ver
   * `core/proficienciaArmadura.ts`), mesma trava do painel de Ação. */
  desvantagemForcaDestreza: boolean;
  conjura: boolean;
  /** Truques/Magias Preparadas com Tempo de Conjuração "Ação Bônus" —
   * já filtrados em `useMagiasEConjuracao.ts` (`ehMagiaDeAcaoBonus`).
   * Poucos no catálogo hoje (Danação, Palavra Curativa, etc.). */
  truques: Magia[];
  magiasPreparadas: Magia[];
  /** Maestria de Magias (Mago, nível 18) — ver `useUsarMagiaPainel.tsx`. */
  maestriaDeMagiasAtuais: Record<number, string>;
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  onGastarSlotCirculo: (circulo: number, classeNome: string) => boolean;
  /** Nome da classe ATIVA — dona do pool acima. Ver `MagiasTab.tsx`. */
  classeAtivaNome: string;
  /** Ponte de Magia de Pacto (SDD Multiclasse seção 8.5) — `null` pra
   * quem não tem Bruxo + outra classe conjuradora ao mesmo tempo. */
  ponte: PoolDePonte | null;
  /** Nível do personagem — pro Aprimoramento de Truque. */
  nivel: number;
  modAcertoConjuracao: number | null;
  /** Quebra do `modAcertoConjuracao` pro popup de rolagem (B7) —
   * `null` nos mesmos casos que `modAcertoConjuracao`. */
  explicacaoAcertoConjuracao: ExplicacaoCalculo | null;
  /** NOME do truque vinculado a Explosão Agonizante + mod. de Carisma
   * — ver `MagiasTab.tsx`/`core/invocacoesMisticas.ts`. */
  truqueVinculadoAgonizante: string | undefined;
  modCarisma: number;
  /** Magia com `ataqueOuSalvaguarda` de tipo salvaguarda — abre o Modal
   * de Salvaguarda, que vive em CombatTab. */
  onAbrirSalvaguarda: (magia: Magia, circuloUsado: number) => void;
  /** Colheita Macabra (Necromante, nível 3+) — `true` = personagem tem
   * a característica. Ver `core/necromante.ts`. */
  colheitaMacabraDisponivel: boolean;
  onColheitaMacabraDisponivel: (cura: number) => void;
}

export default function BonusPanelContent({
  usosFolegoMaximo,
  usosFolegoRestantes,
  onUsarRecuperarFolego,
  ataqueBonus,
  onUsarAtaqueBonus,
  cortarAtaque,
  onUsarCortar,
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
  furiaDisponivel,
  furiaMaximo,
  furiaRestantes,
  furiaAtiva,
  onUsarFuria,
  percorrerArvoreDisponivel,
  percorrerArvoreEstendidaDisponivel,
  onUsarPercorrerArvore,
  onUsarPercorrerArvoreLongaDistancia,
  revelacaoCelestialDisponivel,
  revelacaoCelestialGasto,
  revelacaoCelestialFormaAtiva,
  opcoesRevelacaoCelestial,
  danoBonusRevelacaoCelestial,
  cdMantoNecrotico,
  onUsarRevelacaoCelestial,
  acoesGenericasBonus,
  mestreDaMorteDisponivel,
  petsMortoVivo,
  pvTempMestreDaMorte,
  onUsarMestreDaMorte,
  onEscolher,
  aberto,
  desvantagemForcaDestreza,
  conjura,
  truques,
  magiasPreparadas,
  maestriaDeMagiasAtuais,
  espacos,
  espacosGastosPorCirculo,
  onGastarSlotCirculo,
  classeAtivaNome,
  ponte,
  nivel,
  modAcertoConjuracao,
  explicacaoAcertoConjuracao,
  truqueVinculadoAgonizante,
  modCarisma,
  onAbrirSalvaguarda,
  onCuraDeMagiaAplicada,
  colheitaMacabraDisponivel,
  onColheitaMacabraDisponivel,
}: BonusPanelContentProps) {
  const [escolhendoFormaRevelacao, setEscolhendoFormaRevelacao] = useState(false);
  const [escolhendoMestreDaMorte, setEscolhendoMestreDaMorte] = useState(false);
  const [petsSelecionados, setPetsSelecionados] = useState<string[]>([]);
  const { picker, abrirLista } = useUsarMagiaPainel({
    aberto,
    desvantagemForcaDestreza,
    onEscolher,
    onAbrirSalvaguarda,
    gastarSlotCirculo: onGastarSlotCirculo,
    onCuraDeMagiaAplicada,
    nivel,
    espacos,
    espacosGastosPorCirculo,
    classeAtivaNome,
    ponte,
    truques,
    magiasPreparadas,
    maestriaDeMagiasAtuais,
    modAcertoConjuracao,
    explicacaoAcertoConjuracao,
    truqueVinculadoAgonizante,
    modCarisma,
    colheitaMacabraDisponivel,
    onColheitaMacabraDisponivel,
  });
  const temMagiaBonus = conjura && (truques.length > 0 || magiasPreparadas.length > 0);

  function toggleSelecaoMestreDaMorte(petId: string) {
    setPetsSelecionados((prev) => (prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]));
  }

  function confirmarMestreDaMorte() {
    onUsarMestreDaMorte(petsSelecionados);
    onEscolher(
      '💀 Mestre da Morte',
      `${petsSelecionados.length} Morto-Vivo(s) ganharam ${pvTempMestreDaMorte} PV Temporário — veja a aba Pets.`,
    );
    setEscolhendoMestreDaMorte(false);
    setPetsSelecionados([]);
  }

  if (picker) return picker;

  if (
    usosFolegoMaximo === 0 &&
    usosInspiracaoMaximo === 0 &&
    usosConhecimentoDePedrasMaximo === 0 &&
    usosPicoDeAdrenalinaMaximo === 0 &&
    !vooDraconicoDisponivel &&
    !saltoDaNuvemDisponivel &&
    !formaGrandeDisponivel &&
    !revelacaoCelestialDisponivel &&
    !furiaDisponivel &&
    !ataqueBonus &&
    !cortarAtaque &&
    !mestreDaMorteDisponivel &&
    !temMagiaBonus &&
    acoesGenericasBonus.length === 0
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

  if (escolhendoMestreDaMorte) {
    return (
      <>
        <div className="section-title">Mestre da Morte — escolha os Mortos-Vivos</div>
        <div className="label" style={{ marginBottom: 8 }}>
          Marque quem recebe {pvTempMestreDaMorte} PV Temporário (a até 18 metros) — o resultado aparece na aba Pets.
        </div>
        {petsMortoVivo.length === 0 ? (
          <div className="label" style={{ color: 'var(--text-faint)', marginBottom: 8 }}>
            Nenhum Morto-Vivo sob seu controle agora.
          </div>
        ) : (
          petsMortoVivo.map((pet) => (
            <div key={pet.id} className="check-row" onClick={() => toggleSelecaoMestreDaMorte(pet.id)}>
              <div className={`check-box ${petsSelecionados.includes(pet.id) ? 'checked' : ''}`} />
              <span className="check-label">{pet.nome}</span>
            </div>
          ))
        )}
        <div className={styles.row} onClick={() => setEscolhendoMestreDaMorte(false)}>
          <div className={styles.rowName}>← Voltar</div>
        </div>
        <div
          className="btn btn-primary"
          style={{
            marginTop: 8,
            padding: 12,
            textAlign: 'center',
            ...(petsSelecionados.length === 0 ? { opacity: 0.5, pointerEvents: 'none' } : {}),
          }}
          onClick={confirmarMestreDaMorte}
        >
          Confirmar ✓
        </div>
      </>
    );
  }

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
      {temMagiaBonus && (
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
                : 'Conjurar Truque ou Magia Preparada de Ação Bônus'}
            </div>
          )}
        </div>
      )}
      {usosInspiracaoMaximo > 0 && (
        <>
          <div className={styles.slotCounter}>
            <span>Inspiração de Bardo (d{tamanhoDadoInspiracao}):</span>
            <TickPips total={usosInspiracaoMaximo} usados={usosInspiracaoMaximo - usosInspiracaoRestantes} variante="mostarda" />
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
      {cortarAtaque && (
        <div className={styles.row} onClick={onUsarCortar}>
          <div className={styles.rowName}>🗡 Cortar — {cortarAtaque.nome}</div>
          <div className={styles.rowDesc}>
            Acerto Crítico ou reduziu o alvo a 0 PV — ataque extra com a mesma arma. {cortarAtaque.descricao}
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
      {furiaDisponivel && (
        <>
          <div className={styles.slotCounter}>
            <span>Fúria:</span>
            <TickPips total={furiaMaximo} usados={furiaMaximo - furiaRestantes} variante="vermelho" />
            <span style={{ color: 'var(--text-faint)' }}>
              {furiaRestantes}/{furiaMaximo} disponíveis
            </span>
          </div>
          <div
            className={`${styles.row} ${styles.toggleRowLine}`}
            style={furiaAtiva || furiaRestantes <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarFuria}
          >
            <div>
              <div className={styles.rowName}>😡 Fúria</div>
              {detalhesAtivo && (
                <div className={styles.rowDesc}>
                  Resistência a dano Contundente/Cortante/Perfurante, +dano em ataques baseados em Força, Vantagem em
                  testes/salvaguardas de Força — sem Concentração/magia. Encerra sozinha ao vestir Armadura Pesada, ou
                  manualmente pelo card fixo do Combate.
                </div>
              )}
            </div>
            <div className={`${styles.switchTrack} ${furiaAtiva ? styles.switchOn : ''}`}>
              <div className={styles.switchThumb} />
            </div>
          </div>
          {furiaAtiva && (
            <div className="label" style={{ marginTop: 6 }}>
              já ativa — encerre pelo card fixo na tela do Combate.
            </div>
          )}
          {!furiaAtiva && furiaRestantes <= 0 && (
            <div className="label" style={{ marginTop: 6 }}>
              sem usos disponíveis ({furiaMaximo} no total) — descanse pra recuperar.
            </div>
          )}
        </>
      )}
      {percorrerArvoreDisponivel && (
        <>
          <div className={styles.row} onClick={onUsarPercorrerArvore}>
            <div className={styles.rowName}>🌳 Percorrer a Árvore</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Teleporta a até 18m pra um espaço desocupado à sua vista, sem custo de recurso — pode usar todo
                turno, como qualquer Ação Bônus.
              </div>
            )}
          </div>
          <div
            className={styles.row}
            style={!percorrerArvoreEstendidaDisponivel ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={onUsarPercorrerArvoreLongaDistancia}
          >
            <div className={styles.rowName}>🌳 Percorrer a Árvore — Longa Distância</div>
            {detalhesAtivo && (
              <div className={styles.rowDesc}>
                Estende o alcance pra 45m e permite levar até 6 criaturas voluntárias a até 3m de você. 1x por
                Fúria.
              </div>
            )}
          </div>
          {!percorrerArvoreEstendidaDisponivel && (
            <div className="label" style={{ marginTop: 6 }}>
              Longa Distância já usada nesta Fúria — a versão de 18m continua livre, sem custo de recurso.
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
      {mestreDaMorteDisponivel && (
        <div className={styles.row} onClick={() => setEscolhendoMestreDaMorte(true)}>
          <div className={styles.rowName}>💀 Mestre da Morte</div>
          {detalhesAtivo && (
            <div className={styles.rowDesc}>
              Concede {pvTempMestreDaMorte} PV Temporário a Mortos-Vivos sob seu controle a até 18m, à sua escolha.
            </div>
          )}
        </div>
      )}
      {acoesGenericasBonus.map((a) => (
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
