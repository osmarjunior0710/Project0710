import { useState } from 'react';
import styles from './TrocarArmaMaestria.module.css';

interface OpcaoEfeito {
  nome: string;
  texto: string;
}

interface EscolherEfeitoModalProps {
  titulo: string;
  opcoes: OpcaoEfeito[];
  /** Quantas opções precisam estar marcadas pro "OK" habilitar —
   * padrão 1 (Golpe Brutal nível 9-16; nível 17+ passa 2). */
  maxEscolhas?: number;
  onEscolher: (nomes: string[]) => void;
  onFechar: () => void;
}

/** Popup de escolha de efeito pós-acerto (ver
 * `DECISOES-COMBATE.md` "Fluxo Acerto/Erro" — 3ª peça do padrão,
 * disparado pelo `confirmarFechamento` do popup de dano). Não é
 * rolagem de dado, é escolha pura — por isso vive fora do
 * `RollOverlay`, mesmo padrão visual dos outros modais reais
 * (`ColheitaMacabraModal`/`FuriaImplacavelModal`,
 * `TrocarArmaMaestria.module.css`). Cada opção é um `opt-card`
 * (título + parágrafo, mesmo padrão já usado na aba Combate). Tocar
 * numa opção só seleciona/desseleciona; só o "OK" (desabilitado até
 * `maxEscolhas` estarem marcadas) confirma e fecha. */
export default function EscolherEfeitoModal({
  titulo,
  opcoes,
  maxEscolhas = 1,
  onEscolher,
  onFechar,
}: EscolherEfeitoModalProps) {
  const [selecionados, setSelecionados] = useState<string[]>([]);

  function tocarOpcao(nome: string) {
    if (maxEscolhas <= 1) {
      setSelecionados([nome]);
      return;
    }
    setSelecionados((atual) => {
      if (atual.includes(nome)) return atual.filter((n) => n !== nome);
      if (atual.length >= maxEscolhas) return atual;
      return [...atual, nome];
    });
  }

  const podeConfirmar = selecionados.length === maxEscolhas;

  return (
    <div className={styles.overlay} style={{ zIndex: 60 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        {opcoes.map((opcao) => (
          <div
            key={opcao.nome}
            className={`opt-card ${selecionados.includes(opcao.nome) ? 'selected' : ''}`}
            onClick={() => tocarOpcao(opcao.nome)}
          >
            <div className="opt-card-name">{opcao.nome}</div>
            <div className="opt-card-desc">{opcao.texto}</div>
          </div>
        ))}
        <div
          className={`btn btn-primary${podeConfirmar ? '' : ' btn-disabled'}`}
          style={{ marginTop: 10, textAlign: 'center' }}
          onClick={() => podeConfirmar && onEscolher(selecionados)}
        >
          OK
        </div>
      </div>
    </div>
  );
}
