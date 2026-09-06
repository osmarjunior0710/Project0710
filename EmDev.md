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
- [x] **Grupo A** — "Iniciado em Magia" (Acólito/Guia/Sábio): nova UI
      em `TalentoOrigemEscolhasStep` (`Talento.concedeMagiaIniciada`) —
      2 truques + 1 magia de 1º círculo da lista fixada em
      `Origem.talentoOrigemVariante` + atributo de conjuração livre
      (Int/Sab/Car). `core/magiaTalentoOrigem.ts` novo, ligado em
      `core/conjuracao.ts` (fonte de conjuração) e `MagiasTab.tsx`
      (seção "Magias do Talento de Origem", mesmo tratamento de
      "Magias da Espécie"). As 3 origens viraram `disponivel: true`.
      Verificado: `tsc -b`/`npm test`/`npm run build` limpos +
      Playwright ponta a ponta (Sábio → escolhas → Ficha mostra as
      magias certas na aba Magias e "Livro" com peso certo na Mochila).
- [x] **Grupo B** — talento Vigoroso (Origem Fazendeiro): novo
      `EfeitoMecanicoTalento` (`bonus-pv-por-nivel`). Como esse talento
      só é alcançável via Talento de Origem (sempre ganho no nível 1 da
      criação, nunca escolhido depois via ASI), "+2×nível ao pegar,
      +2/nível seguinte" colapsa num +2 fixo por nível — mesmo padrão
      de `bonusPvPorNivelDaEspecie` (Tenacidade Anã), não precisou
      guardar "nível de aquisição" como imaginado antes de investigar.
      `bonusPvPorNivelDoTalento` novo em `calculoPersonagem.ts`, somado
      em `calcularPvMaximoNivel1`/`explicarPvMaximo*` (wizard e Ficha) e
      no PV de Level Up (`FichaShell`, `geradorPersonagemTeste.ts` —
      `LevelUpShell`/`levelUpAleatorio.ts` só consomem o número já
      combinado). Label do popup/drama generalizado (antes hardcoded
      "Tenacidade Anã", agora `bonusPvPorNivelLabel` monta o nome certo
      pra cada fonte). 3 testes novos (Vitest). Verificado:
      `tsc -b`/`npm test` (212)/`npm run build` limpos + Playwright
      (Fazendeiro nível 1 → popup mostra "Vigoroso +2" e o total bate).
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
- [ ] **Última coisa do foco** — espécie Humana (traço Versátil) deixa
      escolher QUALQUER talento de Origem, inclusive Habilidoso e
      Iniciado em Magia, mas a tela de escolha extra desses 2 (perícia/
      ferramenta ou truque/magia) só aparece hoje quando o talento vem
      de uma Origem, não pelo Versátil. Só fazer depois que todas as
      telas de Origem (Grupos A-G) estiverem prontas.

Próximo passo: Grupo C (demais talentos de Origem sem `efeitoMecanico`).
