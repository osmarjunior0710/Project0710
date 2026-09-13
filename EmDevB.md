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

## Foco: Bárbaro — 5ª classe implementada

Próxima classe depois de Guerreiro/Bardo/Bruxo/Mago (aprovado pelo
Osmar). Chapéu 1 (PM) e chapéu 2 (Game Designer/SDD, só a Fúria — o
resto da progressão/subclasses não precisou de SDD próprio) já
concluídos e aprovados. Documento: `sdd/sdd-barbaro-furia.md`.

**Osmar não tinha em mãos a decupagem externa do Bárbaro nem o guia de
Golias** (mencionados em `PENDENCIAS.md`) — seguindo só com a planilha
mestra (já tem toda a progressão + as 4 Trilhas) e o Cap. 3 do Livro
do Jogador (PDF `04a_-_Cap_3_Classes_de_Personagem_Barbaro_a_Feiticeiro.pdf`).

**Decisões confirmadas (ver SDD pra detalhe completo):**
- Fúria: Caminho Simplificado — fica ativa até "Encerrar Fúria" (ou
  Armadura Pesada), sem tentar detectar "atacou neste turno".
- UI: ativar continua no painel Ação Bônus (gasta 1 uso); card fixo
  sempre visível em Combat mostra "Fúria: ATIVA" + bônus + botão
  Encerrar.

### Plano de entregas

- [x] **B1 — Dado no banco:** `classes.ts` (progressão nível 1-20,
      recursos Fúrias/Dano da Fúria/Maestria em Arma, `disponivel:
      false`), `caracteristicasClasse.ts` (as 20 características base,
      3 células limpas de conteúdo colado de outra aba da planilha —
      Maestria em Arma/Conhecimento Primordial/Campeão Primitivo, ver
      comentário no arquivo), `subclasses.ts` (as 4 Trilhas, só nome/
      id por enquanto — características de cada uma entram em
      B5-B8). Achado no caminho: `ClasseStep.tsx` tinha uma lista
      hardcoded (`CLASSES_EM_BREVE`) desatualizada, com "Mago"
      duplicado (já tinha virado `disponivel: true` no dado real, mas
      continuava também na lista hardcoded — 2 cards, 1 clicável e 1
      cinza) — corrigido junto (removido Mago e Bárbaro do hardcoded,
      já que Bárbaro agora vem do dado real também). Verificado com
      `tsc -b`/`npm test` (512)/`npm run build` limpos + tela de
      criação de personagem: "Bárbaro" aparece 1x só (em breve),
      "Mago" aparece 1x só (não mais duplicado), zero erro de console.
- [x] **B2 — Habilitado na criação (wizard):** `classesProficienciasIniciais.ts`
      (2 perícias de {Atletismo, Intimidação, Lidar com Animais,
      Natureza, Percepção, Sobrevivência}, equipamento A: 4
      Machadinhas + Machado Grande + Kit de Aventureiro + 15 PO / B:
      75 PO) + `classes.ts` virou `disponivel: true`. Proficiência de
      arma/armadura já vinha pronta em `proficienciasArmaArmaduraClasse.ts`
      (toda a planilha "Proficiências de Classe" já tinha sido
      importada antes, pras 12 classes de uma vez).
      **2 achados corrigidos no caminho** (bugs reais, não deixados
      pra depois):
      1. `armasParaMaestria` (`core/maestriaArma.ts`) devolvia o
         catálogo de armas INTEIRO (incluindo à distância) pra
         qualquer classe com proficiência "Armas Simples e Marciais" —
         certo pro Guerreiro, errado pro Bárbaro (a característica
         real restringe a Corpo a Corpo). Filtrado por nome de classe
         (só essa exceção existe hoje) + teste novo.
      2. `calcularCAEquipado`/`explicarCAEquipado` (`core/calculoPersonagem.ts`)
         não tinham NENHUM tratamento pra "Defesa sem Armadura" (CA
         sem armadura = 10 + DES + CON, não só 10 + DES) — gap nunca
         exposto antes porque nenhuma classe implementada tinha essa
         característica. Novo ID estável
         `ID_CARACTERISTICA_CLASSE.defesaSemArmadura` +
         `temDefesaSemArmadura(classe)` (checa a progressão, não o
         nível — a característica é sempre nível 1) + 2 novos params
         `conValor` nas 2 funções (só 1 call site em `FichaShell.tsx`,
         atualizado) + 3 testes novos (com/sem armadura, e confirma
         que Guerreiro continua sem somar CON).
      Verificado com `tsc -b`/`npm test` (516)/`npm run build` limpos
      + criado um Bárbaro de verdade pelo wizard (2 Maestrias de
      arma Corpo a Corpo, 2 perícias, equipamento A) e também via
      "🎲 Personagem de Teste" (nível 5, Golias) — CA bateu com
      10+DES+CON sem armadura, popup "ⓘ" mostra a linha "mod.
      Constituição (Defesa sem Armadura)" certinha, zero erro de
      console.
