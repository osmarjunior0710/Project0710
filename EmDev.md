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

## Foco: Talentos — Fase 4 completa (efeito mecânico de verdade)

77 talentos ainda sem efeito mecânico, em 5 categorias (Geral 42,
Talento Selvagem 10, Dádiva Épica 12, Estilo de Luta 7, Origem 6).
Ordem acordada com o Osmar: **Origem primeiro** (é o que aparece na
criação de personagem), depois Geral; Talento Selvagem/Dádiva Épica
ficam pra depois do Mago (nicho/nível altíssimo). Cada categoria vira
seu próprio conjunto de sub-focos (A = Origem, B = Geral, ...) — antes
de propor a quebra de cada um, sempre relê tudo que já existe (código
+ livro, quando o Osmar fornecer o PDF) antes de sugerir os grupos.

### A. Origem

**A.0 — leitura/revisão (feita 2026-09):** comparado o código
(`talentos.ts`, `DECISOES-CLASSES.md`, `Backlog.md`) contra o livro
(PDF Cap. 5, fornecido pelo Osmar, p.200-202). Achados registrados em
`LICOES-RAPIDAS.md`. Grupos propostos e aprovados pelo Osmar:

- [x] **A.1 — Correção de dado** (sem mecânica nova, só texto):
      Sortudo perdeu a cláusula "nível 5+ nega crítico" (não existe na
      regra 2024, parece herança 2014) — removida de `talentos.ts` e
      do código que a lia (`pontosDeSorteNegaCritico` em
      `FichaShell.tsx`/`CombatTab.tsx`). Valentão de Taverna tinha o
      benefício "empurrar 1,5m ao acertar Desarmado" descrito errado —
      reescrito como os 4 benefícios reais (Ataque Desarmado
      Aprimorado, Dano Garantido, Armamento Improvisado, Corrida
      Aprimorada, Ataque em Investida), com o que falta implementar
      listado no Backlog.md. Verificado: `tsc -b`/`npm test`
      (221)/`npm run build` limpos.
