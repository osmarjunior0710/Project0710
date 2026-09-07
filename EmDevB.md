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

## Foco: Mago (classe base) + Necromante (subclasse homebrew)

**Pedido do Osmar:** implementar a classe Mago inteira primeiro, depois
a subclasse homebrew Necromante (ainda não é regra oficial — tudo dela
precisa ficar marcado como homebrew, porque o livro oficial ainda não
saiu e a regra vai ser revisada quando sair). Material: planilha mestra
(SDD), PDF oficial "Cap. 3 — Guardião a Paladino" (cobre Mago) e PDF
homebrew "Subclasses Arcanas" (cobre Necromante).

**Pesquisa já feita, confirmada linha a linha entre planilha e PDF
oficial (batem 100%, sem divergência):**
- Progressão 1-20 completa (recursos: Truques 3→5, Magias Preparadas
  4→25, Espaços de Magia 1º-9º círculo).
- 8 características nomeadas: Adepto de Ritual/Conjuração/Recuperação
  Arcana (nv1), Acadêmico (nv2), Subclasse de Mago (nv3), Aumento no
  Valor de Atributo (nv4/8/12/16), Memorizar Magia (nv5), Maestria de
  Magias (nv18), Dádiva Épica (nv19), Assinatura Mágica (nv20). Níveis
  6/10/14 = "Característica de Subclasse" (placeholder da planilha,
  resolve contra a subclasse escolhida, mesmo padrão de Bardo/Guerreiro).
  Níveis 7/9/11/13/15/17 não têm característica nomeada nova.
- Proficiências: Armas Simples, sem treinamento de armadura (já
  confirmado em `proficienciasArmaArmaduraClasse.ts` — **nenhuma
  mudança necessária nesse arquivo**). 2 perícias à escolha (Arcanismo/
  História/Intuição/Investigação/Medicina/Natureza/Religião).
  Equipamento inicial: (A) 2 Adagas + Foco Arcano (Cajado) + Kit de
  Erudito + Livro de Magias + Túnica + 5 PO; ou (B) 55 PO.
- 4 subclasses oficiais na planilha: Abjurador, Adivinhador, Evocador,
  Ilusionista (Necromante **não está** na planilha — confirma que é
  mesmo só homebrew, sem atalho de dado).

**Achado central — mecanismo novo que nenhuma classe ainda tem:**
diferente de Bardo/Bruxo (magias preparadas = magias conhecidas, 1
lista só), Mago tem 2 camadas: o **Livro de Magias** (grimório — pool
maior, começa com 6 magias de 1º círculo, ganha +2 por nível depois do
1º, nunca diminui) e as **Magias Preparadas** (subconjunto do grimório,
tamanho por nível igual à tabela — ver "Casters" em
`DECISOES-CLASSES.md`, esse é o "Padrão C" mencionado lá, com a camada
extra do grimório finalmente sendo implementada). Regras de troca:
- **Ao completar Descanso Longo:** redefinição livre — troca QUALQUER
  quantidade de Magias Preparadas por outras do grimório (não só 1,
  diferente de Bardo/Bruxo).
- **Ao completar Descanso Longo (nível 2+):** aprende +2 magias novas
  no grimório (escolha livre, nunca substitui — só cresce).
- **Memorizar Magia (nível 5+, Descanso Curto):** troca só 1 magia
  preparada por outra do grimório — mecanismo SEPARADO do de cima,
  menor, disponível com mais frequência.

**Pesquisa do PDF homebrew (Necromante) — texto completo já lido, 6
características (nv 3, 3, 6, 6, 10, 14):**
- Nv3 Perito em Necromancia: 2 magias de Necromancia (até 2º círculo)
  grátis no grimório; a cada novo círculo de espaço, +1 magia de
  Necromancia grátis no grimório.
