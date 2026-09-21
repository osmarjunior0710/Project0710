import { useState } from 'react';
import {
  TIPOS_MOEDA,
  adicionarMoedas,
  gastarMoedas,
  totalEmPO,
  type Moedas,
  type TipoMoeda,
} from '../../core/moedas';
import styles from '../components/TrocarArmaMaestria.module.css';

/** Emojis provisórios por moeda — o Osmar vai fazer os ícones de verdade. */
const EMOJI: Record<TipoMoeda, string> = { pc: '🟤', pp: '⚪', pe: '🟢', po: '🟡', pl: '🟣' };
const SIGLA: Record<TipoMoeda, string> = { pc: 'PC', pp: 'PP', pe: 'PE', po: 'PO', pl: 'PL' };
const NOME: Record<TipoMoeda, string> = {
  pc: 'Peça de Cobre',
  pp: 'Peça de Prata',
  pe: 'Peça de Electro',
  po: 'Peça de Ouro',
  pl: 'Peça de Platina',
};

function formatarMoedas(m: Moedas): string {
  const partes = TIPOS_MOEDA.slice()
    .reverse()
    .filter((t) => m[t] > 0)
    .map((t) => `${m[t]} ${SIGLA[t]}`);
  return partes.length > 0 ? partes.join(', ') : 'nada';
}

function formatarPO(po: number): string {
  return po.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

interface BolsaDeMoedasProps {
  moedas: Moedas;
  onMudar: (novas: Moedas) => void;
}

/** Primeira linha da Mochila: as 5 moedas (caixa com borda cheia, mesmo
 * padrão dos atributos, cada uma toca pra abrir o painel de adicionar/
 * remover) + o total em PO logo abaixo. */
export default function BolsaDeMoedas({ moedas, onMudar }: BolsaDeMoedasProps) {
  const [aberta, setAberta] = useState<TipoMoeda | null>(null);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-1)' }}>
        {TIPOS_MOEDA.map((t) => (
          <div
            key={t}
            className="box stat-box"
            style={{ borderStyle: 'solid', borderColor: 'var(--accent)', padding: 'var(--space-2) var(--space-1)' }}
            onClick={() => setAberta(t)}
          >
            <div style={{ fontSize: 18 }}>{EMOJI[t]}</div>
            <div className="stat-mod" style={{ fontSize: 16, margin: '2px 0' }}>
              {moedas[t]}
            </div>
            <div className="stat-name">{SIGLA[t]}</div>
          </div>
        ))}
      </div>
      <div className="label" style={{ margin: '6px 0 var(--space-3)', textAlign: 'right' }}>
        ≈ {formatarPO(totalEmPO(moedas))} PO no total
      </div>

      {aberta && <MoedaPainel tipo={aberta} moedas={moedas} onMudar={onMudar} onFechar={() => setAberta(null)} />}
    </>
  );
}

interface MoedaPainelProps {
  tipo: TipoMoeda;
  moedas: Moedas;
  onMudar: (novas: Moedas) => void;
  onFechar: () => void;
}

/** Adicionar/remover de UM tipo de moeda. Remover gasta com conversão
 * automática entre moedas (`gastarMoedas`) e mostra o que foi pago/troco;
 * fica aberto depois de aplicar pra o resultado ser lido. */
function MoedaPainel({ tipo, moedas, onMudar, onFechar }: MoedaPainelProps) {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState<{ texto: string; erro: boolean } | null>(null);
  const valor = Number.parseInt(texto, 10);
  const valido = Number.isFinite(valor) && valor > 0;

  function adicionar() {
    if (!valido) return;
    onMudar(adicionarMoedas(moedas, tipo, valor));
    setResultado({ texto: `Adicionou ${valor} ${SIGLA[tipo]}.`, erro: false });
    setTexto('');
  }

  function remover() {
    if (!valido) return;
    const r = gastarMoedas(moedas, tipo, valor);
    if (!r.ok) {
      setResultado({
        texto: `Moedas insuficientes — você tem ${formatarPO(r.totalPO)} PO no total.`,
        erro: true,
      });
      return;
    }
    onMudar(r.moedas);
    const troco = formatarMoedas(r.troco);
    setResultado({
      texto: `Pagou: ${formatarMoedas(r.pagas)}.${troco !== 'nada' ? ` Troco: ${troco}.` : ''}`,
      erro: false,
    });
    setTexto('');
  }

  const estiloBotao = (cor: string) => ({
    flex: 1,
    minHeight: 44,
    borderRadius: 'var(--shape-sm)',
    border: 'none',
    background: cor,
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: valido ? 'pointer' : 'default',
    opacity: valido ? 1 : 0.4,
  });

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          {EMOJI[tipo]} {NOME[tipo]} — {moedas[tipo]} {SIGLA[tipo]}
        </div>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          autoFocus
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`Quantas ${SIGLA[tipo]}?`}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontSize: 22,
            padding: 'var(--space-3)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--shape-sm)',
            textAlign: 'center',
            marginBottom: 'var(--space-3)',
            background: 'var(--panel)',
            color: 'var(--text)',
          }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <div style={estiloBotao('var(--good)')} onClick={adicionar}>
            Adicionar
          </div>
          <div style={estiloBotao('var(--danger)')} onClick={remover}>
            Remover
          </div>
        </div>
        {resultado && (
          <div style={{ fontSize: 12, marginTop: 12, color: resultado.erro ? 'var(--danger)' : 'var(--text-dim)' }}>
            {resultado.texto}
          </div>
        )}
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
