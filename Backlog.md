# Backlog

> Regra de atualização em CLAUDE.md, seção 17.

Melhoria conhecida e tecnicamente possível, mas que a gente decidiu
**não fazer agora** por prioridade — diferente de `PENDENCIAS.md`
(que é coisa que trava estruturalmente, sem outra opção). Aqui é
"dá pra fazer, só não é a hora".

## Inspiração Heroica

- **Reroll não cobre dano/outras rolagens fora do D20** — a regra real
  ("Qualquer dado") permite rerolar QUALQUER rolagem, incluindo dano.
  Implementado por enquanto só pro RollOverlay de D20 (ataque, teste,
  salvaguarda, iniciativa). Rolagens de dano (`rolarDados`) não têm o
  botão de Inspiração Heroica ainda.
- **Sem contexto de grupo/mesa** — a regra permite transferir a
  Inspiração Heroica pra outro personagem do grupo quando você já tem
  e ganharia de novo. Como o app é uma ficha por personagem, sem noção
  de "outros personagens da mesa", essa transferência não foi
  implementada — hoje o jogador só liga/desliga a própria caixa.
- **Canção Encorajadora (talento Músico)** e **Combatente Heroico**
  (Guerreiro Campeão, nível 10) — as outras 2 fontes que concedem
  Inspiração Heroica automaticamente (além do traço Eficiente do
  Humano) ainda não têm gatilho no app; hoje só dá pra ligar a caixa
  manualmente representando qualquer concessão (Mestre, talento,
  subclasse).

## Talentos de Origem — pedaços implementáveis (auditoria 2026-09, foco Origens Grupo C)

Auditoria dos 6 Talentos de Origem que ainda não têm `efeitoMecanico`
(depois de Alerta/Habilidoso/Iniciado em Magia/Vigoroso já resolvidos).
Cada um tem um pedaço que dá pra fazer hoje (ver `EmDev.md` — Grupo D
já plugado, E ainda em aberto) e um pedaço travado por peça que o app
não tem — registrado aqui pra não redescobrir do zero.

- **Artifista** (Artesão) — proficiência com 3 Ferramentas de Artesão
  já implementada. Faltam: 20% de desconto em item não-mágico na Loja
  (a Loja não tem conceito de desconto por personagem) e fabricar 1
  item da tabela Fabricação Rápida por Descanso Longo (não existe
  tabela nem sistema de "item fabricado" no app — mais perto de um
  sistema de downtime/crafting do que de um cálculo de ficha).
- **Músico** (Artista) — proficiência com 3 Instrumentos Musicais já
  implementada. Falta dar Inspiração Heroica a ALIADOS ao completar
  Descanso Curto/Longo — mesmo bloqueio já registrado acima (sem
  conceito de "outros personagens da mesa" no app).
- **Curandeiro** — ação com Kit de Curandeiro (curar OUTRO personagem
  usando um Dado de Vida DELE) é mecânica nova inteira, trava pelo
  mesmo motivo dos itens acima (sem outros personagens na tela). Reroll
  de 1 em dado de cura tem o mesmo bloqueio do item abaixo.
- **Atacante Selvagem** — rolar o dano da arma 2x e usar o melhor
  resultado precisa de um motor de dano de ataque rolável de verdade;
  a aba Combat ainda usa números de exemplo pro dano (não é fixture só
  desse talento, é limitação geral do Combat hoje).
- **Reroll de "qualquer dado" que não seja d20** (Curandeiro: dado de
  cura; Valentão de Taverna: dado de dano Desarmado) — mesmo mecanismo
  que falta pro reroll de dano da Inspiração Heroica (ver tópico acima)
  — quando um existir, os outros 2 casos usam o mesmo.
- **Empurrar o alvo 1,5m** (Valentão de Taverna, 1x/turno ao acertar
  Desarmado) — não existe efeito de posicionamento/deslocamento tático
  na ficha hoje.
