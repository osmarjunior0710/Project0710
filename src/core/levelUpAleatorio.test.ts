import { describe, it, expect } from 'vitest';
import { classes } from '../data/rulesets/dnd2024/classes';
import { sortearLevelUpRapido } from './levelUpAleatorio';

const guerreiro = classes.find((c) => c.nome === 'Guerreiro')!;
const bruxo = classes.find((c) => c.nome === 'Bruxo')!;
const mago = classes.find((c) => c.nome === 'Mago')!;

const atributosFinaisNeutros = { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 } as const;

describe('sortearLevelUpRapido', () => {
  it('sobe exatamente 1 nível e ganha PV pela média (sem rolar dado)', () => {
    const resultado = sortearLevelUpRapido({
      classe: guerreiro,
      personagem: { nivel: 1, pvMax: 12, dadoVida: 'd10', conMod: 2, subclasse: null, estiloDeLuta: 'Duelismo', bonusPvPorNivel: 0 },
      truquesAtuais: [],
      magiasPreparadasAtuais: [],
      livroDeMagiasAtuais: [],
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
      livroDeMagiasAtuais: [],
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
      livroDeMagiasAtuais: [],
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
      livroDeMagiasAtuais: [],
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

  it('Mago nível 1→2: Livro de Magias cresce +2 mantendo as que já tinha, Preparadas nunca sai do grimório', () => {
    // 6 magias = tamanho real do grimório no nível 1 (regra do livro).
    const livroAtual = ['Alarme', 'Detectar Magia', 'Armadura Arcana', 'Mísseis Mágicos', 'Onda Trovejante', 'Queda Suave'];
    const resultado = sortearLevelUpRapido({
      classe: mago,
      personagem: { nivel: 1, pvMax: 8, dadoVida: 'd6', conMod: 1, subclasse: null, estiloDeLuta: null, bonusPvPorNivel: 0 },
      truquesAtuais: ['Luz', 'Mãos Mágicas', 'Prestidigitação Arcana'],
      magiasPreparadasAtuais: ['Alarme', 'Detectar Magia'],
      livroDeMagiasAtuais: livroAtual,
      invocacoesMisticasAtuais: [],
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
    });
    // Nível 2 = 8 magias no grimório (6 + 2) — cresce exatamente +2.
    expect(resultado.livroDeMagiasEscolhidas).not.toBeNull();
    expect(resultado.livroDeMagiasEscolhidas).toHaveLength(livroAtual.length + 2);
    expect(resultado.livroDeMagiasEscolhidas).toEqual(expect.arrayContaining(livroAtual));
    // Truques: nível 2 ainda não aumenta a quantidade (3 continua 3) —
    // como já tinha exatamente 3, fica igual, sem sortear nenhum novo.
    expect(resultado.truquesEscolhidos).toEqual(['Luz', 'Mãos Mágicas', 'Prestidigitação Arcana']);
    // Preparadas: nível 2 aumenta de 4 pra 5 — mantém as 2 que já tinha
    // e completa o resto só com magias que também estão no grimório.
    expect(resultado.magiasPreparadasEscolhidas).toEqual(expect.arrayContaining(['Alarme', 'Detectar Magia']));
    for (const nome of resultado.magiasPreparadasEscolhidas ?? []) {
      expect(resultado.livroDeMagiasEscolhidas).toContain(nome);
    }
  });
});
