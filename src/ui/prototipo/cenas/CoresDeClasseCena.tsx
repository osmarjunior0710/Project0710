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
  const inputRef = useRef<HTMLInputElement>(null);
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
        <div className="btn" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => inputRef.current?.click()}>
          🎨 Selecionar
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', cursor: 'pointer' }}>
          <input type="checkbox" checked={!valor.textoClaro} onChange={onAlternarTexto} />
          texto preto
        </label>
      </div>
      <input
        ref={inputRef}
        type="color"
        value={valor.cor}
        onChange={(e) => onMudarCor(e.target.value)}
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  );
}

/** Protótipo pra decidir a cor de cada classe (pedido do Osmar,
 * 2026-09) — 12 pills, cada uma com botão que abre o color picker
 * nativo, switcher de texto branco/preto, e um export em texto (nome +
 * hex + cor do texto) pra colar de volta no chat. Estado 100% local,
 * não mexe em `core/corRecursoClasse.ts` — é só ferramenta de decisão,
 * a aplicação de verdade é uma entrega própria depois. */
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
        Toque em "🎨 Selecionar" pra abrir o seletor de cor — a pill atualiza na hora. Quando terminar, toque em
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
