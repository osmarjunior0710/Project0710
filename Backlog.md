# Backlog

> Regra de atualização em CLAUDE.md, seção 17.

Melhoria conhecida e tecnicamente possível, mas que a gente decidiu
**não fazer agora** por prioridade — diferente de `PENDENCIAS.md`
(que é coisa que trava estruturalmente, sem outra opção). Aqui é
"dá pra fazer, só não é a hora".

## `FichaShell.tsx` — registro genérico de recursos "gastos" (2026-09)

Achado durante o foco de saúde do projeto (G3, ver `EmDevB.md`): cada
recurso de subclasse/espécie que "gasta e recupera" (Conhecimento de
Pedras, Ancestralidade Gigante, Ataque de Sopro, etc. — hoje ~20)
precisa de 3 lugares concordando por nome de campo: o `useState`
próprio, uma linha em `descansoCurto`/`descansoLongo` resetando ESSE
campo (cada um com sua regra própria — só Longo, Curto+Longo,
decrementa em vez de zerar), e o payload do autosave. Isso é o que
faz cada classe/espécie nova custar mais que a anterior.

**A versão que resolveria de vez:** trocar os ~20 campos soltos em
`PersonagemSalvo` por 1 `Record<string, EstadoRecurso>` genérico, com
metadado de recuperação (`recuperaEm: 'curto' | 'longo' | 'ambos'`,
`tipo: 'contador' | 'booleano'`) que `descansoCurto`/`descansoLongo`
percorrem em loop (sem listar campo por campo) e o autosave salva de
uma vez (sem listar campo por campo). Isso muda o FORMATO salvo —
precisa de migração pra personagem já salvo (mesmo padrão já usado
outras vezes no projeto, ex: migração de `espacosGastos` no Multiclasse).

**Por que não foi feito agora:** é bem maior e mais arriscado que
"extrair um hook" (a G3.2 rescopeada só embrulha os `useState`
existentes, sem tocar no formato salvo nem em `descansoCurto`/`Longo`)
— merece seu próprio foco com SDD (chapéu de Game Designer, seção
6.2 do CLAUDE.md) descrevendo a migração, não ser feito de passagem
dentro de uma leva de limpeza.

## Dano em crítico não dobra (geral) + "+1 dado extra" do Perfurador (2026-09)

Descoberto ao implementar o Perfurador: nenhum ataque do app dobra os
dados de dano num acerto crítico hoje — "Rolar Dano" sempre rola a
quantidade normal, sem saber se o "Rolar Ataque" anterior foi crítico.
Decisão do Osmar: implementar só o reroll de 1 dado do Perfurador por
enquanto (já funciona, ver DECISOES-COMBATE.md "Grid de dados
individuais"), deixando de fora:

- **Dano dobra em crítico (regra geral)** — qualquer ataque com arma
  deveria rolar o dobro de dados de dano num acerto crítico. Precisa
  de um jeito de "Rolar Dano" saber que o "Rolar Ataque" anterior
  daquele mesmo ataque foi crítico (hoje são 2 rolagens separadas, sem
  vínculo entre elas).
- **Perfurador — "+1 dado extra no crítico"** — depende do item acima
  pra fazer sentido (some ENCIMA do dobro já esperado, não sozinho).

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

## Talentos Gerais — Agressor/Esmagador/Sentinela/Talhador decidido não implementar (2026-09)

Osmar decidiu deixar esses 4 só como texto (`[PH]`) — mesmo espírito
do B.3 acima, nenhum vai ganhar mecânica de verdade; o jogador lembra
sozinho na mesa quando o gatilho acontecer. Diferente de Perfurador
(mesma "família" das 5 magias de dano por tipo — Cortante/Contundente/
Perfurante — mas esse SIM vai ser implementado, ver EmDev.md B.6).

- **Agressor** (p.203) — trava dupla: a ação Correr no Combat só dá o
  Deslocamento padrão, sem lugar pra somar bônus condicional de
  talento; e precisa saber que o personagem "se moveu 3m+ em linha
  reta antes de acertar" — o app não rastreia movimento/distância
  percorrida no turno.
- **Esmagador** (p.205) — dispara "ao causar dano Contundente": a
  ficha ainda não sabe qual é o TIPO de dano do ataque que acabou de
  acontecer (dano é só um número calculado, sem essa tag). Além disso,
  o efeito em si (empurrar o alvo 1,5m) depende de posição/grade, que
  o app não modela.
- **Sentinela** (p.207) — depende de saber quando OUTRA criatura
  (não o próprio personagem) é atacada ou Desengaja a 1,5m dele — isso
  é posição relativa entre vários combatentes; a ficha é individual,
  sem noção de "mapa" de quem está perto de quem.
- **Talhador** (p.208) — mesma trava de tipo de dano do Esmagador (dano
  Cortante), mais o efeito em si (reduzir o Deslocamento do alvo) exigir
  uma ficha de status do INIMIGO, que também não existe no app.

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

