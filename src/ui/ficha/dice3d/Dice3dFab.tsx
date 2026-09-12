import { useEffect, useRef, useState } from 'react';
import type DiceBox from '@3d-dice/dice-box';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import styles from './Dice3dFab.module.css';

const TIPOS = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const;
type TipoDado = (typeof TIPOS)[number];

const MAX_LOG = 20;
// Painel mostra só ~5 por vez (o resto rola por dentro) — altura por
// item calculada pra bater com o CSS de .logItem (2 linhas + padding).
const LOG_VISIVEIS = 5;
const LOG_ALTURA_ITEM_PX = 52;

// [PH] Todas as texturas do pacote oficial @3d-dice/dice-themes (ver
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
  { id: 'default', nome: '[PH] Padrão', suportaCor: true },
  { id: 'smooth', nome: '[PH] Liso', suportaCor: true },
  { id: 'gemstone', nome: '[PH] Gema', suportaCor: true },
  { id: 'rock', nome: '[PH] Pedra', suportaCor: true },
  { id: 'rust', nome: '[PH] Ferrugem', suportaCor: true },
  { id: 'gemstoneMarble', nome: '[PH] Mármore de Gema', suportaCor: false },
  { id: 'blueGreenMetal', nome: '[PH] Metal Azul/Verde', suportaCor: false },
  { id: 'diceOfRolling', nome: '[PH] Dado de Mesa', suportaCor: false },
  { id: 'wooden', nome: '[PH] Madeira', suportaCor: false },
];

// [PH] Primárias + secundárias + preto/branco — lista fixa pronta em
// vez de um seletor de cor livre (mais rápido de usar no celular).
const CORES = [
  { nome: '[PH] Vermelho', hex: '#c0392b' },
  { nome: '[PH] Azul', hex: '#2e6da4' },
  { nome: '[PH] Amarelo', hex: '#d4ac0d' },
  { nome: '[PH] Verde', hex: '#2e8555' },
  { nome: '[PH] Laranja', hex: '#d4690d' },
  { nome: '[PH] Roxo', hex: '#7d3c98' },
  { nome: '[PH] Preto', hex: '#1c1c1c' },
  { nome: '[PH] Branco', hex: '#f2f2f2' },
] as const;

interface RegistroLog {
  id: string;
  /** Nome da perícia OU "Rolagem de NdX + ..." quando não simula perícia. */
  titulo: string;
  /** Valores de cada dado, na ordem que caíram. */
  valores: number[];
  /** "Vantagem" | "Desvantagem" | "Inspiração Heróica" — só rolagem de perícia simulada. */
  tag?: string;
  total: number;
  /** Parcelas somadas pra formar o total (dado(s) mantido(s) + modificador, ou todos os dados). */
  partesTotal: number[];
}

/** [PH] Protótipo isolado (pedido do Osmar, 2026-09) — testa se dado 3D
 * de verdade (física, não CSS) é viável nesse app antes de decidir
 * trocar a arte 2D atual. `@3d-dice/dice-box` (BabylonJS + Ammo.js,
 * roda em Web Worker) é carregado sob demanda (dynamic import) assim
 * que a Ficha abre — não bloqueia o carregamento inicial do app (a
 * Ficha já mostra tudo antes disso terminar), mas já fica pronto antes
 * do jogador tocar o FAB pela 1ª vez. Toda a UI aqui é placeholder —
 * ainda não está ligada a nenhuma rolagem real do jogo, inclusive a
 * "perícia" de cada rolagem de d20 é sorteada à toa só pra testar o
 * formato do log (ver DECISOES-COMBATE.md). */
