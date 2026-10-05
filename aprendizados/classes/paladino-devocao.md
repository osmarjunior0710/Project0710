# Paladino — Juramento da Devoção (subclasse)

Foco próprio (ver CLAUDE.md 7.2), fechado em 2026-10 — as 5
características completas. SDD: `sdd/sdd-paladino-devocao.md`.
Personagem de teste dedicado (🧪 Char Teste — Paladino Devoção, nível
20, Carisma 20) apagado ao fechar o foco, junto do atalho na lista de
personagens.

## Lista exaustiva confirmada (CLAUDE.md 6.1.1)

Nível 3 (Magias do Juramento + Arma Sagrada), 7 (Aura de Devoção), 15
(Destruição Protetora), 20 (Resplendor Sagrado) — conferida contra a
planilha E contra o PDF completo do capítulo (seção 6.1.2), sem nada
faltando. Regra nova adotada no meio deste foco: **trazer o texto
original da planilha/livro junto da lista exaustiva**, não só o
resumo — o Osmar às vezes está sem acesso ao material na hora de ler a
proposta (ver CLAUDE.md seção 6.1).

## Magias do Juramento da Devoção (nível 3) — reaproveitamento 1:1

Mesmo padrão de "Magias de Pacto do Ínfero" (Bruxo): lista fixa por
nível, sempre preparada, fora do limite normal.
`core/magiasJuramentoDaDevocao.ts` é cópia estrutural de
`magiasPactoDoInfero.ts`. Fiação em `useMagiasEConjuracao.ts` já
garante que a magia aparece nas 2 telas (Magias E Combate) de fábrica
— esse mecanismo já nasceu corrigido da lição da seção 6.6, não
precisou de correção depois.

## Arma Sagrada (nível 3) — a entrega mais trabalhosa

**Simplificação de UI que veio de um achado técnico:** o app só
rastreia 1 arma equipada por vez pro "Atacar" — então não precisou de
seletor de arma novo, a Arma Sagrada sempre imbui a arma atualmente
equipada. Se o jogador trocar de arma com o toggle ativo, o bônus
simplesmente some até ele voltar pra uma arma Corpo a Corpo (não
desliga sozinho) — simplificação confirmada com o Osmar.

**Escolha Normal/Radiante — ida e volta:** a regra pede escolha "a
cada acerto", no popup de dano. Na hora de codar, o popup só tinha 1
slot de botão de fechamento (usado por Golpe Brutal/Esmagador/
Talhador) — simplifiquei sozinho pra um toggle no card "ATIVA" em vez
de perguntar antes. O Osmar pediu a versão original mesmo. Corrigido
estendendo `confirmarFechamento` (`RollContext.tsx`/`RollOverlay.tsx`)
pra aceitar um ARRAY de botões, não só 1 — ver
`DECISOES-COMBATE.md` "Fechamento do popup de dano com 2+ botões".
**Lição registrada em `LICOES-RAPIDAS.md`:** limitação técnica que
muda o que o jogador vê/faz é pergunta antes de codar, nunca simplifica
e avisa depois.

**Bug achado no personagem de teste:** o pacote de equipamento inicial
do Paladino sorteado pelo gerador de teste caiu no "B" (só dinheiro,
zero item) — ficou sem arma pra testar Arma Sagrada.
`personagemTestePaladinoDevocao.ts` forçou o pacote A e equipou a
Espada Longa na Mão Principal explicitamente (arma de 1 mão não
auto-equipa sozinha, diferente de armadura/escudo — `slotInicialAutomatico`
deixa `slot: null` pra ela).

## Aura de Devoção (nível 7) / Destruição Protetora (nível 15) — `textonly`

Mesmo motivo dos 2: efeito concedido aos ALIADOS (Imunidade a
Enfeitiçado / Cobertura Parcial), nunca ao próprio Paladino — o app
não rastreia condição/cobertura de outros personagens na cena, mesmo
raciocínio já usado em Aura de Coragem (classe base). Cada uma ganhou
função própria em `core/` (vazia, só marco de existência, CLAUDE.md
12.1) — `auraDeDevocao.ts`/`destruicaoProtetora.ts`.

## Resplendor Sagrado (nível 20) — mecânica parcial, 3 blocos separados

Separado em 3 blocos antes de propor qualquer coisa (CLAUDE.md 6.1,
"leitura calma de regra nova"): Dano Radiante (em INIMIGO — sem ficha
de inimigo no app, só mostra o valor calculado,
`core/resplendorSagrado.ts` `danoResplendorSagrado`), Luz Solar
(textonly puro) e Vigília Consagrada (depende do tipo do oponente,
informação que o app não tem numa salvaguarda qualquer — textonly).
Só a ATIVAÇÃO é mecanizada: toggle sem cronômetro (mesmo padrão de
Fúria/Arma Sagrada) + 1 uso por Descanso Longo, recuperável gastando 1
espaço de 5º círculo (`gastarSlotCirculo(5)`, reaproveitado de
`EscolherCirculoShell`).

## Padrão novo confirmado neste foco: toggle sem cronômetro

Registrado em `DECISOES-COMBATE.md` — toda característica com duração
real ("10 minutos ou até encerrar") que o app não consegue cronometrar
vira um toggle manual: card no corpo da aba Combate, "NOME ATIVA" +
descrição do efeito, botão "Encerrar". Usado por Arma Sagrada e
Resplendor Sagrado nesta subclasse, origem é a Fúria do Bárbaro.
