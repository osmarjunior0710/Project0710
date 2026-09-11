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
- [x] **2 — Características do Necromante (e Bruxo) reconhecidas por
  nome de texto, não por ID estável.** Novo
  `data/rulesets/dnd2024/idsCaracteristicasSubclasse.ts`
  (`ID_CARACTERISTICA_SUBCLASSE`, mesmo padrão já existente de
  `idsCaracteristicasClasse.ts`) — mapa central nome→id anotado à mão,
  13 características (4 do Necromante + 9 do Bruxo). Todos os 16 pontos
  de chamada de `caracteristicaSubclasseDesbloqueada` (11 em
  `FichaShell.tsx`, 2 em `LevelUpShell.tsx`, 2 em `levelUpAleatorio.ts`,
  1 em `necromante.ts`) trocaram o literal solto por
  `ID_CARACTERISTICA_SUBCLASSE.xyz` — se o nome de exibição mudar numa
  revisão futura (planilha do Bruxo ou PDF homebrew do Necromante), só
  esse mapa precisa de ajuste, não cada chamada espalhada pelo código.
  **Refatoração pura** (nenhum comportamento muda) — conferido byte a
  byte que cada valor do mapa bate exatamente com o `nome:` real em
  `caracteristicasSubclasse.ts`/`caracteristicasSubclasseHomebrew.ts`
  antes de considerar pronto.
  **Testado no navegador** (Playwright, 390px, Necromante nível 14):
  Perfil mostra as 3 características de subclasse (Legião dos Mortos/
  Colheita dos Mortos/Mestre da Morte); painel de Reação mostra
  Colheita dos Mortos + Mestre da Morte; painel de Ação Bônus mostra
  Mestre da Morte — tudo idêntico a antes da refatoração, sem erro de
  console.
  tsc(-b)/testes(373)/build verdes.
- [x] **3 — 3 cópias quase idênticas de "conjurar magia com espaço"
  unificadas.** Osmar pediu o refactor completo (não só o remendo da
  Colheita Macabra). Novo `core/conjurarMagia.ts`: `decidirConjuracao(m,
  circuloUsado, nivel, modAcertoConjuracao, colheitaMacabraDisponivel,
  gastouEspacoDeVerdade)` — função pura que decide a mecânica (ataque/
  salvaguarda/cura/nenhuma), monta a rolagem certa, o texto de feedback
  e se qualifica pra Colheita Macabra; centraliza a lógica que se
  repetia, mas cada painel continua aplicando o resultado do seu
  próprio jeito (estado local em `MagiasTab.tsx`, callback pro painel
  pai em `AcaoPanelContent.tsx`/`ReacaoPanelContent.tsx`) — essa parte
  genuinamente difere entre os 3 e não fazia sentido forçar igual.
  **`gastouEspacoDeVerdade` é uma flag separada de `circuloUsado > 0`**
  — necessária porque uma magia concedida de graça por Invocação
  Mística pode ter círculo > 0 sem ter gastado espaço de verdade (não
  qualifica pra Colheita Macabra). **Fecha o furo real:**
  `ReacaoPanelContent.tsx` agora também recebe
  `colheitaMacabraDisponivel`/`onColheitaMacabraDisponivel` (antes não
  tinha esses props — só `MagiasTab`/`AcaoPanelContent` tinham) — se um
  dia existir magia de Necromancia com tempo de conjuração de Reação,
  já funciona sem precisar lembrar de religar de novo.
  8 testes Vitest novos (`decidirConjuracao`, cobrindo os 4 ramos de
  mecânica + a distinção `gastouEspacoDeVerdade`).
  **Testado no navegador** (Playwright, 390px): aba Magias — conjurar
  "Vitalidade Vazia" (Necromancia) com espaço real mostrou o modal de
  Colheita Macabra e a cura aplicou certo (10→12 PV); painel de Ação —
  fluxo de "Usar Magia" → escolher círculo → conjurar não quebrou, sem
  erro de console; painel de Reação — conjurar uma magia de Reação
  (Escudo Arcano) mostrou o feedback certo e marcou a Reação como
  usada, sem erro de console nos 3 fluxos.
  tsc(-b)/testes(381)/build verdes.

**Foco fechado — os 3 achados do postmortem foram corrigidos.**
