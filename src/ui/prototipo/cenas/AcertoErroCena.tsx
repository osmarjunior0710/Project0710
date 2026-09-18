import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';

/** Cena "Acerto/Erro" (Variante D, ver sdd/sdd-fluxo-rolagem.md) — o
 * POPUP DE VERDADE (`RollOverlay`) ganhou "Errei"/"Acertei" no rodapé
 * (via `RollD20Options.confirmarAcerto`, protótipo) e o popup de dano
 * ganhou a escolha de efeito embutida antes do "OK" (via
 * `RollDadosOptions.efeitosExtras`) — nada de tela separada, o fluxo
 * inteiro acontece dentro da mesma rolagem/popup que o jogo já usa.
 * "Goblin" é só um número/estado de mentirinha na tela. */

const EFEITOS = ['Debilitador', 'Poderoso'];
const TAG_DO_EFEITO: Record<string, string> = {
  Debilitador: '🩸 Debilitado',
  Poderoso: '💨 Empurrado',
};

export default function AcertoErroCena() {
  const { rolarD20, rolarDados } = useRoll();
  const [pvGoblin, setPvGoblin] = useState(10);
  const [statusGoblin, setStatusGoblin] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [atacando, setAtacando] = useState(false);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  function reiniciar() {
    setPvGoblin(10);
    setStatusGoblin(null);
    setLog([]);
    setAtacando(false);
  }

  function rolarDano() {
    rolarDados({
      label: 'Dano do Ataque',
      formula: '1d8+3',
      quantidade: 1,
      lados: 8,
      mod: 3,
      onResultado: (total) => {
        setPvGoblin((pv) => Math.max(0, pv - total));
        empilhar(`Dano rolado: ${total}.`);
      },
      efeitosExtras: {
        titulo: 'Golpe Brutal — escolha 1 efeito (não muda nada aqui, só o log)',
        opcoes: EFEITOS,
        onFecharComEfeito: (escolhido) => {
          if (escolhido) {
            setStatusGoblin(TAG_DO_EFEITO[escolhido]);
            empilhar(`Efeito escolhido: ${escolhido}.`);
          }
          setAtacando(false);
        },
      },
    });
  }

  function atacar() {
    setAtacando(true);
    rolarD20({
      label: 'Ataque no Goblin',
      formula: '1d20+5',
      mod: 5,
      confirmarAcerto: {
        onAcertou: () => {
          empilhar('Acertou — rolando dano…');
          rolarDano();
        },
        onErrou: () => {
          empilhar('Errou.');
          setAtacando(false);
        },
      },
    });
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        O popup de rolagem de verdade já pergunta "Acertou?" antes de liberar o dano, e o popup
        de dano já embute a escolha de efeito antes do "OK" — toque em Atacar e veja.
      </p>

      <div className="box-solid" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>👺 Goblin</div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              {pvGoblin}/10 PV{statusGoblin ? ` · ${statusGoblin}` : ''}
            </div>
          </div>
          <div className="label" style={{ cursor: 'pointer' }} onClick={reiniciar}>
            🔄 reiniciar
          </div>
        </div>
      </div>

      <div className={atacando ? 'btn btn-disabled' : 'btn btn-primary'} onClick={atacando ? undefined : atacar}>
        🗡 Atacar
      </div>

      {log.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="label" style={{ marginBottom: 6 }}>
            o que aconteceu
          </div>
          {log.map((linha, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 2 }}>
              {linha}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
