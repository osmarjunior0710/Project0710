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
- [x] **Grupo C — auditoria + proficiências (Artifista/Músico)**:
      dos 6 Talentos de Origem sem `efeitoMecanico` (Artifista,
      Atacante Selvagem, Curandeiro, Músico, Sortudo, Valentão de
      Taverna), auditados 1 a 1 — resultado completo no Backlog.md
      (novo tópico "Talentos de Origem — pedaços implementáveis").
      Implementado agora: novo `Talento.concedeFerramentaGrupo`
      (reaproveita o formato `ferramentasEscolha` já usado por
      proficiência de CLASSE) — Artifista ganha 3 Ferramentas de
      Artesão, Músico ganha 3 Instrumentos Musicais, ambos com tela
      própria em `TalentoOrigemEscolhasStep` e "já possui" cruzando com
      a ferramenta fixa/escolhida da Origem. `ferramentasProficientes`
      (calculoPersonagem.ts) já lia `proficienciasTalentoOrigemEscolhidas`
      genericamente (do Habilidoso) — nenhuma mudança extra precisou.
      Resto de Artifista (desconto de loja, fabricar item por Descanso
      Longo) e de Músico (dar Inspiração Heroica a ALIADOS) travados
      estruturalmente (sem sistema de economia/downtime nem de grupo/
      outros personagens) — movidos pro `Backlog.md`. Verificado:
      `tsc -b`/`npm test` (212)/`npm run build` limpos + Playwright
      (Artesão → 3 ferramentas escolhidas → Ficha, aba Atributos, mostra
      as 4 ferramentas certas com mod./bônus).
- [ ] **Grupo D** — Ataque Desarmado do Valentão de Taverna vira
      1d4+Força (em vez do padrão 1+Força) — plugar em `core/ataque.ts`
      (`ataqueDesarmado`), que já modela isso de verdade. Reroll de 1 no
      dano e empurrar 1,5m ficam de fora (ver Backlog.md).
- [ ] **Grupo E** — Pontos de Sorte do Sortudo (pool = Bônus de
      Proficiência, recarrega em Descanso Longo; gasta 1 pra dar
      Vantagem numa rolagem sua, ou Desvantagem num ataque contra você,
      ou — nível 5+ — vira crítico contra você em acerto normal).
      Maior que os outros — precisa integrar com o RollContext de
      verdade, não só um contador.
- [ ] **Última coisa do foco** — espécie Humana (traço Versátil) deixa
      escolher QUALQUER talento de Origem, inclusive Habilidoso e
      Iniciado em Magia, mas a tela de escolha extra desses 2 (perícia/
      ferramenta ou truque/magia) só aparece hoje quando o talento vem
      de uma Origem, não pelo Versátil. Só fazer depois que todas as
      telas de Origem (Grupos A-G) estiverem prontas.

Próximo passo: perguntar ao Osmar qual entre Grupo D (Valentão) e
Grupo E (Sortudo) seguir primeiro.
