import { describe, it, expect } from 'vitest';
import { magiasElegiveisAssinatura } from './assinaturaMagica';
import { magias } from '../data/rulesets/dnd2024/magias';

// [PH] [codeimplementation] — stub, ver comentário do arquivo.
describe('magiasElegiveisAssinatura', () => {
  it('livro com magias de 3º círculo — ainda não implementado, retorna vazio', () => {
    const livro = magias.filter((m) => m.classes.includes('Mago') && m.circulo === 3);
    expect(magiasElegiveisAssinatura(livro)).toEqual([]);
  });

  it('livro vazio — ainda não implementado, retorna vazio', () => {
    expect(magiasElegiveisAssinatura([])).toEqual([]);
  });
});
