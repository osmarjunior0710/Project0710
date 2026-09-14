import { describe, it, expect } from 'vitest';
import { gerarPersonagemTeste } from './geradorPersonagemTeste';

describe('gerarPersonagemTeste — subclasse nunca sorteia opção sem mecânica implementada', () => {
  it('Bárbaro nível 3+ (as 4 Trilhas só têm dado, zero mecânica): subclasseAtual fica null', () => {
    const personagem = gerarPersonagemTeste({
      classeNome: 'Bárbaro',
      origemNome: 'Acólito',
      especieNome: 'Anão',
      nivelAlvo: 5,
    });
    expect(personagem.subclasseAtual).toBeNull();
  });

  it('subclasseNome forçado (dropdown de teste) continua valendo mesmo sem mecânica', () => {
    const personagem = gerarPersonagemTeste({
      classeNome: 'Bárbaro',
      origemNome: 'Acólito',
      especieNome: 'Anão',
      nivelAlvo: 5,
      subclasseNome: 'Trilha do Berserker',
    });
    expect(personagem.subclasseAtual).toBe('Trilha do Berserker');
  });
});
