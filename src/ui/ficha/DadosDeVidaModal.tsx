import { useState } from 'react';
import { curaDeDadoDeVida, type ReservaDadoVida } from '../../core/dadosDeVida';
import { useRoll, type LadosDado } from '../roll/RollContext';
import BarraDeVida from '../components/BarraDeVida';
import styles from '../components/TrocarArmaMaestria.module.css';

interface DadosDeVidaModalProps {
  reserva: ReservaDadoVida[];
  pvAtual: number;
  pvMax: number;
  pvTemporario: number;
  modConstituicao: number;
  /** Chamado com o tipo gasto ("d8") e os PV recuperados (já com
   * Constituição e o mínimo de 1) — quem abriu desconta o dado e cura. */
  onGastar: (tipo: string, cura: number) => void;
  onTerminar: () => void;
}

/** Passo do Descanso Curto: gastar Dados de Vida pra recuperar PV
 * (Livro do Jogador, Ap. C). Aberto só quando faz sentido — com PV
 * cheio ou sem dado sobrando o `FichaShell` nem abre. Cada toque rola 1
 * dado de verdade (+ mod. de Constituição) e a cura só entra depois de
 * fechar o popup do dado, pra a barra animar aqui dentro. */
export default function DadosDeVidaModal({
  reserva,
  pvAtual,
  pvMax,
  pvTemporario,
  modConstituicao,
  onGastar,
  onTerminar,
}: DadosDeVidaModalProps) {
  const { rolarDados } = useRoll();
  const [rolando, setRolando] = useState(false);
  const cheio = pvAtual >= pvMax;
  const textoMod = modConstituicao >= 0 ? `+ ${modConstituicao}` : `- ${-modConstituicao}`;

  function gastar(r: ReservaDadoVida) {
    if (rolando || cheio || r.restantes <= 0) return;
    setRolando(true);
    let total = 0;
    rolarDados({
      label: `Dado de Vida (${r.tipo}) — Descanso Curto`,
      formula: `1${r.tipo} ${textoMod}`,
      quantidade: 1,
      lados: r.lados as LadosDado,
      mod: modConstituicao,
      onResultado: (t) => {
        total = t;
      },
      confirmarFechamento: {
        aoTocar: () => {
          onGastar(r.tipo, curaDeDadoDeVida(total - modConstituicao, modConstituicao));
          setRolando(false);
        },
      },
    });
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>🎲 Dados de Vida — Descanso Curto</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <div className="label">Pontos de Vida</div>
          <div style={{ fontSize: 20 }}>
            {pvAtual} / {pvMax}
          </div>
        </div>
        <BarraDeVida valor={pvAtual} maximo={pvMax} temporario={pvTemporario} />

        <div style={{ fontSize: 12, color: 'var(--text-faint)', margin: '10px 0' }}>
          Cada dado gasto rola o dado + modificador de Constituição ({textoMod.replace(' ', '')}), mínimo 1 PV.
        </div>

        {reserva.map((r) => {
          const bloqueado = rolando || cheio || r.restantes <= 0;
          return (
            <div
              key={r.tipo}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                padding: 'var(--space-2) 0',
                borderBottom: '1px dashed var(--line-soft)',
              }}
            >
              <div>
                <div style={{ fontSize: 15 }}>{r.tipo}</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                  {r.restantes} / {r.total} disponíveis
                </div>
              </div>
              <div
                className="btn btn-primary"
                style={{ opacity: bloqueado ? 0.4 : 1, cursor: bloqueado ? 'default' : 'pointer', minWidth: 110 }}
                onClick={() => gastar(r)}
              >
                Gastar {r.tipo}
              </div>
            </div>
          );
        })}

        {cheio && (
          <div style={{ fontSize: 12, color: 'var(--good)', marginTop: 10 }}>PV cheio — nada mais a recuperar.</div>
        )}

        <div className="btn btn-primary" style={{ marginTop: 16, opacity: rolando ? 0.4 : 1 }} onClick={rolando ? undefined : onTerminar}>
          Terminar descanso
        </div>
      </div>
    </div>
  );
}
