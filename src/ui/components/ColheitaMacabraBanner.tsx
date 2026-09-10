import { useState } from 'react';
import type { Pet } from '../../core/pets';

interface ColheitaMacabraBannerProps {
  /** PV que a cura concede (já calculado, ver `curaColheitaMacabra`). */
  cura: number;
  /** Só os pets elegíveis (Morto-Vivo) — ver `petsElegiveisColheitaMacabra`. */
  petsElegiveis: Pet[];
  onCurar: (petId: string) => void;
  onDispensar: () => void;
}

/** Banner pós-conjuração de magia de Necromancia com espaço (Colheita
 * Macabra, Necromante nível 3 — ver `core/necromante.ts`) — reaproveita
 * o mesmo padrão visual do banner "Rolagem de acerto feita" já usado em
 * `MagiasTab.tsx`/`AcaoPanelContent.tsx`. Compartilhado entre os 2
 * lugares que conjuram magia com espaço (aba Magias e painel de Ação
 * do Combate) pra não duplicar o formulário de escolha de pet. */
export default function ColheitaMacabraBanner({ cura, petsElegiveis, onCurar, onDispensar }: ColheitaMacabraBannerProps) {
  const [petId, setPetId] = useState(petsElegiveis[0]?.id ?? '');

  return (
    <div className="label" style={{ marginBottom: 12, padding: 10, background: 'var(--panel)', borderRadius: 'var(--shape-md)' }}>
      🩸 Colheita Macabra — cura {cura} PV num Morto-Vivo à sua escolha (até 18 m)
      {petsElegiveis.length === 0 ? (
        <div style={{ marginTop: 6, color: 'var(--text-faint)' }}>Nenhum Morto-Vivo sob seu controle agora.</div>
      ) : (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={petId} onChange={(e) => setPetId(e.target.value)}>
            {petsElegiveis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          <div className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={() => petId && onCurar(petId)}>
            Curar
          </div>
        </div>
      )}
      <div className="btn" style={{ marginTop: 8, padding: '6px 10px', display: 'inline-block' }} onClick={onDispensar}>
        Dispensar
      </div>
    </div>
  );
}
