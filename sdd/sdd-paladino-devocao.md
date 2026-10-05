# SDD — Paladino: Juramento da Devoção

> Chapéu 2 (CLAUDE.md seção 6.2). Cobre as 5 características da
> subclasse, aprovadas no chapéu 1 (lista exaustiva + texto do livro
> já conferido contra a planilha — ver `EmDev.md` "Entrega 7").
> Personagem de teste dedicado: 🧪 Char Teste — Paladino Devoção
> (nível 20, Carisma 20).

## 1. Magias do Juramento da Devoção (nível 3) — sempre preparadas

Lista fixa por nível de Paladino (3/5/9/13/17), sem escolha do
jogador. **Reaproveita 100% o padrão de "Magias de Pacto do Ínfero"**
(Bruxo, `core/magiasPactoDoInfero.ts` + `useMagiasEConjuracao.ts`):

- Novo `core/magiasJuramentoDaDevocao.ts`, mesma assinatura:
  `magiasJuramentoDaDevocao(nivel: number): string[]`, lendo
  `magiasFixasPorNivel` da característica
  `{classe:'Paladino', subclasse:'Juramento da Devoção', nome:'Magias
  do Juramento da Devoção'}` em `caracteristicasSubclasse.ts` (campo
  já existe no dado).
- Fiação em `useMagiasEConjuracao.ts`: novo prop
  `magiasJuramentoDaDevocaoDisponivel: boolean` (gatilho = nível de
  Paladino ≥ 3 E subclasse = Devoção — mesmo helper
  `caracteristicaDesbloqueada`/checagem de subclasse que Repudiar
  Inimigos já usa), `magiasJuramentoDaDevocaoAtuais =
  magiasJuramentoDaDevocaoDisponivel ? magiasJuramentoDaDevocao(nivel)
  : []`, entra no mesmo array que alimenta `magiasConjuraveis`
  (igual `magiasPactoDoInferoPreparadas`).
- Aparecem como "sempre preparadas" nas 2 telas (seção 6.6): aba
  Magias (mesma seção que já lista Pacto do Ínfero/Destruição Divina)
  e painel "Usar Magia" do Combate — nenhuma tela nova.
- **Sem interação com Multiclasse/Espaços de Magia**: são preparadas
  de GRAÇA, fora do limite normal — mesma regra já aplicada ao Pacto
  do Ínfero, não consome espaço de preparação.
- Teste automatizado: espelha `magiasPactoDoInfero.test.ts` (nível
  antes do 3 → `[]`; nível 3 → os 2 da tabela; nível 17 → os 10
  acumulados).

## 2. Arma Sagrada (nível 3) — toggle, gasta Canalizar Divindade

Ao executar a ação Atacar, gasta 1 uso de Canalizar Divindade (banco
já existe — `recursosClasse.ts`/`onUsarUsoCanalizar`, mesmo gasto de
Sentido Divino/Repudiar Inimigos) e imbui 1 arma Corpo a Corpo
empunhada: dura "10 minutos ou até usar de novo/desligar".

- **Decisão de UI confirmada com o Osmar (2026-10):** como o app não
  conta tempo, a duração vira toggle manual — card persistente no
  corpo da aba Combate (padrão novo registrado em
  `DECISOES-COMBATE.md` "Toggle de habilidade com duração real", mesmo
  desenho da Fúria do Bárbaro): "⚔️ Arma Sagrada ATIVA" + descrição do
  bônus, botão "Encerrar Arma Sagrada". Fica visível mesmo com o
  painel de Ação fechado (`furiaAtiva` é o precedente: estado vive no
  nível do `CombatTab`, não dentro do painel).
- **Ativação:** linha nova no painel de Ação ("⚔️ Arma Sagrada" — grátis
  dentro da ação Atacar, por isso fica junto do bloco de Atacar, não
  como ação própria), gasta 1 uso de Canalizar Divindade, pergunta
  qual arma corpo a corpo da Mochila/equipada vai receber o efeito
  (reaproveita o seletor de arma já usado em "Trocar Arma"/Maestria,
  ver `TrocarArmaMaestria.module.css`) e se o dano vai ser normal ou
  Radiante nesse toque (pode escolher a cada acerto, não só na
  ativação — ver texto: "cada vez que atingir... causa o tipo de dano
  normal da arma OU dano Radiante" — é escolha por ACERTO, não por
  ativação. Confirmar com o Osmar antes de implementar: provavelmente
  um botão extra no popup de dano do ataque, "Radiante" vs "Normal",
  só quando Arma Sagrada está ativa E o ataque é com a arma imbuída).
