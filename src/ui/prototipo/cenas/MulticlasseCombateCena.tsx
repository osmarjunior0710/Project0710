import { useState } from 'react';
import { magiasDaClasse } from '../../../data/rulesets/dnd2024/magias';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import GrupoMagiaColapsavel from '../../components/GrupoMagiaColapsavel';

/** Protótipo — mesmo SDD/foco de `MulticlasseMagiasCena.tsx`. V2
 * depois do feedback do Osmar (2026-09-24) — mesma estrutura REAL do
 * seletor de magia em Combate (`SelecionarMagiaShell.tsx`: agrupado
 * por círculo via `GrupoMagiaColapsavel`, linha `check-row`), só que
 * as magias das 2 classes aparecem juntas dentro de cada grupo, com
 * um pill de classe por item (o círculo já vem do cabeçalho do
 * grupo, não precisa repetir por linha aqui).
 *
 * Personagem de mentira: Mago 5 / Bardo 3 (mesmo do protótipo de
 * Magias). `[PH]` = escolha de exemplo. */

interface ItemMagia {
  magia: Magia;
  classe: 'Mago' | 'Bardo';
}

function pegar(classe: 'Mago' | 'Bardo', circulo: number, nome: string): ItemMagia {
  const m = magiasDaClasse(classe, circulo).find((x) => x.nome === nome);
  if (!m) throw new Error(`Magia de exemplo não encontrada: ${nome} (${classe})`);
  return { magia: m, classe };
}

const POR_CIRCULO: { circulo: number; label: string; itens: ItemMagia[] }[] = [
  {
    circulo: 1,
    label: '1º círculo',
    itens: [pegar('Mago', 1, 'Mísseis Mágicos'), pegar('Mago', 1, 'Escudo Arcano'), pegar('Bardo', 1, 'Curar Ferimentos')],
  },
  { circulo: 2, label: '2º círculo', itens: [pegar('Bardo', 2, 'Sugestão')] },
  { circulo: 3, label: '3º círculo', itens: [pegar('Mago', 3, 'Bola de Fogo')] },
];

const COR_SELO: Record<ItemMagia['classe'], string> = {
  Mago: 'var(--pip-azul-claro)',
  Bardo: 'var(--pip-mostarda)',
};

function PillClasse({ classe }: { classe: ItemMagia['classe'] }) {
  return (
    <span
      className="tag"
      style={{ background: COR_SELO[classe], borderColor: COR_SELO[classe], color: 'var(--panel)', fontWeight: 'bold', marginLeft: 8 }}
    >
      {classe}
    </span>
  );
}

// Espaços de Magia — pool combinado único (já funciona hoje).
const ESPACOS_COMBINADOS: Record<number, { maximo: number; gastos: number }> = {
  1: { maximo: 4, gastos: 1 },
  2: { maximo: 3, gastos: 0 },
  3: { maximo: 2, gastos: 0 },
};

export default function MulticlasseCombateCena() {
  const [painelAberto, setPainelAberto] = useState(false);
  const [selecionada, setSelecionada] = useState<ItemMagia | null>(null);

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Mockup `[PH]` do painel de Ação em Combate pro mesmo personagem <b>Mago 5 / Bardo 3</b>, com a mesma estrutura
        real do seletor de hoje (`SelecionarMagiaShell`: agrupado por círculo, linha `check-row`) — só que agora as
        magias das 2 classes aparecem juntas dentro do mesmo grupo, cada uma com o pill de classe. O círculo já vem do
        cabeçalho do grupo, não repete por linha.
      </p>

      <div className="label" style={{ marginBottom: 6 }}>
        Ação
      </div>
      <div className="btn btn-primary" style={{ marginBottom: 16, display: 'inline-block' }} onClick={() => setPainelAberto(true)}>
        ✨ Conjurar Magia
      </div>

      {selecionada && (
        <div className="box-solid" style={{ padding: 10, marginBottom: 16 }}>
          Selecionada: <b>{selecionada.magia.nome}</b> ({selecionada.classe}, {selecionada.magia.circulo}º círculo) —
          gasta 1 espaço combinado de {selecionada.magia.circulo}º círculo.
        </div>
      )}

      {painelAberto && (
        <div className="box-solid" style={{ padding: 0, marginBottom: 16 }}>
          <div style={{ padding: '10px 12px', fontWeight: 'bold', borderBottom: '1px solid var(--line-soft)' }}>
            Qual magia conjurar?
          </div>
          {POR_CIRCULO.map((grupo) => (
            <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.itens.map((i) => i.magia)}>
              {(m) => {
                const item = grupo.itens.find((i) => i.magia.id === m.id)!;
                return (
                  <div
                    key={m.id}
                    className="check-row"
                    onClick={() => {
                      setSelecionada(item);
                      setPainelAberto(false);
                    }}
                  >
                    <span className="check-label">
                      <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                      <PillClasse classe={item.classe} />
                    </span>
                  </div>
                );
              }}
            </GrupoMagiaColapsavel>
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
