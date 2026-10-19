import InfoValor from '../components/InfoValor';
import { useRoll } from './RollContext';
import styles from './RollOverlay.module.css';
import { artePorLados } from './dadosArte';
import { armazenamentoHouseRules } from '../../core/houseRules';

interface DadoVisualProps {
  valor: number | string;
  lados?: number;
  className?: string;
  onClick?: () => void;
}

/** `'🎲'` é só o placeholder de "ainda rolando" (ver RollContext) —
 * agora que o dado tem arte própria, a animação da imagem já comunica
 * isso sozinha, não precisa mais do emoji girando por cima. */
function DadoVisual({ valor, lados, className, onClick }: DadoVisualProps) {
  const arte = artePorLados(lados);
  return (
    <div className={`${styles.die} ${arte ? styles.dieComArte : ''} ${className ?? ''}`} onClick={onClick}>
      {arte && <img src={arte} alt="" className={styles.dieArtImg} />}
      <span className={styles.dieValue}>{arte && valor === '🎲' ? '' : valor}</span>
    </div>
  );
}

/** Quebra em grupos de 4 (esquerda→direita, mesma regra de sempre do
 * grid) — cada grupo vira sua própria linha `flex`, centralizada
 * (`justify-content: center`), pra um grupo de 1-3 dados no final
 * ficar centralizado em vez de grudado à esquerda com espaço vazio à
 * direita. Grupo de 4 preenche a linha toda, visualmente idêntico ao
 * grid antigo. */
function agruparEmLinhas<T>(itens: T[], porLinha: number): T[][] {
  const linhas: T[][] = [];
  for (let i = 0; i < itens.length; i += porLinha) {
    linhas.push(itens.slice(i, i + porLinha));
  }
  return linhas;
}

