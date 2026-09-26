import { createPortal } from 'react-dom';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import {
  agruparMagiasComClassePorCirculo,
  circulosDisponiveisParaConjurar,
  type EspacoDeMagiaAtivo,
  type MagiaComClasseOpcional,
  type PoolDePonte,
} from '../../../core/magiasPersonagem';
import { circuloGratisMaestria } from '../../../core/maestriaDeMagias';
import { circuloGratisAssinatura } from '../../../core/assinaturaMagica';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import GrupoMagiaColapsavel from '../../components/GrupoMagiaColapsavel';
import PillsMagia from '../../components/PillsMagia';
import TickPips from '../../components/TickPips';
import type { PreferenciasPillsMagia } from '../../../core/preferenciasPillsMagia';
import styles from '../levelup/LevelUpShell.module.css';
import localStyles from './SelecionarMagiaShell.module.css';

interface SelecionarMagiaShellProps {
  titulo: string;
  /** Marcadas com a classe que concedeu (multiclasse) — `classe: null`
   * pras listas fixas de 1 classe só (Descobertas Mágicas etc.), sem
   * pill nesse caso. Ver `sdd/sdd-multiclasse-truques-magias.md`. */
  truques: MagiaComClasseOpcional[];
  magiasPreparadas: MagiaComClasseOpcional[];
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  /** Ponte de Magia de Pacto (SDD Multiclasse) — pool da OUTRA classe
   * conjuradora, mostrado junto (não escondido) no painel flutuante
   * de Espaços — mesmo padrão da aba Magias, Entrega 5b. */
  ponte: PoolDePonte | null;
  /** Maestria de Magias (Mago, nível 18) — magia com círculo grátis
   * continua disponível mesmo sem Espaço real sobrando naquele
   * círculo (ver `EscolherCirculoShell`). `{}` pra quem não tem. */
  maestriaDeMagiasAtuais: Record<number, string>;
  /** Assinatura Mágica (Mago, nível 20) — mesmo tratamento acima, mas
   * limitado a 1x por magia até o próximo Descanso. */
  assinaturaMagicaAtuais: string[];
  assinaturaMagicaGastas: string[];
  onFechar: () => void;
  onEscolherTruque: (m: Magia) => void;
  onEscolherMagia: (m: Magia, circulosDisponiveis: number[]) => void;
  /** Quais pills de info aparecem em cada linha de magia — preferência
   * do aparelho (ver `core/preferenciasPillsMagia.ts`). O pill de
   * Círculo fica sempre fora aqui, mesmo que a preferência esteja
   * ligada: essa tela já agrupa por círculo (cabeçalho de cada grupo),
   * repetir na linha seria redundante. */
  preferenciasPillsMagia: PreferenciasPillsMagia;
}

/** Tela cheia (Tela 2 do fluxo "Usar Magia") — lista Truques + Magias
 * Preparadas agrupados por círculo (mesmo `GrupoMagiaColapsavel` do
 * Level Up), em vez do acordeão único que crescia sem parar com
 * personagens de nível alto (algumas classes chegam a 20+ magias
 * preparadas). Cada magia de círculo > 0 mostra se dá pra conjurar
 * agora — regra de upcast real (ver `circulosDisponiveisParaConjurar`):
 * uma magia nunca cabe num espaço de círculo MENOR que o dela, mas
 * cabe no dela ou em qualquer um maior contanto que sobre espaço. */
