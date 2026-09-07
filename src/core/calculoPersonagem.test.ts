import { describe, it, expect } from 'vitest';
import {
  bonusProficiencia,
  bonusPvPorNivelDaEspecie,
  bonusPvPorNivelDoTalento,
  calcularCA,
  calcularCAEquipado,
  calcularPvMaximoNivel1,
  calcularIniciativa,
  calcularPercepcaoPassiva,
  calcularPericias,
  calcularProficienciasFerramenta,
  periciasProficientes,
  ferramentasProficientes,
} from './calculoPersonagem';
import { classes } from '../data/rulesets/dnd2024/classes';
import { criarSelecaoInicial, type WizardSelection } from './personagem';
import type { ItemMochila } from './mochila';

const guerreiro = classes.find((c) => c.nome === 'Guerreiro');
if (!guerreiro) throw new Error('Fixture "Guerreiro" não encontrada em data/rulesets/dnd2024/classes.ts');
const bardo = classes.find((c) => c.nome === 'Bardo');
if (!bardo) throw new Error('Fixture "Bardo" não encontrada em data/rulesets/dnd2024/classes.ts');

describe('bonusProficiencia', () => {
  it('nível 1 é sempre +2 (regra oficial pra qualquer classe)', () => {
    expect(bonusProficiencia(guerreiro, 1)).toBe(2);
  });

  it('sobe conforme a tabela de progressão da classe (Guerreiro nível 5 = +3, nível 9 = +4)', () => {
    expect(bonusProficiencia(guerreiro, 5)).toBe(3);
    expect(bonusProficiencia(guerreiro, 9)).toBe(4);
  });

  it('cai pro nível 1 quando o nível pedido não existe na tabela (fallback de borda)', () => {
    expect(bonusProficiencia(guerreiro, 999)).toBe(bonusProficiencia(guerreiro, 1));
  });
});

/** Guerreiro d10 (mod. CON +1), DES 14 (mod. +2), SAB 12 (mod. +1) —
 * fixture reaproveitada nos testes abaixo, `overrides` só pra mudar o
 * que cada teste precisa (perícia proficiente, etc). */
function selecaoGuerreiro(overrides: Partial<WizardSelection> = {}): WizardSelection {
  const s = criarSelecaoInicial();
  s.classe = 'Guerreiro';
  s.atributos = { FOR: 15, DES: 14, CON: 13, INT: 10, SAB: 12, CAR: 8 };
  return { ...s, ...overrides };
}

function itemEquipado(nome: string, slot: ItemMochila['slot']): ItemMochila {
  return { id: nome, nome, quantidade: 1, peso: null, origemDoItem: 'Manual', slot };
}

describe('bonusPvPorNivelDaEspecie (Tenacidade Anã)', () => {
  it('Anão tem +1 de PV máximo por nível', () => {
    expect(bonusPvPorNivelDaEspecie(selecaoGuerreiro({ especie: 'Anão' }))).toBe(1);
  });

  it('qualquer outra espécie (ou nenhuma ainda escolhida) não tem bônus', () => {
    expect(bonusPvPorNivelDaEspecie(selecaoGuerreiro({ especie: 'Elfo' }))).toBe(0);
    expect(bonusPvPorNivelDaEspecie(criarSelecaoInicial())).toBe(0);
  });
});

describe('calcularPvMaximoNivel1', () => {
  it('usa o dado de vida MÁXIMO da classe + mod. Constituição (nunca rola nem tira média no nível 1)', () => {
    expect(calcularPvMaximoNivel1(selecaoGuerreiro())).toBe(10 + 1); // d10 + mod. CON 13 (+1)
  });

  it('Anão soma +1 de Tenacidade Anã por cima do dado de vida + mod. Constituição', () => {
    expect(calcularPvMaximoNivel1(selecaoGuerreiro({ especie: 'Anão' }))).toBe(10 + 1 + 1); // d10 + mod. CON (+1) + Tenacidade Anã (+1)
  });

  it('Fazendeiro soma +2 de Vigoroso por cima do dado de vida + mod. Constituição', () => {
    expect(calcularPvMaximoNivel1(selecaoGuerreiro({ origem: 'Fazendeiro' }))).toBe(10 + 1 + 2); // d10 + mod. CON (+1) + Vigoroso (+2)
  });

  it('retorna null quando falta Constituição ou Classe (personagem em criação)', () => {
    expect(calcularPvMaximoNivel1(criarSelecaoInicial())).toBeNull();
  });
});

describe('bonusPvPorNivelDoTalento (Vigoroso)', () => {
  it('Origem Fazendeiro (talento Vigoroso) dá +2 de PV máximo por nível', () => {
    expect(bonusPvPorNivelDoTalento(selecaoGuerreiro({ origem: 'Fazendeiro' }))).toBe(2);
  });

  it('qualquer outra origem (ou nenhuma ainda escolhida) não tem bônus', () => {
    expect(bonusPvPorNivelDoTalento(selecaoGuerreiro({ origem: 'Soldado' }))).toBe(0);
    expect(bonusPvPorNivelDoTalento(criarSelecaoInicial())).toBe(0);
  });
});

