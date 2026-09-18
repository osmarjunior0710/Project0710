import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';

/** 1ª cena do ambiente de Protótipo — só prova que dá pra reaproveitar
 * o `RollContext`/`RollOverlay` de verdade (mesma sensação tátil da
 * rolagem real) fora do fluxo de personagem, sem `armazenamentoPersonagens`
 * nem `core/calculoPersonagem` no meio. Serve de gabarito pras cenas
 * de verdade (Entrega B, ver `sdd/sdd-fluxo-rolagem.md`). */
export default function ExemploRolagemSimples() {
  const { rolarD20 } = useRoll();
  const [ultimoResultado, setUltimoResultado] = useState<number | null>(null);

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        Rola um d20 de mentirinha, sem nenhum personagem por trás — prova que o ambiente
        consegue reaproveitar peças reais da UI (RollContext/RollOverlay) direto.
      </p>
      <div
        className="btn btn-primary"
        onClick={() =>
          rolarD20({
            label: 'Rolagem de exemplo',
            formula: '1d20',
            mod: 0,
            onResultado: (total) => setUltimoResultado(total),
          })
        }
      >
        🎲 Rolar
      </div>
      {ultimoResultado !== null && (
        <p style={{ marginTop: 16 }}>
          Último resultado: <strong>{ultimoResultado}</strong>
        </p>
      )}
    </div>
  );
}
