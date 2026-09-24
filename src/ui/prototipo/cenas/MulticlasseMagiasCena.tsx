/** Protótipo — SDD `sdd/sdd-multiclasse-truques-magias.md`, foco
 * "Multiclasse — Truques/Magias Preparadas por classe, tela única,
 * fim do pill" (`EmDev.md`). Mockup da aba Magias DEPOIS da mudança:
 * Truques e Magias Preparadas das 2 classes juntos numa lista só,
 * cada item com um selo pequeno (cor de `core/corRecursoClasse.ts`)
 * indicando de qual classe é — sem pill Mago/Bardo pra trocar.
 *
 * Personagem de mentira: Mago 5 / Bardo 3. `[PH]` = dado de exemplo,
 * não vem de nenhum personagem real. */

interface ItemMagia {
  nome: string;
  classe: 'Mago' | 'Bardo';
  circulo: number;
}

const TRUQUES: ItemMagia[] = [
  { nome: 'Raio de Fogo', classe: 'Mago', circulo: 0 },
  { nome: 'Mãos Mágicas', classe: 'Mago', circulo: 0 },
  { nome: 'Zombaria Viciosa', classe: 'Bardo', circulo: 0 },
];

const MAGIAS_PREPARADAS: ItemMagia[] = [
  { nome: 'Mísseis Mágicos', classe: 'Mago', circulo: 1 },
  { nome: 'Escudo Arcano', classe: 'Mago', circulo: 1 },
  { nome: 'Detectar Magia', classe: 'Mago', circulo: 1 },
  { nome: 'Curar Feridas', classe: 'Bardo', circulo: 1 },
  { nome: 'Sugestão', classe: 'Bardo', circulo: 2 },
  { nome: 'Bola de Fogo', classe: 'Mago', circulo: 3 },
];

const COR_SELO: Record<ItemMagia['classe'], string> = {
  Mago: 'var(--pip-azul-claro)',
  Bardo: 'var(--pip-mostarda)',
};

function Selo({ classe }: { classe: ItemMagia['classe'] }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        fontWeight: 'bold',
        color: 'var(--text-faint)',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: COR_SELO[classe], display: 'inline-block' }} />
      {classe}
    </span>
  );
}

function Lista({ titulo, itens }: { titulo: string; itens: ItemMagia[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="label" style={{ marginBottom: 6 }}>
        {titulo} <span style={{ color: 'var(--text-faint)', fontWeight: 'normal' }}>({itens.length})</span>
      </div>
      <div className="box-solid" style={{ padding: 0 }}>
        {itens.map((item, i) => (
          <div
            key={item.nome}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              borderBottom: i < itens.length - 1 ? '1px solid var(--line-soft)' : 'none',
            }}
          >
            <span>
              {item.circulo === 0 ? 'Truque' : `${item.circulo}º círculo`} — {item.nome}
            </span>
            <Selo classe={item.classe} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MulticlasseMagiasCena() {
  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Mockup `[PH]` da aba Magias pra um personagem <b>Mago 5 / Bardo 3</b>. Sem pill Mago/Bardo — as 2 listas (Truques,
        Magias Preparadas) já vêm juntas, cada item com o selo da classe. Espaços de Magia (não mostrados aqui, já
        funcionam certos hoje) continuam sendo 1 pool combinado único, sem selo — não faz sentido marcar de qual classe é
        um espaço que qualquer uma pode gastar.
      </p>

      <Lista titulo="Truques" itens={TRUQUES} />
      <Lista titulo="Magias Preparadas" itens={MAGIAS_PREPARADAS} />

      <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
        Cor do selo: Mago = azul-claro, Bardo = mostarda (mesma cor já usada nos recursos de Combate — ver
        `core/corRecursoClasse.ts`).
      </div>
    </div>
  );
}
