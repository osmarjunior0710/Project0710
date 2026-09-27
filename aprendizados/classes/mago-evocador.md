# Mago — Evocador (subclasse)

## Contexto e fontes usadas

Foco separado do "Mago — características base" (ver
`aprendizados/classes/mago.md`) — decisão de manter subclasses em
arquivo próprio, separado da classe base, pra não misturar o
histórico de uma com o das outras conforme mais subclasses forem
implementadas (ver seção 7.2 do `CLAUDE.md`). A Entrega 1 (dado no
banco, sem mecânica) já tinha sido feita dentro do foco da classe
base; este arquivo cobre da Entrega 2 em diante.

SDD completo em `sdd/sdd-mago-evocador.md` (chapéus 1/2/3 aprovados) —
referência de "como cada mecânica deveria funcionar", ainda válido
depois do foco fechado.

## Entrega 1 — Dado no banco (feita no foco da classe base)

5 características em `caracteristicasSubclasse.ts`. Evocador
selecionável na criação/Level Up, aparece no Perfil. Nenhuma mecânica
ainda nessa entrega — só o texto real da planilha.

## Entrega 2 — Versado em Evocação (nível 3)

`core/evocador.ts` + wiring em `LevelUpShell.tsx`, mesmo padrão de
Perito em Necromancia (Necromante) — mas **sem** o selo Homebrew, por
ser regra oficial do livro (achado antes de codar: eu tinha planejado
reaproveitar o padrão do Necromante incluindo o selo, e o Osmar
corrigiu antes de eu escrever qualquer linha — Versado em Evocação e
Necromancia são regras diferentes, uma oficial e outra homebrew, e o
padrão de UI não devia copiar esse detalhe junto). Corrigido de
quebra: as 5 características do Evocador não tinham
`statusImplementacao` desde a Entrega 1 — preenchido agora (Versado em
Evocação = `codeimplementation`; Esculpir Magias = `textonly`,
confirmado no SDD; as outras 3 = `placeholder-codeimplementation`,
aguardando suas entregas).

## Entrega 3 — Truque Potente (nível 3)

Metade de dano no erro de ataque (`onErrou` de `useUsarMagiaPainel.tsx`
+ implementação própria em `ReacaoPanelContent.tsx`, que não usa o
hook) e no sucesso da salvaguarda (`textoSucessoSalvaguarda` em
`CombatTab.tsx`, mesmo padrão de "Ataque de Sopro"). Vale pra qualquer
truque com dano que o Mago conjure, não só de Evocação
(`truqueElegivelTruquePotente`).

**Bug achado pelo Osmar no dia seguinte:** clicar "Errei" na aba
Magias só fechava o popup, sem aplicar Truque Potente — a aba Magias
tem sua PRÓPRIA cópia de `processarMagiaAoUsar` (fluxo de conjuração
paralelo ao de Combate, com seu próprio `onErrou`/`telaSalvaguarda`),
que eu esqueci de atualizar — violei a própria regra da seção 6.6 do
CLAUDE.md, registrada 2 entregas atrás (foco da classe base) por um
bug quase idêntico (Maestria/Assinatura não aparecendo em Combate).
Corrigido: mesma lógica replicada em `MagiasTab.tsx`, incluindo um
banner de feedback novo (aba Magias não tinha `onEscolher` como o
Combate).

## Entrega 4 — Evocação Potencializada (nível 10)

Mod. de Inteligência somado ao dano de magia de Evocação de Mago,
mesmo padrão de Explosão Agonizante (`decidirConjuracao`) no caso
Ataque; caso Salvaguarda calcula o dano fora de `decidirConjuracao`
(em 2 lugares: `CombatTab.tsx` `abrirSalvaguarda` e `MagiasTab.tsx`
`processarMagiaAoUsar`) — criado `aplicarEvocacaoPotencializadaAoDano`
como helper único reaproveitado nos 2, em vez de duplicar a lógica de
merge da explicação do cálculo. Conferido desde o início nas 2 telas
dessa vez, aprendendo com o bug da Entrega 3 — sem bug reportado depois.

## Entrega 5 — Sobrecarga (nível 14)