- [x] **A.2 — Motor de reroll de dado não-d20**: `RollContext` ganhou
      `rerollSe1`/`usarRerollSe1` — quando `rolarDados` é chamado com
      `quantidade === 1`, mostra o valor de verdade (antes sempre
      "💥") e aceita `{ rotulo }` pra oferecer reroll se sair 1, mesmo
      botão visual da Sorte (Pequenino). Plugado no Valentão de
      Taverna (Dano Garantido, `CombatTab.rolarDanoPendente`, só
      quando o dano é do Ataque Desarmado E o talento está ativo).
      Curandeiro (Cura Garantida) fica só com o motor pronto — falta a
      ação de cura em si (Backlog.md, bloqueada por "curar outro
      personagem" não existir). Achado no caminho: `DanoPendente.label`
      do Ataque Desarmado vem com emoji (`"Dano — 🗡 Ataque
      Desarmado"`), comparação exata (`===`) não bate — usar
      `.endsWith()`. Detalhe completo em `DECISOES-COMBATE.md`.
      Verificado: `tsc -b`/`npm test` (221)/`npm run build` limpos +
      Playwright (Math.random forçado pra 1 no 1d4 → botão aparece →
      reroll dá outro valor → botão some, não pode usar 2x).
- [x] **A.3 — Substituição de Magia (Iniciado em Magia)**: novo passo
      `iniciadoEmMagia` no `LevelUpShell` — a cada level-up (sem
      limite de 1, diferente de Arcana Mística), troca a magia de 1º
      círculo por outra da mesma lista, pra cada gaveta ativa (Origem
      e/ou Versátil, independentes). Reaproveita `TrocarValorSimples`
      e o padrão visual de "trocar já conhecido" da Arcana Mística.
      Padrão generalizado registrado em `DECISOES-CLASSES.md`.
      Verificado: `tsc -b`/`npm test` (221)/`npm run build` limpos +
      Playwright (personagem Sábio nível 1 → Level Up nível 2 → troca
      Alarme por Armadura Arcana → Confirmar → persistido em
      `selecao.magiaMagiaIniciadaEscolhida`).
- Bloqueados (registrados no Backlog.md, sem entrega de código por
  enquanto): Troca de Iniciativa (Alerta), desconto de loja/Fabricação
  Rápida (Artifista), Atacante Selvagem completo, Médico de Combate
  (Curandeiro), Canção Encorajadora (Músico), Armamento
  Improvisado/Corrida Aprimorada/Ataque em Investida (Valentão de
  Taverna).

### B. Geral

**B.0 — leitura/revisão (feita 2026-09):** comparado o código
(`talentos.ts`, 43 talentos — 42 sem efeito mecânico + Mestre em
Armaduras Médias já pronto) contra a planilha mestra (aba Talentos,
sem diferença nenhuma de texto) e o livro (PDF Cap. 5, p.202-209).
Achado: **Conjurador Ritualista** falta 1 frase real do livro
("sempre que seu Bônus de Proficiência aumentar, pode adicionar mais
1 magia de 1º círculo com Ritual às sempre preparadas") — vira B.1.
Grupos propostos e aprovados pelo Osmar:

- [x] **B.0.1 — Marcação de placeholder por talento** (pedido do
      Osmar antes de começar B.1): `talentoTemPlaceholder` (já
      existia em `classificarTalento.ts`, só era usado no Perfil)
      agora também aparece na própria tela de escolha do Level Up
      (`TelaEscolherTalento`) e nos 2 pontos do Perfil que ainda não
      usavam (card do Talento de Origem, talento pego pelo Versátil).
      Corrigido também um falso-positivo: Habilidoso e Iniciado em
      Magia são cobertos por mecanismo próprio (`concedeProficiencias`/
      `concedeMagiaIniciada`), não por `efeitoMecanico` — sem isso
      apareceriam como `[PH]` mesmo estando 100% prontos. Músico
      continua `[PH]` de propósito (só a proficiência com instrumento
      está pronta, a Canção Encorajadora ainda falta). Conforme cada
      talento do Grupo B ganhar `efeitoMecanico`, o `[PH]` some
      sozinho — não precisa mexer nesse texto de novo.
      Verificado: `tsc -b`/`npm test` (223)/`npm run build` limpos +
      Playwright (Guerreiro nível 3→4, tela de escolha de Talento
      mostra `[PH]` em cada card sem efeito, largura 390px).
- [x] **B.1 — Correção de texto (sem mecânica nova)**: Conjurador
      Ritualista ganhou a frase que faltava (livro, p.203) sobre o
      número de magias Rituais sempre preparadas crescer +1 toda vez
      que o Bônus de Proficiência aumentar depois de pegar o talento,
      e a nota de que o atributo de conjuração é o atributo aumentado
      por este talento. A planilha mestra (aba Talentos) também está
      sem essa frase — avisar o Osmar pra ele decidir se atualiza lá
      também. Verificado: `tsc -b`/`npm test` (223)/`npm run build`
      limpos (só texto, nada plugado em cálculo ainda — `[PH]`
      continua até B.4).
- [ ] **B.2 — Proficiências simples**: Especialista em Armaduras
      Leves/Médias/Pesadas, Treinamento com Armas Marciais —
      reaproveita o padrão de leitura de talento já usado pra CA/
      Iniciativa (`efeitoMecanicoDoTalento`).
- [ ] **B.3 — Bônus numérico direto**: Velocista (Deslocamento),
      Líder Inspirador/Chef (PV temporário) — mesmo padrão de
      `bonus-pv-por-nivel`/`bonus-ca-com-armadura`.
- [ ] **B.4 — Magia sempre-preparada**: Adepto Elemental, Atirador
      Arcano, Conjurador Ritualista, Telecinético, Telepático, Tocado
      pela Sombra/Fadas — reaproveita o padrão do Iniciado em Magia
      (escolha na tela de Talento + magia(s) sempre preparada(s)).
- [ ] **B.5 — Escolha de perícia**: Analítico, Mente Aguçada,
      Especialista em Perícia — reaproveita o padrão do Habilidoso
      (`concedeProficiencias`).
- Resto (Agressor, Esmagador, Sentinela, Perfurador, Talhador, etc.)
  fica bloqueado no Backlog.md — depende de um motor de combate com
  tipo de dano/arma/posição que a Ficha ainda não modela (mesmo motivo
  já registrado pro Atacante Selvagem em Backlog.md).