- Nv3 Grimório de Necromancia: Resistência a dano necrótico (passiva);
  Colheita Macabra (ao conjurar magia de Necromancia com espaço, cura
  1 Morto-Vivo aliado); Familiar Morto-Vivo (Encontrar Familiar vira
  Esqueleto/Zumbi).
- Nv6 Poder Funesto: Recuperação Arcana também reduz Exaustão em 1;
  dano de Necromancia ignora resistência a necrótico.
- Nv6 Legião dos Mortos: Animar Mortos sempre preparada + 1x grátis;
  Mortos-Vivos convocados/criados por magia de Necromancia ganham PV
  extra e dano bônus no ataque.
- Nv10 Colheita dos Mortos: ao ficar Ensanguentado, Reação pra reduzir
  a 0 PV um Morto-Vivo controlado e curar a si mesmo.
- Nv14 Mestre da Morte: Ação Bônus dá PV Temp a Mortos-Vivos
  controlados; Reação de explosão necrótica (dano em área + CD) quando
  um Morto-Vivo controlado é reduzido a 0 PV.

**Bloqueio estrutural já identificado (avisar antes de chegar na Fase
B, não é surpresa de última hora):** a maioria das características do
Necromante depende de "criatura convocada/controlada pelo personagem"
existir no app (Familiar, Mortos-Vivos de Animar Mortos) — esse
conceito **não existe** hoje (mesmo bloqueio já registrado em
`PENDENCIAS.md` pro Familiar do Pacto da Corrente do Bruxo). Só dá pra
implementar de verdade, sem esse sistema: Perito em Necromancia
(magia grátis no grimório) e Resistência Necrótica (passiva simples).
O resto (Colheita Macabra, Familiar Morto-Vivo, Poder Funesto inteiro
menos a parte de Exaustão, Legião dos Mortos, Colheita dos Mortos,
Mestre da Morte) trava estruturalmente até existir noção de "criatura
sob controle do personagem" — vai virar pendência registrada quando a
Fase B abrir, não bloqueia a Fase A (Mago base).

---

### FASE A — Mago, classe base (fazer primeiro, sequência pedida pelo Osmar)

- [ ] **A1 — Dados.** `classes.ts` (núcleo + progressão + recursos:
  Truques/Magias Preparadas/9 Espaços de Magia por círculo, mesmo
  padrão de array-por-círculo do Bardo); `caracteristicasClasse.ts`
  (8 características reais acima); `classesProficienciasIniciais.ts`
  (2 perícias de 7 opções + equipamento A/B). Schema NOVO: Livro de
  Magias — provável novo array `livroDeMagiasAtual: string[]` (mesmo
  padrão de "coleção que cresce sozinha" já usado no Conjurador
  Ritualista) + novo `core/livroDeMagias.ts` com
  `tamanhoLivroDeMagias(nivel)` (6 no nv1, +2 por nível depois).
- [ ] **A2 — Wizard.** Criação de Mago nível 1: 2 perícias, 3 truques,
  escolher 6 magias de 1º círculo pro grimório, depois escolher 4
  dessas 6 como preparadas hoje, equipamento A/B.
- [ ] **A3 — Ficha (aba Magias).** Truques/Preparadas/Espaços reais do
  Mago (reaproveita o que já existe) + seção NOVA "Livro de Magias"
  (mostra as conhecidas, distingue visualmente preparada vs. só no
  grimório).
- [ ] **A4 — Combat.** "Usar Magia" com truques/preparadas reais do
  Mago (reaproveita o picker já existente, `SelecionarMagiaShell`/
  `EscolherCirculoShell` — zero componente novo esperado aqui).
- [ ] **A5 — Level Up.** +2 magias no grimório por nível (nunca
  remove); Magias Preparadas cresce E permite redefinição livre a
  cada Descanso Longo (não é level-up — ver A7); Truques cresce
  (nv4/10); ASI (nv4/8/12/16); Memorizar Magia (nv5+, card na Combat,
  1x por Descanso Curto, troca 1 preparada). Maior entrega da fase —
  primeira vez que o motor precisa de "escolher magia de um pool maior
  (grimório)" em vez de só crescer/trocar 1 na lista de conhecidas.
