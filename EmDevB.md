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
- [ ] **Chapéu 3 (Product/UI Design) — onde o protótipo mora e como
      é.** Em andamento: proposta de rota (`/prototipo`), ponto de
      entrada (Lista de Personagens, discreto) e estrutura de "cenas"
      soltas — aguardando aprovação do Osmar antes de codar.
- [ ] **Entrega A — Ambiente de Protótipo** (infraestrutura mínima).
- [ ] **Entrega B — Prototipar os 4 formatos de rolagem** em baixa
      fidelidade, decidindo ao vivo.
- [ ] **Entrega C — Formaliza o padrão** (DECISOES-COMBATE.md).
- [ ] **Entrega D — Aplica no Golpe Brutal**, fecha a pendência.
