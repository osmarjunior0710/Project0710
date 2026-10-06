# EmDev.md

> Arquivo da conta principal / branch padrão (ver seção 14.1 do
> `CLAUDE.md`). A outra conta usa `EmDevB.md` — nunca escreva aqui a
> partir da branch `claude/read-claude-md-c75hsf`.
>
> Plano do foco que está em andamento **agora** (ver ciclo de foco,
> seção 6 do `CLAUDE.md`). Diferente da família `DECISOES-*.md`
> (decisão já tomada, permanente) e de `PENDENCIAS.md` (adiado de
> propósito ou travado estruturalmente), este arquivo é só o checklist
> de trabalho do foco sendo executado agora.
>
> Fica vazio entre focos. Quando um foco fecha (seção 6.3), o conteúdo
> é apagado — não acumula plano antigo.

---

## Foco atual: Monge — classe base (nível 1-20, sem subclasse)

8ª classe do projeto. SDD completo em `sdd/sdd-monge.md` (chapéu 2) —
leia antes de implementar qualquer entrega, principalmente a seção 2
(CA sem armadura precisa GENERALIZAR a função existente pro 2º
atributo poder ser SAB, não só CON, e pra perder o bônus com Escudo —
não é só "trocar Bárbaro por Monge").

**2 células da planilha com dado bugado** (aba Subclasses, só afeta
as 4 subclasses — não a classe base desta leva): Combatente das
Sombras nível 3 tem texto de outra legenda colado; Combatente dos
Elementos nível 17 tem a introdução inteira do capítulo de Paladino
colada no final. Extrair só o texto certo na hora de importar (mesmo
tratamento do Bruxo/Mestre Místico) — não usar a célula como está.

- [x] **Entrega 1 — dado no banco, nada visível ainda.** `classes.ts`
      (progressão completa + recursos: Bônus de Artes Marciais em
      Nº DE LADOS do dado — 6/8/10/12 —, Pontos de Foco, Movimento sem
      Armadura), `classesProficienciasIniciais.ts` (já tinha
      `proficienciasArmaArmaduraClasse.ts` pronto, confirmado), CA sem
      armadura generalizada (`DEFESA_SEM_ARMADURA_POR_CLASSE`,
      `core/calculoPersonagem.ts` — Bárbaro CON/mantém com Escudo,
      Monge SAB/perde com Escudo; `calcularCA` do wizard, que nem
      tinha o caso do Bárbaro, ganhou de quebra). `ferramentasEscolha`
      generalizado pra aceitar array de grupos (Monge escolhe entre 2
      grupos — Artesão OU Instrumento). 3 novas funções em
      `recursosClasse.ts` (`ladosDadoArtesMarciais`/
      `quantidadePontosDeFoco`/`bonusMovimentoSemArmadura`), todas
      testadas. Achado de quebra, registrado em PENDENCIAS.md:
      Bárbaro e Paladino faltam em `proficienciasEntradaMulticlasse.ts`
      (fora de escopo desta entrega). Validado ao vivo: Monge continua
      "(em breve)" no wizard, nenhum personagem de outra classe quebrou.
      `npx tsc -b`, `npm test -- --run` (862/862), `npm run build`
      verdes.
- [ ] **Entrega 2 — habilitar Monge na criação (wizard).** Defesa sem
      Armadura valendo (SAB, perde com Escudo), Artes Marciais valendo
      no dano do Ataque Desarmado/armas de Monge (maior entre o dado
      da arma e o de Artes Marciais, nunca soma).
- [ ] **Entrega 3 — Pontos de Foco + as 3 técnicas base** (Defesa
      Paciente/Passo do Vento/Torrente de Golpes) — cada uma com
      escolha "de graça" vs "gastar 1 Foco", painel de Ação Bônus.
      Pontos de Foco em `recursosVisiveis.ts` + resets de Descanso
      Curto E Longo.
- [ ] **Entrega 4 — Defletir Ataques + Queda Lenta + Golpe
      Atordoante.** Defletir Ataques é um padrão NOVO (reduzir dano
      recebido reativamente, nunca existiu no app — ver SDD seção 7).
- [ ] **Entrega 5 — resto dos níveis 6-20** (Evasão, Movimento
      Acrobático, Foco Aprimorado, Restauro Pessoal, Defletir Energia,
      Sobrevivente Disciplinado, Foco Perfeito, Defesa Superior,
      Dádiva Épica, Corpo e Mente). Metabolismo Incomum (nível 2) já
      entrou na Entrega 3 — Foco Perfeito (nível 15) reaproveita o
      mesmo gatilho de Rolar Iniciativa.
- [ ] **Entrega 6 — personagem de teste + revisão final**, sem
      subclasse ainda (subclasses viram foco(s) separado(s) depois).

Subclasses (Mão Espalmada, Misericórdia, Sombras, Elementos) ficam
pra focos futuros, como já foi feito com Bárbaro/Paladino/Guerreiro.
