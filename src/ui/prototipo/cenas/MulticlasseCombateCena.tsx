import { useState } from 'react';

/** Protótipo — mesmo SDD/foco de `MulticlasseMagiasCena.tsx`. Mockup
 * do seletor de magia em Combate (painel de Ação) DEPOIS da mudança:
 * ao abrir "Conjurar Magia", a lista já oferece as magias das 2
 * classes juntas, com o mesmo selo da aba Magias — hoje só mostra as
 * da classe que está no pill.
 *
 * Personagem de mentira: Mago 5 / Bardo 3 (mesmo do protótipo de
 * Magias). `[PH]` = dado de exemplo. */

interface OpcaoMagia {
  nome: string;
  classe: 'Mago' | 'Bardo';
  circulo: number;
}

const OPCOES: OpcaoMagia[] = [
  { nome: 'Mísseis Mágicos', classe: 'Mago', circulo: 1 },
  { nome: 'Escudo Arcano', classe: 'Mago', circulo: 1 },
  { nome: 'Curar Feridas', classe: 'Bardo', circulo: 1 },
  { nome: 'Sugestão', classe: 'Bardo', circulo: 2 },
  { nome: 'Bola de Fogo', classe: 'Mago', circulo: 3 },
];

const COR_SELO: Record<OpcaoMagia['classe'], string> = {
  Mago: 'var(--pip-azul-claro)',
  Bardo: 'var(--pip-mostarda)',
};

// Espaços de Magia — pool combinado único (já funciona hoje), pra
// mostrar que o gasto continua vindo do mesmo lugar não importa qual
// classe é dona da magia escolhida.
const ESPACOS_COMBINADOS: Record<number, { maximo: number; gastos: number }> = {
  1: { maximo: 4, gastos: 1 },
  2: { maximo: 3, gastos: 0 },
  3: { maximo: 2, gastos: 0 },
};

export default function MulticlasseCombateCena() {
  const [painelAberto, setPainelAberto] = useState(false);
  const [selecionada, setSelecionada] = useState<OpcaoMagia | null>(null);

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Mockup `[PH]` do painel de Ação em Combate pro mesmo personagem <b>Mago 5 / Bardo 3</b>. Botão "Conjurar Magia"
        abre a lista com as 2 classes juntas — escolher gasta do espaço certo (combinado ou separado, isso já funciona
        hoje e não muda).
      </p>

      <div className="label" style={{ marginBottom: 6 }}>
        Ação
      </div>
      <div className="btn btn-primary" style={{ marginBottom: 16, display: 'inline-block' }} onClick={() => setPainelAberto(true)}>
        ✨ Conjurar Magia
      </div>

      {selecionada && (
        <div className="box-solid" style={{ padding: 10, marginBottom: 16 }}>
          Selecionada: <b>{selecionada.nome}</b> ({selecionada.classe}, {selecionada.circulo}º círculo) — gasta 1 espaço
          combinado de {selecionada.circulo}º círculo.
        </div>
      )}

      {painelAberto && (
        <div className="box-solid" style={{ padding: 0, marginBottom: 16 }}>
          <div style={{ padding: '10px 12px', fontWeight: 'bold', borderBottom: '1px solid var(--line-soft)' }}>
            Qual magia conjurar?
          </div>
          {OPCOES.map((op, i) => (
            <div
              key={op.nome}
              onClick={() => {
                setSelecionada(op);
                setPainelAberto(false);
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                borderBottom: i < OPCOES.length - 1 ? '1px solid var(--line-soft)' : 'none',
                cursor: 'pointer',
              }}
            >
              <span>
                {op.circulo}º círculo — {op.nome}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: COR_SELO[op.classe], display: 'inline-block' }} />
                {op.classe}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="label" style={{ marginBottom: 6 }}>
        Espaços de Magia (pool combinado — já funciona assim hoje)
      </div>
      <div className="box-solid" style={{ padding: 10 }}>
        {Object.entries(ESPACOS_COMBINADOS).map(([circulo, e]) => (
          <div key={circulo} style={{ fontSize: 13, marginBottom: 4 }}>
            {circulo}º círculo: {e.maximo - e.gastos}/{e.maximo} disponíveis
          </div>
        ))}
      </div>
    </div>
  );
}
