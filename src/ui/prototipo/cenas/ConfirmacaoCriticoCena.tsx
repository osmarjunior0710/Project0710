import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import styles from '../../components/TrocarArmaMaestria.module.css';

/** Protótipo da house rule "confirmação de crítico" (ver `EmDev.md`,
 * foco "Melhorias e correções"). Regras confirmadas no Livro do Jogador,
 * Cap. 1: 20 natural em ataque = acerto crítico (dobra os DADOS de dano,
 * modificador só 1x); 1 natural em ataque = erro automático. Só ataque
 * tem essa regra — Teste de Perícia nunca ganha 2º d20.
 *
 * O 1º d20 e o d20 de confirmação são simulados AQUI (número mostrado no
 * popup local), não pelo `RollContext`, pra poder forçar 1/20 sem ligar o
 * Modo de Teste global. O DANO usa o `rolarDados` real. */

type Etapa = { tipo: 'primeiro'; d20: number } | { tipo: 'confirmado'; d20: number; confirmacao: number };

const MOD_ATAQUE = 5;

function sortearD20(): number {
  return 1 + Math.floor(Math.random() * 20);
}

export default function ConfirmacaoCriticoCena() {
  const { rolarDados } = useRoll();
  const [houseRule, setHouseRule] = useState(true);
  const [etapa, setEtapa] = useState<Etapa | null>(null);
  const [pericia, setPericia] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  function atacar(forcado?: number) {
    setPericia(null);
    setEtapa({ tipo: 'primeiro', d20: forcado ?? sortearD20() });
  }

  function testarPericia(forcado: number) {
    setEtapa(null);
    setPericia(forcado);
    empilhar(`Teste de Perícia: ${forcado} + ${MOD_ATAQUE} = ${forcado + MOD_ATAQUE} — sem 2º dado, nunca.`);
  }

  function rolarConfirmacao() {
    setEtapa((e) => (e ? { tipo: 'confirmado', d20: e.d20, confirmacao: sortearD20() } : e));
  }

  function rolarDano(dobrado: boolean) {
    setEtapa(null);
    const qtd = dobrado ? 2 : 1;
    rolarDados({
      label: dobrado ? 'Dano Dobrado (crítico)' : 'Dano da Espada',
      formula: `${qtd}d8+3`,
      quantidade: qtd,
      lados: 8,
      mod: 3,
      onResultado: (total) => empilhar(`${dobrado ? 'Dano dobrado' : 'Dano'}: ${total} (${qtd}d8 + 3).`),
    });
  }

  function encerrar(texto: string) {
    setEtapa(null);
    empilhar(texto);
  }

  const d20 = etapa?.d20 ?? 0;
  const nat1 = d20 === 1;
  const nat20 = d20 === 20;
  const critico = nat1 || nat20;
  const precisaConfirmar = houseRule && critico && etapa?.tipo === 'primeiro';

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Fluxo da house rule “confirmação de crítico”. O d20 do ataque e o de confirmação são simulados aqui (pra você
        forçar 1 ou 20); o dano é rolado de verdade.
      </p>

      <div
        className="box-solid"
        style={{ marginBottom: 12, padding: 10, cursor: 'pointer' }}
        onClick={() => setHouseRule((v) => !v)}
      >
        {houseRule ? '☑' : '☐'} House rule: confirmação de crítico ligada
      </div>

      <div className="label" style={{ marginBottom: 6 }}>
        Ataque (Espada, +{MOD_ATAQUE})
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="btn btn-primary" onClick={() => atacar()}>
          🗡 Sortear
        </div>
        <div className="btn" onClick={() => atacar(1)}>
          Forçar 1
        </div>
        <div className="btn" onClick={() => atacar(12)}>
          Forçar 12
        </div>
        <div className="btn" onClick={() => atacar(20)}>
          Forçar 20
        </div>
      </div>

      <div className="label" style={{ marginBottom: 6 }}>
        Teste de Perícia (nunca tem 2º dado)
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="btn" onClick={() => testarPericia(1)}>
          Forçar 1
        </div>
        <div className="btn" onClick={() => testarPericia(20)}>
          Forçar 20
        </div>
      </div>
      {pericia !== null && (pericia === 1 || pericia === 20) && (
        <div style={{ fontSize: 13, marginBottom: 12, color: pericia === 1 ? 'var(--danger)' : 'var(--good)' }}>
          {pericia === 1 ? '😢 FALHA CRÍTICA' : '🎉 SUCESSO CRÍTICO'} — só mostra o resultado, sem botões.
        </div>
      )}

      {etapa && (
        <div className={styles.overlay}>
          <div className={styles.card} onClick={(e) => e.stopPropagation()}>
            <div className={styles.title}>Ataque de Espada</div>
            <div style={{ fontSize: 34, fontWeight: 'bold' }}>{d20}</div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>
              {d20} + {MOD_ATAQUE} = {d20 + MOD_ATAQUE}
            </div>
            {nat1 && <div style={{ color: 'var(--danger)', fontWeight: 'bold', marginBottom: 8 }}>😢 FALHA CRÍTICA</div>}
            {nat20 && <div style={{ color: 'var(--good)', fontWeight: 'bold', marginBottom: 8 }}>🎉 ACERTO CRÍTICO!</div>}

            {etapa.tipo === 'confirmado' && (
              <div style={{ margin: '8px 0', padding: 8, border: '1px dashed var(--line)' }}>
                <div className="label">Dado de confirmação</div>
                <div style={{ fontSize: 22, fontWeight: 'bold' }}>{etapa.confirmacao}</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                  {etapa.confirmacao} + {MOD_ATAQUE} = {etapa.confirmacao + MOD_ATAQUE} — só informativo (o Mestre compara
                  com a CA; um 1 aqui é só o número).
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px dashed var(--line)', margin: '8px 0 12px' }} />

            {precisaConfirmar && (
              <div className="btn btn-primary" onClick={rolarConfirmacao}>
                🎲 Rolar dado de confirmação
              </div>
            )}

            {!precisaConfirmar && !critico && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="btn" onClick={() => encerrar('Errou.')}>
                  Errei
                </div>
                <div className="btn btn-primary" onClick={() => rolarDano(false)}>
                  Acertei
                </div>
              </div>
            )}

            {!precisaConfirmar && nat1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="btn" onClick={() => encerrar('Errou — nada acontece.')}>
                  Errei
                </div>
                <div className="btn btn-primary" onClick={() => rolarDano(false)}>
                  Rolar Dano
                </div>
              </div>
            )}

            {!precisaConfirmar && nat20 && !houseRule && (
              <div className="btn btn-primary" onClick={() => rolarDano(true)}>
                Rolar Dobro do Dano
              </div>
            )}

            {!precisaConfirmar && nat20 && houseRule && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="btn btn-primary" onClick={() => rolarDano(false)}>
                  Rolar Dano
                </div>
                <div className="btn btn-primary" onClick={() => rolarDano(true)}>
                  Rolar Dano Dobrado
                </div>
              </div>
            )}
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