- **Efeito no ataque:** soma `modCarisma` (mínimo +1) no bônus de
  acerto — precisa entrar em `AcaoPanelContent.tsx` `rolarAtaque`
  (mesmo ponto que Golpes Radiantes alterou), só quando
  `armaSagradaAtiva && ataque.arma === armaSagradaNomeArma`.
- **Luz (6m Luz Plena + 6m Meia-luz):** `textonly` — o app não modela
  luz/visão de área.
- **Encerra se parar de carregar a arma:** simplificação aceita, igual
  outras auras — o app não rastreia "está empunhando X agora" turno a
  turno fora do que o jogador escolhe manualmente.

## 3. Aura de Devoção (nível 7) — suspeita de `textonly`

"Você e seus aliados têm Imunidade a Enfeitiçado na Aura de
Proteção." Efeito só em ALIADOS (nunca no próprio Paladino) — app não
rastreia condição de outros personagens. Mesma conclusão de Aura de
Coragem (nível 10, já `textonly`). Proposta: marcar `textonly` direto,
sem entrega de código — só ajustar `statusImplementacao` na planilha
de dados.

## 4. Destruição Protetora (nível 15) — suspeita de `textonly`

"Ao conjurar Destruição Divina, você e aliados na Aura de Proteção
têm Cobertura Parcial até o início do seu próximo turno." Efeito em
ALIADOS — mesma conclusão do item 3. Proposta: `textonly` direto.

## 5. Resplendor Sagrado (nível 20) — toggle parcial

Ação Bônus, 1x/Descanso Longo (ou gasta espaço de 5º círculo pra
recuperar — reaproveita `usarMagiaGratis`/padrão de recarga via
espaço, já usado em Assinatura Mágica do Mago), ativa por "10 minutos
ou até encerrar" 3 efeitos:

- **Dano Radiante em inimigo que começa turno na aura:** efeito em
  INIMIGO — app não tem ficha de inimigo pra aplicar dano
  automaticamente. `textonly` (mostra o valor calculado
  `modCarisma + bônus de proficiência` no texto, jogador aplica
  manualmente fora do app — mesmo padrão de "CD mostrada, resultado
  manual" já usado em Sentido Divino/Repudiar Inimigos).
- **Luz Solar:** `textonly` (mesma razão do item 2).
- **Vigília Consagrada (Vantagem em salvaguarda contra Ínfero/Morto-
  Vivo):** efeito no PRÓPRIO Paladino, mas condicional a "o inimigo é
  Ínfero ou Morto-Vivo" — informação que o app não tem sobre o
  oponente numa salvaguarda qualquer. `textonly` (mostra o aviso no
  texto, jogador lembra de aplicar a Vantagem manualmente).
- **O que fica mecânico:** a ATIVAÇÃO em si — toggle igual ao item 2
  (card "✨ Resplendor Sagrado ATIVA" no corpo do Combate, botão
  "Encerrar"), o gasto do uso de Descanso Longo, e a opção de
  recuperar gastando espaço de 5º círculo. O corpo do card mostra os 3
  efeitos como texto (pro jogador saber o que está ativo), mas nenhum
  deles aplica automaticamente em outra ficha.

## Ordem de entrega (chapéu 1, confirmada)

1. Magias do Juramento da Devoção — só dado + fiação, zero UI nova.
2. Arma Sagrada — toggle + integração no ataque (a mais trabalhosa).
3. Aura de Devoção — `textonly`, sem código (confirmar com o Osmar
   antes de marcar, mesmo sendo "óbvio" — seção 6.1.1).
4. Destruição Protetora — `textonly`, mesma ressalva.
5. Resplendor Sagrado — toggle de ativação + 3 efeitos em texto.