Escolha "Rolar Dano" (normal) vs. "☠️ Sobrecarga" (dano máximo) numa
tela própria (`SobrecargaEscolha.tsx`), pra qualquer magia de Mago de
1º-5º círculo com dano. Contador `sobrecargaUsosDesdeDescansoAtual`
persistido (zera no Descanso Longo); a partir do 2º uso desde o
descanso, rola dano Necrótico auto-infligido escalando
`(1+usosAnteriores) × círculo`, em d12. Wiring nos 5 pontos de
conjuração (`useUsarMagiaPainel.tsx`, `ReacaoPanelContent.tsx`,
`MagiasTab.tsx` ataque+salvaguarda, `CombatTab.tsx` `abrirSalvaguarda`).

**2 bugs achados pelo Osmar no dia seguinte, os dois passando pela
validação Playwright original sem serem detectados:**

1. **Dano Necrótico rolava mas não descontava PV.** Copiei o padrão
   de "rolar dado com `confirmarFechamento: {}`" de popups de dano
   CONTRA um alvo (a maioria no app — o jogador aplica o PV do
   inimigo por fora, na mesa) sem perceber que Sobrecarga é o
   primeiro caso de dano que o app precisa aplicar sozinho, no
   próprio personagem. Corrigido: cada rolagem captura o total
   (`onResultado`) e aplica com
   `confirmarFechamento.aoTocar: () => onAlterarPv(-total)` — mesma
   função pura `alterarPv` dos botões manuais de PV. Precisou também
   passar `onAlterarPv` pra `MagiasTab.tsx` (nunca tinha essa prop) e
   pra `BonusPanelContent.tsx`/`ReacaoPanelContent.tsx` (não recebiam
   de `CombatTab.tsx`). **Por que a validação original não pegou:**
   confirmei que a rolagem aparecia com a fórmula certa (texto na
   tela) — nunca chequei se o PV do personagem de teste mudava de
   verdade depois. Lição registrada em `LICOES-RAPIDAS.md`.
2. **Popup de escolha preso dentro do painel de Combate** (só no
   caminho de Ataque — Ação/Bônus/Reação). Causa: `SidePanel.module.css`
   anima o painel com `transform`, que cria um novo *containing
   block* pra filhos `position: fixed` — o popup (que usa
   `position: fixed` copiando o padrão de `SalvaguardaDoAlvoModal`)
   ficava preso/cortado dentro do painel deslizante em vez de cobrir
   a tela toda. A Sobrecarga acionada pela Salvaguarda já funcionava
   porque seu estado sempre viveu em `CombatTab.tsx`, fora do
   `SidePanel` — só a escolha de Ataque tinha estado/render LOCAL
   (`useUsarMagiaPainel.tsx` e a cópia em `ReacaoPanelContent.tsx`).
   Corrigido: os 2 arquivos passaram a delegar pro estado já existente
   em `CombatTab.tsx` via um novo prop `onAbrirEscolhaSobrecarga`
   (mesmo padrão de `onAbrirSalvaguarda`), em vez de renderizar
   localmente. **Por que a validação original não pegou:** os cliques
   do meu script usam `dispatchEvent` direto no elemento, que ignora
   se ele está visível/clicável de verdade — um clique REAL do
   Playwright (usado sem querer numa etapa não relacionada da
   depuração) travou esperando o elemento ficar clicável, e foi assim
   que o bug apareceu. Um screenshot da validação original já não
   mostrava o popup — percebi isso na hora e descartei como "só
   timing de screenshot" sem investigar, quando era o bug se
   revelando. Padrão registrado em `DECISOES-COMBATE.md` ("Combat
   Layout C — overlays usam `position: fixed`...").

## O que ficou pendente ao fechar este foco

Nada ficou de propósito sem fazer — as 5 características da subclasse
(Versado em Evocação, Esculpir Magias, Truque Potente, Evocação
Potencializada, Sobrecarga) têm mecânica completa, e os 2 bugs achados
depois da publicação já foram corrigidos e revalidados. `PENDENCIAS.md`
não tinha nenhuma entrada específica de Evocador — nada a remover de
lá.
