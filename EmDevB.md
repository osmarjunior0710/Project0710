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

## Foco atual: Mago — Evocador (subclasse)

SDD em `sdd/sdd-mago-evocador.md` (chapéus 1/2/3 aprovados). Retomado
da Entrega 2 — foco "Mago — características base" fechou (ver
`aprendizados/classes/mago.md` pro histórico completo).

- [x] Entrega 1 — Dado no banco: 5 características em
      `caracteristicasSubclasse.ts`, legenda de margem cortada em
      Sobrecarga. Evocador selecionável + aparece no Perfil.
- [x] Entrega 2 — Versado em Evocação (nível 3): `core/evocador.ts` +
      wiring em `LevelUpShell.tsx` (mesmo padrão de Perito em
      Necromancia, sem o selo Homebrew — regra oficial). Corrigido de
      quebra: as 5 características do Evocador não tinham
      `statusImplementacao` desde a Entrega 1 — preenchido agora
      (Versado em Evocação = `codeimplementation`; Esculpir Magias =
      `textonly`, confirmado no SDD; as outras 3 =
      `placeholder-codeimplementation`, aguardando suas entregas).
      Validado via Playwright (nível 1→3, escolhendo Evocador): passo
      aparece certo, 2 magias de Evocação entram no Livro de Magias
      além do crescimento normal, 0 selo Homebrew na aba Magias.
- [x] Entrega 3 — Truque Potente (nível 3): metade de dano no erro
      (ataque, via `onErrou` de `useUsarMagiaPainel.tsx` + implementação
      própria em `ReacaoPanelContent.tsx`) e no sucesso da salvaguarda
      (`textoSucessoSalvaguarda` em `CombatTab.tsx`, mesmo padrão de
      "Ataque de Sopro"). Vale pra qualquer truque com dano, não só
      Evocação (`core/evocador.ts` `truqueElegivelTruquePotente`).
      Validado via Playwright (Raio de Fogo errando + Bolha Ácida com
      sucesso na salvaguarda): texto certo nos 2 casos, sem selo
      Homebrew.
      **Bug achado pelo Osmar no dia seguinte:** clicar "Errei" na aba
      Magias só fechava o popup, sem aplicar Truque Potente — a aba
      Magias tem seu PRÓPRIO `processarMagiaAoUsar` (cópia paralela do
      mesmo fluxo de conjuração, com seu próprio `onErrou`/
      `telaSalvaguarda`), que eu esqueci de atualizar (violei a própria
      regra da seção 6.6 do CLAUDE.md, registrada 2 entregas atrás por
      um bug quase idêntico). Corrigido: mesma lógica replicada em
      `MagiasTab.tsx`, incluindo um banner de feedback novo (aba Magias
      não tinha `onEscolher` como o Combate) pro resultado do erro
      aparecer. Validado via Playwright nos 2 casos, na aba Magias.
- [x] Entrega 4 — Evocação Potencializada (nível 10): mod. de
      Inteligência somado ao dano de magia de Evocação de Mago, mesmo
      padrão de Explosão Agonizante (`decidirConjuracao`) no caso
      Ataque; caso Salvaguarda ganhou helper próprio
      (`aplicarEvocacaoPotencializadaAoDano`, `core/evocador.ts`)
      reaproveitado nos 2 lugares que calculam esse dano por fora
      (`CombatTab.tsx` `abrirSalvaguarda` + `MagiasTab.tsx`
      `processarMagiaAoUsar`) — dessa vez conferindo as 2 abas desde o
      início. Auto-aplicado, sem toggle. Validado via Playwright nos 3
      pontos (ataque em Magias, salvaguarda em Magias, ataque em
      Combate): linha "Evocação Potencializada +X" aparece certa na
      quebra do dano.
- [ ] Entrega 5 — Sobrecarga (nível 14): dano máximo opcional +
      contador de usos desde o Descanso Longo + dano Necrótico
      auto-infligido escalando.
- [ ] Entrega 6 — Fechamento: testes/tsc/build,
      `aprendizados/classes/mago.md` atualizado, `PENDENCIAS.md`
      "Escolha de subclasse — versão placeholder" perde o Evocador.
