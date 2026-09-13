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
- [ ] **B3 — Motor de Fúria:** ativar (Ação Bônus, gasta 1 uso, banco
      cresce por nível), card fixo em Combat, Resistência a
      Contundente/Cortante/Perfurante, Dano da Fúria somado
      automaticamente (expõe `atributoUsado` em `AtaqueResolvido`/
      `AtaqueInfo`, ver SDD seção 5), Vantagem em teste/salvaguarda de
      Força, encerrar manual + automático ao vestir Armadura Pesada,
      Descanso Curto recupera 1 uso / Longo recupera todos.
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
