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

## Tela 3 de "Usar Magia" (Combat/Magias) — prévia numérica por círculo

`EscolherCirculoShell.tsx` mostra só o TEXTO da magia (`descricaoCurta`,
ex. "Upcast: +1d6 por círculo") em vez de um número já calculado por
opção de círculo (ex. "10d6" na opção de 5º círculo, "8d6" na de 3º) —
jogador lê o texto e faz a conta de cabeça. Isso era bloqueado por
falta de dado estruturado (ver `PENDENCIAS.md`, histórico), mas
`core/magiaDano.ts` (`calcularDanoMagia`) já resolve exatamente essa
conta hoje — só falta chamar essa função uma vez por círculo
disponível e mostrar o resultado no card de cada opção, sem
recalcular nada novo.

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
  mesmo motivo dos itens acima (sem outros personagens na tela). O
  motor de reroll de 1 já existe (`RollContext.usarRerollSe1`, feito
  pro Valentão de Taverna — ver abaixo) — quando a ação de cura em si
  existir, é só passar `rerollSe1: { rotulo: 'Cura Garantida' }` na
  chamada de `rolarDados`, sem mecanismo novo.
- **Atacante Selvagem** — rolar o dano da arma 2x e usar o melhor
  resultado precisa de um motor de dano de ataque rolável de verdade;
  a aba Combat ainda usa números de exemplo pro dano (não é fixture só
  desse talento, é limitação geral do Combat hoje).
- **Valentão de Taverna — Armamento Improvisado** (proficiência com
  armas improvisadas) — não existe essa categoria de proficiência de
  arma no schema hoje (`core/proficienciaArma.ts` só conhece
  Simples/Marcial).
- **Valentão de Taverna — Corrida Aprimorada** (+3m de Deslocamento na
  ação Correr) — a ação Correr no Combat hoje só concede o
  Deslocamento extra padrão, sem lugar pra somar bônus condicional de
  talento.
- **Valentão de Taverna — Ataque em Investida** (mover 3m+ em linha
  reta antes de acertar um ataque corpo a corpo → +1d8 de dano OU
  empurrar até 3m) — precisa rastrear que o personagem se moveu antes
  do ataque (a ficha não modela posição/deslocamento em combate) e um
  efeito de empurrão que também não existe. Corrigido em 2026-09: o
  texto anterior desse talento descrevia errado esse benefício como
  "empurrar 1,5m ao acertar Desarmado" — não é isso, é um "ataque de
  investida" que vale pra qualquer arma corpo a corpo, com a escolha
  entre dano extra OU empurrão. Ver livro Cap. 5, p.201.

## Talentos Gerais — B.3 decidido não implementar (2026-09)

Osmar decidiu deixar esses 3 só como texto (`[PH]`) — cada jogador
resolve o PV Temporário/Deslocamento na própria ficha depois de
anunciar na mesa, em vez do app calcular.

- **Velocista** (Cap. 5, p.208) — Deslocamento +3m. A Ficha não tem
  campo de Deslocamento em lugar nenhum hoje (nem espécie define um
  valor base) — não é só esse talento faltando, é a métrica inteira
  que não existe ainda.
- **Líder Inspirador** (p.206) — Atuação Encorajadora concede PV
  Temporário a até 6 aliados ao completar Descanso Curto/Longo. Trava
  dupla: sem conceito de "outros personagens da mesa" (mesmo motivo já
  registrado em Inspiração Heroica) e sem campo de "atributo aumentado
  por este talento" rastreado pro talento em si.
- **Chef** (p.204) — Refeição Satisfatória (bônus de cura ligado a
  gastar Dados de Vida em Descanso Curto, pra várias criaturas) e
  Guloseimas Revigorantes (PV Temporário = Bônus de Proficiência,
  Ação Bônus pra comer) — mesma trava de "vários aliados" acima.

## Talentos Gerais — B.4 escopo corrigido (2026-09)

- **Adepto Elemental** (p.202) — não concede magia nenhuma, MODIFICA
  magias que o personagem já conjura de um tipo de dano escolhido
  (ignora Resistência a esse dano + trata 1s como 2 em dado de dano).
  Não é "magia sempre-preparada" (B.4), mas também não tem onde
  plugar hoje — a Ficha não tem um motor de "modificador de dano por
  tipo elemental" aplicado durante a rolagem de dano de magia.
- **Atirador Arcano** (p.202) — mesmo caso: modifica ataques de magia
  já existentes (ignora Cobertura, sem Desvantagem a queima-roupa,
  +18m de alcance), não concede magia nova. Precisaria de um motor de
  "modificadores de ataque de magia" que também não existe (Combat
  ainda trata ataque de magia como 1 rolagem simples, sem hooks pra
  Cobertura/alcance/Desvantagem condicional).