describe('calcularCA (criação, resumo do wizard)', () => {
  it('sem armadura escolhida no equipamento inicial: 10 + mod. Destreza', () => {
    expect(calcularCA(selecaoGuerreiro())).toBe(12); // DES 14 -> mod +2
  });
});

describe('calcularCAEquipado (Ficha, pós-criação)', () => {
  it('sem nada equipado: 10 + mod. Destreza (padrão "sem armadura")', () => {
    expect(calcularCAEquipado([], 14)).toBe(12);
  });

  it('armadura Leve sem teto de Destreza: base + mod. Destreza inteiro, mesmo alto', () => {
    const itens = [itemEquipado('Couro Batido', 'armadura')];
    expect(calcularCAEquipado(itens, 18)).toBe(12 + 4); // DES 18 -> mod +4, Couro Batido não tem teto
  });

  it('armadura Média com teto (máx. 2): mod. Destreza capado mesmo com Destreza alta', () => {
    const itens = [itemEquipado('Gibão de Peles', 'armadura')];
    expect(calcularCAEquipado(itens, 18)).toBe(12 + 2); // capado em +2, não +4
  });

  it('Escudo soma +2 além da armadura', () => {
    const itens = [itemEquipado('Couro Batido', 'armadura'), itemEquipado('Escudo', 'escudo')];
    expect(calcularCAEquipado(itens, 14)).toBe(12 + 2 + 2); // DES 14 -> mod +2
  });

  it('Estilo de Luta Defensivo soma +1 SÓ quando alguma Armadura está equipada', () => {
    const itens = [itemEquipado('Couro Batido', 'armadura')];
    expect(calcularCAEquipado(itens, 14, 'Defensivo')).toBe(12 + 2 + 1);
  });

  it('Defensivo sem nenhuma Armadura equipada não soma nada (regra real: precisa estar "usando armadura")', () => {
    expect(calcularCAEquipado([], 14, 'Defensivo')).toBe(12);
  });

  it('Mestre em Armaduras Médias eleva o teto de Destreza de 2 pra 3, com Armadura Média e Destreza 16+', () => {
    const itens = [itemEquipado('Gibão de Peles', 'armadura')];
    expect(calcularCAEquipado(itens, 16, null, ['mestre-em-armaduras-medias'])).toBe(12 + 3); // mod +3, dentro do novo teto
  });

  it('Mestre em Armaduras Médias não faz efeito se a Destreza for menor que 16', () => {
    const itens = [itemEquipado('Gibão de Peles', 'armadura')];
    expect(calcularCAEquipado(itens, 14, null, ['mestre-em-armaduras-medias'])).toBe(12 + 2); // continua no teto normal
  });

  it('sem `classe` passada (ex.: resumo do wizard): Escudo sempre soma, sem checar proficiência', () => {
    const itens = [itemEquipado('Couro Batido', 'armadura'), itemEquipado('Escudo', 'escudo')];
    expect(calcularCAEquipado(itens, 14)).toBe(12 + 2 + 2);
  });

  it('Bardo (sem treinamento com Escudos): CA não soma o bônus do Escudo', () => {
    const itens = [itemEquipado('Couro Batido', 'armadura'), itemEquipado('Escudo', 'escudo')];
    expect(calcularCAEquipado(itens, 14, null, [], bardo)).toBe(12 + 2); // sem os +2 do escudo
  });

  it('Bardo + Especialista em Armaduras Leves (concede Escudos também): volta a somar', () => {
    const itens = [itemEquipado('Couro Batido', 'armadura'), itemEquipado('Escudo', 'escudo')];
    expect(calcularCAEquipado(itens, 14, null, ['especialista-em-armaduras-leves'], bardo)).toBe(12 + 2 + 2);
  });

  it('Guerreiro (com treinamento com Escudos): CA soma o bônus normalmente', () => {
    const itens = [itemEquipado('Couro Batido', 'armadura'), itemEquipado('Escudo', 'escudo')];
    expect(calcularCAEquipado(itens, 14, null, [], guerreiro)).toBe(12 + 2 + 2);
  });
});

describe('calcularIniciativa', () => {
  it('sem o talento Alerta: só o mod. Destreza', () => {
    expect(calcularIniciativa(selecaoGuerreiro())).toBe(2); // DES 14 -> mod +2
  });

  it('com o talento Alerta: soma o Bônus de Proficiência do nível', () => {
    expect(calcularIniciativa(selecaoGuerreiro(), guerreiro, 1, ['alerta'])).toBe(2 + 2); // nível 1 = +2 de prof.
  });
});

describe('calcularPercepcaoPassiva', () => {
  it('sem proficiência em Percepção: 10 + mod. Sabedoria', () => {
    expect(calcularPercepcaoPassiva(selecaoGuerreiro(), 1)).toBe(11); // SAB 12 -> mod +1
  });

  it('com proficiência em Percepção: soma o Bônus de Proficiência do nível', () => {
    const s = selecaoGuerreiro({ periciasClasseEscolhidas: ['Percepção'] });
    expect(calcularPercepcaoPassiva(s, 1)).toBe(11 + 2);
  });
});

