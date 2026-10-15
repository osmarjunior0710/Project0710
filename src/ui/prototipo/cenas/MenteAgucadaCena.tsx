import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';

/** Cena de exploração pra "Mente Aguçada" (Psiônico, UA, E4d-b — ver EmDev.md).
 *
 * Mecânica real (Modo de Ataque): "Uma vez por turno, quando você causar dano
 * Psíquico, você pode substituir o número obtido em UM DOS DADOS de dano pelo
 * número anotado quando ativou a Disciplina."
 *
 * O motor de dado (`RollContext`) só devolve o TOTAL quando a rolagem tem 1
 * dado só — com 2+ dados ele JÁ guarda cada resultado individual em
 * `estado.dadosIndividuais` (mesma infra do Perfurador, que deixa escolher 1
 * dado pra rerolar). Esta cena lê esse grid (só leitura, não mexe no motor)
 * pra decidir sozinha qual dado faria sentido trocar — sempre o MENOR, e só
 * sugere a troca quando o número anotado é MAIOR que ele (trocar por um valor
 * menor nunca ajuda, pedido do Osmar: a escolha "óbvia" não devia precisar de
 * decisão manual). Nenhuma escrita em produção — só mockup local. */
export default function MenteAgucadaCena() {
  const { rolarDados, estado } = useRoll();
  const [ativa, setAtiva] = useState(false);
  const [anotado, setAnotado] = useState<number | null>(null);
  const [usadaNesteTurno, setUsadaNesteTurno] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  function ativar() {
    rolarDados({
      label: '🧠 Mente Aguçada — anotar número',
      formula: '1d12',
      quantidade: 1,
      lados: 12,
      mod: 0,
      onResultado: (total) => {
        setAnotado(total);
        setAtiva(true);
        setUsadaNesteTurno(false);
        empilhar(`Mente Aguçada ativada — número anotado: ${total}.`);
      },
      confirmarFechamento: {},
    });
  }

  function encerrar() {
    setAtiva(false);
    setAnotado(null);
    empilhar('Mente Aguçada encerrada manualmente — anotação apagada.');
  }

  function fimDoTurno() {
    setUsadaNesteTurno(false);
    empilhar('Fim do Turno — Modo de Ataque disponível de novo (Mente Aguçada continua ATIVA, dura 1 minuto).');
  }

  function simularDanoMagia(nomeMagia: string, quantidade: number, lados: number) {
    rolarDados({
      label: `✨ ${nomeMagia} — Dano Psíquico`,
      formula: `${quantidade}d${lados}`,
      quantidade,
      lados,
      mod: 0,
      onResultado: (total) => {
        empilhar(`${nomeMagia} — dano rolado: ${total}.`);
      },
      confirmarFechamento: {},
    });
  }

  // Lê o grid de dados individuais da rolagem que acabou de concluir (só
  // disponível com 2+ dados) pra calcular a sugestão de troca.
  const grid = estado?.fase === 'concluido' && estado.tipo === 'dados' ? (estado.dadosIndividuais ?? null) : null;
  const valoresNumericos = grid?.filter((d) => typeof d.valor === 'number').map((d) => d.valor as number) ?? [];
  const menorValor = valoresNumericos.length > 0 ? Math.min(...valoresNumericos) : null;
  const podeOferecerTroca =
    ativa && !usadaNesteTurno && grid !== null && menorValor !== null && anotado !== null && anotado > menorValor;

  function aplicarTroca() {
    if (menorValor === null || anotado === null || !estado || estado.total === null) return;
    const novoTotal = estado.total - menorValor + anotado;
    setUsadaNesteTurno(true);
    empilhar(`Modo de Ataque usado — trocou o menor dado (${menorValor}) pelo número anotado (${anotado}). Total: ${estado.total} → ${novoTotal}.`);
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        1. Ativa (rola 1d12, "anota o número"). 2. Simula o dano Psíquico de uma magia (2+ dados, pra
        aparecer o grid). 3. Se o número anotado for MAIOR que o menor dado rolado, aparece um botão só
        pra trocar — a decisão "vale a pena?" já vem resolvida pelo app, nunca pergunta quando trocar
        seria pior.
      </p>

      <div className="box-solid" style={{ marginBottom: 12, padding: 10 }}>
        <div className="opt-card" style={{ borderColor: ativa ? '#b36bd6' : undefined }}>
          <div className="opt-card-name">🧠 Mente Aguçada {ativa ? 'ATIVA' : ''}</div>
          <div className="opt-card-desc">
            {ativa
              ? `Ignorando Psiônicos (texto informativo — resistência a dano Psíquico de inimigos, o app não rastreia). Modo de Ataque: 1x por turno, dano Psíquico pode trocar o menor dado pelo número anotado (${anotado}). Dura 1 minuto ou até Incapacitado — toque abaixo pra encerrar.`
              : 'No início do seu turno, gaste 1 Dado de Energia Psiônica: role e anote um número. Por 1 minuto, ignora Resistência a dano Psíquico e pode, 1x por turno, trocar o menor dado de um dano Psíquico pelo número anotado.'}
          </div>
          {!ativa ? (
            <div className="btn btn-primary" style={{ marginTop: 8 }} onClick={ativar}>
              Ativar (gasta 1 Dado de Energia Psiônica)
            </div>
          ) : (
            <>
              <div
                className="btn"
                style={{ marginTop: 8, background: 'rgba(178, 59, 59, 0.16)', borderColor: '#b23b3b' }}
                onClick={encerrar}
              >
                Encerrar Mente Aguçada
              </div>
              <div className="btn" style={{ marginTop: 8 }} onClick={fimDoTurno}>
                (simular) Fim do Turno
              </div>
            </>
          )}
        </div>
      </div>

      <div className="box-solid" style={{ marginBottom: 12, padding: 10 }}>
        <div className="label" style={{ marginBottom: 6 }}>
          Simular conjuração de magia Psiônica com dano Psíquico
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div className="btn" onClick={() => simularDanoMagia('Lança Psíquica', 7, 6)}>
            Lança Psíquica (7d6)
          </div>
          <div className="btn" onClick={() => simularDanoMagia('Explosão Concussiva', 6, 8)}>
            Explosão Concussiva (6d8)
          </div>
        </div>
      </div>

      {podeOferecerTroca && (
        <div className="box-solid" style={{ marginBottom: 12, padding: 10, borderColor: '#b36bd6' }}>
          <div className="label" style={{ marginBottom: 6 }}>
            🔮 Mente Aguçada disponível
          </div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            Dados rolados: {valoresNumericos.join(', ')} — menor foi <b>{menorValor}</b>. Número anotado:{' '}
            <b>{anotado}</b>.
          </div>
          <div className="btn btn-primary" onClick={aplicarTroca}>
            Trocar {menorValor} pelo anotado ({anotado})
          </div>
        </div>
      )}
      {ativa && !usadaNesteTurno && grid !== null && !podeOferecerTroca && (
        <p style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 12 }}>
          (Mente Aguçada não oferece troca aqui — o número anotado ({anotado}) não é maior que nenhum dado
          rolado, trocar só pioraria o total.)
        </p>
      )}
      {ativa && usadaNesteTurno && (
        <p style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 12 }}>
          Modo de Ataque já usado neste turno — só libera de novo no próximo turno.
        </p>
      )}

      <div className="section-title">Log</div>
      {log.map((linha, i) => (
        <div key={i} style={{ fontSize: 12, color: 'var(--text-faint)' }}>
          {linha}
        </div>
      ))}
    </div>
  );
}
