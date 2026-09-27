import { useRef, useState } from 'react';

interface ClasseCor {
  cor: string;
  textoClaro: boolean;
}

/** As 12 classes de D&D — 5 já implementadas no app + 7 "em breve"
 * (mesma lista de `ClasseStep.tsx`). Protótipo não depende de
 * `data/rulesets/dnd2024/classes.ts` de propósito (7 delas nem têm
 * entrada lá ainda) — lista fixa aqui mesmo. */
const CLASSES = [
  'Bárbaro',
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro',
  'Guardião',
  'Guerreiro',
  'Ladino',
  'Mago',
  'Monge',
  'Paladino',
];

/** Cores já confirmadas com o Osmar hoje (`core/corRecursoClasse.ts`),
 * convertidas do token CSS pro hex real (ver `index.css`) — ponto de
 * partida, não travado: o Osmar pode mudar até essas aqui. */
const CORES_INICIAIS: Record<string, ClasseCor> = {
  Bárbaro: { cor: '#b3261e', textoClaro: true }, // vermelho (--danger)
  Bardo: { cor: '#c9971a', textoClaro: true }, // mostarda (--pip-mostarda)
  Bruxo: { cor: '#8a5fd9', textoClaro: true }, // roxo (--accent-especial)
  Guerreiro: { cor: '#4a5fd9', textoClaro: true }, // azul (--accent)
  Mago: { cor: '#4fc3f7', textoClaro: true }, // azul-claro (--pip-azul-claro)
};

const COR_PADRAO = '#9e9e9e';

/** 20 cores "maximamente distintas" (paleta categórica clássica de
 * Sasha Trubetskoy) — pensada exatamente pro problema de 12 itens
 * lado a lado precisarem parecer diferentes uns dos outros, o que o
 * picker nativo do navegador não ajuda a resolver (ele só abre uma
 * roda de cor genérica, sem pensar em "diferente das outras 11"). */
const PALETA_SUGERIDA = [
  '#e6194b',
  '#f58231',
  '#ffe119',
  '#bfef45',
  '#3cb44b',
  '#42d4f4',
  '#4363d8',
  '#911eb4',
  '#f032e6',
  '#a9a9a9',
  '#800000',
  '#9a6324',
  '#808000',
  '#469990',
  '#000075',
  '#e6beff',
  '#fabed4',
  '#ffd8b1',
  '#aaffc3',
  '#fffac8',
];

interface Hsv {
  h: number;
  s: number;
  v: number;
}