- [ ] **A6 — Subclasse placeholder.** Abjurador/Adivinhador/Evocador/
  Ilusionista em `subclasses.ts`, sem mecânica (mesmo padrão já usado
  em Bardo/Bruxo — reaproveite 100%, deve ser rápido).
- [ ] **A7 — Transição de Descanso (fade + prompt).** Pedido explícito
  do Osmar, plugado nos 2 botões já existentes de `AtributosTab.tsx`
  (`onDescansoCurto`/`onDescansoLongo`, hoje sem nenhum feedback
  visual):
  - [ ] A7.1 — overlay genérico de tela cheia: fade-in pro preto,
    texto "Descanso Curto" ou "Descanso Longo" em branco no meio,
    fade-out. Descanso Curto: 0,5s fade-in + 0,5s fade-out (1s
    total). Descanso Longo: 1s fade-in + 1s fade-out (2s total).
    Component novo (provável `DescansoOverlay.tsx`, `position: fixed`,
    mesmo padrão de overlay de tela cheia já usado por `RollOverlay`/
    `LevelUpShell` — ver DECISOES-DESIGN.md).
  - [ ] A7.2 — só no Descanso Longo: se o personagem tiver Magias
    Preparadas no padrão "redefinição livre" (hoje só Mago), a
    transição PARA no preto (sem terminar o fade-in ainda virar
    fade-out) e mostra a pergunta "quer alterar suas magias
    preparadas?" (sim/não). Sim → abre a mesma tela de escolha da A5
    (grimório → preparadas). Não/confirmar → só então roda o
    fade-out. Personagem sem essa característica (ex: Bardo/Bruxo)
    não vê o prompt, só o fade normal.

### FASE B — Necromante (subclasse homebrew, só depois da Fase A fechada)

- [ ] **B0 — Convenção de marcação "homebrew".** Proposta a confirmar
  com o Osmar antes de codar (mesmo espírito do `[PH]`, seção 12 do
  CLAUDE.md, mas significado diferente — "não é regra oficial ainda,
  vai ser revisado"): campo `homebrew: boolean` em `Subclasse`
  (`subclasses.ts`) — UI deriva o badge desse campo em qualquer lugar
  que mostrar nome/característica da subclasse (card de escolha na
  Level Up, seção de características na Perfil/Combat), nunca
  hardcoded por nome. Falta decidir o visual do badge (cor, texto —
  ex.: tag âmbar "🏠 Homebrew — a revisar quando a regra oficial
  sair").
- [ ] **B1 — Dados.** `subclasses.ts` (Necromante, `homebrew: true`);
  `caracteristicasSubclasse.ts` (6 características reais, extraídas
  do PDF homebrew — texto já lido e transcrito acima).
- [ ] **B2 — Mecânica possível hoje.** Perito em Necromancia (2 magias
  de Necromancia grátis no grimório ao pegar a subclasse + 1 a cada
  novo círculo de espaço) e Resistência Necrótica (passiva simples).
- [ ] **B3 — Registrar bloqueio estrutural em PENDENCIAS.md.** O resto
  das características do Necromante (Colheita Macabra, Familiar
  Morto-Vivo, Poder Funesto/Necrose Avassaladora, Legião dos Mortos,
  Colheita dos Mortos, Mestre da Morte) trava em "criatura sob
  controle do personagem" não existir no app — mover pra
  `PENDENCIAS.md` no fechamento desta fase, junto com o bloqueio
  gêmeo já registrado lá pro Familiar do Bruxo (mesma trava, unificar
  se fizer sentido).

---

**Próximo passo:** aguardando o Osmar confirmar este plano (ou pedir
ajuste) antes de começar a escrever qualquer código, começando por A1.
