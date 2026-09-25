# Backlog

> Regra de atualização em CLAUDE.md, seção 17.

Melhoria conhecida e tecnicamente possível, mas que a gente decidiu
**não fazer agora** por prioridade — diferente de `PENDENCIAS.md`
(que é coisa que trava estruturalmente, sem outra opção). Aqui é
"dá pra fazer, só não é a hora".

## Auditoria de padding em botões/caixas do app inteiro (2026-09-25)

Pedido do Osmar: qualquer botão/caixa clicável deveria ter padding
visível máximo de 2px em qualquer lado (a caixa acompanha o tamanho
do conteúdo, sem sobra artificial) — não um touch target inflado por
`min-width`/`min-height`/`padding` generosos. Corrigido pontualmente
nos botões novos de Idiomas (aba Perfil, ver `PerfilTab.module.css`
`.removerBtn`/`.removerBtnConfirm`), mas o app tem dezenas de botões/
caixas mais antigos (`.btn`, `.opt-card`, `.box`, `removerBtn` de
Pets, etc.) que ainda não foram revisados com essa régua. Quando for
puxado como foco: percorrer tela por tela, com prints antes/depois
pro Osmar aprovar, já que mexer nas classes globais (`.opt-card`,
`.box` em `index.css`) afeta várias telas de uma vez.

## Pills configuráveis de info da magia (2026-09-24)

Ideia do Osmar, saída do protótipo de Multiclasse (`/prototipo`, cenas
`MulticlasseMagiasCena`/`MulticlasseCombateCena`): expandir o pill de
"círculo + classe" (que o foco de Multiclasse já vai construir) pra
qualquer combinação de info da magia, com o jogador escolhendo em
Perfil quais pills quer ver em cada linha. Campos candidatos já no
catálogo (`data/rulesets/dnd2024/magias.ts`): Escola, Distância
(`alcance`), Componentes (V/S/M — hoje 1 string só, precisa separar em
3 pills), Ataque ou Salvaguarda. **Duração** e **Tipo de ação**
(`tempoConjuracao`) têm texto livre — várias magias de Reação/Ação
Bônus condicional têm frases inteiras nesse campo (ex.: "Reação, que
você executa quando..."), então precisam de uma extração pra virar
pill curto ("Reação"), não dá pra usar o texto direto.

**Por que ficou pra depois:** decidido (2026-09-24) fazer o foco de
Multiclasse primeiro com o pill simples (círculo + classe), sem
travar a Entrega 1 (mudança de dado) nessa expansão maior — que
envolve tela nova de configuração em Perfil e passa pelos 3 chapéus
de novo antes de codar.

## Combate lendo direto da aba Magias — 1 registro só de fonte extra (2026-09-25)

Achado do Osmar, depois do bug "Maestria de Magias/Assinatura Mágica
não apareciam no Combate" (corrigido em `v202609_1108`): hoje cada
característica "sempre preparada" (Descobertas Mágicas, Livro das
Sombras, Pacto do Ínfero, magia de Espécie/Talento de Origem/Talento
Geral, Maestria de Magias, Assinatura Mágica — ~8 fontes) tem seu
próprio array pra desenhar a seção própria na aba Magias E precisa ser
somada à mão em `magiasConjuraveis` (`useMagiasEConjuracao.ts`) pra
também aparecer no picker "Usar Magia" do Combate — são 2 pontos de
manutenção por característica nova, fácil esquecer o 2º (foi
exatamente o que causou o bug).

**Ideia:** um registro único de "fontes extras de magia sempre
conjurável" (nome da fonte + lista de magias), que tanto a aba Magias
(pra desenhar cada seção) quanto o Combate (pra montar
`magiasConjuraveis`) leem do MESMO lugar — uma característica nova
entra 1 vez só. O roteamento por Ação/Ação Bônus/Reação/upcast já é
automático hoje (lê `tempoConjuracao`/círculo direto da magia, não é
hardcoded por característica) — não precisa mexer nisso, só na parte
de "de onde vêm as magias extras".

**Por que ficou pra depois:** o Osmar está no meio de uma rodada de
caça a bugs (não fechar nenhum foco até ele mandar) — isso aqui é
refatoração de um arquivo central usado por ~8 características já
implementadas, risco de regressão maior que um ajuste pontual. Vira
foco próprio (com SDD, chapéu de Engenheiro olhando cada fonte antes
de mexer) assim que a rodada de bugs terminar.

## Recursos visíveis (área abaixo do HP) — o que ficou de fora de propósito (2026-09)

Pedido do Osmar: a 1ª versão mostra só Fúria, Inspiração de Bardo, Magia de
Pacto e Recuperar Fôlego. Já existem no app, com contador, e podem entrar
depois em `core/recursosVisiveis.ts` se ele quiser: **Surto de Ação** e
**Indomável** (Guerreiro); **Astúcia Mágica**, **Contatar Patrono** e
**Arcana Mística** (Bruxo); e os de espécie/talento — Conhecimento de
Pedras, Pico de Adrenalina, Ataque de Sopro, Ancestralidade Gigante, Falar
com Animais e Pontos de Sorte. Mago não tem recurso com contador hoje.

## Ancestralidade Gigante só no ataque principal (2026-09)

Ao migrar Ancestralidade Gigante (Golias) do card avulso "toque ao
acertar" pra dentro do popup de dano do ataque principal (Fluxo
Acerto/Erro, retrofit completo — ver `DECISOES-COMBATE.md`), o talento
deixou de estar disponível depois de Ataque Bônus, Cortar, ataque de
magia ou ataques de Reação — só funciona mais depois do "Atacar"
principal (`AcaoPanelContent.tsx`). Antes (card avulso manual) valia
pra qualquer acerto, mesmo os que o app nem rastreava rolagem própria.
Dá pra estender pros outros pontos de ataque se algum jogador Golias
sentir falta — cada um precisaria receber os mesmos props
(`ancestralidadeGiganteEscolhida`/`usosAncestralidadeGiganteRestantes`/
`onAtivarAncestralidadeGigante`) e a mesma lógica de prioridade que
`AcaoPanelContent.tsx` já tem.

