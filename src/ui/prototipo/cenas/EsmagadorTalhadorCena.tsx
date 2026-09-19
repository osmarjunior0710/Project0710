import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import styles from '../../components/TrocarArmaMaestria.module.css';

/** Cena de validação pro fluxo proposto de Esmagador/Talhador — ver
 * conversa no chat (pedido do Osmar, 2026-09). Diferente do Golpe
 * Brutal (`AcertoErroCena.tsx`), aqui NÃO tem nada pra "renunciar"
 * antes de atacar — o gatilho é 100% automático (bate o tipo de dano
 * da arma + tem o talento + não usou ainda neste turno), então o
 * fluxo Acerto/Erro só entra em cena QUANDO essas 3 condições batem;
 * caso contrário o ataque continua no fluxo antigo (sem perguntar
 * nada), pra não incomodar quem não tem esses talentos.
 *
 * O popup de efeito daqui é local à cena (não usa o
 * `EscolherEfeitoModal` de verdade) porque testa uma variante NOVA
 * dele — 2 botões (Ativar/Não usar) em vez de só "OK" — antes de
 * decidir se isso vira uma opção nova do componente real. */

type TipoDano = 'Contundente' | 'Cortante' | 'Perfurante';

const EFEITO_POR_TALENTO: Record<
  'esmagador' | 'talhador',
  { rotulo: string; tituloPopup: string; textoEfeito: string; tagStatus: string; textoCritico: string }
> = {
  esmagador: {
    rotulo: '🔨 Esmagador',
    tituloPopup: '🔨 Esmagador',
    textoEfeito: 'Empurra o alvo 1,5m pra um espaço livre (se ele não for maior que você).',
    tagStatus: '💨 Empurrado',
    textoCritico: '💥 Crítico com dano Contundente — ataques contra esse alvo têm Vantagem até seu próximo turno.',
  },
  talhador: {
    rotulo: '🗡️ Talhador',
    tituloPopup: '🗡️ Talhador',
    textoEfeito: 'Reduz o Deslocamento do alvo em 3m até o início do seu próximo turno.',
    tagStatus: '🐌 Deslocamento reduzido',
    textoCritico: '💥 Crítico com dano Cortante — o alvo tem Desvantagem em ataques até seu próximo turno.',
  },
};

