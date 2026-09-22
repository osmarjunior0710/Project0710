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

## Foco: Bárbaro — Trilha do Berserker (2ª Trilha)

SDD completo em `sdd/sdd-barbaro-berserker.md` (planilha + Livro do
Jogador cruzados, sem divergência — só os 2 bugs de extração de
sempre: legenda de margem em Presença Intimidante, `tipoAcao` errado
em Retaliação). Leituras já confirmadas com o Osmar (não precisa
reconfirmar): Fúria Irracional vira só texto (app não rastreia
condições); Presença Intimidante não repete a salvaguarda por
criatura (app não segue NPC turno a turno).

Checklist:
- [ ] **Entrega 1** — Dado no banco: as 4 características em
      `caracteristicasSubclasse.ts` (Frenesi/Fúria Irracional/
      Retaliação/Presença Intimidante), com a legenda de margem
      cortada de Presença Intimidante e `tipoAcao` de Retaliação
      ajustado pra "Reação".
- [ ] **Entrega 2** — Frenesi: dano extra automático (Xd6, X = bônus
      de Dano da Fúria) no 1º acerto do turno com Ataque Imprudente +
      Fúria ativos.
- [ ] **Entrega 3** — Retaliação: card de Reação (nível 10+, sem
      checar Fúria) com ataque de verdade (arma equipada/Desarmado),
      reaproveitando o motor de ataque já usado em "🗡 Atacar".
- [ ] **Entrega 4** — Presença Intimidante: card de Ação Bônus (nível
      14+) com CD 8+FOR+Prof, salvaguarda de Sabedoria, Falha/Sucesso;
      1x por Descanso Longo + recarga gastando 1 uso de Fúria.
- [ ] **Entrega 5** — Fechamento: `npm test`/`tsc`/`build`,
      `aprendizados/classes/barbaro.md` atualizado com esta Trilha,
      `PENDENCIAS.md` "Bárbaro — Trilhas" perde o Berserker da lista
      (Coração Selvagem/Fanático continuam on hold).

(Fúria Irracional não precisa de entrega própria — é só texto, já
cobre com a Entrega 1.)
