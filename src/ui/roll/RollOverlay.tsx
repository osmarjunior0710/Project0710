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

  return (
    <div className={styles.overlay} onClick={fechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.label}>{estado.label}</div>
        {estado.dadosIndividuais ? (
          <div className={styles.diceGrid}>
            {estado.dadosIndividuais.map((d) => {
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
        ) : (
          <div className={styles.diceRow}>
            <DadoVisual
              valor={estado.valorDado}
              lados={ladosDadoPrincipal}
              className={dado1Descartado ? styles.dieDescartado : critClass}
            />
            {temSegundoDado && (
              <DadoVisual valor={estado.dado2 ?? ''} lados={20} className={dado2Descartado ? styles.dieDescartado : critClass} />
            )}
          </div>
        )}
        {estado.vantagem && (
          <div className={styles.formula}>{estado.vantagem === 'vantagem' ? 'Vantagem' : 'Desvantagem'}</div>
        )}
        <div className={styles.formula}>{estado.formula}</div>
        <div className={styles.total}>{estado.fase === 'rolando' ? '—' : estado.total}</div>
        {estado.critico === 'falha' && <div className={`${styles.feedback} ${styles.feedbackCritFail}`}>😢 FALHA CRÍTICA</div>}
        {estado.critico === 'sucesso' && <div className={`${styles.feedback} ${styles.feedbackCritSuccess}`}>🎉 ACERTO CRÍTICO!</div>}
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
        <div className={styles.close} onClick={fechar}>
          FECHAR
        </div>
      </div>
    </div>
  );
}
