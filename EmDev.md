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
- [x] **Entrega 2 — habilitar Monge na criação (wizard).** `disponivel:
      true` em `classes.ts`. Nova `core/monge.ts` (`ehArmaDeMonge` —
      Armas Simples Corpo a Corpo OU Marciais Corpo a Corpo com
      propriedade Leve, distinto da proficiência ampla do Monge, que
      cobre toda arma Simples inclusive à distância), testado (4
      casos). `core/ataque.ts` generalizado: `ataqueDesarmado` e
      `ataqueComArma` agora usam o Dado de Artes Marciais no lugar do
      dado normal (nunca somam — pega o maior) e permitem rolar com
      Destreza em vez de Força quando ela for maior (mesmo padrão já
      usado por Acuidade). Banner de classes prontas do wizard
      (`ClasseStep.tsx`) corrigido de quebra — estava sem Paladino e
      sem Monge. Testado ao vivo via Playwright em 390px: personagem
      Monge criado do zero pelo wizard (perícias, ferramenta — o
      picker juntou Ferramentas de Artesão + Instrumento Musical num
      só grupo, como esperado —, atributos, idiomas), CA calculada
      certo (14 = 10+DES+SAB) tanto no resumo do wizard quanto na
      Ficha salva, Ataque Desarmado no Combate rolando `1d20+4` (mod.
      Destreza +2 + Bônus de Proficiência +2 — confirmado na própria
      tela de detalhe do app). `npx tsc -b`, `npm test -- --run`
      (872/872), `npm run build` verdes.
- [x] **Entrega 3 — Pontos de Foco + as 3 técnicas base** (Defesa
      Paciente/Passo do Vento/Torrente de Golpes) — cada uma com
      escolha "de graça" vs "gastar 1 Foco", painel de Ação Bônus.
      Pontos de Foco exibido como pips (pedido do Osmar: 20 pips em 2
      linhas de 10 — `TickPips.tsx` ganhou prop `quebrarACada`,
      `RecursoVisivel` ganhou `exibicao: 'pips-bloco'`). Resets de
      Descanso Curto E Longo (`pontosDeFocoGasto`, grupo "Monge" em
      ordem alfabética). Torrente de Golpes reaproveita `ataqueDesarmado`
      forçado (nunca a arma equipada) + o mesmo padrão de contador
      "(ataque X/Y)" do Ataque Extra. Achado corrigido de quebra:
      `pontosDeFocoMaximo`/`ataqueTorrente` em `FichaShell.tsx` tinham
      que olhar a entrada de Monge em `classesAtual` DIRETO (não
      `classe`/`personagem.nivel`, que seguem a classe conjuradora
      "ativa") — senão a técnica inteira sumia numa multiclasse onde o
      Monge não é a classe conjuradora em foco. Achado corrigido de
      quebra #2: `abrirPainel` (`CombatTab.tsx`) bloqueava reabrir o
      card de Ação/Ação Bônus assim que `onMarcarUsado` marcava a
      categoria "usada" no 1º ataque de uma sequência — quebrava o 2º+
      ataque do Ataque Extra (bug pré-existente, não só do Monge) E o
      Torrente de Golpes inteiro; corrigido com uma exceção que
      reconhece ataque pendente de qualquer um dos dois. `Char
      Multiclasse` (`personagemTesteMulticlasse.ts`) ganhou o Monge na
      lista (estava esquecido desde a Entrega 1/2). Testado ao vivo via
      Playwright em 390px: Pontos de Foco 20/20 em 2 linhas de 10
      confirmadas visualmente; Torrente de Golpes com Foco liberando 2
      Ataques Desarmados de verdade (reabrindo o painel pro 2º ataque,
      contador "ataque 1/2" → "2/2"), Foco descontando certo (20→19).
      `npx tsc -b`, `npm test -- --run` (876/876), `npm run build`
      verdes.
- [x] **Entrega 3b — Metabolismo Incomum** (nível 2). Texto real
      conferido na planilha ("Características de Classe") — tem 2
      efeitos juntos, não só recuperar Foco: restaura todos os Pontos
      de Foco gastos E cura PV (dado de Artes Marciais + nível de
      Monge). Pergunta Sim/Não ao rolar Iniciativa (mesmo padrão visual
      de "Perícia Inigualável"), só aparece se Monge nível 2+ e ainda
      não usado desde o último Descanso Longo — não exige ter Foco
      gasto (a cura sozinha já vale a pergunta). "Não" não gasta o
      uso — pode perguntar de novo na próxima Iniciativa antes do
      próximo Descanso Longo. `metabolismoIncomumUsado` persistido,
      resetado só no Descanso Longo (não no Curto). Mesma correção de
      multiclasse das entregas anteriores: olha a entrada de Monge em
      `classesAtual` direto, não a classe "ativa". Testado ao vivo via
      Playwright: pergunta aparece com o texto/fórmula certos (1d12 +
      nível 20), "Sim" restaura Pontos de Foco pra 20/20 e dispara a
      rolagem de cura "Metabolismo Incomum (cura) — 1d12 + 20". `npx
      tsc -b`, `npm test -- --run` (876/876), `npm run build` verdes.
- [x] **Entrega 3c — UX das 3 técnicas revista** (achado durante
      review do Osmar, 2026-10): Defesa Paciente/Passo do Vento/
      Torrente de Golpes viravam uma sub-tela DENTRO do painel de Ação
      Bônus — Osmar queria um popup central (mesmo padrão de
      `MaosConsagradasModal.tsx`), e a Torrente especificamente tinha
      vaivém ruim (escolher → fechava → reabrir pra atacar → fechava →
      reabrir de novo pro 2º ataque). Criado `TecnicaMongeModal.tsx`
      (popup reaproveitando `TrocarArmaMaestria.module.css`, z-index
      120 — acima do painel de Ação Bônus, 110/111, que fecha ao abrir
      o popup). Escolher a Torrente já dispara o Ataque 1 na hora; o
      2º ataque (se gastou Foco) vira um card fixo no corpo do
      Combate, fora de qualquer painel — `abrirPainel` (`CombatTab.tsx`)
      voltou a só ter a exceção do Ataque Extra (a exceção da Torrente
      não é mais necessária, o botão dela não mora mais lá dentro).
      Testado ao vivo via Playwright: popup aparece centralizado,
      "Gastar 1 Foco" dispara o Ataque 1 sozinho (Foco 20→19, popup de
      rolagem "1d20+13" abre na hora), card "ataque 2/2" aparece na
      tela principal sem abrir painel nenhum. `npx tsc -b`, `npm test
      -- --run` (876/876), `npm run build` verdes.
- [ ] **Entrega 4 — Defletir Ataques + Queda Lenta + Golpe
      Atordoante.** Defletir Ataques é um padrão NOVO (reduzir dano
      recebido reativamente, nunca existiu no app — ver SDD seção 7).
- [ ] **Entrega 5 — resto dos níveis 6-20** (Evasão, Movimento
      Acrobático, Foco Aprimorado, Restauro Pessoal, Defletir Energia,
      Sobrevivente Disciplinado, Foco Perfeito, Defesa Superior,
      Dádiva Épica, Corpo e Mente). Foco Perfeito (nível 15) reaproveita
      o mesmo gatilho de Rolar Iniciativa da Entrega 3b.
- [ ] **Entrega 6 — personagem de teste + revisão final**, sem
      subclasse ainda (subclasses viram foco(s) separado(s) depois).

Subclasses (Mão Espalmada, Misericórdia, Sombras, Elementos) ficam
pra focos futuros, como já foi feito com Bárbaro/Paladino/Guerreiro.
