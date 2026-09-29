import { useState } from 'react';
import styles from '../../components/TrocarArmaMaestria.module.css';

interface MaosConsagradasModalProps {
  maximo: number;
  restantes: number;
  onCurarSelf: (pontos: number) => boolean;
  onCurarOutro: (pontos: number) => boolean;
  onRemoverEnvenenado: () => boolean;
  onFechar: () => void;
}

/** Popup pra gastar a reserva de Mãos Consagradas (Paladino) — mesmo
 * padrão do `PvManualModal.tsx` (cartão flutuante, digita um valor e
 * confirma), não um sub-painel dentro do painel de Bônus: evita que a
 * tela inteira do painel seja tomada só pra uma escolha pontual. */
export default function MaosConsagradasModal({
  maximo,
  restantes,
  onCurarSelf,
  onCurarOutro,
  onRemoverEnvenenado,
  onFechar,
}: MaosConsagradasModalProps) {
  const [texto, setTexto] = useState('');
  const valor = Number.parseInt(texto, 10);
  const valido = Number.isFinite(valor) && valor > 0 && valor <= restantes;
  const podeRemoverEnvenenado = restantes >= 5;

  function curarSelf() {
    if (!valido) return;
    if (!onCurarSelf(valor)) return;
    onFechar();
  }
  function curarOutro() {
    if (!valido) return;
    if (!onCurarOutro(valor)) return;
    onFechar();
  }
  function removerEnvenenado() {
    if (!podeRemoverEnvenenado) return;
    if (!onRemoverEnvenenado()) return;
    onFechar();
  }

  const estiloOpcao = (habilitado: boolean) => ({
    border: '1px solid var(--line)',
    borderRadius: 'var(--shape-sm)',
    padding: 'var(--space-2) var(--space-3)',
    marginBottom: 8,
    cursor: habilitado ? 'pointer' : 'default',
    opacity: habilitado ? 1 : 0.4,
    background: 'var(--panel)',
  });

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>🖐️ Mãos Consagradas</div>
        <div className="label" style={{ marginBottom: 'var(--space-2)' }}>
          Reserva: {restantes}/{maximo} PV. Recarrega só no Descanso Longo.
        </div>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={restantes}
          autoFocus
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`Quantos PV? (até ${restantes})`}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontSize: 18,
            padding: 'var(--space-2)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--shape-sm)',
            textAlign: 'center',
            marginBottom: 'var(--space-3)',
            background: 'var(--panel)',
            color: 'var(--text)',
          }}
        />
        <div style={estiloOpcao(valido)} onClick={curarSelf}>
          Curar a si mesmo
        </div>
        <div style={estiloOpcao(valido)} onClick={curarOutro}>
          Curar outro
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
            Só desconta da reserva — aplique o PV no aliado fora do app.
          </div>
        </div>
        <div style={estiloOpcao(podeRemoverEnvenenado)} onClick={removerEnvenenado}>
          Remover Envenenado (5 PV)
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
            Nunca restaura PV — serve pra você ou pra outra criatura.
          </div>
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
