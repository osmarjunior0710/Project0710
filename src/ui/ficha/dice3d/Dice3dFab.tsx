import { useEffect, useRef, useState } from 'react';
import type DiceBox from '@3d-dice/dice-box';
import { useRoll } from '../../roll/RollContext';
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

const MODOS_D20 = ['normal', 'vantagem', 'desvantagem'] as const;
type ModoD20 = (typeof MODOS_D20)[number];

const ROTULO_MODO_D20: Record<ModoD20, string> = {
  normal: 'Normal',
  vantagem: 'Vantagem',
  desvantagem: 'Desvantagem',
};

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
  const { log, adicionarLog } = useRoll();
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
  const [rotuloD20, setRotuloD20] = useState('');
  const [modoD20, setModoD20] = useState<ModoD20>('normal');
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
    setRotuloD20('');
    setModoD20('normal');
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

  // Rolagem de 1d20 avulsa — rótulo e Normal/Vantagem/Desvantagem são
  // escolhidos manualmente pelo jogador antes de tocar no dado (esta
  // ferramenta não conhece perícia/ataque nenhum, é avulsa — ver o
  // SDD). Sem esses dois controles, um dado 3D "puro" não daria pra
  // registrar Vantagem/Desvantagem no log nem dar nome à rolagem.
  async function rolarD20() {
    setResultado(null);
    setErro(null);
    const titulo = rotuloD20.trim() || 'Rolagem de 1d20';
    try {
      const box = await carregar();
      await garantirTema(box);
      if (modoD20 === 'normal') {
        box.onRollComplete = (resultados) => {
          const v = resultados[0].value;
          setResultado(v);
          adicionarLog({ titulo, valores: [v], total: v, partesTotal: [v] });
        };
        box.roll('1d20', opcoesRolagem());
      } else {
        box.onRollComplete = (resultados) => {
          const [v1, v2] = resultados.map((r) => r.value);
          const mantido = modoD20 === 'vantagem' ? Math.max(v1, v2) : Math.min(v1, v2);
          const tag = ROTULO_MODO_D20[modoD20];
          setResultado(mantido);
          adicionarLog({ titulo, valores: [v1, v2], tag, total: mantido, partesTotal: [mantido] });
        };
        box.roll(['1d20', '1d20'], opcoesRolagem());
      }
    } catch (e) {
      setCarregando(false);
      setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
    }
  }

  // Rolagem "crua" (sem d20 sozinho envolvido) — usada tanto pro toque
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
      rolarD20();
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
              {!modoMultiplo && (
                <div className={styles.d20Config}>
                  <input
                    type="text"
                    className={styles.d20RotuloInput}
                    placeholder="Rótulo do d20 (opcional)"
                    value={rotuloD20}
                    onChange={(e) => setRotuloD20(e.target.value)}
                  />
                  <div className={styles.d20ModoRow}>
                    {MODOS_D20.map((modo) => (
                      <div
                        key={modo}
                        className={modo === modoD20 ? styles.d20ModoBtnAtivo : styles.d20ModoBtn}
                        onClick={() => setModoD20(modo)}
                      >
                        {ROTULO_MODO_D20[modo]}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