export default function EsmagadorTalhadorCena() {
  const { rolarD20, rolarDados } = useRoll();
  const [tipoDanoArma, setTipoDanoArma] = useState<TipoDano>('Contundente');
  const [temEsmagador, setTemEsmagador] = useState(true);
  const [temTalhador, setTemTalhador] = useState(true);
  const [esmagadorUsadoTurno, setEsmagadorUsadoTurno] = useState(false);
  const [talhadorUsadoTurno, setTalhadorUsadoTurno] = useState(false);
  const [proximoEhCritico, setProximoEhCritico] = useState(false);

  const [pvGoblin, setPvGoblin] = useState(10);
  const [statusGoblin, setStatusGoblin] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [atacando, setAtacando] = useState(false);
  const [popupAberto, setPopupAberto] = useState<'esmagador' | 'talhador' | null>(null);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  function fimDoTurno() {
    setEsmagadorUsadoTurno(false);
    setTalhadorUsadoTurno(false);
    empilhar('— Fim do Turno — flags de "usado" voltam a ficar livres —');
  }

  function reiniciar() {
    setPvGoblin(10);
    setStatusGoblin(null);
    setLog([]);
    setAtacando(false);
    setPopupAberto(null);
    setEsmagadorUsadoTurno(false);
    setTalhadorUsadoTurno(false);
  }

  // Qual talento entra em jogo NESSE ataque — `null` = nenhum bate
  // (tipo de dano errado, não tem o talento, ou já usou neste turno).
  const talentoAtivavel: 'esmagador' | 'talhador' | null =
    tipoDanoArma === 'Contundente' && temEsmagador && !esmagadorUsadoTurno
      ? 'esmagador'
      : tipoDanoArma === 'Cortante' && temTalhador && !talhadorUsadoTurno
        ? 'talhador'
        : null;

  function marcarUsado(talento: 'esmagador' | 'talhador') {
    if (talento === 'esmagador') setEsmagadorUsadoTurno(true);
    else setTalhadorUsadoTurno(true);
  }

  function rolarDano(talento: 'esmagador' | 'talhador') {
    rolarDados({
      label: 'Dano do Ataque',
      formula: '1d8+3',
      quantidade: 1,
      lados: 8,
      mod: 3,
      onResultado: (total) => {
        setPvGoblin((pv) => Math.max(0, pv - total));
        empilhar(`Dano rolado: ${total}.`);
        if (proximoEhCritico) {
          empilhar(EFEITO_POR_TALENTO[talento].textoCritico);
        }
      },
      confirmarFechamento: { rotulo: EFEITO_POR_TALENTO[talento].rotulo, aoTocar: () => setPopupAberto(talento) },
    });
  }

  function atacar() {
    setAtacando(true);
    const talento = talentoAtivavel;
    if (talento) {
      rolarD20({
        label: 'Ataque no Goblin',
        formula: '1d20+5',
        mod: 5,
        confirmarAcerto: {
          onAcertou: () => {
            empilhar('Acertou — rolando dano…');
            rolarDano(talento);
          },
          onErrou: () => {
            empilhar('Errou.');
            setAtacando(false);
          },
        },
      });
      return;
    }
    // Sem talento ativável nesse ataque: fluxo ANTIGO (igual o
    // "Atacar" de hoje) — rola só o ataque, sem perguntar Acerto/Erro;
    // dano é um botão separado ("Rolar Dano"), não simulado aqui.
    rolarD20({ label: 'Ataque no Goblin', formula: '1d20+5', mod: 5 });
    empilhar('Ataque rolado (fluxo antigo — sem talento ativável nesse ataque; "Rolar Dano" ficaria à parte).');
    setAtacando(false);
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Protótipo do fluxo proposto pra Esmagador/Talhador — ataque normal, sem "renunciar" nada
        antes. Só entra no Acerto/Erro quando a arma bate o tipo de dano certo, o personagem tem o
        talento, e ele ainda não foi usado neste turno.
      </p>

      <div className="box-solid" style={{ marginBottom: 12, padding: 10 }}>
        <div className="label" style={{ marginBottom: 6 }}>
          Configuração de teste
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {(['Contundente', 'Cortante', 'Perfurante'] as TipoDano[]).map((t) => (
            <span
              key={t}
              className="tag"
              style={{
                cursor: 'pointer',
                borderColor: tipoDanoArma === t ? 'var(--accent)' : undefined,
                fontWeight: tipoDanoArma === t ? 'bold' : undefined,
              }}
              onClick={() => setTipoDanoArma(t)}
            >
              arma: {t}
            </span>
          ))}
        </div>
        <div style={{ cursor: 'pointer', marginBottom: 4 }} onClick={() => setTemEsmagador((v) => !v)}>
          {temEsmagador ? '☑' : '☐'} personagem tem Esmagador
        </div>
        <div style={{ cursor: 'pointer', marginBottom: 4 }} onClick={() => setTemTalhador((v) => !v)}>
          {temTalhador ? '☑' : '☐'} personagem tem Talhador
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setProximoEhCritico((v) => !v)}>
          {proximoEhCritico ? '☑' : '☐'} simular Crítico no próximo ataque (só o aviso informativo)
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

      <div style={{ fontSize: 12, marginBottom: 10, color: 'var(--text-faint)' }}>
        Esmagador: {esmagadorUsadoTurno ? 'já usado neste turno' : 'livre'} · Talhador:{' '}
        {talhadorUsadoTurno ? 'já usado neste turno' : 'livre'}
        {talentoAtivavel && (
          <>
            {' '}
            · <strong>este ataque vai perguntar ({talentoAtivavel})</strong>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div className={atacando ? 'btn btn-disabled' : 'btn btn-primary'} onClick={atacando ? undefined : atacar}>
          🗡 Atacar
        </div>
        <div className="btn" onClick={fimDoTurno}>
          ↻ Fim do Turno
        </div>
      </div>

      {popupAberto && (
        <div className={styles.overlay} style={{ zIndex: 60 }} onClick={() => setPopupAberto(null)}>
          <div className={styles.card} onClick={(e) => e.stopPropagation()}>
            <div className={styles.title}>{EFEITO_POR_TALENTO[popupAberto].tituloPopup}</div>
            <div className="opt-card" style={{ marginBottom: 10 }}>
              <div className="opt-card-name">Ativar efeito</div>
              <div className="opt-card-desc">{EFEITO_POR_TALENTO[popupAberto].textoEfeito}</div>
            </div>
            <div
              className="btn btn-primary"
              style={{ marginBottom: 8 }}
              onClick={() => {
                setStatusGoblin(EFEITO_POR_TALENTO[popupAberto].tagStatus);
                empilhar(`Efeito ativado: ${EFEITO_POR_TALENTO[popupAberto].tagStatus}.`);
                marcarUsado(popupAberto);
                setPopupAberto(null);
                setAtacando(false);
              }}
            >
              ✅ Ativar
            </div>
            <div
              className="btn"
              onClick={() => {
                empilhar('Escolheu "Não usar" — talento continua livre pro próximo ataque.');
                setPopupAberto(null);
                setAtacando(false);
              }}
            >
              🚫 Não usar
            </div>
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
