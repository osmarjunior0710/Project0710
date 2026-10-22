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
      invocacoesTruqueVinculadoAtuais: {},
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
      conhecimentoPrimordialPericiaAtual: null,
      academicoPericiaAtual: null,
      maestriaDeMagiasAtuais: {},
      assinaturaMagicaAtuais: [],
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
      invocacoesTruqueVinculadoAtuais: {},
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
      conhecimentoPrimordialPericiaAtual: null,
      academicoPericiaAtual: null,
      maestriaDeMagiasAtuais: {},
      assinaturaMagicaAtuais: [],
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
      invocacoesTruqueVinculadoAtuais: {},
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
      conhecimentoPrimordialPericiaAtual: null,
      academicoPericiaAtual: null,
      maestriaDeMagiasAtuais: {},
      assinaturaMagicaAtuais: [],
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
      invocacoesTruqueVinculadoAtuais: {},
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
      conhecimentoPrimordialPericiaAtual: null,
      academicoPericiaAtual: null,
      maestriaDeMagiasAtuais: {},
      assinaturaMagicaAtuais: [],
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
      invocacoesTruqueVinculadoAtuais: {},
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
      conhecimentoPrimordialPericiaAtual: null,
      academicoPericiaAtual: null,
      maestriaDeMagiasAtuais: {},
      assinaturaMagicaAtuais: [],
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

describe('sortearLevelUpRapido — Psiônico (Disciplinas Psiônicas)', () => {
  const psionico = classes.find((c) => c.nome === 'Psiônico')!;
  const base = {
    classe: psionico,
    personagem: { nivel: 1, pvMax: 8, dadoVida: 'd6', conMod: 0, subclasse: null, estiloDeLuta: null, bonusPvPorNivel: 0 },
    truquesAtuais: [],
    magiasPreparadasAtuais: [],
    livroDeMagiasAtuais: [],
    invocacoesMisticasAtuais: [],
    invocacoesTruqueVinculadoAtuais: {},
    arcanaMisticaAtuais: {},
    periciasEspecialistaAtuais: [],
    periciasProficientesDoPersonagem: [],
    periciasSubclasseBonusAtuais: [],
    magiasDescobertasMagicasAtuais: [],
    atributosFinaisAtuais: { ...atributosFinaisNeutros },
    talentosGeraisAtuais: [],
    conhecimentoPrimordialPericiaAtual: null,
    academicoPericiaAtual: null,
    maestriaDeMagiasAtuais: {},
    assinaturaMagicaAtuais: [],
  };

  it('nível 1 → 2 sorteia 2 disciplinas distintas', () => {
    const r = sortearLevelUpRapido(base);
    expect(r.disciplinasPsionicasEscolhidas).toHaveLength(2);
    expect(new Set(r.disciplinasPsionicasEscolhidas).size).toBe(2);
  });

  it('borda: já tendo 2, o nível 5 só acrescenta 1 e mantém as antigas; nível sem disciplina nova mantém as mesmas (a troca de 1 é opcional)', () => {
    const r5 = sortearLevelUpRapido({
      ...base,
      personagem: { ...base.personagem, nivel: 4 },
      disciplinasPsionicasAtuais: ['mira-inerrante', 'bio-retorno'],
    });
    expect(r5.disciplinasPsionicasEscolhidas).toHaveLength(3);
    expect(r5.disciplinasPsionicasEscolhidas).toEqual(expect.arrayContaining(['mira-inerrante', 'bio-retorno']));
    const r3 = sortearLevelUpRapido({ ...base, personagem: { ...base.personagem, nivel: 2 }, disciplinasPsionicasAtuais: ['mira-inerrante', 'bio-retorno'] });
    expect(r3.disciplinasPsionicasEscolhidas).toEqual(['mira-inerrante', 'bio-retorno']);
  });
});

describe('sortearLevelUpRapido — Dádiva Épica aplica o próprio ASI (bug corrigido)', () => {
  it('nível 19 do Guerreiro sorteia uma Dádiva Épica E o +1 de atributo dela, dentro do máximo 30', () => {
    const resultado = sortearLevelUpRapido({
      classe: guerreiro,
      personagem: { nivel: 18, pvMax: 100, dadoVida: 'd10', conMod: 2, subclasse: null, estiloDeLuta: 'Duelismo', bonusPvPorNivel: 0 },
      truquesAtuais: [],
      magiasPreparadasAtuais: [],
      livroDeMagiasAtuais: [],
      invocacoesMisticasAtuais: [],
      invocacoesTruqueVinculadoAtuais: {},
      arcanaMisticaAtuais: {},
      periciasEspecialistaAtuais: [],
      periciasProficientesDoPersonagem: [],
      periciasSubclasseBonusAtuais: [],
      magiasDescobertasMagicasAtuais: [],
      atributosFinaisAtuais: { ...atributosFinaisNeutros },
      talentosGeraisAtuais: [],
      conhecimentoPrimordialPericiaAtual: null,
      academicoPericiaAtual: null,
      maestriaDeMagiasAtuais: {},
      assinaturaMagicaAtuais: [],
    });
    expect(resultado.dadivaEpicaEscolhida).not.toBeNull();
    expect(resultado.atributosAumentadosDadiva).toHaveLength(1);
  });

  it('borda: Dádiva do Ataque Irresistível sorteada grava o atributo escolhido na gaveta (precisa lembrar qual)', () => {
    // Sorteia até achar a Dádiva do Ataque Irresistível (prerequisito nenhum, sempre elegível) —
    // repete algumas vezes pra não depender de 1 sorteio só com baixa probabilidade.
    let achou = false;
    for (let i = 0; i < 300 && !achou; i++) {
      const resultado = sortearLevelUpRapido({
        classe: guerreiro,
        personagem: { nivel: 18, pvMax: 100, dadoVida: 'd10', conMod: 2, subclasse: null, estiloDeLuta: 'Duelismo', bonusPvPorNivel: 0 },
        truquesAtuais: [],
        magiasPreparadasAtuais: [],
        livroDeMagiasAtuais: [],
        invocacoesMisticasAtuais: [],
        invocacoesTruqueVinculadoAtuais: {},
        arcanaMisticaAtuais: {},
        periciasEspecialistaAtuais: [],
        periciasProficientesDoPersonagem: [],
        periciasSubclasseBonusAtuais: [],
        magiasDescobertasMagicasAtuais: [],
        atributosFinaisAtuais: { ...atributosFinaisNeutros },
        talentosGeraisAtuais: [],
        conhecimentoPrimordialPericiaAtual: null,
        academicoPericiaAtual: null,
        maestriaDeMagiasAtuais: {},
        assinaturaMagicaAtuais: [],
      });
      if (resultado.dadivaEpicaEscolhida === 'dadiva-do-ataque-irresistivel') {
        achou = true;
        expect(resultado.escolhaAtributoTalentoGeral).toEqual({
          'dadiva-do-ataque-irresistivel': resultado.atributosAumentadosDadiva?.[0],
        });
      }
    }
    expect(achou).toBe(true);
  });
});

