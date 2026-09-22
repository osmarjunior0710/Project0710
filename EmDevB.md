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

## Foco: Bárbaro — Trilha da Árvore do Mundo (1ª Trilha, ordem: Árvore
do Mundo → Berserker → Coração Selvagem → Fanático, decisão do Osmar)

Planilha conferida + cruzada com o Livro do Jogador (Cap. 3) — nenhuma
divergência, só a célula de "Raízes Devastadoras" com o bug de sempre
(legenda de margem colada no meio do parágrafo), corrigida na
importação. Emblemas das 4 Trilhas já salvos em
`assets/icones-classes/` (`{id}-banner.webp`).

Decisões já aprovadas pelo Osmar:
- **Força Revigorante** (rola PV Temp pra outra criatura, 1x no início
  do turno): botão sempre disponível enquanto a Fúria está ativa, sem
  trava de turno de verdade — confia no jogador.
- **Percorrer a Árvore**: card informativo de Ação Bônus + 1 toggle
  real pro "usei a versão estendida (45m) nesta Fúria" (reseta quando
  a Fúria reativa, mesmo padrão de Fúria Persistente).

Checklist:
- [x] **Entrega 1** — Dado no banco: as 4 características em
      `caracteristicasSubclasse.ts` (Vitalidade da Árvore/Ramos da
      Árvore/Raízes Devastadoras/Percorrer a Árvore), com o texto de
      Raízes Devastadoras corrigido e `tipoAcao` de Ramos da Árvore
      ajustado pra "Reação" (planilha marcou errado, mesmo tipo de
      ajuste já feito em Palavras de Interrupção do Bardo). Confirmado
      via Playwright: a Trilha já aparece selecionável (Personagem de
      Teste e o wizard normal, via `subclasseImplementada`), o
      cabeçalho mostra "(Trilha da Árvore do Mundo)" e as 4
      características aparecem certinho no Perfil, seção "SUBCLASSE —
      TRILHA DA ÁRVORE DO MUNDO". 1 teste antigo corrigido
      (`geradorPersonagemTeste.test.ts` assumia "Bárbaro nunca sorteia
      subclasse" — agora sorteia a única implementada).
- [x] **Entrega 2** — Vitalidade da Árvore mecânica: Surto de
      Vitalidade automático (PV Temp = nível na classe, ao ativar
      Fúria, via `ganharPvTemporario`) + botão de Força Revigorante
      (rola Xd6, X = bônus de Dano da Fúria, mostra o total pro
      jogador aplicar em outra criatura). Confirmado via Playwright:
      ativar Fúria (nível 5) já soma +5 PV Temp sozinho (pill "+5
      TEMP" no PV), e o botão "🌳 Força Revigorante" aparece dentro
      do card de Fúria e rola 2d6 (bônus de Dano da Fúria no nível 5)
      corretamente.
- [ ] **Entrega 3** — Ramos da Árvore: card de Reação (só com Fúria
      ativa + nível 6+) que abre `SalvaguardaDoAlvoModal` (Força, CD
      8+FOR+Prof, sem dano — sucesso "nada acontece", falha
      "teleporta perto de você, Deslocamento 0 até o fim do turno").
- [ ] **Entrega 4** — Percorrer a Árvore: card informativo de Ação
      Bônus (nível 14+, Fúria ativa) + toggle "usei a versão
      estendida nesta Fúria" (reseta ao reativar Fúria).
- [ ] **Entrega 5** — Fechamento: `npm test`/`tsc`/`build`,
      `aprendizados/classes/barbaro.md` atualizado com esta Trilha,
      `PENDENCIAS.md` "Bárbaro — Trilhas" perde a Árvore do Mundo da
      lista (as outras 3 continuam).

(Raízes Devastadoras não precisa de entrega própria — é só texto,
já cobre com a Entrega 1.)