function hexParaHsv(hex: string): Hsv {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvParaHex(h: number, s: number, v: number): string {
  const sN = s / 100;
  const vN = v / 100;
  const c = vN * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vN - c;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const paraHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${paraHex(r)}${paraHex(g)}${paraHex(b)}`;
}

const HEX_VALIDO = /^#[0-9a-f]{6}$/i;

/** Quadrado Saturação×Brilho (estilo do picker do w3schools/photoshop,
 * pedido do Osmar em vez dos sliders) — eixo X = Saturação (0 esquerda
 * → 100 direita), eixo Y = Brilho (100 topo → 0 embaixo). Arrasta com
 * mouse OU dedo (`onPointerDown`/`onPointerMove` com pointer capture,
 * funciona nos dois). A cor de fundo do quadrado inteiro muda com o
 * matiz atual (barra separada, abaixo). */
function QuadradoSaturacaoBrilho({ h, s, v, onMudar }: { h: number; s: number; v: number; onMudar: (s: number, v: number) => void }) {
  const quadradoRef = useRef<HTMLDivElement>(null);

  function calcularDaPosicao(clientX: number, clientY: number) {
    const rect = quadradoRef.current!.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    onMudar(Math.round((x / rect.width) * 100), Math.round(100 - (y / rect.height) * 100));
  }

  function aoPressionar(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    calcularDaPosicao(e.clientX, e.clientY);
  }

  function aoArrastar(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons === 0 && e.pointerType === 'mouse') return;
    calcularDaPosicao(e.clientX, e.clientY);
  }

  return (
    <div
      ref={quadradoRef}
      onPointerDown={aoPressionar}
      onPointerMove={aoArrastar}
      style={{
        position: 'relative',
        width: '100%',
        height: 160,
        borderRadius: 'var(--shape-sm)',
        touchAction: 'none',
        cursor: 'crosshair',
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${h}, 100%, 50%))`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${s}%`,
          top: `${100 - v}%`,
          width: 16,
          height: 16,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '2px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/** Picker próprio (não o `<input type="color">` nativo do navegador,
 * que só abre uma roda de cor genérica sem pensar em "diferente das
 * outras 11") — mesmo estilo do picker do w3schools: quadrado de
 * Saturação×Brilho + barra de Matiz, com grade de 20 cores já bem
 * distintas entre si pra escolha rápida e campo de hex pra colar valor
 * exato. Tudo atualiza a pill ao vivo através de `onMudarCor`. */
function SeletorDeCor({ cor, onMudarCor }: { cor: string; onMudarCor: (cor: string) => void }) {
  const hsv = hexParaHsv(cor);
  const [hexTexto, setHexTexto] = useState(cor);

  function mudarHsv(novo: Partial<Hsv>) {
    const proximo = { ...hsv, ...novo };
    const novoHex = hsvParaHex(proximo.h, proximo.s, proximo.v);
    setHexTexto(novoHex);
    onMudarCor(novoHex);
  }

  function confirmarHexDigitado() {
    const valor = hexTexto.startsWith('#') ? hexTexto : `#${hexTexto}`;
    if (HEX_VALIDO.test(valor)) onMudarCor(valor);
    else setHexTexto(cor);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 10, background: 'var(--panel2)', borderRadius: 'var(--shape-sm)' }}>
      <QuadradoSaturacaoBrilho h={hsv.h} s={hsv.s} v={hsv.v} onMudar={(s, v) => mudarHsv({ s, v })} />

      <input
        type="range"
        min={0}
        max={359}
        value={hsv.h}
        onChange={(e) => mudarHsv({ h: Number(e.target.value) })}
        style={{
          width: '100%',
          background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
        }}
      />

      <div>
        <div className="label" style={{ marginBottom: 6 }}>
          Ou uma das 20 cores já bem diferentes entre si
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))', gap: 6 }}>
          {PALETA_SUGERIDA.map((sugestao) => (
            <div
              key={sugestao}
              onClick={() => {
                onMudarCor(sugestao);
                setHexTexto(sugestao);
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--shape-xs)',
                background: sugestao,
                border: sugestao.toLowerCase() === cor.toLowerCase() ? '2px solid var(--text)' : '1px solid var(--line)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="label">Hex</div>
        <input
          type="text"
          value={hexTexto}
          onChange={(e) => setHexTexto(e.target.value)}
          onBlur={confirmarHexDigitado}
          onKeyDown={(e) => e.key === 'Enter' && confirmarHexDigitado()}
          style={{
            flex: 1,
            fontFamily: 'monospace',
            fontSize: 13,
            padding: '6px 8px',
            border: '1px solid var(--line)',
            borderRadius: 'var(--shape-xs)',
            background: 'var(--panel)',
            color: 'var(--text)',
          }}
        />
      </div>
    </div>
  );
}

function ClasseColorRow({
  nome,
  valor,
  onMudarCor,
  onAlternarTexto,
}: {
  nome: string;
  valor: ClasseCor;
  onMudarCor: (cor: string) => void;
  onAlternarTexto: () => void;
}) {
  const [pickerAberto, setPickerAberto] = useState(false);
  const jaTemCor = CORES_INICIAIS[nome] !== undefined;

  return (
    <div className="box-solid" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          className="tag"
          style={{
            background: valor.cor,
            borderColor: valor.cor,
            color: valor.textoClaro ? '#ffffff' : '#000000',
            fontWeight: 'bold',
            fontSize: 13,
            padding: '5px 12px',
          }}
        >
          {nome}
        </span>
        {!jaTemCor && (
          <span className="tag" style={{ fontSize: 9 }}>
            sem cor ainda
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="btn" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setPickerAberto((v) => !v)}>
          🎨 {pickerAberto ? 'Fechar cor' : 'Selecionar'}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', cursor: 'pointer' }}>
          <input type="checkbox" checked={!valor.textoClaro} onChange={onAlternarTexto} />
          texto preto
        </label>
      </div>
      {pickerAberto && <SeletorDeCor cor={valor.cor} onMudarCor={onMudarCor} />}
    </div>
  );
}

/** Protótipo pra decidir a cor de cada classe (pedido do Osmar,
 * 2026-09) — 12 pills, cada uma com um picker PRÓPRIO (paleta de 20
 * cores distintas + quadrado Saturação×Brilho + barra de Matiz + hex —
 * não o `<input type="color">`
 * nativo, que só dá uma roda de cor genérica sem ajudar a manter as 12
 * diferentes entre si), switcher de texto branco/preto, e um export em
 * texto (nome + hex + cor do texto) pra colar de volta no chat. Estado
 * 100% local, não mexe em `core/corRecursoClasse.ts` — é só ferramenta
 * de decisão, a aplicação de verdade é uma entrega própria depois. */
export default function CoresDeClasseCena() {
  const [cores, setCores] = useState<Record<string, ClasseCor>>(() => {
    const inicial: Record<string, ClasseCor> = {};
    for (const nome of CLASSES) inicial[nome] = CORES_INICIAIS[nome] ?? { cor: COR_PADRAO, textoClaro: true };
    return inicial;
  });
  const [exportando, setExportando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  function mudarCor(nome: string, cor: string) {
    setCores((prev) => ({ ...prev, [nome]: { ...prev[nome], cor } }));
  }

  function alternarTexto(nome: string) {
    setCores((prev) => ({ ...prev, [nome]: { ...prev[nome], textoClaro: !prev[nome].textoClaro } }));
  }

  const textoExport = CLASSES.map((nome) => {
    const { cor, textoClaro } = cores[nome];
    return `${nome}: ${cor} (texto ${textoClaro ? 'branco' : 'preto'})`;
  }).join('\n');

  async function copiar() {
    try {
      await navigator.clipboard.writeText(textoExport);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard bloqueado (ex: sem permissão) — o textarea abaixo
      // continua servindo pra copiar na mão.
    }
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="section-title">Cor de cada classe</div>
      <div className="label" style={{ marginBottom: 4 }}>
        Toque em "🎨 Selecionar" — arraste no quadrado (Saturação×Brilho) e na barra de Matiz, escolha uma das 20
        cores já bem diferentes entre si, ou digite o hex direto. A pill atualiza na hora. Quando terminar, toque em
        "Exportar" e me manda o texto.
      </div>

      {CLASSES.map((nome) => (
        <ClasseColorRow
          key={nome}
          nome={nome}
          valor={cores[nome]}
          onMudarCor={(cor) => mudarCor(nome, cor)}
          onAlternarTexto={() => alternarTexto(nome)}
        />
      ))}

      <div className="btn btn-primary" style={{ marginTop: 8, textAlign: 'center' }} onClick={() => setExportando(true)}>
        📋 Exportar
      </div>

      {exportando && (
        <div className="opt-card" style={{ cursor: 'default' }}>
          <div className="opt-card-name">Cores escolhidas</div>
          <textarea
            readOnly
            value={textoExport}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            style={{
              width: '100%',
              minHeight: 260,
              fontFamily: 'monospace',
              fontSize: 12,
              marginTop: 8,
              padding: 8,
              boxSizing: 'border-box',
              background: 'var(--panel2)',
              color: 'var(--text)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--shape-sm)',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }} onClick={copiar}>
              {copiado ? '✅ Copiado!' : '📋 Copiar'}
            </div>
            <div className="btn" style={{ flex: 1, textAlign: 'center' }} onClick={() => setExportando(false)}>
              Fechar
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
