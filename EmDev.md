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

## Foco atual: Monge — Combatente dos Elementos (subclasse)

Decidido pelo Osmar (2026-10). SDD: `sdd/sdd-monge-elementos.md`. Teste
sempre no "Char Multiclasse" (nível 20 em todas as classes — regra do
CLAUDE.md 6.4); o Monge já entra nele com essa subclasse. Planilha
(aba Subclasses): célula do nível 17 (Ápice Elemental) vinha com a
introdução do Paladino colada — cortada na importação.

- [x] **Entrega 1 — dado + liberar a escolha.** 5 características
      importadas em `caracteristicasSubclasse.ts` (todas `placeholder-*`,
      nível 17 limpo), Level Up libera a subclasse (`subclasseImplementada`),
      Char Multiclasse com "Combatente dos Elementos". Teste em
      `core/subclasseElementos.test.ts`.
- [x] **Entrega 2 — Manipular Elementos (nível 3).** Campo novo `truquesConcedidos` em `CaracteristicaSubclasse` + `core/magiasSubclasse.ts` (genérico, qualquer subclasse) + testes; hook de conjuração soma o truque em `magiasConjuraveis` (Combate) e a aba Magias ganhou a seção "Magias de Subclasse"; a aba Magias aparece mesmo sem classe conjuradora. Conferido ao vivo nas 2 telas com um Monge puro. Elementalismo é só utilidade (sem rolagem), então o atributo de conjuração (SAB) não aparece em nenhum cálculo.
- [x] **Entrega 3 — Sintonia Elemental (nível 3)** (feito: `core/sintoniaElemental.ts` + testes, `sintoniaElementalAtiva` persistido, card igual ao da Defesa Superior com Extensão e Natação/Voo do nível 11 como texto; Passo dos Elementos ficou como texto, ainda `placeholder-textonly` no dado) — cartão Ativar (1 Foco)
      / Encerrar na aba Combate (padrão Defesa Superior), Extensão e Passo
      dos Elementos (nível 11) como texto.
- [x] **Entrega 4 — Ataques Elementais (nível 3)** (feito: opção B — botão "🌪 Elemental" no popup de dano do Ataque Desarmado/Torrente com Sintonia ativa → `ElementoSintoniaModal` (5 elementos) → `SalvaguardaDoAlvoModal` de Força, empurrão opcional; `core/ataquesElementais.ts` + testes; testado ao vivo incluindo o encadeamento na Torrente 1/3→2/3) — tipos de dano
      elementais no popup do Ataque Desarmado (+ Torrente) e empurrão com
      salvaguarda de Força. Decisão de UI da lista de tipos em aberto (SDD
      seção 2).
- [x] **Entrega 5 — Explosão Elemental (nível 6).** Linha no painel de Ação (grupo Monge, com contador de Foco), `ElementoSintoniaModal` reaproveitado com outro título, 2 Foco + Ação, rola 3×dado de Artes Marciais, `SalvaguardaDoAlvoModal` de Destreza com falha=dano e sucesso=metade; `core/explosaoElemental.ts` + testes; testado ao vivo (3d12=27 → 13). A CD é a de Foco (8+SAB+prof), como no restante da subclasse.
- [ ] **Entrega 6 — Ápice Elemental (nível 17)** em 3 partes (6a FEITA: Golpes Potencializados do Ápice, automático no 1º acerto desarmado do turno, `core/apiceElemental.ts`, `apiceGolpesUsadoTurno` + ref anti-closure; falta 6b Passo Destrutivo e 6c Resistência a Dano): Golpes
      Potencializados do Ápice, Passo Destrutivo, Resistência a Dano.
