import { describe, expect, it } from 'vitest';
import { temBannerProprio } from './IconeClasse';
import { subclasses } from '../../data/rulesets/dnd2024/subclasses';

describe('banners das subclasses do Monge', () => {
  const doMonge = subclasses.filter((s) => s.classeId === 'monge');

  it('as 4 subclasses do Monge têm emblema próprio ({id}-banner.webp)', () => {
    expect(doMonge).toHaveLength(4);
    for (const s of doMonge) expect(temBannerProprio(s.id), s.id).toBe(true);
  });

  it('borda: id sem arquivo de banner não conta como emblema próprio', () => {
    expect(temBannerProprio('monge-subclasse-que-nao-existe')).toBe(false);
  });
});
