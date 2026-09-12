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

- [x] **G2.1** — `DECISOES-DESIGN.md`: 1487→608 linhas.
- [x] **G2.2** — `DECISOES-CLASSES.md`: 1160→868 linhas.
- [x] **G2.3** — `DECISOES-COMBATE.md`: 906→353 linhas.
- [x] **G2.4** — `DECISOES-DADOS.md`: 808→415 linhas.

Feito em paralelo (1 agente por arquivo, mesmas regras da seção 7.1),
com checagem manual em cada um confirmando que nenhum padrão técnico,
nome de arquivo/função, ou dívida técnica conhecida foi perdido — só
narrativa de entrega/status. `tsc -b`/`npm test`/`npm run build`
limpos depois de cada publicação. **G2 fechado.**

### G3 — Extrair hooks de `FichaShell.tsx` (1956 linhas, a peça maior)

Cada característica de subclasse/espécie/recurso nova vira hoje uma
tripla manual copiada (useState + constante `xxxDisponivel` + prop pro
Combat) — sem abstração de "quais características este personagem tem
ativas". Faltam ainda 10 classes + ~35 subclasses; resolver agora
custa bem menos que resolver depois de mais classes empilhadas.

- [x] **G3.1** — `useAutosavePersonagem` (`src/ui/ficha/hooks/`):
      isolado o `useEffect` de autosave (objeto salvo + array de
      dependências continuam montados no `FichaShell`, exatamente
      como antes — só o `useEffect` em si mudou de arquivo, pra não
      mudar a cadência de quando o save dispara). Verificado com
      `tsc -b`/`npm test` (495)/`npm run build` limpos + teste de
      ponta a ponta no navegador (mudei PV pela aba Combate, recarreguei
      a página, valor persistiu igual antes).

**Achado ao ler o arquivo inteiro antes de mexer (importante pra quem
retomar isso depois):** o levantamento inicial descreveu G3.2 como "1
hook genérico substituindo as cópias de recurso" — na prática, cada
"recurso" (Conhecimento de Pedras, Ancestralidade Gigante, etc.) tem
sua regra de recuperação PRÓPRIA (alguns só no Descanso Longo, alguns
Curto+Longo, alguns decrementam em vez de zerar) espalhada em 3 lugares
diferentes que precisam concordar: o `useState`, `descansoCurto`/
`descansoLongo` (que zeram/decrementam CADA campo por nome, um por
um), e o autosave (G3.1). Um hook genérico de verdade exigiria unificar
os 3 lugares numa única estrutura de dado (`Record` de recursos em vez
de ~20 campos soltos em `PersonagemSalvo`), o que muda o FORMATO
salvo — precisaria de migração pra personagem já salvo, e é um projeto
bem maior/mais arriscado do que "extrair um hook". Decisão: **não**
fazer essa versão profunda agora (registrada no Backlog.md pra quando
fizer sentido investir nisso) — G3.2 vira a versão mais segura abaixo,
que ainda reduz duplicação real sem tocar no formato salvo.

- [ ] **G3.2 (re-escopado)** — `useContadorGasto`/`useFlagGasta`: 2
      hooks pequenos que embrulham CADA par `useState` de recurso já
      existente (sem mudar o formato salvo) e devolvem
      `{restantes, disponivel, usar}` ou `{gasta, usar}` — elimina a
      duplicação das ~15 funções `usarX` quase idênticas, sem tocar
      em `descansoCurto`/`descansoLongo`/autosave.
- [ ] **G3.3** — `useMagiasPersonagem`: os ~40 `const magias*`/
      `truques*` espalhados pelo componente, extraídos como 1 hook de
      derivação pura (mesmas entradas → mesmo objeto de saída).
- [ ] **G3.4** — Consolida os ~11 `caracteristicaSubclasseDesbloqueada(...)`
      chamados um por um (mesmo padrão, ID diferente) num único
      helper que recebe a lista de IDs e devolve um mapa
      `{chave: boolean}` — também derivação pura, sem mudar estado.

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
