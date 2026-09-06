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

## Foco: Origens (Cap. 4 do livro)

Auditoria completa das 16 Origens + re-confirmação das 10 Espécies
contra o PDF `Cap_4_Origens_dos_Personagens`. Dado das 16 Origens já
está correto e completo em `origens.ts` (atributos, talento de origem,
perícias, ferramenta, equipamento opção A/B todos batem com o livro) —
não é um problema de importação como foi com Espécies. Os gaps são de
**mecânica não implementada** (talento sem efeito no cálculo) e de
**nome de item não batendo com o catálogo** (peso sub-contado).

- [x] **Grupo H** — corrigir nomes de item em `origens.ts` que não
      batiam com `equipamentoAventura.ts` (causava "sem peso
      cadastrado" na Mochila): Balde de Ferro→Balde, Fantasia→Roupas,
      Fantasia, Roupas Finas→Roupas, Finas, Roupas de Viagem→Roupas,
      Viagem, 3× Livro (tema)→Livro genérico (tema preservado em
      comentário). Verificado: `tsc -b`, `npm test`, `npm run build`
      passando; exibição em tela consistente com o nome já usado pela
      Loja pro mesmo item.
- [ ] **Grupo A** — "Iniciado em Magia" (talento repetível, Origem):
      criar UI de escolha (lista Clérigo/Druida/Mago → 2 truques + 1
      magia de 1º círculo + atributo de conjuração) análoga ao padrão
      já usado em `core/magiasEspecie.ts`. Desbloqueia as 3 Origens
      hoje com `disponivel: false`: Acólito, Guia, Sábio.
- [ ] **Grupo B** — talento Vigoroso (Origem Fazendeiro) sem
      `efeitoMecanico`: PV máximo devia ganhar +2×nível no momento em
      que o talento é adquirido, +2 PV extra a cada nível seguinte.
      Mais complexo que Tenacidade Anã/Porte Poderoso porque precisa
      guardar "nível em que foi adquirido" pra fórmula não recalcular
      errado depois. Precisa desenho antes de codar.
- [ ] **Grupo C** — demais talentos de Origem sem `efeitoMecanico`
      ainda (9 origin-slots / 7 talentos distintos, além de Vigoroso) —
      auditar cada um e decidir se entra em `EfeitoMecanicoTalento` ou
      se é caso "sem número calculado hoje" (ex: precisa do motor de
      dano/reroll que ainda não existe — ver nota de Curandeiro/
      Atacante Selvagem abaixo).
- [ ] **Grupo D-G** — pendente de detalhar (mecanismo de reroll de
      "dados" não-d20 pra Curandeiro/Atacante Selvagem — ver
      `Backlog.md` sobre Inspiração Heroica só cobrir d20 hoje —, e
      outros achados menores do restante da auditoria de talentos de
      Origem).

Próximo passo: validar Grupo H com o Osmar, depois perguntar qual
grupo seguir (provável prioridade: Grupo A, desbloqueia 3 Origens
inteiras).
