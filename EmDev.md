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
- [ ] **Entrega 2 — Manipular Elementos (nível 3).** Elementalismo
      concedido ao Monge (SAB como atributo de conjuração), nas telas Magias
      E Combate (CLAUDE.md 6.6).
- [ ] **Entrega 3 — Sintonia Elemental (nível 3)** — cartão Ativar (1 Foco)
      / Encerrar na aba Combate (padrão Defesa Superior), Extensão e Passo
      dos Elementos (nível 11) como texto.
- [ ] **Entrega 4 — Ataques Elementais (nível 3)** — tipos de dano
      elementais no popup do Ataque Desarmado (+ Torrente) e empurrão com
      salvaguarda de Força. Decisão de UI da lista de tipos em aberto (SDD
      seção 2).
- [ ] **Entrega 5 — Explosão Elemental (nível 6).**
- [ ] **Entrega 6 — Ápice Elemental (nível 17)** em 3 partes: Golpes
      Potencializados do Ápice, Passo Destrutivo, Resistência a Dano.
