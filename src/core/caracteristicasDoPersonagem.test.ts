import { describe, expect, it } from 'vitest';
import { classes, type Classe } from '../data/rulesets/dnd2024/classes';
import { ID_CARACTERISTICA_CLASSE } from '../data/rulesets/dnd2024/idsCaracteristicasClasse';
import {
  caracteristicasDeSubclasse,
  contextosDasClasses,
  detalheDaCaracteristica,
  donaDaCaracteristicaDeSubclasse,
  donaDaCaracteristica,
  maiorNumeroDeAtaques,
  repeticoesDaCaracteristica,
  temCaracteristica,
} from './caracteristicasDoPersonagem';

// Bardo primeiro de propósito: é a classe "em foco" do Char Multiclasse e antes escondia todas as outras.
const MULTI = [
  { classe: 'Bardo', nivel: 20, subclasse: 'Colégio do Conhecimento' },
  { classe: 'Bárbaro', nivel: 20, subclasse: 'Trilha da Árvore do Mundo' },
  { classe: 'Guerreiro', nivel: 20, subclasse: null },
  { classe: 'Paladino', nivel: 20, subclasse: 'Juramento da Devoção' },
];

describe('características em todas as classes do personagem', () => {
  const ctx = contextosDasClasses(MULTI, classes);

  it('acha característica de classe que NÃO é a primeira (Bárbaro, Guerreiro, Bardo)', () => {
    expect(temCaracteristica(ctx, ID_CARACTERISTICA_CLASSE.ataqueImprudente)).toBe(true);
    expect(temCaracteristica(ctx, ID_CARACTERISTICA_CLASSE.golpeBrutal)).toBe(true);
    expect(temCaracteristica(ctx, 'Surto de Ação')).toBe(true);
    expect(temCaracteristica(ctx, 'Inspiração de Bardo')).toBe(true);
  });

  it('devolve a classe dona e o nível NELA, não o nível total', () => {
    const dona = donaDaCaracteristica(ctx, ID_CARACTERISTICA_CLASSE.ataqueImprudente);
    expect(dona?.classe.nome).toBe('Bárbaro');
    expect(dona?.nivel).toBe(20);
    expect(detalheDaCaracteristica(ctx, 'Surto de Ação')?.nome).toBe('Surto de Ação');
  });

  it('conta repetições na classe dona (Golpe Brutal Fortalecido 2x no nível 20)', () => {
    expect(repeticoesDaCaracteristica(ctx, ID_CARACTERISTICA_CLASSE.golpeBrutalFortalecido)).toBe(2);
  });

  it('respeita o nível de CADA classe: nível 1 de Bárbaro ainda não tem Golpe Brutal', () => {
    const baixo = contextosDasClasses([{ classe: 'Bárbaro', nivel: 1, subclasse: null }, ...MULTI.slice(0, 1)], classes);
    expect(temCaracteristica(baixo, ID_CARACTERISTICA_CLASSE.golpeBrutal)).toBe(false);
  });

  it('subclasse de QUALQUER classe conta (Raízes do Bárbaro e Arma Sagrada do Paladino, com o Bardo na frente)', () => {
    const sub = caracteristicasDeSubclasse(ctx, ['raizesDevastadoras', 'armaSagrada', 'legiaoDosMortos']);
    expect(sub.raizesDevastadoras).toBe(true);
    expect(sub.armaSagrada).toBe(true);
    expect(sub.legiaoDosMortos).toBe(false); // Necromante não está no personagem
  });

  it('sem subclasse escolhida não libera nada de subclasse', () => {
    const sem = contextosDasClasses([{ classe: 'Bárbaro', nivel: 20, subclasse: null }], classes);
    expect(caracteristicasDeSubclasse(sem, ['raizesDevastadoras']).raizesDevastadoras).toBe(false);
  });

  it('devolve a classe dona da subclasse com o nível NELA (Árvore do Mundo no Bárbaro, não no Bardo da frente)', () => {
    const dona = donaDaCaracteristicaDeSubclasse(contextosDasClasses([{ classe: 'Bardo', nivel: 5, subclasse: null }, ...MULTI.slice(1)], classes), 'raizesDevastadoras');
    expect(dona?.classe.nome).toBe('Bárbaro');
    expect(dona?.nivel).toBe(20);
    expect(donaDaCaracteristicaDeSubclasse(ctx, 'legiaoDosMortos')).toBeNull();
  });

  it('Ataque Extra não soma entre classes: vale o maior', () => {
    expect(maiorNumeroDeAtaques(ctx)).toBe(4); // Guerreiro 20
    expect(maiorNumeroDeAtaques(contextosDasClasses([MULTI[0]], classes))).toBe(1);
    expect(maiorNumeroDeAtaques([])).toBe(1);
  });

  it('classe desconhecida é ignorada e personagem sem classe não quebra', () => {
    expect(contextosDasClasses([{ classe: 'Inventada', nivel: 3, subclasse: null }], classes)).toEqual([]);
    expect(temCaracteristica([], 'Qualquer Coisa')).toBe(false);
  });

  it('classe NOVA (que não existe no código) é reconhecida só pelo dado, sem editar nada', () => {
    const nova = {
      nome: 'Classe do Futuro',
      progressao: [
        { nivel: 1, bonusProficiencia: '+2', caracteristicas: ['Poder Inicial'] },
        { nivel: 3, bonusProficiencia: '+2', caracteristicas: ['Poder Avançado'] },
      ],
    } as unknown as Classe;
    const futuro = contextosDasClasses([{ classe: 'Classe do Futuro', nivel: 3, subclasse: null }], [...classes, nova]);
    expect(temCaracteristica(futuro, 'Poder Avançado')).toBe(true);
    const cedo = contextosDasClasses([{ classe: 'Classe do Futuro', nivel: 2, subclasse: null }], [...classes, nova]);
    expect(temCaracteristica(cedo, 'Poder Avançado')).toBe(false);
  });
});
