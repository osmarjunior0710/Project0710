# EmDevB.md

> Arquivo desta conta (branch `claude/read-claude-md-c75hsf` — ver
> seção 14.1 do `CLAUDE.md`). A conta principal usa `EmDev.md` — nunca
> escreva lá a partir desta branch, mesmo que ele apareça aqui depois
> de um merge (nesse caso o conteúdo é da outra conta, só chegou junto).
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

## Foco: Postmortem Mago + Necromante — 3 achados pra corrigir

Depois de fechar a Fase B, o Osmar pediu uma revisão a fundo (postmortem)
de todo o trabalho de Mago + Necromante. Revisão levantou 3 achados
técnicos concretos, priorizados; Osmar aprovou corrigir os 3, um de
cada vez.

- [x] **1 — Legião dos Mortos com fórmula errada (mesma categoria de
  bug já corrigida na Colheita dos Mortos).** Confirmado contra a foto
  do PDF: PV extra = círculo do espaço de magia GASTO ao criar aquele
  Morto-Vivo (não nível de Mago fixo) + mod. Inteligência; dano bônus =
  mod. Inteligência, mínimo 1 (não o mod. cru, que podia ficar 0/negativo).
  Como o app não sabe automaticamente qual espaço criou qual pet (pets
  são adicionados manualmente), decidido com o Osmar: o toggle no card
  do pet agora pede o círculo usado (select 1º-9º) ANTES de ligar —
  `core/necromante.ts`'s `bonusLegiaoDosMortos(circuloDoEspacoGasto,
  modInt)` recalculado; `PetsTab.tsx`'s `PetCard` ganhou o select
  (só visível enquanto o bônus está desligado); `onAlternarBonusLegiaoDosMortos`
  agora recebe o círculo escolhido. 2 testes Vitest reescritos.
  **Testado no navegador** (Playwright, 390px, Necromante nível 6 com
  Zumbi convocado): escolher círculo 3 e ligar o bônus mostrou "+4 PV,
  +1 dano" — batendo com o mod. de Inteligência real do personagem
  gerado (3 + mod. INT 1 = 4; dano = mod. INT 1) — sem erro de console.
  tsc(-b)/testes(373)/build verdes.
- [ ] **2 — Características do Necromante reconhecidas por nome de
  texto, não por ID estável.** `caracteristicaSubclasseDesbloqueada`
  compara `nome` (string livre) — usado por ~4 gates do Necromante
  (Grimório de Necromancia, Legião dos Mortos, Colheita dos Mortos,
  Mestre da Morte) + vários do Bruxo. Como o Necromante é homebrew
  ("vai ser revisado quando o livro sair"), qualquer ajuste de nome
  quebra a feature em silêncio. Migrar pra ID estável, mesmo padrão já
  existente em `idsCaracteristicasClasse.ts` (ver PENDENCIAS.md
  "Migração de comparação-por-nome pra ID estável").
- [ ] **3 — 3 cópias quase idênticas de "conjurar magia com espaço"**
  (`MagiasTab.tsx`'s `processarMagiaAoUsar`, `AcaoPanelContent.tsx`'s
  `conjurarMagia`, `ReacaoPanelContent.tsx`'s `conjurarMagia`). Colheita
  Macabra só está ligada em 2 das 3 — hoje inofensivo (nenhuma magia de
  Necromancia tem tempo de conjuração de Reação no catálogo), mas é
  uma armadilha pra qualquer gancho futuro de "ao conjurar com espaço".
  Unificar numa função só reaproveitada pelos 3 painéis.

**Próximo passo:** item 1 fechado — seguir com o item 2 (IDs estáveis
de característica de subclasse).
