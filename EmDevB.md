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

## Foco atual: Mago — características base quebradas (auditoria)

SDD em `sdd/sdd-mago-caracteristicas-base.md`. Aberto no meio do foco
Evocador (pausado — ver seção abaixo, PAUSADO não fechado) depois de
uma auditoria completa da classe base a pedido do Osmar.

- [ ] Entrega 1 — Acadêmico (nv.2, o bug reportado): passo de Level Up
      + escolha entra em `periciasBonusExtras` e `periciasEspecialista`.
- [ ] Entrega 2 — Recuperação Arcana (nv.1): pergunta condicional no
      Descanso Curto + tela de escolha de círculos com orçamento.
- [ ] Entrega 3 — Adepto de Ritual (nv.1): seção nova na aba Magias,
      conjuração livre de magia Ritual do Livro não preparada.
- [ ] Entrega 4 — Maestria de Magias (nv.18): passo de Level Up +
      conjuração grátis no círculo mais baixo.
- [ ] Entrega 5 — Assinatura Mágica (nv.20): passo de Level Up +
      conjuração grátis 1x por descanso (2 flags).
- [ ] Entrega 6 — Fechamento: testes/tsc/build,
      `aprendizados/classes/mago.md` (criar), `PENDENCIAS.md` ganha a
      troca de Maestria/Assinatura no Descanso Longo (baixa
      prioridade). Depois disso, retomar o foco do Evocador abaixo.

---

## Foco PAUSADO: Mago — Evocador (subclasse)

SDD em `sdd/sdd-mago-evocador.md` (chapéus 1/2/3 aprovados). Retomar
da Entrega 2 assim que o foco acima (características base) fechar.

- [x] Entrega 1 — Dado no banco: 5 características em
      `caracteristicasSubclasse.ts`, legenda de margem cortada em
      Sobrecarga. Evocador selecionável + aparece no Perfil.
- [ ] Entrega 2 — Versado em Evocação (nível 3): `core/evocador.ts` +
      wiring em `LevelUpShell.tsx`.
- [ ] Entrega 3 — Truque Potente (nível 3): metade de dano no erro
      (ataque) e no sucesso da salvaguarda (truque).
- [ ] Entrega 4 — Evocação Potencializada (nível 10): mod. de
      Inteligência somado ao dano de magia de Evocação de Mago.
- [ ] Entrega 5 — Sobrecarga (nível 14): dano máximo opcional +
      contador de usos desde o Descanso Longo + dano Necrótico
      auto-infligido escalando.
- [ ] Entrega 6 — Fechamento: testes/tsc/build,
      `aprendizados/classes/mago.md` atualizado, `PENDENCIAS.md`
      "Escolha de subclasse — versão placeholder" perde o Evocador.
