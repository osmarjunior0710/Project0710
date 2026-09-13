import { useEffect, useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import { carregarDiceBox3D, garantirTemaDiceBox3D, DICE3D_CANVAS_HOST_ID } from '../../roll/diceBox3d';
import styles from './Dice3dFab.module.css';

const TIPOS = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const;
type TipoDado = (typeof TIPOS)[number];

// Painel mostra só ~5 por vez (o resto rola por dentro) — altura por
// item calculada pra bater com o CSS de .logItem (2 linhas + padding).
const LOG_VISIVEIS = 5;
const LOG_ALTURA_ITEM_PX = 52;

// Todas as texturas do pacote oficial @3d-dice/dice-themes (ver
// DECISOES-COMBATE.md) — pedido do Osmar foi colocar todas pra ele
// escolher quais ficam na versão final. `suportaCor` = tema de
// material "color" (aceita tingimento via themeColor); os outros têm
// aparência fixa e ignoram a cor escolhida.
interface TemaOpcao {
  id: string;
  nome: string;
  suportaCor: boolean;
}

const TEMAS: TemaOpcao[] = [
  { id: 'default', nome: 'Padrão', suportaCor: true },
  { id: 'smooth', nome: 'Liso', suportaCor: true },
  { id: 'gemstone', nome: 'Gema', suportaCor: true },
  { id: 'rock', nome: 'Pedra', suportaCor: true },
  { id: 'rust', nome: 'Ferrugem', suportaCor: true },
  { id: 'gemstoneMarble', nome: 'Mármore de Gema', suportaCor: false },
  { id: 'blueGreenMetal', nome: 'Metal Azul/Verde', suportaCor: false },
  { id: 'diceOfRolling', nome: 'Dado de Mesa', suportaCor: false },
  { id: 'wooden', nome: 'Madeira', suportaCor: false },
];

// Primárias + secundárias + preto/branco — lista fixa pronta em vez
// de um seletor de cor livre (mais rápido de usar no celular).
const CORES = [
  { nome: 'Vermelho', hex: '#c0392b' },
  { nome: 'Azul', hex: '#2e6da4' },
  { nome: 'Amarelo', hex: '#d4ac0d' },
  { nome: 'Verde', hex: '#2e8555' },
  { nome: 'Laranja', hex: '#d4690d' },
  { nome: 'Roxo', hex: '#7d3c98' },
  { nome: 'Preto', hex: '#1c1c1c' },
  { nome: 'Branco', hex: '#f2f2f2' },
] as const;

/** Ferramenta avulsa de dado 3D (Fase A do `sdd/sdd-dado-3d.md`) —
 * `@3d-dice/dice-box` (BabylonJS + Ammo.js, roda em Web Worker) é
 * carregado sob demanda (dynamic import) assim que a Ficha abre — não
 * bloqueia o carregamento inicial do app, mas já fica pronto antes do
 * jogador tocar o FAB pela 1ª vez. O log de rolagens é compartilhado
 * com o resto da Ficha (`RollContext.log`) — toda rolagem real do jogo
 * também aparece aqui, e vice-versa. Ainda não é o motor oficial de
 * rolagem do jogo (isso é a Fase B, ver o SDD) — este FAB é só uma
 * ferramenta avulsa que o jogador aciona quando quiser rolar dado com
 * física de verdade, sem estar ligada a nenhuma perícia/ataque
 * específico ainda.
 */
export default function Dice3dFab() {
  const { log, adicionarLog, estado } = useRoll();
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const [modoMultiplo, setModoMultiplo] = useState(false);
  const [selecoes, setSelecoes] = useState<Partial<Record<TipoDado, number>>>({});
  const [logAberto, setLogAberto] = useState(false);
  const [temaId, setTemaId] = useState(TEMAS[0].id);
  const [corHex, setCorHex] = useState<string>(CORES[0].hex);
  const [customAberto, setCustomAberto] = useState(false);

  // `true` = uma rolagem OFICIAL (perícia/ataque/etc, RollOverlay) está
  // usando o motor 3D agora — o host do canvas (compartilhado, ver
  // diceBox3d.ts) precisa ficar visível mesmo com este FAB fechado,
  // senão o RollOverlay não tem onde mostrar o dado físico.
  const rollOficialUsando3D = estado?.motor3D === true;
  const mostrarWrapper = aberto || rollOficialUsando3D;

  const temaAtual = TEMAS.find((t) => t.id === temaId) ?? TEMAS[0];

  const totalSelecionado = Object.values(selecoes).reduce((acc, n) => acc + (n ?? 0), 0);

  // Pré-carrega assim que a Ficha abre, pra já estar pronto quando o
  // jogador tocar o FAB (ou quando a 1ª rolagem oficial 3D acontecer)
  // — o host do canvas fica sempre montado (nunca desmonta ao fechar o
  // overlay), só escondido via CSS, senão a lib perde a referência do
  // <canvas> e a próxima rolagem não aparece mais.
  useEffect(() => {
    setCarregando(true);
    carregarDiceBox3D()
      .then(() => setCarregando(false))
      .catch((e) => {
        setCarregando(false);
        setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
      });
  }, []);

  function abrir() {
    setAberto(true);
    setResultado(null);
    setErro(null);
    setModoMultiplo(false);
    setSelecoes({});
    setLogAberto(false);
  }

  function opcoesRolagem(): { theme: string; themeColor: string } {
    return { theme: temaId, themeColor: corHex };
  }

  // Rolagem "crua" — usada tanto pro toque direto em qualquer tipo
  // (incluindo d20, tratado igual aos outros: sem rótulo nem Vantagem/
  // Desvantagem, essa ferramenta é avulsa e não conhece perícia/ataque
  // nenhum) quanto pro modo Múltiplos. Ordena
  // os tipos por tamanho (TIPOS já vem d4→d100) antes de montar a
  // notação e o título.
  async function rolarGenerico(itens: { tipo: TipoDado; qtd: number }[]) {
    setResultado(null);
    setErro(null);
    try {
      const box = await carregarDiceBox3D();
      await garantirTemaDiceBox3D(box, temaId);
      const ordenados = TIPOS.filter((t) => itens.some((i) => i.tipo === t)).map(
        (t) => itens.find((i) => i.tipo === t)!,
      );
      const notacoes = ordenados.map((i) => `${i.qtd}${i.tipo}`);
      const titulo = `Rolagem de ${notacoes.join(' + ')}`;
      box.onRollComplete = (resultados) => {
        const valores = resultados.map((r) => r.value);
        const total = valores.reduce((acc, v) => acc + v, 0);
        setResultado(total);
        adicionarLog({ titulo, valores, total, partesTotal: valores });
      };
      box.roll(notacoes.length === 1 ? notacoes[0] : notacoes, opcoesRolagem());
    } catch (e) {
      setCarregando(false);
      setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
    }
  }

  function tocarTipo(tipo: TipoDado) {
    if (modoMultiplo) {
      setSelecoes((prev) => ({ ...prev, [tipo]: (prev[tipo] ?? 0) + 1 }));
      return;
    }
    rolarGenerico([{ tipo, qtd: 1 }]);
  }

  function tocarBotaoMultiplo() {
    if (!modoMultiplo) {
      setModoMultiplo(true);
      setSelecoes({});
      return;
    }
    if (totalSelecionado === 0) {
      setModoMultiplo(false);
      return;
    }
    const itens = TIPOS.filter((tipo) => (selecoes[tipo] ?? 0) > 0).map((tipo) => ({
      tipo,
      qtd: selecoes[tipo]!,
    }));
    rolarGenerico(itens);
    setModoMultiplo(false);
    setSelecoes({});
  }

  function fechar() {
    setAberto(false);
    setLogAberto(false);
    setCustomAberto(false);
  }

  const labelBotaoMultiplo = !modoMultiplo
    ? 'Múltiplos'
    : totalSelecionado === 0
      ? 'Cancelar'
      : `Rolar (${totalSelecionado})`;

  return (
    <>
      <div className={styles.fab} onClick={abrir} title="Dado 3D">
        🎲
      </div>
      {/* Sempre montado (nunca condicional) — a lib do dado 3D fica
          dona desse nó de verdade; escondido via CSS quando fechado.
          Também fica visível (sem os controles do FAB) quando uma
          rolagem OFICIAL está usando o motor 3D (`rollOficialUsando3D`)
          — é o mesmo canvas físico compartilhado, ver diceBox3d.ts. */}
      <div className={mostrarWrapper ? styles.overlay : styles.overlayEscondido}>
        <div id={DICE3D_CANVAS_HOST_ID} className={styles.canvasHost} />
        {aberto && (
          <>
            <div
              className={styles.customToggle}
              onClick={() => {
                setCustomAberto((v) => !v);
                setLogAberto(false);
              }}
            >
              🎨 Customizar
            </div>
            {customAberto && (
              <div className={styles.customPanel}>
                <label className={styles.customLabel}>
                  Textura
                  <select
                    className={styles.customSelect}
                    value={temaId}
                    onChange={(e) => setTemaId(e.target.value)}
                  >
                    {TEMAS.map((tema) => (
                      <option key={tema.id} value={tema.id}>
                        {tema.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.customLabel}>
                  Cor{!temaAtual.suportaCor && ' (essa textura não muda de cor)'}
                  <select
                    className={styles.customSelect}
                    value={corHex}
                    disabled={!temaAtual.suportaCor}
                    onChange={(e) => setCorHex(e.target.value)}
                  >
                    {CORES.map((cor) => (
                      <option key={cor.hex} value={cor.hex}>
                        {cor.nome}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {log.length > 0 && (
              <div
                className={styles.logToggle}
                onClick={() => {
                  setLogAberto((v) => !v);
                  setCustomAberto(false);
                }}
              >
                📜 Log ({log.length})
              </div>
            )}
            {logAberto && (
              <div
                className={styles.logPanel}
                style={{ maxHeight: `${LOG_VISIVEIS * LOG_ALTURA_ITEM_PX}px` }}
              >
                {log.map((registro) => (
                  <div key={registro.id} className={styles.logItem}>
                    <div className={styles.logLinha1}>
                      {registro.titulo}: {registro.valores.join(' | ')}
                      {registro.tag && ` (${registro.tag})`}
                    </div>
                    <div className={styles.logLinha2}>
                      Total: {registro.total} ({registro.partesTotal.join(' + ')})
                    </div>
                  </div>
                ))}
              </div>
            )}
            {carregando && <div className={styles.status}>Carregando dado 3D…</div>}
            {erro && <div className={styles.status}>⚠️ {erro}</div>}
            {resultado !== null && <div className={styles.resultado}>{resultado}</div>}
            {!carregando && !erro && resultado === null && !modoMultiplo && (
              <div className={styles.status}>Escolha um dado pra rolar</div>
            )}
            {modoMultiplo && (
              <div className={styles.status}>Toque nos dados que quer rolar juntos</div>
            )}
            <div className={styles.controles}>
              <div className={styles.tipos}>
                {TIPOS.map((tipo) => (
                  <div key={tipo} className={styles.tipoBtn} onClick={() => tocarTipo(tipo)}>
                    {tipo}
                    {modoMultiplo && (selecoes[tipo] ?? 0) > 0 && (
                      <span className={styles.tipoBadge}>×{selecoes[tipo]}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.multiploBtn} onClick={tocarBotaoMultiplo}>
                {labelBotaoMultiplo}
              </div>
              <div className={styles.fechar} onClick={fechar}>
                fechar
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
