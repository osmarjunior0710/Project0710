import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';

/** Cena "Acerto/Erro" do ambiente de Protótipo — 3 variantes
 * trocáveis do MESMO cenário de mentirinha ("ataca um Goblin de 10
 * PV"), pra decidir ao vivo (não especulando) as perguntas em aberto
 * do sdd/sdd-fluxo-rolagem.md:
 * - o app deveria perguntar "acertou?" depois da rolagem, ou deixar
 *   como hoje (dano/efeito sempre disponíveis, sem gating)?
 * - escolher um efeito deveria aplicar algo real, ou só lembrete?
 *
 * Estado 100% local, "Goblin" é só um número na tela — nada disso
 * mexe em `core/` nem em personagem salvo. */

type Variante = 'A' | 'B' | 'C';

const VARIANTES: { id: Variante; titulo: string; descricao: string }[] = [
  {
    id: 'A',
    titulo: 'A — Como é hoje',
    descricao: 'Rola o ataque; dano e efeito já ficam disponíveis na hora, acerte ou erre.',
  },
  {
    id: 'B',
    titulo: 'B — Confirma acerto',
    descricao: 'Rola o ataque, espera o resultado de verdade, aí pergunta "Acertou?" antes de liberar o resto.',
  },
  {
    id: 'C',
    titulo: 'C — Efeito aplica de verdade',
    descricao: 'Igual à B, mas escolher o efeito muda o PV/estado do Goblin na tela, não só escreve um texto.',
  },
];

const EFEITOS = [
  { nome: 'Debilitador', tag: '🩸 Debilitado', lembrete: 'Alvo com Desvantagem no próximo teste/ataque.' },
  { nome: 'Poderoso', tag: '💨 Empurrado', lembrete: 'Alvo empurrado até 3m de você.' },
];

export default function AcertoErroCena() {
  const { rolarD20, rolarDados } = useRoll();
  const [variante, setVariante] = useState<Variante>('A');

  const [pvGoblin, setPvGoblin] = useState(10);
  const [statusGoblin, setStatusGoblin] = useState<string | null>(null);
  const [faseAtaque, setFaseAtaque] = useState<'antes' | 'aguardando' | 'perguntando' | 'dano' | 'efeito' | 'fim'>(
    'antes',
  );
  const [log, setLog] = useState<string[]>([]);

  function reiniciar() {
    setPvGoblin(10);
    setStatusGoblin(null);
    setFaseAtaque('antes');
    setLog([]);
  }

  function mudarVariante(v: Variante) {
    setVariante(v);
    reiniciar();
  }

  function empilhar(linha: string) {
    setLog((l) => [...l, linha]);
  }

  function atacar() {
    if (variante === 'A') {
      // Réplica do padrão atual: libera o próximo passo na MESMA
      // chamada, sem esperar o resultado da rolagem terminar.
      rolarD20({ label: 'Ataque no Goblin', formula: '1d20+5', mod: 5 });
      empilhar('Ataque rolado (o app não sabe se acertou).');
      setFaseAtaque('dano');
      return;
    }
    setFaseAtaque('aguardando');
    rolarD20({
      label: 'Ataque no Goblin',
      formula: '1d20+5',
      mod: 5,
      onResultado: (total) => {
        empilhar(`Ataque rolado: total ${total}.`);
        setFaseAtaque('perguntando');
      },
    });
  }

  function responderAcerto(acertou: boolean) {
    if (!acertou) {
      empilhar('Você disse que errou — nada mais acontece.');
      setFaseAtaque('fim');
      return;
    }
    empilhar('Confirmado: acertou.');
    setFaseAtaque('dano');
  }

  function rolarDano() {
    rolarDados({
      label: 'Dano do Ataque',
      formula: '1d8+3',
      quantidade: 1,
      lados: 8,
      mod: 3,
      onResultado: (total) => {
        empilhar(`Dano rolado: ${total}.`);
        if (variante === 'C') {
          setPvGoblin((pv) => Math.max(0, pv - total));
        }
        setFaseAtaque('efeito');
      },
    });
  }

  function escolherEfeito(nome: string) {
    const efeito = EFEITOS.find((e) => e.nome === nome)!;
    if (variante === 'C') {
      setStatusGoblin(efeito.tag);
      empilhar(`Efeito aplicado de verdade: Goblin ficou "${efeito.tag}".`);
    } else {
      empilhar(`Lembrete (nada mudou no Goblin): ${efeito.nome} — ${efeito.lembrete}`);
    }
    setFaseAtaque('fim');
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Mesmo cenário de mentirinha nas 3 variantes — troque entre elas e ataque de novo pra
        sentir a diferença.
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {VARIANTES.map((v) => (
          <div
            key={v.id}
            className={v.id === variante ? 'btn btn-primary' : 'btn'}
            style={{ flex: 1, padding: '8px 4px', fontSize: 13 }}
            onClick={() => mudarVariante(v.id)}
          >
            {v.id}
          </div>
        ))}
      </div>

      <div className="box" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 'bold' }}>{VARIANTES.find((v) => v.id === variante)!.titulo}</div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
          {VARIANTES.find((v) => v.id === variante)!.descricao}
        </div>
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

      {faseAtaque === 'antes' && (
        <div className="btn btn-primary" onClick={atacar}>
          🗡 Atacar
        </div>
      )}

      {faseAtaque === 'aguardando' && <div className="label">rolando…</div>}

      {faseAtaque === 'perguntando' && (
        <div>
          <div style={{ marginBottom: 8 }}>Acertou?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="btn btn-primary" style={{ flex: 1 }} onClick={() => responderAcerto(true)}>
              Sim
            </div>
            <div className="btn" style={{ flex: 1 }} onClick={() => responderAcerto(false)}>
              Não
            </div>
          </div>
        </div>
      )}

      {faseAtaque === 'dano' && (
        <div className="btn btn-primary" onClick={rolarDano}>
          🎲 Rolar Dano
        </div>
      )}

      {faseAtaque === 'efeito' && (
        <div>
          <div style={{ marginBottom: 8 }}>Escolha o efeito:</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {EFEITOS.map((e) => (
              <div key={e.nome} className="btn" style={{ flex: 1 }} onClick={() => escolherEfeito(e.nome)}>
                {e.nome}
              </div>
            ))}
          </div>
        </div>
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
