import { describe, it, expect } from 'vitest';
import {
  magiasPeritoNecromanciaNesteNivel,
  catalogoPeritoNecromancia,
  formasFamiliarMortoVivoElegiveis,
  ehMortoVivo,
  bonusLegiaoDosMortos,
  curaColheitaMacabra,
  petsMortoVivo,
  personagemEnsanguentado,
  curaColheitaDosMortos,
  opcoesColheitaDosMortos,
} from './necromante';
import { classes } from '../data/rulesets/dnd2024/classes';
import { criaturas } from '../data/rulesets/dnd2024/criaturas';
import { criarPet } from './pets';

const mago = classes.find((c) => c.nome === 'Mago')!;

describe('magiasPeritoNecromanciaNesteNivel', () => {
  it('caso normal — ao atingir o nível 3 (escolha da subclasse), concede 2', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 2, 3)).toBe(2);
  });

  it('caso de borda — nível abaixo de 3 nunca concede nada (subclasse ainda não existe)', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 1, 2)).toBe(0);
  });

  it('concede +1 quando o level-up desbloqueia um círculo de magia novo (ex: nível 5, 3º círculo)', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 4, 5)).toBe(1);
  });

  it('não concede nada num level-up que não desbloqueia círculo novo', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 5, 6)).toBe(0);
  });
});

describe('catalogoPeritoNecromancia', () => {
  it('caso normal — só magias de Necromancia de círculo 1+ até o máximo', () => {
    const catalogo = catalogoPeritoNecromancia(2);
    expect(catalogo.length).toBeGreaterThan(0);
    expect(catalogo.every((m) => m.escola === 'Necromancia' && m.circulo >= 1 && m.circulo <= 2)).toBe(true);
  });

  it('caso de borda — círculo máximo 0 não inclui nenhuma magia (só truques ficariam de fora também)', () => {
    expect(catalogoPeritoNecromancia(0)).toEqual([]);
  });
});

describe('formasFamiliarMortoVivoElegiveis', () => {
  it('caso normal — Necromante nível 3+ vê Esqueleto e Zumbi', () => {
    const formas = formasFamiliarMortoVivoElegiveis('Necromante', 3);
    expect(formas.map((c) => c.nome).sort()).toEqual(['Esqueleto', 'Zumbi']);
  });

  it('caso de borda — sem a característica ainda (nível 2, ou outra subclasse) não mostra nada', () => {
    expect(formasFamiliarMortoVivoElegiveis('Necromante', 2)).toEqual([]);
    expect(formasFamiliarMortoVivoElegiveis('Abjurador', 5)).toEqual([]);
    expect(formasFamiliarMortoVivoElegiveis(null, 5)).toEqual([]);
  });
});

describe('ehMortoVivo', () => {
  it('caso normal — Esqueleto (tipo "Morto-Vivo", maiúsculo) é reconhecido', () => {
    const esqueleto = criaturas.find((c) => c.id === 'esqueleto')!;
    expect(ehMortoVivo(esqueleto)).toBe(true);
  });

  it('caso de borda — Zumbi (tipo "Morto-vivo", minúsculo na planilha) também é reconhecido', () => {
    const zumbi = criaturas.find((c) => c.id === 'zumbi')!;
    expect(ehMortoVivo(zumbi)).toBe(true);
  });

  it('uma criatura comum (Gato, tipo Fera) não é Morto-Vivo', () => {
    const gato = criaturas.find((c) => c.id === 'gato')!;
    expect(ehMortoVivo(gato)).toBe(false);
  });
});

describe('bonusLegiaoDosMortos', () => {
  it('caso normal — PV extra igual ao nível de Mago, dano igual ao mod. de Inteligência', () => {
    expect(bonusLegiaoDosMortos(6, 3)).toEqual({ pv: 6, dano: 3 });
  });

  it('caso de borda — mod. de Inteligência negativo também é aplicado (dano bônus negativo)', () => {
    expect(bonusLegiaoDosMortos(6, -1)).toEqual({ pv: 6, dano: -1 });
  });
});

describe('curaColheitaMacabra', () => {
  it('caso normal — dobro do círculo do espaço gasto', () => {
    expect(curaColheitaMacabra(2)).toBe(4);
  });

  it('caso de borda — círculo 1 (mínimo pra gastar espaço) cura só 2', () => {
    expect(curaColheitaMacabra(1)).toBe(2);
  });
});

describe('petsMortoVivo', () => {
  it('caso normal — só devolve os pets Morto-Vivo, ignora os demais', () => {
    const zumbi = criaturas.find((c) => c.id === 'zumbi')!;
    const gato = criaturas.find((c) => c.id === 'gato')!;
    const pets = [criarPet('Podrengo', zumbi), criarPet('Bichano', gato)];
    const elegiveis = petsMortoVivo(pets);
    expect(elegiveis.map((p) => p.nome)).toEqual(['Podrengo']);
  });

  it('caso de borda — sem nenhum Morto-Vivo entre os pets, devolve vazio', () => {
    const gato = criaturas.find((c) => c.id === 'gato')!;
    expect(petsMortoVivo([criarPet('Bichano', gato)])).toEqual([]);
  });
});

describe('personagemEnsanguentado', () => {
  it('caso normal — PV exatamente na metade já conta como Ensanguentado', () => {
    expect(personagemEnsanguentado(10, 20)).toBe(true);
  });

  it('caso de borda — 1 PV acima da metade ainda não é Ensanguentado', () => {
    expect(personagemEnsanguentado(11, 20)).toBe(false);
  });
});

describe('curaColheitaDosMortos', () => {
  it('caso normal — dobro do ND, arredondado pra cima (ND 1, cura 2)', () => {
    expect(curaColheitaDosMortos(1)).toBe(2);
  });

  it('caso de borda — ND fracionário (1/4, como Esqueleto/Zumbi) nunca cura menos que 1', () => {
    expect(curaColheitaDosMortos(0.25)).toBe(1);
  });
});

describe('opcoesColheitaDosMortos', () => {
  it('caso normal — cada pet Morto-Vivo aparece com a cura calculada pro ND dele', () => {
    const zumbi = criaturas.find((c) => c.id === 'zumbi')!; // ND 1/4
    const pets = [criarPet('Podrengo', zumbi)];
    expect(opcoesColheitaDosMortos(pets)).toEqual([{ pet: pets[0], cura: 1 }]);
  });

  it('caso de borda — sem nenhum pet Morto-Vivo, devolve vazio', () => {
    const gato = criaturas.find((c) => c.id === 'gato')!;
    expect(opcoesColheitaDosMortos([criarPet('Bichano', gato)])).toEqual([]);
  });
});
