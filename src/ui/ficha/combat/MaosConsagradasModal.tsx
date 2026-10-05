import { useState } from 'react';
import styles from '../../components/TrocarArmaMaestria.module.css';
import BarraRecurso from '../../components/BarraRecurso';
import { custoTotalMaosConsagradas } from '../../../core/maosConsagradas';

interface MaosConsagradasModalProps {
  maximo: number;
  restantes: number;
  cor: string;
  /** PV atual/máximo do PRÓPRIO Paladino — só pra mostrar no botão
   * "Curar a si mesmo", pra ele ver quanto PV tem antes de escolher
   * esse alvo (pedido do Osmar, 2026-10). Não limita o quanto cura —
   * curar além do máximo simplesmente não passa de `pvMax` (mesma
   * regra dos botões manuais de PV). */
  pvAtual: number;
  pvMax: number;
  /** Envenenado sempre; + as 6 do Toque Restaurador a partir do nível
   * 14 (ver `core/maosConsagradas.ts` `condicoesDisponiveisMaosConsagradas`). */
  condicoesDisponiveis: string[];
  /** 1 toque só — cura E remove condição(ões) juntos, tudo descontado
   * de uma vez (regra real: não é exclusivo, ver `core/maosConsagradas.ts`). */
  onConfirmar: (pontosCurar: number, alvo: 'self' | 'outro' | null, condicoes: string[]) => boolean;
  onFechar: () => void;
}

/** Popup pra gastar a reserva de Mãos Consagradas (Paladino) — mesmo
 * padrão do `PvManualModal.tsx` (cartão flutuante), mas com 1
 * confirmação só: a barra no topo mostra a reserva com uma prévia em
 * vermelho do que SERIA gasto (cura + 5 por condição marcada) antes de
 * confirmar — pedido do Osmar (2026-10), mesma ideia de dano pendente
 * na barra de PV. */
export default function MaosConsagradasModal({
  maximo,
  restantes,
  cor,
  pvAtual,
  pvMax,
  condicoesDisponiveis,
  onConfirmar,
  onFechar,
}: MaosConsagradasModalProps) {
  const [texto, setTexto] = useState('');
  const [alvo, setAlvo] = useState<'self' | 'outro' | null>(null);
  const [condicoesMarcadas, setCondicoesMarcadas] = useState<string[]>([]);

  // Conta o que foi digitado SEMPRE (não só depois de escolher alvo) —
  // senão a barra não mostra a prévia do que vai ser gasto enquanto o
  // jogador ainda está decidindo quem recebe a cura (bug real,
  // apontado pelo Osmar testando ao vivo).
  const pontosCurar = Number.parseInt(texto, 10) || 0;
  const custoTotal = custoTotalMaosConsagradas(pontosCurar, condicoesMarcadas.length);
  // Só exige alvo escolhido quando TEM PV pra curar — remover só
  // condição, sem curar nada, não precisa de alvo (não existe "de
  // quem" pra isso: nunca aplica PV em ninguém, regra real).
  const podeConfirmar = custoTotal > 0 && custoTotal <= restantes && (pontosCurar === 0 || alvo !== null);

  function confirmar() {
    if (!podeConfirmar) return;
    if (!onConfirmar(pontosCurar, alvo, condicoesMarcadas)) return;
    onFechar();
  }

  function ajustar(delta: number) {
    const atual = Number.parseInt(texto, 10) || 0;
    const novo = Math.max(0, Math.min(restantes, atual + delta));
    setTexto(novo === 0 ? '' : String(novo));
  }

  function alternarCondicao(nome: string) {
    setCondicoesMarcadas((prev) => (prev.includes(nome) ? prev.filter((c) => c !== nome) : [...prev, nome]));
  }

  const estiloBotaoAjuste = {
    flex: 1,
    minHeight: 'var(--touch-target-min)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--shape-sm)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 14,
  } as const;

  const estiloAlvo = (ativo: boolean) => ({
    flex: 1,
    border: `1px solid ${ativo ? 'var(--accent)' : 'var(--line)'}`,
    borderRadius: 'var(--shape-sm)',
    padding: '4px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    background: ativo ? 'var(--accent-fraco, var(--panel))' : 'var(--panel)',
    fontWeight: ativo ? 'bold' : 'normal',
  });

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>🖐️ Mãos Consagradas</div>
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <BarraRecurso valor={restantes} maximo={maximo} cor={cor} rotulo={`${restantes}/${maximo} PV`} pendente={custoTotal} />
        </div>

        <div className="section-title" style={{ margin: '0 0 var(--space-2)' }}>
          💊 Curar
        </div>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={restantes}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`Curar quantos PV? (até ${restantes})`}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontSize: 18,
            padding: '4px',
            border: '1px solid var(--line)',
            borderRadius: 'var(--shape-sm)',
            textAlign: 'center',
            marginBottom: 'var(--space-2)',
            background: 'var(--panel)',
            color: 'var(--text)',
          }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <div style={estiloBotaoAjuste} onClick={() => ajustar(-5)}>
            −5
          </div>
          <div style={estiloBotaoAjuste} onClick={() => ajustar(-1)}>
            −1
          </div>
          <div style={estiloBotaoAjuste} onClick={() => ajustar(1)}>
            +1
          </div>
          <div style={estiloBotaoAjuste} onClick={() => ajustar(5)}>
            +5
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <div style={estiloAlvo(alvo === 'self')} onClick={() => setAlvo(alvo === 'self' ? null : 'self')}>
            Curar a si mesmo
            <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 'normal' }}>
              {pvAtual}/{pvMax} PV
            </div>
          </div>
          <div style={estiloAlvo(alvo === 'outro')} onClick={() => setAlvo(alvo === 'outro' ? null : 'outro')}>
            Curar outro
          </div>
        </div>
        {alvo === 'outro' && (
          <div className="label" style={{ marginTop: -8, marginBottom: 'var(--space-3)' }}>
            Só desconta da reserva — aplique o PV no aliado fora do app.
          </div>
        )}

        <div className="section-title" style={{ margin: '0 0 var(--space-2)' }}>
          🧪 Remover
        </div>
        <div className="label" style={{ marginBottom: 4 }}>
          5 PV cada, nunca restaura PV.
        </div>
        {condicoesDisponiveis.map((nome) => {
          const marcado = condicoesMarcadas.includes(nome);
          return (
            <div key={nome} className="check-row" onClick={() => alternarCondicao(nome)}>
              <div className={`check-box ${marcado ? 'checked' : ''}`} />
              <span className="check-label">{nome}</span>
            </div>
          );
        })}

        <div
          className="btn btn-primary"
          style={{ marginTop: 'var(--space-3)', textAlign: 'center', opacity: podeConfirmar ? 1 : 0.4 }}
          onClick={confirmar}
        >
          Confirmar{custoTotal > 0 ? ` (${custoTotal} PV)` : ''}
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
