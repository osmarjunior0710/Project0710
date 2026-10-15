import { useEffect, useState } from 'react';
import { useRoll, type RollState } from '../../roll/RollContext';

const TITULO = '🧠 Mente Aguçada';

/** Cena de exploração pra "Mente Aguçada" (Psiônico, UA, E4d-b — ver EmDev.md).
 *
 * Mecânica real (Modo de Ataque): "Uma vez por turno, quando você causar dano
 * Psíquico, você pode substituir o número obtido em UM DOS DADOS de dano pelo
 * número anotado quando ativou a Disciplina."
 *
 * O motor de dado (`RollContext`) só devolve o TOTAL quando a rolagem tem 1
 * dado só — com 2+ dados ele JÁ guarda cada resultado individual em
 * `estado.dadosIndividuais` (mesma infra do Perfurador, que deixa escolher 1
 * dado pra rerolar). Esta cena lê esse grid (só leitura) pra decidir sozinha
 * qual dado faria sentido trocar — sempre o MENOR, e só sugere a troca quando
 * o número anotado é MAIOR que ele (trocar por um valor igual/menor nunca
 * ajuda, pedido do Osmar: a escolha "óbvia" não devia precisar de decisão
 * manual).
 *
 * 2 rodadas de feedback do Osmar testando ao vivo:
 * 1ª — o botão de troca apareceu NUM CARD ATRÁS do popup de dano, em vez de
 * DENTRO dele.
 * 2ª — mesmo corrigido pra dentro do popup, não gostou do botão ao lado do
 * "OK" — pediu TÍTULO + CARD CLICÁVEL empilhados abaixo do total, o card
 * fica cinza quando já usado, e um efeito visual no dado trocado + no total
 * atualizando.
 * Resolvido com `OfertaTrocaDeDado` (ver `RollContext.tsx`) — capacidade
 * genérica nova do popup de dano (não exclusiva desta cena): título + card
 * clicável entre o total e o fechamento, SEMPRE empilhado (nunca ao lado de
 * outro botão); clicar troca o dado (anima o dado específico + o total) e
 * marca usado (card vira cinza). Nenhuma escrita em produção — só mockup
 * local. */
export default function MenteAgucadaCena() {
  const { rolarDados, estado } = useRoll();

  const [ativa, setAtiva] = useState(false);
  const [anotado, setAnotado] = useState<number | null>(null);
  const [usadaNesteTurno, setUsadaNesteTurno] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  // Reage ao app ter aplicado a troca (RollContext cuida do dado/total —
  // esta cena só precisa saber QUANDO aconteceu, pra travar "1x por turno"
  // e registrar no log).
  useEffect(() => {
    if (estado?.fase === 'concluido' && estado.ofertaTrocaDeDado?.titulo === TITULO && estado.ofertaTrocaDeDadoUsada) {
      setUsadaNesteTurno((ja) => {
        if (ja) return ja;
        empilhar(`${estado.label} — Modo de Ataque usado. Novo total: ${estado.total}.`);
        return true;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado?.ofertaTrocaDeDadoUsada, estado?.fase]);

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

  function avaliarOferta(est: RollState): { texto: string; dadoId: string; novoValor: number } | null {
    if (!ativa || usadaNesteTurno || anotado === null || !est.dadosIndividuais) return null;
    const numericos = est.dadosIndividuais.filter((d) => typeof d.valor === 'number');
    if (numericos.length === 0) return null;
    const menorDado = numericos.reduce((a, b) => ((a.valor as number) <= (b.valor as number) ? a : b));
    const menor = menorDado.valor as number;
    if (anotado <= menor) return null;
    return { texto: `Trocar menor resultado (${menor}) por (${anotado})`, dadoId: menorDado.id, novoValor: anotado };
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
      ofertaTrocaDeDado: { titulo: TITULO, avaliar: avaliarOferta },
    });
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        1. Ativa (rola 1d12, "anota o número"). 2. Simula o dano Psíquico de uma magia (2+ dados). 3. Se o
        número anotado for MAIOR que o menor dado rolado, aparece "Mente Aguçada" + um card clicável
        abaixo do total, dentro do próprio popup — tocar troca o dado (com efeito) e o card vira cinza.
        Se os dados já forem iguais ou melhores, nem aparece.
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
