import { useState } from 'react';
import { podeMarcarEfeito, type EfeitoAoAcertar } from '../../core/efeitosAoAcertar';
import styles from './TrocarArmaMaestria.module.css';

interface EfeitosAoAcertarModalProps {
  efeitos: EfeitoAoAcertar[];
  /** Pontos de Foco que ainda sobram — bloqueia marcar mais efeitos do que o Foco paga. */
  focoRestante: number;
  onConfirmar: (idsMarcados: string[]) => void;
}

const ESTILO_TAG = {
  display: 'inline-block',
  marginLeft: 6,
  padding: '0 6px',
  border: '1px solid var(--accent)',
  borderRadius: 999,
  fontSize: 10,
  fontWeight: 'normal',
  color: 'var(--accent)',
  verticalAlign: 'middle',
} as const;

/** Lista "ao acertar" (checkbox on/off, 0..N), aberta logo depois do d20 acertar quando há algum efeito
 * elegível. Cada linha tem a tag de origem (Monge, Talento, Espécie...). Não fecha tocando fora: é uma
 * decisão que o jogador precisa ver (`CONVENCOES-UI.md`). Confirmar com nada marcado só segue o dano normal. */
export default function EfeitosAoAcertarModal({ efeitos, focoRestante, onConfirmar }: EfeitosAoAcertarModalProps) {
  const [marcados, setMarcados] = useState<ReadonlySet<string>>(new Set());

  function alternar(efeito: EfeitoAoAcertar) {
    if (!podeMarcarEfeito(efeito, efeitos, marcados, focoRestante)) return;
    setMarcados((atual) => {
      const novo = new Set(atual);
      if (novo.has(efeito.id)) novo.delete(efeito.id);
      else novo.add(efeito.id);
      return novo;
    });
  }

  return (
    <div className={styles.overlay} style={{ zIndex: 120 }}>
      <div className={styles.card}>
        <div className={styles.title}>Efeitos ao acertar</div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
          Marque os que quer usar neste acerto (pode ser nenhum).
        </div>
        {efeitos.map((efeito) => {
          const marcado = marcados.has(efeito.id);
          const bloqueado = !podeMarcarEfeito(efeito, efeitos, marcados, focoRestante);
          return (
            <div
              key={efeito.id}
              className={`opt-card ${marcado ? 'selected' : ''}`}
              style={bloqueado ? { opacity: 0.5 } : undefined}
              onClick={() => alternar(efeito)}
            >
              <div className="opt-card-name">
                {marcado ? '☑' : '☐'} {efeito.nome}
                <span style={ESTILO_TAG}>{efeito.origem}</span>
              </div>
              <div className="opt-card-desc">
                {efeito.descricao}
                {efeito.custoFoco ? ` Custo: ${efeito.custoFoco} Ponto de Foco.` : ''}
                {bloqueado ? ' (Foco insuficiente.)' : ''}
              </div>
            </div>
          );
        })}
        <div
          className="btn btn-primary"
          style={{ marginTop: 10, textAlign: 'center' }}
          onClick={() => onConfirmar(efeitos.filter((e) => marcados.has(e.id)).map((e) => e.id))}
        >
          {marcados.size === 0 ? 'Rolar dano sem efeitos' : `Rolar dano (${marcados.size} efeito${marcados.size > 1 ? 's' : ''})`}
        </div>
      </div>
    </div>
  );
}
