import { magiasDaClasse } from '../../../data/rulesets/dnd2024/magias';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import spellStyles from '../../ficha/tabs/MagiasTab.module.css';

/** Protótipo — SDD `sdd/sdd-multiclasse-truques-magias.md`, foco
 * "Multiclasse — Truques/Magias Preparadas por classe, tela única,
 * fim do pill" (`EmDev.md`). V2 depois do feedback do Osmar
 * (2026-09-24: "simplificou demais, tem botão de Usar e outras
 * coisas, não mostra o que eu vou ver de verdade") — usa a magia
 * REAL do catálogo (`magiasDaClasse`) e o mesmo botão "Usar"
 * (`MagiasTab.module.css`), não mais um mock genérico. Layout novo
 * pedido pelo Osmar: nome numa linha, pills pequenos (círculo em
 * branco/outline — mesmo estilo do "já possui" de perícia — e classe
 * colorida) numa 2ª linha embaixo do nome.
 *
 * Personagem de mentira: Mago 5 / Bardo 3. `[PH]` = escolha de
 * exemplo, não vem de nenhum personagem real. */

interface ItemMagia {
  magia: Magia;
  classe: 'Mago' | 'Bardo';
}

function pegar(classe: 'Mago' | 'Bardo', circulo: number, nome: string): ItemMagia {
  const m = magiasDaClasse(classe, circulo).find((x) => x.nome === nome);
  if (!m) throw new Error(`Magia de exemplo não encontrada: ${nome} (${classe})`);
  return { magia: m, classe };
}

const TRUQUES: ItemMagia[] = [
  pegar('Mago', 0, 'Raio de Fogo'),
  pegar('Mago', 0, 'Mãos Mágicas'),
  pegar('Bardo', 0, 'Zombaria Perversa'),
];

const MAGIAS_PREPARADAS: ItemMagia[] = [
  pegar('Mago', 1, 'Mísseis Mágicos'),
  pegar('Mago', 1, 'Escudo Arcano'),
  pegar('Bardo', 1, 'Curar Ferimentos'),
  pegar('Bardo', 2, 'Sugestão'),
  pegar('Mago', 3, 'Bola de Fogo'),
];

const COR_SELO: Record<ItemMagia['classe'], string> = {
  Mago: 'var(--pip-azul-claro)',
  Bardo: 'var(--pip-mostarda)',
};

/** Pill de classe — mesmo tamanho/formato do `.tag` (já possui), mas
 * com fundo na cor da classe em vez de branco/outline. */
function PillClasse({ classe }: { classe: ItemMagia['classe'] }) {
  return (
    <span
      className="tag"
      style={{ background: COR_SELO[classe], borderColor: COR_SELO[classe], color: 'var(--panel)', fontWeight: 'bold' }}
    >
      {classe}
    </span>
  );
}

function LinhaMagia({ item }: { item: ItemMagia }) {
  const { magia: m } = item;
  const usar = m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`;
  return (
    <div style={{ padding: 'var(--space-2) var(--space-1)', borderBottom: '1px dashed var(--line-soft)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div className={spellStyles.spellName}>
          <MagiaComDescricao magia={m} /> {iconesMagia(m)}
        </div>
        <div className={spellStyles.usarBtn}>Usar</div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <span className="tag">{usar}</span>
        <PillClasse classe={item.classe} />
      </div>
    </div>
  );
}

export default function MulticlasseMagiasCena() {
  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Mockup `[PH]` da aba Magias pra um personagem <b>Mago 5 / Bardo 3</b>, com a magia real do catálogo e o mesmo
        botão "Usar" de hoje. Sem pill Mago/Bardo — nome numa linha, os 2 pills pequenos (círculo em branco/outline —
        igual ao "já possui" de perícia — e classe colorida) numa linha própria embaixo do nome. Espaços de Magia (não
        mostrados aqui, já funcionam certos hoje) continuam 1 pool combinado único.
      </p>

      <div className="section-title">Truques ({TRUQUES.length})</div>
      {TRUQUES.map((item) => (
        <LinhaMagia key={item.magia.id} item={item} />
      ))}

      <div className="section-title" style={{ marginTop: 16 }}>
        Magias Preparadas ({MAGIAS_PREPARADAS.length})
      </div>
      {MAGIAS_PREPARADAS.map((item) => (
        <LinhaMagia key={item.magia.id} item={item} />
      ))}

      <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 12 }}>
        Cor do pill de classe: Mago = azul-claro, Bardo = mostarda (mesma cor já usada nos recursos de Combate — ver
        `core/corRecursoClasse.ts`).
      </div>
    </div>
  );
}
