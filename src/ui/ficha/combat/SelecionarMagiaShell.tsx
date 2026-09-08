import { createPortal } from 'react-dom';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { agruparMagiasPorCirculo, circulosDisponiveisParaConjurar, type EspacoDeMagiaAtivo } from '../../../core/magiasPersonagem';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import GrupoMagiaColapsavel from '../../components/GrupoMagiaColapsavel';
import TickPips from '../../components/TickPips';
import styles from '../levelup/LevelUpShell.module.css';
import localStyles from './SelecionarMagiaShell.module.css';

interface SelecionarMagiaShellProps {
  titulo: string;
  truques: Magia[];
  magiasPreparadas: Magia[];
  espacos: EspacoDeMagiaAtivo[];
  espacosGastosPorCirculo: Record<number, number>;
  onFechar: () => void;
  onEscolherTruque: (m: Magia) => void;
  onEscolherMagia: (m: Magia, circulosDisponiveis: number[]) => void;
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
  onFechar,
  onEscolherTruque,
  onEscolherMagia,
}: SelecionarMagiaShellProps) {
  const grupos = agruparMagiasPorCirculo([...truques, ...magiasPreparadas]);

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
            <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
              {(m) => {
                const truque = m.circulo === 0;
                const circulosDisponiveis = truque ? [] : circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo);
                const disponivel = truque || circulosDisponiveis.length > 0;
                return (
                  <div
                    key={m.id}
                    className="check-row"
                    style={disponivel ? undefined : { opacity: 0.45, pointerEvents: 'none' }}
                    onClick={() => (truque ? onEscolherTruque(m) : onEscolherMagia(m, circulosDisponiveis))}
                  >
                    <span className="check-label">
                      <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                      {!disponivel && (
                        <span style={{ color: 'var(--text-faint)', fontSize: 11 }}> · sem espaço disponível</span>
                      )}
                    </span>
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

      {/* Portal pro <body>: esta tela abre dentro do drawer "Ação" (SidePanel),
          que tem `transform` pra animar o slide-in — isso vira containing
          block pra qualquer `position: fixed` descendente, então sem o
          portal o painel ficaria preso à largura do drawer (~84%), não à
          tela inteira. */}
      {espacos.length > 0 &&
        createPortal(
          <div className={localStyles.painelEspacos}>
            <div className={localStyles.painelEspacosTitulo}>Espaços</div>
            {espacos.map((e) => {
              const gasto = espacosGastosPorCirculo[e.circulo] ?? 0;
              return (
                <div key={e.circulo} className={localStyles.painelEspacosRow}>
                  <span className={localStyles.painelEspacosLabel}>{e.circulo}º</span>
                  <TickPips total={e.maximo} usados={gasto} tamanho="sm" />
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
