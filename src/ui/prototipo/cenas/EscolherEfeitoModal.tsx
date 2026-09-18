import { useState } from 'react';
import styles from '../../components/TrocarArmaMaestria.module.css';

interface OpcaoEfeito {
  nome: string;
  texto: string;
}

interface EscolherEfeitoModalProps {
  titulo: string;
  opcoes: OpcaoEfeito[];
  onEscolher: (nome: string) => void;
  onFechar: () => void;
}

/** [Protótipo, ver sdd/sdd-fluxo-rolagem.md] Popup 3 da Variante D —
 * só abre quando o "botão especial" do popup de dano é tocado (ver
 * `confirmarFechamento` em `RollContext.tsx`). Mesmo padrão visual dos
 * modais reais (`ColheitaMacabraModal`/`FuriaImplacavelModal`,
 * reaproveitando `TrocarArmaMaestria.module.css`) — cada opção é um
 * `opt-card` (título + parágrafo, mesmo padrão já usado no picker real
 * de Golpe Brutal em `CombatTab.tsx`). Tocar numa opção só SELECIONA;
 * só o "OK" (desabilitado até escolher) fecha e confirma. */
export default function EscolherEfeitoModal({ titulo, opcoes, onEscolher, onFechar }: EscolherEfeitoModalProps) {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  return (
    <div className={styles.overlay} style={{ zIndex: 60 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        {opcoes.map((opcao) => (
          <div
            key={opcao.nome}
            className={`opt-card ${selecionado === opcao.nome ? 'selected' : ''}`}
            onClick={() => setSelecionado(opcao.nome)}
          >
            <div className="opt-card-name">{opcao.nome}</div>
            <div className="opt-card-desc">{opcao.texto}</div>
          </div>
        ))}
        <div
          className={`btn btn-primary${selecionado ? '' : ' btn-disabled'}`}
          style={{ marginTop: 10, textAlign: 'center' }}
          onClick={() => selecionado && onEscolher(selecionado)}
        >
          OK
        </div>
      </div>
    </div>
  );
}
