# EmDev.md

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
- [x] **B.2 — Proficiências simples**: escopo corrigido no caminho —
      Especialista em Armaduras Leves/Médias/Pesadas não têm nada pra
      calcular hoje (a Ficha não modela penalidade por armadura sem
      treinamento em lugar nenhum), então foram pro Backlog.md em vez
      de ganhar um `efeitoMecanico` de mentirinha. Só **Treinamento
      com Armas Marciais** entrou: novo tipo
      `proficiencia-armas-marciais`, lido em
      `classeProficienteComArma` (`core/proficienciaArma.ts`) — arma
      Marcial conta como proficiente mesmo se a classe só é Simples.
      Propagado por `ataqueComArma`/`ataqueAtual`/
      `ataqueBonusMaoSecundaria` até `FichaShell.tsx`. Verificado:
      `tsc -b`/`npm test` (226)/`npm run build` limpos (testes novos:
      Bardo com o talento soma Bônus de Proficiência numa Espada
      Longa, que sem o talento não somaria).
- [x] **B.3 — Bônus numérico direto** — Osmar decidiu NÃO implementar:
      Velocista trava sem métrica de Deslocamento em lugar nenhum da
      Ficha; Líder Inspirador/Chef travam em "vários aliados" (mesmo
      motivo de Inspiração Heroica). Ficam só como texto (`[PH]`) —
      cada jogador resolve PV Temporário/Deslocamento na própria ficha
      depois de anunciar na mesa. Detalhe completo no Backlog.md.