- [x] **B3 — Motor de Fúria:** `core/recursosClasse.ts` ganhou
      `quantidadeFuria`/`bonusDanoFuria` (+ testes). `core/ataque.ts`
      ganhou o parâmetro `bonusDanoSeForca` nas 4 funções de ataque
      (`ataqueDesarmado`, `ataqueComArma`, `ataqueAtual`,
      `ataqueBonusMaoSecundaria`) — soma sozinho quando o ataque usa
      Força de verdade (nunca à distância; em Acuidade só quando Força
      ≥ Destreza; nunca com `atribForcada`, ex. Pacto da Lâmina) — SDD
      seção 5 atualizada pra registrar essa escolha de implementação
      (não precisou expor `atributoUsado` em `AtaqueResolvido`). Novos
      campos `furiaGasto`/`furiaAtiva` em `PersonagemSalvo`.
      `FichaShell.tsx`: `usarFuria()` (toggle igual à Forma Grande, mas
      com banco contado + trava de Armadura Pesada pra ATIVAR),
      `equiparItem` encerra a Fúria sozinha ao equipar Armadura Pesada
      enquanto ativa, `descansoCurto` devolve 1 uso (sem desligar),
      `descansoLongo` zera gasto e desliga. `CombatTab`/
      `BonusPanelContent`: linha de ativar no painel de Ação Bônus
      (só ativa — desligar é sempre pelo card fixo) + card fixo sempre
      visível na tela principal do Combate (decisão já confirmada),
      mostrando "Fúria: ATIVA" + efeitos + botão "Encerrar Fúria"
      quando ativa, ou "N de M usos disponíveis" quando não.
      Verificado com `tsc -b --force`/`npm test -- --run`
      (529)/`npm run build` limpos + Playwright num Bárbaro nível 5 de
      teste (Modo de Teste ligado pra dado determinístico): card
      correto antes/depois de ativar, painel de Bônus mostra "já
      ativa" quando tenta reabrir, dano da Fúria somado de verdade
      (personagem com FOR −1 rolou "1d1 + 1" com Fúria ativa = −1 + 2,
      bate com `bonusDanoFuria` no nível 5), equipar Cota de Malha
      (Armadura Pesada) encerrou a Fúria sozinha sem devolver o uso,
      Descanso Curto devolveu 1 uso sem desligar a Fúria já ativa,
      Descanso Longo zerou usos gastos e desligou. Zero erro de
      console.
- [x] **B3.1 — Ajustes de UI no card de Fúria (feedback do Osmar
      testando no celular):** texto dos efeitos quebrado em 3 linhas
      (Resistência / Dano da Fúria / Vantagem, em vez de 1 parágrafo
      só); botão "Encerrar Fúria" perdeu o `padding`/`fontSize`
      reduzidos que deixavam ele "maior que o texto" (volta ao `.btn`
      padrão) e ganhou destaque vermelho suave (fundo/borda). Charme
      novo pedido pelo Osmar: enquanto a Fúria está ativa, uma vinheta
      vermelha pulsa nas bordas da tela (degradê transparente no
      centro → vermelho nos últimos pixels) com 16 partículas fixas
      emanando de fora pra dentro pelas 4 bordas — tudo
      `position: fixed`/`pointer-events: none`/`z-index: -1` (mesmo
      raciocínio do `.piscadaOverlay` já existente, só que atrás de
      tudo em vez de na frente), então nunca atrapalha toque em botão.
      Verificado com `tsc -b --force`/`npm test -- --run`
      (529)/`npm run build` limpos + Playwright: vinheta some ao
      encerrar a Fúria, botão continua clicável através da camada
      decorativa.
