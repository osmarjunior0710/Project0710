import { useState } from 'react';
import { statsMontariaSobrenatural } from '../../../core/pets';
import styles from '../../components/TrocarArmaMaestria.module.css';

export interface OpcaoTipoMontaria {
  tipo: 'Celestial' | 'Feérico' | 'Ínfero';
  criaturaId: string;
  dano: string;
}

const OPCOES: OpcaoTipoMontaria[] = [
  { tipo: 'Celestial', criaturaId: 'montaria-celestial', dano: 'Radiante' },
  { tipo: 'Feérico', criaturaId: 'montaria-ferica', dano: 'Psíquico' },
  { tipo: 'Ínfero', criaturaId: 'montaria-infera', dano: 'Necrótico' },
];

interface EscolherMontariaModalProps {
  circuloUsado: number;
  onConfirmar: (nome: string, criaturaId: string, ajustes: { ca: number; pvMax: number }) => void;
  onFechar: () => void;
}

/** Popup de Convocar Montaria (Paladino, Montaria Fiel) — escolhe o
 * nome e o tipo (Celestial/Feérico/Ínfero, à escolha "sempre que
 * conjurar", ver livro), CA/PV calculados pelo círculo REAL usado
 * (upcast inclusive) e aplicados como `ajustes` do Pet — atributos são
 * iguais nas 3 formas. Mesmo padrão visual do `MaosConsagradasModal.tsx`. */
export default function EscolherMontariaModal({ circuloUsado, onConfirmar, onFechar }: EscolherMontariaModalProps) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<OpcaoTipoMontaria>(OPCOES[0]);
  const { ca, pvMax: pv } = statsMontariaSobrenatural(circuloUsado);

  function confirmar() {
    const nomeLimpo = nome.trim() || `Montaria ${tipo.tipo}`;
    onConfirmar(nomeLimpo, tipo.criaturaId, { ca, pvMax: pv });
    onFechar();
  }

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>🐴 Convocar Montaria</div>
        <div className="label" style={{ marginBottom: 'var(--space-2)' }}>
          Círculo {circuloUsado} — CA {ca}, {pv} PV. Se você já tem uma montaria desta magia, ela é substituída.
        </div>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da montaria..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontSize: 16,
            padding: 'var(--space-2)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--shape-sm)',
            marginBottom: 'var(--space-3)',
            background: 'var(--panel)',
            color: 'var(--text)',
          }}
        />
        {OPCOES.map((op) => (
          <div
            key={op.tipo}
            onClick={() => setTipo(op)}
            style={{
              border: `1px solid ${tipo.tipo === op.tipo ? 'var(--accent)' : 'var(--line)'}`,
              borderRadius: 'var(--shape-sm)',
              padding: 'var(--space-2) var(--space-3)',
              marginBottom: 8,
              cursor: 'pointer',
              background: tipo.tipo === op.tipo ? 'var(--accent-fraco, var(--panel))' : 'var(--panel)',
              fontWeight: tipo.tipo === op.tipo ? 'bold' : 'normal',
            }}
          >
            {op.tipo}
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2, fontWeight: 'normal' }}>
              Pancada Sobrenatural causa dano {op.dano}. Ação Bônus/Vínculo Vital: ver ⓘ da montaria (controle manual).
            </div>
          </div>
        ))}
        <div className="btn btn-primary" style={{ marginTop: 8, textAlign: 'center' }} onClick={confirmar}>
          Convocar
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