- **B.4 — Magia sempre-preparada** — escopo corrigido no caminho:
      Adepto Elemental/Atirador Arcano saem (modificam magia já
      conjurada, não concedem nenhuma — não é bem "magia sempre-
      preparada", vão pro Backlog.md). Sobram Conjurador Ritualista,
      Telecinético, Telepático, Tocado pela Sombra/Fadas.
  - [x] **B.4.1 — sem escolha nenhuma** (Telecinético, Telepático):
        novo `efeitoMecanico: 'magia-geral-concedida'` (truque(s) e/ou
        magia(s) FIXAS, sem tela nova — `core/magiaTalentoGeral.ts`).
        Telecinético dá o truque Mãos Mágicas; Telepático dá Detectar
        Pensamentos sempre preparada + grátis 1x/Descanso Longo (nova
        seção "Magias Grátis de Talentos Gerais" na aba Magias, mesmo
        padrão de `magiasGratisDasInvocacoes`, com chave própria
        `talento:...` na mesma lista `magiasGratisGastas` — sem criar
        2º array). `personagemConjura` (`core/conjuracao.ts`) passou a
        considerar esses talentos — sem isso, um Guerreiro só com
        Telepático teria a aba Magias escondida. Verificado: `tsc -b`/
        `npm test` (251)/`npm run build` limpos + Playwright (Guerreiro
        nível 4 pega Telepático → aba Magias aparece com "Detectar
        Pensamentos" grátis → usa → vira "Usada").
  - [ ] **B.4.2 — escolha de 1 magia entre 2 escolas** (Tocado pela
        Sombra: Ilusão/Necromancia; Tocado pelas Fadas: Adivinhação/
        Encantamento) — precisa de sub-tela nova no passo "Talento" do
        Level Up (o passo genérico hoje só escolhe o talento em si,
        sem sub-escolha condicional — diferente do wizard, que já tem
        esse mecanismo pra Iniciado em Magia).
  - [ ] **B.4.3 — Conjurador Ritualista**: escolha de N magias
        Rituais (N = Bônus de Proficiência, cresce por nível) da
        lista da própria classe conjuradora do personagem — reaproveita
        a sub-tela do B.4.2, mas com contagem variável e multi-seleção.
- [ ] **B.5 — Escolha de perícia**: Analítico, Mente Aguçada,
      Especialista em Perícia — reaproveita o padrão do Habilidoso
      (`concedeProficiencias`).
- Resto (Agressor, Esmagador, Sentinela, Perfurador, Talhador, etc.)
  fica bloqueado no Backlog.md — depende de um motor de combate com
  tipo de dano/arma/posição que a Ficha ainda não modela (mesmo motivo
  já registrado pro Atacante Selvagem em Backlog.md).

### C. Penalidades por falta de proficiência (Armadura/Escudo/Arma)

Achado durante o B.2 (Especialista em Armaduras ficou sem consumidor)
— o Osmar trouxe o SDD completo (`sdd-penalidade-proficiencia-
equipamento.md`) e pediu pra resolver ANTES de continuar o B.3, pra
não esquecer. Regra real (Cap. 6, "Treinamento com Armadura"/
"Proficiência em Armas"): 3 penalidades independentes, nunca a mesma
regra reaproveitada —
- **Armadura** (Leve/Média/Pesada) sem treinamento: Desvantagem em
  QUALQUER Teste de D20 de Força ou Destreza (testes, perícias,
  iniciativa, ataques, salvaguardas) + não pode conjurar magias.
- **Escudo** sem treinamento: só não soma o bônus de CA do escudo —
  sem Desvantagem, sem trava de magia.
- **Arma** sem proficiência: só não soma o Bônus de Proficiência no
  ataque — já implementado (`classeProficienteComArma`), nada a fazer
  aqui além de manter.

Grupos aprovados pelo Osmar (do mais isolado pro mais espalhado):

- [x] **C.1 — Motor de proficiência de Armadura/Escudo**: novo arquivo
      `core/proficienciaArmadura.ts` (`classeProficienteComArmadura`),
      mesmo padrão de `classeProficienteComArma`, lendo
      `treinamentoArmadura` da planilha. Especialista em Armaduras
      Leves/Médias/Pesadas ganharam `efeitoMecanico: 'proficiencia-
      armadura'` (Leves concede `['Leve','Escudos']` junto, conforme o
      livro) — fecha o item do Backlog.md aberto no B.2. Varre TODOS
      os talentos do personagem (não só o primeiro achado), porque
      2 talentos diferentes podem contribuir categorias diferentes ao
      mesmo tempo. Verificado: `tsc -b`/`npm test` (234)/`npm run
      build` limpos.
- [x] **C.2 — CA sem bônus de escudo sem treinamento**:
      `calcularCAEquipado`/`explicarCAEquipado` ganharam parâmetro
      `classe` opcional — só somam `bonusEscudo` se
      `classeProficienteComArmadura(classe, 'Escudos', talentos)` for
      `true`; sem `classe` passada (chamadas antigas, ex. resumo do
      wizard), comportamento antigo preservado. Popup do "ⓘ" mostra
      "Escudo (sem treinamento) +0" quando aplicável. Verificado:
      `tsc -b`/`npm test`/`npm run build` limpos + Playwright (Bardo
      com Couro Batido + Escudo → CA 12, sem os +2 do escudo; popup
      mostra a linha "sem treinamento").
- [x] **C.3 — Desvantagem em D20 de Força/Destreza sem treinamento de
      armadura**: sinal único `desvantagemForcaDestreza` calculado 1x
      em `FichaShell.tsx` (`armaduraSemTreinamentoEquipada`) e passado
      pra `AtributosTab` (atributo FOR/DES, perícias de FOR/DES,
      Iniciativa), `CombatTab` (Iniciativa do painel, ataque Mão
      Secundária) e `AcaoPanelContent` (ataque principal) — cada
      chamada de `rolarD20` correspondente ganha `vantagem:
      'desvantagem'` condicional. Não fixa Vantagem/Desvantagem
      escolhida manualmente — só força quando o jogador ainda não
      escolheu nenhuma. Verificado: `tsc -b`/`npm test`/`npm run
      build` limpos + Playwright (Bardo com Cota de Malha — FOR e
      ataque com Espada Longa saem em Desvantagem automática; CAR
      continua rolagem normal, com os botões de Vantagem/Desvantagem
      livres pro jogador escolher).
- [x] **C.4 — Bloqueio de conjuração com armadura errada**: trava
      `conjurarMagia` em `AcaoPanelContent.tsx` (Ação) E
      `ReacaoPanelContent.tsx` (Reação) — os 2 pontos únicos por onde
      toda conjuração de combate passa — mais um reforço em
      `MagiasTab.tsx` (`usarMagia`/`usarMagiaGratis`), que também
      deixa conjurar direto fora do Combat. Linha "✨ Usar Magia" fica
      acinzentada com aviso "Bloqueado — Armadura equipada sem
      treinamento impede conjurar magias." Verificado: `tsc -b`/`npm
      test`/`npm run build` limpos + Playwright (painel de Ação com
      Cota de Malha equipada mostra a linha bloqueada).

Grupo C fechado — volta o B.3 (pausado acima).
