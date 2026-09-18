import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import EscolherEfeitoModal from '../../components/EscolherEfeitoModal';

/** Cena "Acerto/Erro" (Variante D, ver sdd/sdd-fluxo-rolagem.md) — o
 * popup de rolagem de verdade (`RollOverlay`) ganhou "Errei"/"Acertei"
 * no rodapé (`RollD20Options.confirmarAcerto`) e o popup de dano
 * ganhou um botão de fechamento condicional (`RollDadosOptions.
 * confirmarFechamento`): "OK" simples quando o personagem não tem
 * nenhuma característica com escolha de efeito, ou o NOME da
 * característica (ex. "🔨 Golpe Brutal") quando tem — tocar nesse
 * botão especial fecha o popup de dano e abre um 3º popup
 * (`EscolherEfeitoModal`) com a lista de efeitos de verdade.
 * "Goblin"/"tem Golpe Brutal" são só estado de mentirinha na tela. */

const EFEITOS = [
  {
    nome: 'Golpe Debilitador',
    texto: 'O Deslocamento do alvo é reduzido em 4,5m até o início do seu próximo turno.',
  },
  {
    nome: 'Golpe Poderoso',
    texto: 'O alvo é empurrado 4,5m pra longe de você.',
  },
];
const TAG_DO_EFEITO: Record<string, string> = {
  'Golpe Debilitador': '🩸 Debilitado',
  'Golpe Poderoso': '💨 Empurrado',
};

export default function AcertoErroCena() {
  const { rolarD20, rolarDados } = useRoll();
  const [temGolpeBrutal, setTemGolpeBrutal] = useState(true);
  const [pvGoblin, setPvGoblin] = useState(10);
  const [statusGoblin, setStatusGoblin] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [atacando, setAtacando] = useState(false);
  const [modalEfeitoAberto, setModalEfeitoAberto] = useState(false);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  function reiniciar() {
    setPvGoblin(10);
    setStatusGoblin(null);
    setLog([]);
    setAtacando(false);
    setModalEfeitoAberto(false);
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
      // Condicional: só personagem com a característica ganha o botão
      // especial (abre o popup de efeito) — sem ela, é "OK" normal.
      confirmarFechamento: temGolpeBrutal
        ? { rotulo: '🔨 Golpe Brutal', aoTocar: () => setModalEfeitoAberto(true) }
        : { aoTocar: () => setAtacando(false) },
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
        Toque em Atacar — o popup de dano só oferece o botão de Golpe Brutal quando o personagem
        tem a característica; sem ela, é só "OK".
      </p>

      <div
        className="label"
        style={{ marginBottom: 12, cursor: 'pointer' }}
        onClick={() => setTemGolpeBrutal((v) => !v)}
      >
        {temGolpeBrutal ? '☑' : '☐'} personagem tem Golpe Brutal (toque pra alternar)
      </div>

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

      {modalEfeitoAberto && (
        <EscolherEfeitoModal
          titulo="🔨 Golpe Brutal — escolha 1 efeito"
          opcoes={EFEITOS}
          onEscolher={([nome]) => {
            setStatusGoblin(TAG_DO_EFEITO[nome]);
            empilhar(`Efeito escolhido: ${nome}.`);
            setModalEfeitoAberto(false);
            setAtacando(false);
          }}
          onFechar={() => {
            setModalEfeitoAberto(false);
            setAtacando(false);
          }}
        />
      )}

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
