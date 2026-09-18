import InfoValor from '../components/InfoValor';
import { useRoll } from './RollContext';
import styles from './RollOverlay.module.css';
import { artePorLados } from './dadosArte';

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
    usarRerollSe1,
    rerollDadoEscolhido,
    inspiracaoHeroicaDisponivel,
    usarInspiracaoHeroica,
  } = useRoll();

  if (!estado) return null;

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
  const aguardandoDecisaoNova = !!estado.confirmarAcerto || !!estado.confirmarFechamento;
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
            {agruparEmLinhas(estado.dadosIndividuais, 4).map((linha, i) => (
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
                      className={`${styles.dieGrid} ${podeRerolar ? styles.dieRerolavel : ''}`}
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
        <div className={styles.total}>
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
        {estado.fase === 'concluido' && estado.confirmarAcerto && (
          <div className={`${styles.vantagemButtons} ${styles.confirmarAcertoWrap}`}>
            <div
              className={`${styles.vantagemBtn} ${styles.desvantagemBtn}`}
              onClick={() => {
                const { onErrou } = estado.confirmarAcerto!;
                fechar();
                onErrou();
              }}
            >
              Errei
            </div>
            <div
              className={`${styles.vantagemBtn} ${styles.vantagemBtnPositivo}`}
              onClick={() => {
                const { onAcertou } = estado.confirmarAcerto!;
                fechar();
                onAcertou();
              }}
            >
              Acertei
            </div>
          </div>
        )}
        {estado.fase === 'concluido' && estado.confirmarFechamento && (
          <div
            className={styles.okBtn}
            onClick={() => {
              const { aoTocar } = estado.confirmarFechamento!;
              fechar();
              aoTocar?.();
            }}
          >
            {estado.confirmarFechamento.rotulo ?? 'OK'}
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