describe('calcularPericias (periciasBonusExtras — ex: "Proficiências Bônus" do Colégio do Conhecimento)', () => {
  it('perícia fora de periciasBonusExtras continua "Sem proficiência"', () => {
    const s = selecaoGuerreiro();
    const resultado = calcularPericias(s, 1, [], ['Arcanismo']);
    const furtividade = resultado.find((p) => p.nome === 'Furtividade');
    expect(furtividade?.proficiente).toBe(false);
  });

  it('perícia listada em periciasBonusExtras vira proficiente (bônus inteiro, não dobrado)', () => {
    const s = selecaoGuerreiro();
    const resultado = calcularPericias(s, 1, [], ['Arcanismo']);
    const arcanismo = resultado.find((p) => p.nome === 'Arcanismo');
    expect(arcanismo?.proficiente).toBe(true);
    expect(arcanismo?.mod).toBe(0 + bonusProficiencia(guerreiro, 1)); // INT 10 -> mod 0
  });
});

describe('calcularPericias (perícia da espécie — Hábil do Humano)', () => {
  it('perícia em periciaEspecieEscolhida vira proficiente', () => {
    const s = selecaoGuerreiro({ periciaEspecieEscolhida: 'Arcanismo' });
    const resultado = calcularPericias(s, 1);
    const arcanismo = resultado.find((p) => p.nome === 'Arcanismo');
    expect(arcanismo?.proficiente).toBe(true);
  });

  it('sem periciaEspecieEscolhida (espécie sem Hábil, ou ainda não escolhida) não afeta nada', () => {
    const s = selecaoGuerreiro();
    const resultado = calcularPericias(s, 1);
    const arcanismo = resultado.find((p) => p.nome === 'Arcanismo');
    expect(arcanismo?.proficiente).toBe(false);
  });
});

describe('calcularProficienciasFerramenta', () => {
  it('lista só as ferramentas concedidas (Classe), com mod. atributo + Bônus de Proficiência', () => {
    const s = selecaoGuerreiro({ ferramentasClasseEscolhidas: ['Ferramentas de Ladrão'] }); // Destreza
    const resultado = calcularProficienciasFerramenta(s, 1);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe('Ferramentas de Ladrão');
    expect(resultado[0].atributo).toBe('DES');
    expect(resultado[0].mod).toBe(2 + bonusProficiencia(guerreiro, 1)); // DES 14 -> mod +2
  });

  it('sem nenhuma ferramenta concedida, devolve lista vazia (borda)', () => {
    expect(calcularProficienciasFerramenta(selecaoGuerreiro(), 1)).toEqual([]);
  });

  it('não duplica quando a mesma ferramenta vem de mais de uma fonte (Origem + Classe)', () => {
    const s = selecaoGuerreiro({
      origem: 'Andarilho', // ferramenta fixa: Ferramentas de Ladrão
      ferramentasClasseEscolhidas: ['Ferramentas de Ladrão'],
    });
    const resultado = calcularProficienciasFerramenta(s, 1);
    expect(resultado).toHaveLength(1);
  });
});

describe('periciasProficientes (Talento de Origem + Versátil)', () => {
  it('inclui a parte de perícia de proficienciasTalentoOrigemEscolhidas (ex: Habilidoso pego pela Origem)', () => {
    const s = selecaoGuerreiro({ proficienciasTalentoOrigemEscolhidas: ['Medicina', 'Ferramentas de Ladrão'] });
    expect(periciasProficientes(s)).toContain('Medicina');
    expect(periciasProficientes(s)).not.toContain('Ferramentas de Ladrão');
  });

  it('inclui a parte de perícia da gaveta separada do Versátil, sem duplicar a de proficienciasTalentoOrigemEscolhidas', () => {
    const s = selecaoGuerreiro({
      proficienciasTalentoOrigemEscolhidas: ['Medicina'],
      proficienciasTalentoEspecieEscolhidas: ['Medicina', 'Percepção'],
    });
    const resultado = periciasProficientes(s);
    expect(resultado.filter((p) => p === 'Medicina')).toHaveLength(1);
    expect(resultado).toContain('Percepção');
  });

  it('sem nenhum talento com escolha de perícia, não quebra (borda)', () => {
    expect(periciasProficientes(selecaoGuerreiro())).toEqual([]);
  });
});

describe('ferramentasProficientes (Talento de Origem + Versátil)', () => {
  it('inclui a parte de ferramenta das duas gavetas (Origem e Versátil) ao mesmo tempo', () => {
    const s = selecaoGuerreiro({
      proficienciasTalentoOrigemEscolhidas: ['Ferramentas de Ladrão'],
      proficienciasTalentoEspecieEscolhidas: ['Ferramentas de Navegador'],
    });
    const resultado = ferramentasProficientes(s);
    expect(resultado).toContain('Ferramentas de Ladrão');
    expect(resultado).toContain('Ferramentas de Navegador');
  });

  it('sem nenhuma ferramenta de talento, devolve só o que vier de Origem/Classe (borda)', () => {
    expect(ferramentasProficientes(selecaoGuerreiro())).toEqual([]);
  });
});
