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
> Fica vazio entre focos. Quando um foco fecha (seção 6), o conteúdo
> é apagado — não acumula plano antigo.

---

## Foco: Revisão do fluxo de rolagem Acerto/Erro (fecha a pendência de Golpe Brutal do Bárbaro)

Motivado pela pendência "Bárbaro — Golpe Brutal/Golpe Brutal
Fortalecido: escolha de efeito depois de acertar o ataque" em
`PENDENCIAS.md`. Investigação (levantamento factual) mostrou que o
problema é maior que só Golpe Brutal — ver `sdd/sdd-fluxo-rolagem.md`.

Ideia de processo nova pro projeto, sugerida pelo Osmar: existir um
ambiente de protótipo (baixa fidelidade, fora do fluxo real de
personagem) pra validar decisões de fluxo/UX clicando na tela ANTES
de decidir a versão final — primeiro uso real vai ser aqui.

- [x] **Chapéu 1 (PM) — quebra em entregas.** Aprovado pelo Osmar
      ("Bora"): Entrega A (ambiente de protótipo) → B (prototipar os 4
      formatos de rolagem: Salvaguarda/Teste/Acerto-Erro/Cura) → C
      (formaliza o padrão em DECISOES-COMBATE.md) → D (aplica no Golpe
      Brutal de verdade). Retrofit das outras características com o
      mesmo problema (Ataque normal, magia, Ancestralidade Gigante)
      fica fora desta rodada, vai pro `PENDENCIAS.md`.
- [x] **Chapéu 2 (Game Designer) — SDD.** `sdd/sdd-fluxo-rolagem.md`
      escrito: levanta o estado atual (padrão "atira e esquece", 2
      comportamentos inconsistentes de "escolher efeito"), a taxonomia
      dos 4 formatos, e as perguntas em aberto que o protótipo (Entrega
      B) precisa responder — decisões propositalmente NÃO tomadas no
      documento.
- [x] **Chapéu 3 (Product/UI Design) — onde o protótipo mora e como
      é.** Aprovado pelo Osmar: rota `/prototipo` sem `:id` de
      personagem, ponto de entrada discreto na Lista, estrutura de
      "cenas" soltas com estado 100% local.
- [x] **Entrega A — Ambiente de Protótipo** (infraestrutura mínima).
      Rota `/prototipo` (lista de "cenas") e `/prototipo/:cenaId`
      (`PrototipoShell.tsx`/`PrototipoCenaShell.tsx`), catálogo de
      cenas em `src/ui/prototipo/cenas/index.ts` (adicionar cena nova =
      1 entrada ali). Ponto de entrada discreto no rodapé da Lista de
      Personagens ("🧪 protótipos", `.label`, não um `.btn` grande —
      ferramenta nossa, não do jogador). 1ª cena
      (`ExemploRolagemSimples.tsx`) prova que dá pra reaproveitar
      `RollContext`/`RollOverlay` de verdade fora do fluxo de
      personagem, sem `armazenamentoPersonagens`. Verificado com
      `tsc -b --force`/`npm test -- --run` (596)/`npm run build`
      limpos + Playwright em 390px: link aparece na Lista, abre a
      lista de cenas, abre a cena, "🎲 Rolar" dispara o RollOverlay de
      verdade (mesmo popup/animação do jogo), resultado aparece na
      tela ("Último resultado: 7").
- [ ] **Entrega B — Prototipar os 4 formatos de rolagem** em baixa
      fidelidade, decidindo ao vivo.
  - [x] **Acerto/Erro** — cena `AcertoErroCena.tsx`
        (`/prototipo/acerto-erro`), cenário de mentirinha ("ataca um
        Goblin de 10 PV") com 3 variantes trocáveis no topo, mesmo
        estado reiniciado a cada troca: **A** (réplica do "atira e
        esquece" atual — dano/efeito liberados na mesma chamada, sem
        esperar `onResultado`), **B** (espera o resultado real da
        rolagem via `onResultado`, só libera dano/efeito depois de
        confirmar "Acertou?"), **C** (igual à B, mas o efeito escolhido
        muda o PV/status do Goblin fictício de verdade, em vez de só
        escrever um lembrete). Verificado com `tsc -b --force`/`npm
        test -- --run` (598)/`npm run build` limpos + Playwright em
        390px, as 3 variantes de ponta a ponta. Falta o Osmar decidir
        qual variante vira o padrão real (não decidido ainda).
  - [ ] **Salvaguarda** — SDD já concluiu que não tem o problema
        (resultado é sempre só informativo); decidir se ainda vale
        prototipar ou se pula direto pra Entrega C nesse formato.
  - [ ] **Teste** — mesma situação da Salvaguarda.
  - [ ] **Cura** — questão em aberto específica: seletor de alvo (eu
        mesmo vs. outro personagem/Pet) ainda sem prototipar.
- [ ] **Entrega C — Formaliza o padrão** (DECISOES-COMBATE.md).
- [ ] **Entrega D — Aplica no Golpe Brutal**, fecha a pendência.