## Ferramenta genérica de tracking de status/efeitos ativos (2026-09)

Sugestão do Osmar ao planejar Ataque Imprudente (Bárbaro, B4.1): em vez
de cada característica nova inventar seu próprio par de estado/UI
ad-hoc (Fúria, Forma Grande, Ataque Imprudente hoje já são 3 versões
parecidas-mas-não-iguais de "liga/desliga, afeta X"), construir uma
ferramenta central que rastreie "status ativos" na Ficha (nome,
duração/gatilho de fim, o que cada um afeta — Vantagem em tal coisa,
Resistência a tal dano, bônus de dano condicional, etc.) e aplique
esses efeitos automaticamente em qualquer rolagem/cálculo relevante.

Decidido (com o Osmar) NÃO fazer agora, em cima só do Ataque
Imprudente — vale a pena como foco próprio depois, com PM+SDD direito:
precisa decidir o modelo de duração (turno/minutos/até condição X),
como N status simultâneos aparecem na tela sem virar bagunça, e olhar
pra frente pros próximos casos conhecidos que ela precisaria cobrir
(Golpe Brutal, as 4 Trilhas do Bárbaro, futuro Ataque Furtivo do
Ladino) antes de fixar a forma genérica.

## Magias — dano condicional/à escolha não coberto pelo motor padrão (2026-09)

Achado durante a auditoria do dado alternativo de Badalar Fúnebre (ver
`DECISOES-DADOS.md` "Dano alternativo condicional") — 3 padrões
DIFERENTES do dele, cada um precisaria do próprio campo/UI se algum dia
virar prioridade:
- **Destruição Divina**: soma um dado EXTRA (1d8, não substitui) se o
  alvo for Ínfero/Morto-vivo — hoje só rola o dano base, sem esse
  extra.
- **Golpe Certeiro / Bordão Místico**: o TIPO do dano (não a
  quantidade) é à escolha do jogador entre Radiante/Energético ou o
  tipo normal da arma — hoje só mostra 1 tipo fixo.
- **Palavra de Poder: Matar**: só rola 12d12 se o alvo tiver mais de
  100 PV; com 100 ou menos, o alvo simplesmente morre, sem rolagem —
  hoje sempre mostraria o botão de dano, mesmo quando a regra real é
  "morte instantânea".

## Explosão Repulsiva — empurrão de 3m não automatizado (2026-09)

O vínculo (qual truque) e a tag no Perfil já funcionam de verdade —
só o efeito em si (empurrar 3m um alvo Grande ou menor acertado pelo
truque vinculado) continua manual/narrativo, sem botão no Combat.
Baixa prioridade: efeito situacional, sem número pra calcular (é só
posição na mesa).

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

- **Dano dobra em crítico** — FEITO pros ataques de arma (2026-09, foco
  Melhorias e correções: `onAcertou({ critico })` + `core/danoCritico.ts`).
  Ataques de MAGIA também feitos. Só falta o Perfurador (+1 dado).
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