export default function SelecionarMagiaShell({
  titulo,
  truques,
  magiasPreparadas,
  espacos,
  espacosGastosPorCirculo,
  ponte,
  maestriaDeMagiasAtuais,
  assinaturaMagicaAtuais,
  assinaturaMagicaGastas,
  onFechar,
  onEscolherTruque,
  onEscolherMagia,
  preferenciasPillsMagia,
}: SelecionarMagiaShellProps) {
  const grupos = agruparMagiasComClassePorCirculo([...truques, ...magiasPreparadas]);
  const preferenciasSemCirculo = { ...preferenciasPillsMagia, circulo: false };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>{titulo}</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={localStyles.listCol}>
          {grupos.map((grupo) => (
            <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.itens}>
              {({ magia: m, classe }) => {
                const truque = m.circulo === 0;
                const circulosDisponiveis = truque ? [] : circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo);
                const circuloGratis = truque
                  ? null
                  : (circuloGratisMaestria(m.nome, maestriaDeMagiasAtuais) ??
                    circuloGratisAssinatura(m.nome, assinaturaMagicaAtuais, assinaturaMagicaGastas));
                const disponivel = truque || circulosDisponiveis.length > 0 || circuloGratis !== null;
                return (
                  <div
                    key={`${m.id}-${classe ?? 'x'}`}
                    className="check-row"
                    style={disponivel ? undefined : { opacity: 0.45, pointerEvents: 'none' }}
                    onClick={() => (truque ? onEscolherTruque(m) : onEscolherMagia(m, circulosDisponiveis))}
                  >
                    <div className={`check-label ${localStyles.checkLabelCol}`}>
                      <div>
                        <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                        {!disponivel && (
                          <span style={{ color: 'var(--text-faint)', fontSize: 11 }}> · sem espaço disponível</span>
                        )}
                      </div>
                      <div className={localStyles.checkLabelLinha2}>
                        <PillsMagia magia={m} classe={classe} preferencias={preferenciasSemCirculo} />
                      </div>
                    </div>
                  </div>
                );
              }}
            </GrupoMagiaColapsavel>
          ))}
        </div>
      </div>

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={onFechar}>
          ← Voltar
        </div>
      </div>

      {/* Portal pro <body>: esta tela abre dentro do drawer "Ação"
          (SidePanel), que tem `transform` pra animar o slide-in — isso
          vira containing block pra qualquer `position: fixed`
          descendente, então sem o portal o painel ficaria preso à
          largura do drawer, não à tela inteira. Só o painel sai da
          árvore — o resto da tela (lista de magias) fica no tamanho
          original de propósito, não é pra cobrir a tela toda. */}
      {(espacos.length > 0 || (ponte && ponte.espacos.length > 0)) &&
        createPortal(
          <div className={localStyles.painelEspacos}>
            <div className={localStyles.painelEspacosTitulo}>Espaços</div>
            {/* Invertido pra círculo maior em cima, menor embaixo — pedido
                do Osmar (2026-09), só neste painel flutuante. `espacos`
                vem crescente de `espacosDeMagiaAtivos` (outros lugares que
                o consomem direto, ex.: aba Magias, continuam crescente de
                propósito — não peça pra mexer lá também). */}
            {[...espacos].reverse().map((e) => {
              const gasto = espacosGastosPorCirculo[e.circulo] ?? 0;
              return (
                <div key={e.circulo} className={localStyles.painelEspacosRow}>
                  <span className={localStyles.painelEspacosLabel}>{e.circulo}º</span>
                  <TickPips total={e.maximo} usados={gasto} tamanho="sm" />
                </div>
              );
            })}
            {/* Ponte de Magia de Pacto (SDD Multiclasse, Entrega 5b) —
                pool da OUTRA classe conjuradora, mostrado junto. */}
            {ponte && ponte.espacos.length > 0 && (
              <>
                {espacos.length > 0 && <div className={localStyles.painelEspacosSeparador} />}
                <div className={localStyles.painelEspacosTitulo}>{ponte.classeNome}</div>
                {[...ponte.espacos].reverse().map((e) => {
                  const gasto = ponte.espacosGastosPorCirculo[e.circulo] ?? 0;
                  return (
                    <div key={e.circulo} className={localStyles.painelEspacosRow}>
                      <span className={localStyles.painelEspacosLabel}>{e.circulo}º</span>
                      <TickPips total={e.maximo} usados={gasto} tamanho="sm" variante={ponte.classeNome === 'Bruxo' ? 'roxo' : 'padrao'} />
                    </div>
                  );
                })}
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
