import { describe, it, expect } from 'vitest';
import { classes } from '../data/rulesets/dnd2024/classes';
import { sortearLevelUpRapido } from './levelUpAleatorio';

const guerreiro = classes.find((c) => c.nome === 'Guerreiro')!;
const bruxo = classes.find((c) => c.nome === 'Bruxo')!;

const atributosFinaisNeutros = { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 } as const;

describe('sortearLevelUpRapido', () => {
  it('sobe exatamente 1 nível e ganha PV pela média (sem rolar dado)', () => {
    const resultado = sortearLevelUpRapido({
      classe: guerreiro,
      personagem: { nivel: 1, pvMax: 12, dadoVida: 'd10', conMod: 2, subclasse: null, estiloDeLuta: 'Duelismo', bonusPvPorNivel: 0 },
      truquesAtuais: [],
      magiasPreparadasAtuais: [],
      invocacoesMisticasAtuais: [],
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
    });
    expect(resultado.novoNivel).toBe(2);
    expect(resultado.pvGanho).toBe(6 + 2); // média de d10 (6) + mod. CON
  });

  it('nível sem subclasse escolhida ainda: não mexe em subclasse', () => {
    const resultado = sortearLevelUpRapido({
      classe: guerreiro,
      personagem: { nivel: 1, pvMax: 12, dadoVida: 'd10', conMod: 0, subclasse: null, estiloDeLuta: null, bonusPvPorNivel: 0 },
      truquesAtuais: [],
      magiasPreparadasAtuais: [],
      invocacoesMisticasAtuais: [],
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
    });
    expect(resultado.subclasseEscolhida).toBeNull();
  });

  it('Bruxo nível 2→3: sorteia subclasse (nivelSubclasse=3) e Invocações Místicas', () => {
    const resultado = sortearLevelUpRapido({
      classe: bruxo,
      personagem: { nivel: 2, pvMax: 14, dadoVida: 'd8', conMod: 1, subclasse: null, estiloDeLuta: null, bonusPvPorNivel: 0 },
      truquesAtuais: [],
      magiasPreparadasAtuais: [],
      invocacoesMisticasAtuais: [],
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
    });
    expect(resultado.novoNivel).toBe(3);
    expect(resultado.subclasseEscolhida).toBe('Patrono Ínfero'); // única implementada hoje
    expect(resultado.invocacoesMisticasEscolhidas).not.toBeNull();
    expect(resultado.invocacoesMisticasEscolhidas!.length).toBeGreaterThan(0);
    expect(resultado.truquesEscolhidos).not.toBeNull();
  });

  it('nível de ASI: sempre escolhe um talento (real ou Aumento no Valor de Atributo)', () => {
    const resultado = sortearLevelUpRapido({
      classe: guerreiro,
      personagem: { nivel: 3, pvMax: 24, dadoVida: 'd10', conMod: 1, subclasse: 'Cavaleiro Místico', estiloDeLuta: 'Duelismo', bonusPvPorNivel: 0 },
      truquesAtuais: [],
      magiasPreparadasAtuais: [],
      invocacoesMisticasAtuais: [],
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
    });
    expect(resultado.novoNivel).toBe(4);
    expect(resultado.talentoGeralEscolhido).not.toBeNull();
  });
});
