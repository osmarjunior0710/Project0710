import { describe, it, expect } from 'vitest';
import { gerarPersonagemTeste } from './geradorPersonagemTeste';

describe('gerarPersonagemTeste — subclasse nunca sorteia opção sem mecânica implementada', () => {
  it('Bárbaro nível 3+ (só a Trilha da Árvore do Mundo tem dado; Berserker/Coração Selvagem/Fanático ainda não): sorteia só a implementada', () => {
    const personagem = gerarPersonagemTeste({
      classeNome: 'Bárbaro',
      origemNome: 'Acólito',
      especieNome: 'Anão',
      nivelAlvo: 5,
    });
    expect(personagem.subclasseAtual).toBe('Trilha da Árvore do Mundo');
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