export default function RollOverlay() {
  const {
    estado,
    escolherVantagemPosRolagem,
    fechar,
    bonusExtraDisponivel,
    aplicarBonusExtra,
    sorteDisponivel,
    usarSorte,
    sortudoDisponivel,
    sortudoRestantes,
    usarSortudo,
    opcaoDadoPsionico,
    usarDadoPsionico,
    resolverDadoPsionico,
    ofertaSurtoPsionico,
    aplicarSurtoPsionico,
    rolarConfirmacaoCritico,
    usarRerollSe1,
    rerollDadoEscolhido,
    trocarOfertaDeDado,
    inspiracaoHeroicaDisponivel,
    usarInspiracaoHeroica,
    sobreviventeDisciplinadoDisponivel,
    usarSobreviventeDisciplinado,
  } = useRoll();

  if (!estado) return null;

  const exigeConfirmacao =
    estado.fase === 'concluido' &&
    !!estado.confirmarAcerto &&
    estado.critico !== null &&
    !estado.confirmacaoCritico &&
    armazenamentoHouseRules.carregar().confirmacaoCritico;

  const critClass =
    estado.critico === 'falha' ? styles.dieCritFail : estado.critico === 'sucesso' ? styles.dieCritSuccess : '';

  const temSegundoDado = estado.dado2 != null;
  const dado1Num = typeof estado.valorDado === 'number' ? estado.valorDado : null;
  const dado2Num = typeof estado.dado2 === 'number' ? estado.dado2 : null;
  let dado1Descartado = false;
  let dado2Descartado = false;
  if (dado1Num !== null && dado2Num !== null && estado.vantagem) {
    const usado = estado.vantagem === 'vantagem' ? Math.max(dado1Num, dado2Num) : Math.min(dado1Num, dado2Num);
    dado1Descartado = dado1Num !== usado;
    dado2Descartado = dado2Num !== usado;
  }
  // Só 'd20' tem par de dados (Vantagem/Desvantagem) — o 2º dado é
  // sempre outro d20, nunca guardado à parte no estado.
  const ladosDadoPrincipal = estado.tipo === 'd20' ? 20 : estado.lados;
  // Travado enquanto o dado ainda tá rolando — fechar (✕ ou tocar
  // fora) antes do resultado chegar fazia o popup reabrir sozinho
  // quando a rolagem terminava (achado testando no celular: o motor,
  // físico ou não, continua em andamento por trás mesmo com o popup
  // fechado, e o `setEstado` do resultado reabria do zero).
  // [Protótipo, ver sdd/sdd-fluxo-rolagem.md] Rolagem com
  // confirmarAcerto/confirmarFechamento só fecha pelos botões novos —
  // nem tap fora, nem ✕ (o jogador precisa decidir antes de seguir).
  // Dado de Energia Psiônica somado a um d20 que NÃO é ataque: precisa dizer se deu sucesso (gasta o dado) antes de fechar.
  const decidindoDadoPsionico = !!estado.dadoPsionico && !estado.dadoPsionico.decidido && !estado.confirmarAcerto;
  const aguardandoDecisaoNova = !!estado.confirmarAcerto || !!estado.confirmarFechamento || !!estado.confirmarAlvoCura || decidindoDadoPsionico;
  const podeFechar = estado.fase === 'concluido' && !aguardandoDecisaoNova;

  return (
    <div
      className={`${styles.overlay} ${estado.motor3D ? styles.overlaySemFundo : ''}`}
      onClick={podeFechar ? fechar : undefined}
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {!aguardandoDecisaoNova && (
          <div
            className={`${styles.close} ${podeFechar ? '' : styles.closeDesabilitado}`}
            onClick={podeFechar ? fechar : undefined}
          >
            <span className={styles.closeIcon}>✕</span>
          </div>
        )}
        <div className={styles.label}>{estado.label}</div>
        {estado.dadosIndividuais ? (
          <div className={styles.diceGridWrap}>
            {/* Dado de 1 lado (1d1) nunca tem resultado variável — é
                sempre "1" — então não desenha como se tivesse rolado
                algo (pedido do Osmar, 2026-10: "se não tem dado, não
                precisa postar nada, só o valor"). O total já soma esse
                valor fixo normalmente, só a caixinha de dado some. */}
            {agruparEmLinhas(
              estado.dadosIndividuais.filter((d) => d.lados !== 1),
              4,
            ).map((linha, i) => (
              <div key={i} className={styles.diceGridRow}>
                {linha.map((d) => {
                  const podeRerolar =
                    estado.fase === 'concluido' &&
                    !!estado.rerollEscolhido &&
                    !estado.rerollEscolhidoUsado &&
                    typeof d.valor === 'number';
                  return (
                    <DadoVisual
                      key={d.id}
                      valor={d.valor}
                      lados={d.lados}
                      className={`${styles.dieGrid} ${podeRerolar ? styles.dieRerolavel : ''} ${d.trocado ? styles.dieTrocado : ''}`}
                      onClick={podeRerolar ? () => rerollDadoEscolhido(d.id) : undefined}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          // Motor 3D (ver `RollState.motor3D`): dado(s) que vieram da
          // física já aparecem caindo no canvas por trás do card
          // (Dice3dFab, compartilhado) — não desenha o `DadoVisual` CSS
          // deles de novo aqui, senão duplica. Vale pra Vantagem/
          // Desvantagem PRÉ-declarada (rola os 2 juntos) E escolhida
          // DEPOIS do resultado (`escolherVantagemPosRolagem`, entra na
          // mesma cena via `box.add()`) — os dois casos marcam
          // `dado2Motor3D` assim que o 2º dado começa a cair, não só
          // quando termina, pra nunca aparecer um dado 2D por cima do
          // físico enquanto ele ainda tá rolando.
          (!estado.motor3D || (temSegundoDado && !estado.dado2Motor3D)) && (
            <div className={styles.diceRow}>
              {!estado.motor3D && (
                <DadoVisual
                  valor={estado.valorDado}
                  lados={ladosDadoPrincipal}
                  className={dado1Descartado ? styles.dieDescartado : critClass}
                />
              )}
              {temSegundoDado && !estado.dado2Motor3D && (
                <DadoVisual valor={estado.dado2 ?? ''} lados={20} className={dado2Descartado ? styles.dieDescartado : critClass} />
              )}
            </div>
          )
        )}
        {estado.vantagem && (
          <div className={styles.formula}>{estado.vantagem === 'vantagem' ? 'Vantagem' : 'Desvantagem'}</div>
        )}
        {/* Dado de Energia Psiônica numa rolagem com Vantagem/Desvantagem: o mesmo dado soma nos DOIS d20 (a escolha entre eles não muda,
            o total é o mesmo) — mostra a soma de cada um pra conferir. */}
        {estado.dadoPsionico?.valores &&
          typeof estado.valorDado === 'number' &&
          typeof estado.dado2 === 'number' &&
          estado.fase === 'concluido' && (
            <div className={styles.formula}>
              Com o dado psiônico (+{estado.dadoPsionico.valores.reduce((x, y) => x + y, 0)}):{' '}
              {estado.valorDado + (estado.mod ?? 0) + estado.dadoPsionico.valores.reduce((x, y) => x + y, 0)} /{' '}
              {estado.dado2 + (estado.mod ?? 0) + estado.dadoPsionico.valores.reduce((x, y) => x + y, 0)}
            </div>
          )}
        <div className={`${styles.total} ${estado.ofertaTrocaDeDadoUsada ? styles.totalAtualizado : ''}`}>
          {estado.fase === 'rolando' ? (
            <span className={styles.rolando}>
              Rolando
              <span className={styles.rolandoPonto}>.</span>
              <span className={styles.rolandoPonto}>.</span>
              <span className={styles.rolandoPonto}>.</span>
            </span>
          ) : (
            estado.total
          )}
        </div>
        {/* Fórmula desce pra baixo do total (pedido do Osmar, B7) — o
            número grande é a resposta, a fórmula é só o "como
            cheguei nele", secundário. Ganha o ⓘ (mesmo `InfoValor` de
            CA/perícia/iniciativa) só quando a rolagem já tem a quebra
            pronta (`explicacaoMod`) — sem isso, mostra só a fórmula
            simples, igual sempre foi. */}
        <div className={styles.formulaComInfo}>
          <span className={styles.formula}>{estado.formula}</span>
          {estado.explicacaoMod && <InfoValor titulo={estado.label} explicacao={estado.explicacaoMod} />}
        </div>
        {estado.critico === 'falha' && <div className={`${styles.feedback} ${styles.feedbackCritFail}`}>😢 FALHA CRÍTICA</div>}
        {estado.critico === 'sucesso' && <div className={`${styles.feedback} ${styles.feedbackCritSuccess}`}>🎉 ACERTO CRÍTICO!</div>}
        {estado.fase === 'concluido' && estado.forcaIndomavelAplicada && (
          <div className={styles.feedback}>💪 Força Indomável — total virou seu valor de Força</div>
        )}
        {opcaoDadoPsionico && estado.fase === 'concluido' && estado.tipo === 'd20' && (
          <div
            className={`${styles.bonusExtraBtn} ${styles.bonusExtraBtnColuna}`}
            style={opcaoDadoPsionico.bloqueioMotivo ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            onClick={usarDadoPsionico}
          >
            <span>
              ✨ +{opcaoDadoPsionico.quantidade}d{opcaoDadoPsionico.lados} {opcaoDadoPsionico.rotulo}
            </span>
            <span className={styles.bonusExtraBtnSub}>
              {opcaoDadoPsionico.bloqueioMotivo ??
                (estado.confirmarAcerto
                  ? 'Soma ao ataque — só gasta o Dado de Energia se o ataque acertar'
                  : 'Soma à jogada — só gasta o Dado de Energia se der sucesso')}
            </span>
          </div>
        )}
        {estado.podeEscolherVantagem && (
          <div className={styles.vantagemButtons}>
            <div
              className={`${styles.vantagemBtn} ${styles.desvantagemBtn}`}
              onClick={() => escolherVantagemPosRolagem('desvantagem')}
            >
              Desvantagem
            </div>
            <div
              className={`${styles.vantagemBtn} ${styles.vantagemBtnPositivo}`}
              onClick={() => escolherVantagemPosRolagem('vantagem')}
            >
              Vantagem
            </div>
          </div>
        )}
        {/* House rule "Confirmação de crítico": 1/20 natural em ataque pede um
            2º d20 (só informativo) ANTES de mostrar os botões de decisão. */}
        {estado.fase === 'concluido' && estado.confirmarAcerto && exigeConfirmacao && (
          <div className={`${styles.vantagemButtons} ${styles.confirmarAcertoWrap}`}>
            <div className={`${styles.vantagemBtn} ${styles.vantagemBtnPositivo}`} onClick={rolarConfirmacaoCritico}>
              🎲 Rolar dado de confirmação
            </div>
          </div>
        )}
        {estado.fase === 'concluido' && estado.confirmarAcerto && estado.confirmacaoCritico && (
          <div className={styles.feedback} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {estado.confirmacaoCritico.fase === 'rolando' ? (
              <span>Rolando dado de confirmação...</span>
            ) : (
              <>
                {artePorLados(20) && <img src={artePorLados(20)} alt="d20" style={{ width: 20, height: 20, objectFit: 'contain' }} />}
                <span>
                  {estado.confirmacaoCritico.valor} + {estado.mod ?? 0} = {(estado.confirmacaoCritico.valor ?? 0) + (estado.mod ?? 0)}
                </span>
              </>
            )}
          </div>
        )}
        {estado.fase === 'concluido' && estado.confirmarAcerto && !exigeConfirmacao && estado.confirmacaoCritico?.fase !== 'rolando' && (
          <div className={`${styles.vantagemButtons} ${styles.confirmarAcertoWrap}`}>
            {/* 20 natural = acerto automático (sem "Errei"); 1 natural = erro
                automático, mas o Mestre pode dar consequência (ex.: acertar
                algo/alguém) — daí "Rolar Dano" em vez de "Acertei", sem dobra. */}
            {estado.critico !== 'sucesso' && (
              <div
                className={`${styles.vantagemBtn} ${styles.desvantagemBtn}`}
                onClick={() => {
                  const { onErrou } = estado.confirmarAcerto!;
                  resolverDadoPsionico(false);
                  fechar();
                  onErrou();
                }}
              >
                Errei
              </div>
            )}
            {/* 20 natural COM a house rule já confirmado: o jogador escolhe entre
                dano normal e dobrado (o 2º dado é só informativo). */}
            {estado.critico === 'sucesso' && estado.confirmacaoCritico && (
              <div
                className={`${styles.vantagemBtn} ${styles.vantagemBtnPositivo}`}
                onClick={() => {
                  const { onAcertou } = estado.confirmarAcerto!;
                  resolverDadoPsionico(true);
                  fechar();
                  onAcertou({ critico: false });
                }}
              >
                Rolar Dano
              </div>
            )}
            <div
              className={`${styles.vantagemBtn} ${styles.vantagemBtnPositivo}`}
              onClick={() => {
                const { onAcertou } = estado.confirmarAcerto!;
                resolverDadoPsionico(true);
                fechar();
                onAcertou({ critico: estado.critico === 'sucesso' });
              }}
            >
              {estado.critico === 'sucesso'
                ? estado.confirmacaoCritico
                  ? 'Rolar Dano Dobrado'
                  : 'Rolar Dobro do Dano'
                : estado.critico === 'falha'
                  ? 'Rolar Dano'
                  : 'Acertei'}
            </div>
          </div>
        )}
        {/* Ver `OfertaTrocaDeDado` (ex.: Mente Aguçada, Psiônico) — título +
            card clicável DENTRO do popup, entre o total e o(s) botão(ões) de
            fechar (pedido do Osmar: nunca ao lado do "OK", sempre abaixo,
            empilhado). `avaliar` decide se aparece E o texto — sem oferta
            válida (trocar não compensaria), não mostra nada aqui. */}
        {estado.fase === 'concluido' &&
          estado.tipo === 'dados' &&
          estado.ofertaTrocaDeDado &&
          (() => {
            if (estado.ofertaTrocaDeDadoUsada) {
              return (
                <>
                  <div className={styles.ofertaTitulo}>{estado.ofertaTrocaDeDado.titulo}</div>
                  <div className={`${styles.ofertaCard} ${styles.ofertaCardUsada}`}>Já usada nesta rolagem</div>
                </>
              );
            }
            const resultado = estado.ofertaTrocaDeDado.avaliar(estado);
            if (!resultado) return null;
            return (
              <>
                <div className={styles.ofertaTitulo}>{estado.ofertaTrocaDeDado.titulo}</div>
                <div className={styles.ofertaCard} onClick={trocarOfertaDeDado}>
                  {resultado.texto}
                </div>
              </>
            );
          })()}
        {/* Surto Psiônico (Psiônico nível 7) — mesmo padrão visual da
            troca acima, mas é um 2º slot independente (`ofertaSurtoPsionico`
            já decide sozinho se oferece) — cobre tanto a rolagem PURA de
            Dado de Energia Psiônica (`ehDadoDeEnergiaPsionica`) quanto o
            bônus de dado psiônico somado a um d20 (`dadoPsionico`), por
            isso não filtra por `estado.tipo` como a troca acima. */}
        {estado.fase === 'concluido' && (estado.ehDadoDeEnergiaPsionica || estado.dadoPsionico?.valores) && (
          <>
            {estado.surtoPsionicoUsado ? (
              <>
                <div className={styles.ofertaTitulo}>⚡ Surto Psiônico</div>
                <div className={`${styles.ofertaCard} ${styles.ofertaCardUsada}`}>Já usada nesta rolagem</div>
              </>
            ) : (
              ofertaSurtoPsionico && (
                <>
                  <div className={styles.ofertaTitulo}>⚡ Surto Psiônico</div>
                  <div className={`${styles.ofertaCard} ${styles.ofertaCardDuasLinhas}`} onClick={aplicarSurtoPsionico}>
                    <div className={styles.ofertaCardAcao}>{ofertaSurtoPsionico.titulo}</div>
                    <div className={styles.ofertaCardEfeito}>{ofertaSurtoPsionico.descricao}</div>
                  </div>
                </>
              )
            )}
          </>
        )}
        {estado.fase === 'concluido' && estado.confirmarFechamento && Array.isArray(estado.confirmarFechamento) && (
          // 3+ botões (ex.: tipo de dano + Golpe Atordoante) empilham na vertical —
          // lado a lado quebravam o rótulo em 2 linhas no celular.
          <div
            className={styles.vantagemButtons}
            style={estado.confirmarFechamento.length >= 3 ? { flexDirection: 'column' } : undefined}
          >
            {estado.confirmarFechamento
              .map((botao, i) => ({ i, rotulo: typeof botao.rotulo === 'function' ? botao.rotulo(estado) : botao.rotulo, aoTocar: botao.aoTocar }))
              .filter((botao) => botao.rotulo !== null)
              .map((botao) => (
                <div
                  key={botao.i}
                  className={styles.okBtn}
                  style={{ flex: 1, marginTop: 0 }}
                  onClick={() => {
                    fechar();
                    botao.aoTocar?.();
                  }}
                >
                  {botao.rotulo}
                </div>
              ))}
          </div>
        )}
        {estado.fase === 'concluido' && estado.confirmarFechamento && !Array.isArray(estado.confirmarFechamento) && (
          <div
            className={styles.okBtn}
            onClick={() => {
              const { aoTocar } = estado.confirmarFechamento as { rotulo?: string; aoTocar?: () => void };
              fechar();
              aoTocar?.();
            }}
          >
            {(estado.confirmarFechamento as { rotulo?: string }).rotulo ?? 'OK'}
          </div>
        )}
        {estado.fase === 'concluido' && estado.confirmarAlvoCura && (
          <div className={`${styles.vantagemButtons} ${styles.confirmarAcertoWrap}`}>
            <div
              className={`${styles.vantagemBtn} ${styles.desvantagemBtn}`}
              onClick={() => {
                const { onCurarOutro } = estado.confirmarAlvoCura!;
                fechar();
                onCurarOutro?.();
              }}
            >
              Curar outro
            </div>
            <div
              className={`${styles.vantagemBtn} ${styles.vantagemBtnPositivo}`}
              onClick={() => {
                const { onMeCurar } = estado.confirmarAlvoCura!;
                const total = estado.total ?? 0;
                fechar();
                onMeCurar(total);
              }}
            >
              Me curar
            </div>
          </div>
        )}
        {sorteDisponivel &&
          estado.fase === 'concluido' &&
          estado.tipo === 'd20' &&
          estado.valorDado === 1 &&
          !estado.dado2 &&
          !estado.sorteUsada && (
            <div className={styles.bonusExtraBtn} onClick={usarSorte}>
              🍀 Sorte — jogar de novo
            </div>
          )}
        {estado.fase === 'concluido' &&
          estado.tipo === 'dados' &&
          estado.rerollSe1 &&
          estado.valorDado === 1 &&
          !estado.rerollSe1Usado && (
            <div className={styles.bonusExtraBtn} onClick={usarRerollSe1}>
              🎲 {estado.rerollSe1.rotulo} — jogar de novo
            </div>
          )}
        {/* Rolagem com grid (2+ dados) — toca no dado, sem botão próprio. */}
        {estado.fase === 'concluido' && estado.tipo === 'dados' && estado.dadosIndividuais && estado.rerollEscolhido && (
          <div className={styles.formula}>
            {estado.rerollEscolhidoUsado
              ? `${estado.rerollEscolhido.rotulo} já usado nesta rolagem`
              : `🎲 ${estado.rerollEscolhido.rotulo} — toque num dado pra rerolar`}
          </div>
        )}
        {/* Rolagem de 1 dado só — sem ambiguidade de "qual dado", botão
            direto (mesmo padrão do rerollSe1, sem exigir valor 1). */}
        {estado.fase === 'concluido' &&
          estado.tipo === 'dados' &&
          !estado.dadosIndividuais &&
          estado.rerollEscolhido &&
          !estado.rerollEscolhidoUsado && (
            <div className={styles.bonusExtraBtn} onClick={() => rerollDadoEscolhido()}>
              🎲 {estado.rerollEscolhido.rotulo} — jogar de novo
            </div>
          )}
        {inspiracaoHeroicaDisponivel &&
          estado.fase === 'concluido' &&
          estado.tipo === 'd20' &&
          !estado.dado2 &&
          !estado.inspiracaoHeroicaUsada && (
            <div
              className={`${styles.bonusExtraBtn} ${styles.bonusExtraBtnColuna}`}
              onClick={usarInspiracaoHeroica}
            >
              <span>✨ Inspiração Heroica</span>
              <span className={styles.bonusExtraBtnSub}>Rola dado novamente e fica com novo valor</span>
            </div>
          )}
        {sortudoDisponivel && estado.fase === 'concluido' && estado.tipo === 'd20' && !estado.dado2 && (
          <div className={`${styles.bonusExtraBtn} ${styles.bonusExtraBtnColuna}`} onClick={usarSortudo}>
            <span>🍀 Sortudo — Vantagem</span>
            <span className={styles.bonusExtraBtnSub}>
              Gasta 1 Ponto de Sorte (restam {sortudoRestantes}): rola outro d20 e fica com o maior
            </span>
          </div>
        )}
        {sobreviventeDisciplinadoDisponivel &&
          estado.fase === 'concluido' &&
          estado.tipo === 'd20' &&
          estado.ehSalvaguarda &&
          !estado.dado2 &&
          !estado.sobreviventeUsado && (
            <div
              className={`${styles.bonusExtraBtn} ${styles.bonusExtraBtnColuna}`}
              onClick={usarSobreviventeDisciplinado}
            >
              <span>🧘 Sobrevivente Disciplinado</span>
              <span className={styles.bonusExtraBtnSub}>Falhou? Gasta 1 Ponto de Foco e joga de novo</span>
            </div>
          )}
        {estado.dadoPsionico && (
          <>
            <div className={styles.formula}>
              +{estado.dadoPsionico.opcao.quantidade}d{estado.dadoPsionico.opcao.lados} ({estado.dadoPsionico.opcao.rotulo})
            </div>
            {/* Dado físico (motor 3D): já aparece caindo no canvas por trás do card — não desenha o 2D de novo. */}
            {!estado.dadoPsionico.motor3D && (
              <div className={styles.diceRow}>
                {(estado.dadoPsionico.valores ?? Array.from({ length: estado.dadoPsionico.opcao.quantidade }, () => '🎲' as number | string)).map((v, i) => (
                  <DadoVisual key={i} valor={v} lados={estado.dadoPsionico!.opcao.lados} className={styles.dieBonusExtra} />
                ))}
              </div>
            )}
          </>
        )}
        {decidindoDadoPsionico && estado.dadoPsionico?.valores && (
          <div className={styles.vantagemButtons}>
            <div className={`${styles.vantagemBtn} ${styles.desvantagemBtn}`} onClick={() => resolverDadoPsionico(false)}>
              Falhou — não gasta
            </div>
            <div className={`${styles.vantagemBtn} ${styles.vantagemBtnPositivo}`} onClick={() => resolverDadoPsionico(true)}>
              Sucesso — gasta o dado
            </div>
          </div>
        )}
        {estado.categoria === 'atributoOuSalvaguarda' && estado.bonusExtra && (
          <>
            <div className={styles.formula}>
              +1d{estado.bonusExtra.lados} ({estado.bonusExtra.rotulo})
            </div>
            <div className={styles.diceRow}>
              <DadoVisual valor={estado.bonusExtra.valor} lados={estado.bonusExtra.lados} className={styles.dieBonusExtra} />
            </div>
          </>
        )}
        {estado.fase === 'concluido' &&
          estado.categoria === 'atributoOuSalvaguarda' &&
          !estado.bonusExtra &&
          bonusExtraDisponivel &&
          bonusExtraDisponivel.maximo > 0 && (
            <div
              className={`${styles.bonusExtraBtn} ${bonusExtraDisponivel.restantes <= 0 ? styles.bonusExtraBtnDesabilitado : ''}`}
              onClick={bonusExtraDisponivel.restantes > 0 ? aplicarBonusExtra : undefined}
            >
              🔥 {bonusExtraDisponivel.rotulo} {bonusExtraDisponivel.restantes}/{bonusExtraDisponivel.maximo}
            </div>
          )}
      </div>
    </div>
  );
}
