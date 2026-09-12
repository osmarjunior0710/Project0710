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
> Fica vazio entre focos. Quando um foco fecha (seção 6.3), o conteúdo
> é apagado — não acumula plano antigo.

---

## Foco: Saúde do projeto — dívida técnica antes das próximas classes

Nascido do levantamento geral (chapéu de Product Manager, seção 6.1)
feito a pedido do Osmar antes de abrir a próxima classe. Osmar aprovou
resolver tudo que foi identificado como "vai crescer e virar mega
problema" — este foco cobre isso.

**Nota de processo:** foco 100% de refatoração/higiene interna — sem
regra de D&D nova, sem tela nova pro jogador. Os chapéus 2 (Game
Designer/SDD) e 3 (Product/UI Design) não têm o que fazer aqui (nada
de mecânica nova pra especificar, nada de UI nova pra encaixar) — vai
direto pro chapéu 4 (execução, só o lado Engenheiro), com o cuidado
extra de garantir ZERO mudança de comportamento visível (checklist +
Playwright smoke test em cada entrega, já que não tem "coisa nova" na
tela pra clicar e validar).

Ordem (do mais barato/seguro pro mais estrutural):

### G1 — Higiene rápida e barata

- [x] **G1.1** — Corrigir entrada desatualizada do ASI em
      `PENDENCIAS.md` (já resolvido no código — `DistribuirPontosAtributo`
      + `atributosAumentados` → `aumentarAtributos` em `FichaShell.tsx`
      — só a entrada não foi removida).
- [x] **G1.2** — Estilos de Luta duplicados em `talentos.ts`/
      `estilosDeLuta.ts`. Confirmado (grep em todos os consumidores de
      `talentos`) que categoria "Estilo de Luta" nunca é lida — a única
      tela que filtra por categoria (`TelaEscolherTalento`) usa default
      "Geral", nenhuma chamada passa "Estilo de Luta". Removidos os 10
      objetos duplicados de `talentos.ts` (100% código morto), com
      comentário apontando pra `estilosDeLuta.ts` como fonte real.
      `tsc -b`/`npm test` (427)/`npm run build` limpos.
- [x] **G1.3** — Testes Vitest pros 6 arquivos `core/` que calculam
      regra sem teste: `recursosClasse.ts`, `loja.ts`,
      `maestriaArma.ts`, `sintonizacao.ts`, `inspiracaoBardo.ts`,
      `equipamento.ts` — 64 testes novos, real fixture (dado importado
      da planilha, nunca mock inventado), pelo menos 1 caso normal + 1+
      de borda cada. `tsc -b`/`npm test` (491)/`npm run build` limpos.
      **G1 fechado.**

### G2 — Compactação dos 4 `DECISOES-*.md` acima do limite

`DECISOES-DESIGN.md` (1486 linhas), `DECISOES-CLASSES.md` (1160),
`DECISOES-COMBATE.md` (906), `DECISOES-DADOS.md` (808) — todos acima
do teto de 600-800 linhas/15-20 entradas (seção 7.1). Reescrever
cortando narrativa de entrega/teste, mantendo só o padrão
generalizado — mesmo processo já usado na compactação de 2026-09.

- [ ] **G2.1** — `DECISOES-DESIGN.md`
- [ ] **G2.2** — `DECISOES-CLASSES.md`
- [ ] **G2.3** — `DECISOES-COMBATE.md`
- [ ] **G2.4** — `DECISOES-DADOS.md`

### G3 — Extrair hooks de `FichaShell.tsx` (1956 linhas, a peça maior)

Cada característica de subclasse/espécie/recurso nova vira hoje uma
tripla manual copiada (useState + constante `xxxDisponivel` + prop pro
Combat) — sem abstração de "quais características este personagem tem
ativas". Faltam ainda 10 classes + ~35 subclasses; resolver agora
custa bem menos que resolver depois de mais classes empilhadas.

- [ ] **G3.1** — `useAutosavePersonagem`: isolar o `useEffect` de
      autosave (~130 linhas, ~50 dependências) do `FichaShell.tsx`.
- [ ] **G3.2** — `useRecursosDeClasse`: hook genérico
      `{disponivel, maximo, restantes, usar}` parametrizado por id de
      recurso, substituindo as ~15 cópias quase idênticas de
      useState+disponível+máximo+restantes+usar.
- [ ] **G3.3** — `useMagiasPersonagem`: os ~40 `const magias*`/
      `truques*` espalhados pelo componente.
- [ ] **G3.4** — Mecanismo genérico de "características de subclasse
      ativas" — substitui as 11 constantes manuais tipo
      `caracteristicaSubclasseDesbloqueada`/`legiaoDosMortosDisponivel`.

### G4 — Avaliar depois de G3 (pode reaproveitar os hooks novos)

- [ ] **G4.1** — `LevelUpShell.tsx` (1910 linhas, ~20 `useState` por
      escolha de level-up).
- [ ] **G4.2** — `CombatTab.tsx` (~100 props individuais, 1 quadra
      `xDisponivel`/`xMaximo`/`xRestantes`/`onUsarX` por recurso).

**Regra de execução:** cada sub-item acima é sua própria entrega
pequena — checklist completo (`tsc -b`, `npm test -- --run`,
`npm run build`) + confirmação de que nada de comportamento mudou
(nenhuma tela nova pra clicar, então a validação é "app continua
idêntico", não uma feature nova). G3/G4 quebram mais ainda na hora se
precisar.
