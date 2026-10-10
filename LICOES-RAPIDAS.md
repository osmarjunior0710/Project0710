# LICOES-RAPIDAS.md

> Observação pequena e recorrente de UI/UX/processo — ainda sem virar
> regra permanente em algum `DECISOES-*.md`. Ver seção 16 do
> `CLAUDE.md` pra regra completa: na 3ª vez que a MESMA lição aparecer,
> para e decide com o Osmar se vira regra de verdade (some daqui de
> qualquer jeito, vire regra ou não).
>
> Diferente de `PENDENCIAS.md` — isso aqui não é trabalho pendente, é
> observação de padrão de comportamento/processo.

---

## Planilha pode ter erro de resumo/paráfrase — conferir contra o livro quando o Osmar fornecer

1ª ocorrência (2026-09, revisão de Talentos de Origem, Grupo A.1):
Sortudo tinha uma cláusula extra "(nível 5+) transforma crítico em
acerto normal" que não existe na regra 2024 (parece herança da versão
2014) — removida. Valentão de Taverna tinha "empurrar 1,5m ao acertar
Desarmado" que descrevia errado o benefício real ("Ataque em
Investida": mover 3m+ antes de qualquer ataque corpo a corpo, +1d8 de
dano OU empurrar 3m). Achado ao comparar `talentos.ts` linha a linha
contra o PDF do Cap. 5 (Talentos) que o Osmar anexou — a planilha
mestra continua sendo a fonte de dados oficial do projeto (CLAUDE.md
seção 3), mas quando o Osmar fornece o livro pra conferência pontual
de um talento/regra específica, vale comparar o texto salvo contra
ele antes de assumir que está certo.

## Perguntar "onde fica / como ativa" antes de codar UI de combate nova

1ª ocorrência (2026-09, postmortem Bruxo): "A Sorte do Próprio
Tenebroso" (B6.4) foi construída como card separado no Combat sem
perguntar antes — o Osmar pediu pra mover pro modal de rolagem depois,
2ª implementação. Logo em seguida, "Lançar no Inferno" (B6.6) foi
perguntado ANTES de codar ("onde você tá pensando em colocar isso e
como o jogador vai ativar?") e saiu certo de primeira.

## Validar dano auto-infligido: conferir o PV de verdade, não só o texto/fórmula da rolagem

1ª ocorrência (2026-09, Sobrecarga do Mago/Evocador): validei via
Playwright que a rolagem de dano Necrótico auto-infligido aparecia com
a fórmula certa (4d12/6d12/12d12 conforme o uso) e considerei a entrega
pronta — mas nenhum dos 5 pontos de conjuração realmente descontava o
PV do personagem, só mostrava o número rolado. Rolagem de dano CONTRA
um alvo (a imensa maioria dos casos no app) não precisa desse cuidado,
porque o app nunca aplica PV de NPC sozinho — mas dano que o próprio
personagem sofre é diferente, e só apareceu esse caso agora. Lição: ao
validar uma mecânica de auto-dano/auto-efeito no próprio personagem,
sempre ler o PV/recurso antes e depois da rolagem (ex.: no
`localStorage` salvo), não só conferir que o texto/rolagem aparece.

## Botão desabilitado com `opacity` + `pointer-events:none` num pill fixo vaza clique pro que está atrás

1ª ocorrência (2026-09, Copiar Magia): o OK desabilitado usava
`opacity`+`pointer-events:none` — como o pill fica no `navLayer`
(`position: fixed`), sobrepondo os FABs de Descanso/Dado, o clique
"vazava" pro FAB por trás em vez de ser ignorado (corrigido: manter
`pointer-events` normal e guardar a ação dentro do handler). 2ª
ocorrência notada (não corrigida ainda): `MemorizarMagiaShell.tsx`
("Confirmar") tem o mesmo padrão de risco — só vira arrumação de
verdade se aparecer de novo em algum lugar novo.

## Pips + texto "{restantes}/{máximo} disponíveis" junto é redundante

1ª ocorrência (2026-10, Repudiar Inimigos): ao copiar o padrão de
Sentido Divino (`TickPips` + `<span>{restantes}/{maximo} disponíveis
</span>` do lado), o Osmar pediu pra tirar o texto — os pips já mostram
a quantidade, escrever o número de novo do lado é redundante. Removido
das 3 telas que tinham esse texto (Ação/Bônus/Reação). Diferente do
`ContadorUsos.tsx` (resumo da tela principal, "{restantes}/{total}"
sem a palavra "disponíveis") — esse é um padrão já aprovado antes
(DECISOES-DESIGN.md), não mexi nele.

## Limitação técnica força simplificar o que já foi aprovado — perguntar ANTES de codar, não avisar depois

1ª ocorrência (2026-10, Arma Sagrada): a decupagem aprovada pedia
escolha de dano Normal/Radiante "a cada acerto", no popup de dano. Na
hora de codar, o popup só aceitava 1 botão de fechamento (slot já
usado por Golpe Brutal/Esmagador/Talhador) — em vez de perguntar antes
de desviar, simplifiquei sozinho pra um toggle no card "ATIVA" e só
avisei no relatório depois do push. O Osmar preferia a versão aprovada
original (e tinha razão — bastava estender o popup pra aceitar vários
botões, não era preciso simplificar nada). Lição: uma limitação
técnica que mudaria o que o jogador VÊ/FAZ na tela (não só "como
implementar por baixo") é pergunta antes de codar, igual qualquer
outra decisão de UI — nunca uma nota de rodapé no relatório final.

## Ambiente de teste (navegador do Claude) — armadilhas que parecem bug do app

(2026-10, foco Monge; 1ª ocorrência de cada, todas já resolvidas.)
- Dado 3D só avança se o painel desenha frames: `tabs_select` + screenshot, senão a
  rolagem fica em "Rolando...".
- `scrollIntoView` no teste rola o `#root` (overflow hidden) e desloca todo modal
  `position: fixed` — parece bug de posição do popup, não é.
- "Fim do Turno" e vários botões são `div`, não `button` (clicar por coordenada/ref).
- Scripts de edição: nunca `node -e` com texto de código (aspas quebram, ~6x num dia);
  escrever o script num arquivo e rodar. Script de versão: usar `date` do Git Bash.

## Afirmar "aparece na tela" sem conferir na tela

1ª ocorrência (2026-10, Monge): disse que as características do Monge já apareciam
no Perfil; na verdade nenhuma tinha texto importado. Só descobri ao conferir de
verdade. Regra prática: antes de dizer que algo aparece/funciona, abrir a tela.

**2ª ocorrência (2026-10, Deslocamento):** dei o Deslocamento por "validado ao vivo" olhando só o total e o ⓘ,
sem checar se o personagem de teste REALMENTE usava armadura — o ⓘ dizia "armadura equipada" (bug:
`undefined !== null`) e eu li como correto. O Osmar viu na Mochila que não havia armadura. Regra prática:
validar um número **contra o estado real** (abrir a Mochila/aba de origem), e testar o caso oposto (aqui:
equipar uma armadura de verdade e ver o bônus virar "inativo"). Slot vazio pode ser `null` OU `undefined`:
usar `estaEquipado()` (`core/deslocamento.ts`) em vez de `!== null`. (Na 3ª ocorrência, perguntar ao
Osmar se vira regra permanente — seção 16 do `CLAUDE.md`.)