- [x] **B4.0 — Fundação: Salvaguardas de verdade (pré-requisito pro
      resto do B4).** Achado no caminho ao planejar B4: o app nunca
      distinguia "teste de atributo" de "salvaguarda" — o box FOR/DES/
      CON/INT/SAB/CAR sempre rolava só o mod., sem nunca somar o Bônus
      de Proficiência mesmo pra classe proficiente naquela salvaguarda
      (ex.: Bárbaro é proficiente em FOR/CON, mas isso nunca entrava
      em nenhum cálculo). Decisão do Osmar: criar a distinção de
      verdade agora, não deixar textual/adiado — importa pra Sentido
      de Perigo, Força Indomável e a própria Vantagem de Força da
      Fúria (nível 1, hoje só textual no card). Implementado:
      `core/calculoPersonagem.ts` ganhou `calcularSalvaguardas`
      (+ tipo `SalvaguardaFinal`, + 3 testes) — soma o Bônus de
      Proficiência só quando a **classeOriginal** (nunca classe extra
      de multiclasse) tem aquela salvaguarda; confirmado nos PDFs
      (Cap. 2 "Multiclasse" + a seção "Como um Personagem Multiclasse"
      de cada classe no Cap. 3) que salvaguarda NUNCA vem de
      multiclasse, só da 1ª classe. `AtributosTab.tsx` ganhou 6 linhas
      novas ("Salvaguarda de Força/Destreza/.../Carisma") no topo da
      lista de Perícias, mesmo padrão de linha/rolagem/popup "ⓘ" já
      usado por Perícias. Os 6 boxes de atributo (FOR/DES/.../CAR) no
      topo continuam iguais — só teste de atributo, sem proficiência.
      Verificado com `tsc -b --force`/`npm test -- --run`
      (532)/`npm run build` limpos + Playwright num Bárbaro nível 5
      (FOR 14/CON 17, prof +3): Salvaguarda de Força mostrou 🔵 +5
      (mod +2 + prof +3), Constituição 🔵 +6, as outras 4 ⚫ sem
      bônus, popup "ⓘ" com a conta explicada linha a linha.
- [ ] **B4 — Resto da progressão base (sem subclasse):** Ataque
      Imprudente, Sentido de Perigo, Conhecimento Primordial
      (perícia extra + Força no lugar de outro atributo em Fúria),
      Ataque Extra, Movimento Rápido, Bote Instintivo, Instintos
      Primitivos (Vantagem em Iniciativa), Golpe Brutal (nível 9,
      efeitos Debilitador/Poderoso) + Fortalecido (nível 13/17,
      Atordoante/Destruidor, dano 1d10→2d10), Fúria Implacável (nível
      11), Fúria Persistente (nível 15 — vira só "recupera Fúrias na
      Iniciativa", já que a duração de 10 min já é o padrão desde o
      B3), Força Indomável (nível 18), Campeão Primitivo (nível 20,
      FOR/CON +4 até 25), ASI (4/8/12/16).
- [ ] **B5 — Trilha do Berserker** (nível 3/6/10/14): Frenesi, Fúria
      Irracional, Retaliação, Presença Intimidante.
- [ ] **B6 — Trilha do Coração Selvagem:** Arauto da Fauna, Fúria dos
      Selvagens (escolha a cada ativação), Aspecto dos Selvagens
      (escolha entre Descansos), Arauto da Natureza, Poder dos
      Selvagens (escolha a cada ativação).
- [ ] **B7 — Trilha da Árvore do Mundo:** Vitalidade da Árvore, Ramos
      da Árvore (Reação), Raízes Devastadoras, Percorrer a Árvore.
- [ ] **B8 — Trilha do Fanático:** Campeão dos Deuses (reserva de
      dados), Fúria Divina, Concentração Fanática, Presença Zelosa,
      Fúria dos Deuses (nível 14, forma temporária).

Cada entrega: checklist (`tsc -b`, `npm test -- --run`, `npm run
build`) + teste real na tela antes de publicar (personagem de teste
criado como Bárbaro, clicando o que for novo). B5-B8 pode reordenar a
ordem das Trilhas na hora se uma se mostrar mais simples/pronta que a
outra ao chegar lá.