## Talentos Gerais — Agressor/Sentinela decidido não implementar (2026-09)

Osmar decidiu deixar esses 2 só como texto (`[PH]`) — mesmo espírito
do B.3 acima, nenhum vai ganhar mecânica de verdade; o jogador lembra
sozinho na mesa quando o gatilho acontecer. Esmagador/Talhador saíram
dessa lista (2026-09) — o app já sabe o tipo de dano do ataque
(`AtaqueInfo.danoTipo`), então o gatilho "ao causar dano Contundente/
Cortante" virou implementável de verdade (ver `DECISOES-COMBATE.md`
"Fluxo Acerto/Erro sem 'renunciar' nada antes"); só o bônus de Crítico
desses 2 (Vantagem/Desvantagem contra o alvo) ficou fora, decisão à
parte do Osmar (o app não modela turno/alvo nesse nível).

- **Agressor** (p.203) — trava dupla: a ação Correr no Combat só dá o
  Deslocamento padrão, sem lugar pra somar bônus condicional de
  talento; e precisa saber que o personagem "se moveu 3m+ em linha
  reta antes de acertar" — o app não rastreia movimento/distância
  percorrida no turno.
- **Sentinela** (p.207) — depende de saber quando OUTRA criatura
  (não o próprio personagem) é atacada ou Desengaja a 1,5m dele — isso
  é posição relativa entre vários combatentes; a ficha é individual,
  sem noção de "mapa" de quem está perto de quem.

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


## Talentos Gerais — reaudit 2026-09, decidido não implementar por ora (11 talentos)

Mesmo espírito das entradas acima (trava de Deslocamento/estado de
inimigo/monta/posição, que o app não modela) — achados na reaudit do
Grupo D (Talentos — Fase 4).

- **Atleta** (p.203) — Deslocamento de Escalada = normal, levantar de
  Caído com 1,5m, saltar após só 1,5m de movimento — mesma trava do
  Velocista/Agressor: a Ficha não tem campo de Deslocamento.
- **Ator** (p.203) — Vantagem em Atuação/Enganação pra disfarce +
  imitar sons/fala (CD pro ouvinte perceber) — mecanicamente é quase
  todo narrativo; baixo valor pra virar cálculo de verdade.
- **Combatente Montado** (p.204) — depende de sistema de montaria
  (PV/salvaguarda da montaria, redirecionar ataque), que não existe.
- **Conjurador Bélico** (p.204) — Reação de conjurar magia ao ser
  provocado (evitar Ataque de Oportunidade) — depende de saber quando
  o personagem É atacado/provocado, gatilho externo que o app não
  modela.
- **Duelista Defensivo** (p.205) — Reação ao SER acertado corpo a
  corpo (soma Bônus de Proficiência na CA) — mesma trava: o app não
  sabe quando um inimigo acerta o personagem.
- **Especialista em Besta** (p.206) — ataque bônus com besta Leve
  (parecido com Especialista Ambidestro, ver EmDev.md D.2), mas
  também ignora Recarga/desvantagem a queima-roupa — regras
  situacionais que a aba Combat não modela ainda; reconsiderar junto
  de Mestre-Atirador abaixo se esses conceitos entrarem no futuro.
- **Exterminador de Conjuradores** (p.206) — Desvantagem na
  salvaguarda de Concentração de um alvo — depende de saber se o
  ALVO está concentrando, estado de inimigo que o app não rastreia.
- **Imobilizador** (p.206) — Ataque Desarmado aplica a condição
  Imobilizado no alvo — condição de INIMIGO, que o app não rastreia
  (efeito precisa "grudar" no alvo entre turnos, diferente de
  Esmagador/Talhador, que só empurram/reduzem Deslocamento na hora,
  sem precisar lembrar disso depois).
- **Mestre em Armas de Haste** (p.207) — ataque bônus com a outra
  ponta da arma + Reação quando alguém entra no alcance — a 2ª parte
  depende de posição/movimento de inimigo, que o app não modela.
- **Mestre em Armaduras Pesadas** (p.207) — reduz dano recebido em
  Bônus de Proficiência — depende de rastrear "dano recebido" como
  evento (hoje PV é só ajustado manualmente com +/-, sem hook nenhum
  pra aplicar redução automática nele).
- **Mestre-Atirador** (p.207) — ignora Cobertura Parcial/¾, sem
  Desvantagem a queima-roupa ou no alcance máximo — Cobertura e as
  faixas de alcance com Desvantagem não são conceitos modelados na
  aba Combat hoje (ataque à distância é 1 rolagem simples).