export default function Dice3dFab() {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const [modoMultiplo, setModoMultiplo] = useState(false);
  const [selecoes, setSelecoes] = useState<Partial<Record<TipoDado, number>>>({});
  const [logs, setLogs] = useState<RegistroLog[]>([]);
  const [logAberto, setLogAberto] = useState(false);
  const [temaId, setTemaId] = useState(TEMAS[0].id);
  const [corHex, setCorHex] = useState<string>(CORES[0].hex);
  const [customAberto, setCustomAberto] = useState(false);
  const diceBoxRef = useRef<DiceBox | null>(null);
  const carregandoPromiseRef = useRef<Promise<DiceBox> | null>(null);

  const temaAtual = TEMAS.find((t) => t.id === temaId) ?? TEMAS[0];

  const totalSelecionado = Object.values(selecoes).reduce((acc, n) => acc + (n ?? 0), 0);

  function carregar(): Promise<DiceBox> {
    if (diceBoxRef.current) return Promise.resolve(diceBoxRef.current);
    if (carregandoPromiseRef.current) return carregandoPromiseRef.current;
    setCarregando(true);
    const promessa = (async () => {
      const { default: DiceBoxCtor } = await import('@3d-dice/dice-box');
      const box = new DiceBoxCtor({
        container: '#dice3d-canvas-host',
        assetPath: `${import.meta.env.BASE_URL}assets/`,
        theme: 'default',
      });
      await box.init();
      diceBoxRef.current = box;
      setCarregando(false);
      return box;
    })();
    carregandoPromiseRef.current = promessa;
    return promessa;
  }

  // Pré-carrega assim que a Ficha abre, pra já estar pronto quando o
  // jogador tocar o FAB — o host do canvas fica sempre montado (nunca
  // desmonta ao fechar o overlay), só escondido via CSS, senão a lib
  // perde a referência do <canvas> e a 2ª rolagem não aparece mais.
  useEffect(() => {
    carregar().catch((e) => {
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

  function adicionarLog(entrada: Omit<RegistroLog, 'id'>) {
    setLogs((prev) => [{ ...entrada, id: `${Date.now()}-${Math.random()}` }, ...prev].slice(0, MAX_LOG));
  }

  // `roll()` acessa os dados do tema de forma síncrona — precisa
  // garantir que ele já foi baixado/carregado antes (idempotente, só
  // baixa de verdade na 1ª vez que cada tema é escolhido).
  async function garantirTema(box: DiceBox) {
    await box.loadTheme(temaId);
  }

  function opcoesRolagem(): { theme: string; themeColor: string } {
    return { theme: temaId, themeColor: corHex };
  }

  // [PH] Simula uma rolagem de perícia — o protótipo ainda não sabe de
  // atributo/perícia de verdade, então sorteia uma perícia e um
  // modificador só pra testar o formato do log (ver pedido do Osmar).
  // 1 dado só (perícia real é sempre 1d20) — Vantagem mantém o maior,
  // Desvantagem o menor, "reroll" simula Inspiração Heróica (mantém a
  // 2ª rolagem, seja ela qual for).
  async function rolarPericiaSimulada() {
    setResultado(null);
    setErro(null);
    const pericia = pericias[Math.floor(Math.random() * pericias.length)].nome;
    const modificador = Math.floor(Math.random() * 7) - 1; // -1..5
    const sorteio = Math.random();
    const modo: 'normal' | 'vantagem' | 'desvantagem' | 'reroll' =
      sorteio < 0.55 ? 'normal' : sorteio < 0.7 ? 'vantagem' : sorteio < 0.85 ? 'desvantagem' : 'reroll';
    try {
      const box = await carregar();
      await garantirTema(box);
      if (modo === 'normal') {
        box.onRollComplete = (resultados) => {
          const v = resultados[0].value;
          const total = v + modificador;
          setResultado(total);
          adicionarLog({ titulo: pericia, valores: [v], total, partesTotal: [v, modificador] });
        };
        box.roll('1d20', opcoesRolagem());
      } else {
        box.onRollComplete = (resultados) => {
          const [v1, v2] = resultados.map((r) => r.value);
          let mantido: number;
          let tag: string;
          if (modo === 'vantagem') {
            mantido = Math.max(v1, v2);
            tag = 'Vantagem';
          } else if (modo === 'desvantagem') {
            mantido = Math.min(v1, v2);
            tag = 'Desvantagem';
          } else {
            mantido = v2;
            tag = 'Inspiração Heróica';
          }
          const total = mantido + modificador;
          setResultado(total);
          adicionarLog({ titulo: pericia, valores: [v1, v2], tag, total, partesTotal: [mantido, modificador] });
        };
        box.roll(['1d20', '1d20'], opcoesRolagem());
      }
    } catch (e) {
      setCarregando(false);
      setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
    }
  }

  // Rolagem "crua" (sem perícia envolvida) — usada tanto pro toque
  // direto num tipo que não seja d20 quanto pro modo Múltiplos. Ordena
  // os tipos por tamanho (TIPOS já vem d4→d100) antes de montar a
  // notação e o título.
  async function rolarGenerico(itens: { tipo: TipoDado; qtd: number }[]) {
    setResultado(null);
    setErro(null);
    const ordenados = TIPOS.filter((t) => itens.some((i) => i.tipo === t)).map(
      (t) => itens.find((i) => i.tipo === t)!,
    );
    const notacoes = ordenados.map((i) => `${i.qtd}${i.tipo}`);
    const titulo = `Rolagem de ${notacoes.join(' + ')}`;
    try {
      const box = await carregar();
      await garantirTema(box);
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
    if (tipo === 'd20') {
      rolarPericiaSimulada();
    } else {
      rolarGenerico([{ tipo, qtd: 1 }]);
    }
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
    ? '[PH] Múltiplos'
    : totalSelecionado === 0
      ? '[PH] Cancelar'
      : `[PH] Rolar (${totalSelecionado})`;

  return (
    <>
      <div className={styles.fab} onClick={abrir} title="[PH] Protótipo: dado 3D">
        🎲
      </div>
      {/* Sempre montado (nunca condicional) — a lib do dado 3D fica
          dona desse nó de verdade; escondido via CSS quando fechado. */}
      <div className={aberto ? styles.overlay : styles.overlayEscondido}>
        <div id="dice3d-canvas-host" className={styles.canvasHost} />
        {aberto && (
          <>
            <div
              className={styles.customToggle}
              onClick={() => {
                setCustomAberto((v) => !v);
                setLogAberto(false);
              }}
            >
              [PH] 🎨 Customizar
            </div>
            {customAberto && (
              <div className={styles.customPanel}>
                <label className={styles.customLabel}>
                  [PH] Textura
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
                  [PH] Cor{!temaAtual.suportaCor && ' (essa textura não muda de cor)'}
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
            {logs.length > 0 && (
              <div
                className={styles.logToggle}
                onClick={() => {
                  setLogAberto((v) => !v);
                  setCustomAberto(false);
                }}
              >
                [PH] 📜 Log ({logs.length})
              </div>
            )}
            {logAberto && (
              <div
                className={styles.logPanel}
                style={{ maxHeight: `${LOG_VISIVEIS * LOG_ALTURA_ITEM_PX}px` }}
              >
                {logs.map((registro) => (
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
            {carregando && <div className={styles.status}>[PH] Carregando dado 3D…</div>}
            {erro && <div className={styles.status}>⚠️ {erro}</div>}
            {resultado !== null && <div className={styles.resultado}>{resultado}</div>}
            {!carregando && !erro && resultado === null && !modoMultiplo && (
              <div className={styles.status}>[PH] Escolha um dado pra rolar</div>
            )}
            {modoMultiplo && (
              <div className={styles.status}>[PH] Toque nos dados que quer rolar juntos</div>
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
                [PH] fechar
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
