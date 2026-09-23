# SDD — Mago: Evocador (subclasse)

> Chapéu de Game Designer (CLAUDE.md §6.2), foco "Mago — Evocador".
> Planilha (aba Subclasses) cruzada com o Livro do Jogador (Cap. 3,
> ~p.155-156) — sem divergência de conteúdo, só o bug de extração de
> sempre (legenda de margem colada, ver seção 1).

## 1. Regra real e correções de dado

- **Truque Potente** (nível 3): "Seus truques que causam dano afetam
  até criaturas que evitam os efeitos deles. Ao conjurar um truque em
  uma criatura e errar o ataque ou o alvo ser bem-sucedido na
  salvaguarda contra o truque, ele sofre metade do dano (se houver),
  mas não sofre efeitos adicionais do truque."
- **Versado em Evocação** (nível 3): "Escolha duas magias de Mago da
  escola de Evocação, cada uma deve ser de 2º círculo ou inferior, e
  adicione-as gratuitamente ao seu livro de magias. Além disso, ao
  adquirir acesso a um novo círculo de espaços de magia nesta classe,
  você pode adicionar gratuitamente uma magia de Mago da escola de
  Evocação ao seu livro de magias. A magia escolhida deve ser de um
  círculo para o qual você tenha espaços de magia."
- **Esculpir Magias** (nível 6): "Você pode criar zonas de segurança
  nos efeitos das suas evocações. Ao conjurar uma magia de Evocação
  que afeta criaturas à sua vista, você pode escolher um número delas
  igual a 1 mais o círculo da magia. Criaturas escolhidas são
  bem-sucedidas automaticamente em suas salvaguardas e não sofrem
  dano se normalmente sofreriam metade do dano em caso de sucesso."
- **Evocação Potencializada** (nível 10): "Ao conjurar uma magia de
  Mago da escola de Evocação, você pode adicionar seu modificador de
  Inteligência a uma jogada de dano dessa magia."
- **Sobrecarga** (nível 14): "Você pode aumentar o poder de suas
  magias. Ao conjurar uma magia de Mago que cause dano com um espaço
  de magia de 1º a 5º círculo, você pode causar dano máximo com essa
  magia no turno no qual a conjurar. Ao fazer isso pela primeira vez,
  você não sofre nenhum efeito adverso. Se usar esta característica
  novamente antes de completar um Descanso Longo, você sofre 2d12
  pontos de dano Necrótico para cada círculo do espaço de magia
  imediatamente após conjurá-la. Esse dano ignora Resistência e
  Imunidade. Toda vez que você usa esta característica novamente antes
  de completar um Descanso Longo, o dano Necrótico por círculo de
  magia aumenta em 1d12." Planilha tinha a legenda de margem
  "Subclasse Evocador" colada no fim da célula — confirmado como
  artefato de página no PDF (mesmo bug já documentado no CLAUDE.md §8),
  cortado na importação.

Nenhuma das 5 características tem Ação Bônus/Reação — todas são
Passiva/Estática na planilha, e o texto confirma (Truque Potente/
Evocação Potencializada se aplicam DENTRO da própria ação de conjurar;
Esculpir Magias e Sobrecarga são escolhas feitas no momento de
conjurar, não uma ação própria).

## 2. O que já existe no motor (reaproveitar, não reinventar)

- **`core/necromante.ts`** é o precedente quase idêntico pra "Versado
  em Evocação": `magiasPeritoNecromanciaNesteNivel` (2 grátis no nível
  3, +1 a cada círculo novo depois) + `catalogoPeritoNecromancia`
  (filtra `magias` por `escola`). Diferença resolvida: Necromante NÃO
  restringe por classe (comentário do próprio arquivo confirma,
  proposital), mas o texto de Versado em Evocação diz "magias de
  MAGO" — o catálogo do Evocador precisa filtrar também
  `m.classes.includes('Mago')` (campo `classes: string[]` já existe em
  `Magia`, `data/rulesets/dnd2024/magias.ts:127`). "2º círculo ou
  inferior" no grant inicial (nível 3) é **redundante** com o círculo
  máximo de espaços do Mago nesse nível (nível 3 = círculo 2 máximo,
  ver `classes.ts:433`) — não precisa de cap separado, o mesmo filtro
  por `circuloMaximoNoNivel` (idêntico ao de Necromante) já resulta
  correto nos dois casos (grant inicial e grants seguintes por círculo
  novo).
- **`LevelUpShell.tsx`** já tem o wiring completo desse padrão
  ('peritoNecromancia' como `LuStep`, `useEscolhaMultipla`, checagem de
  quantidade, inclusão no payload de `onConfirmar`) — Versado em
  Evocação copia a mesma estrutura com um novo `LuStep`
  ('versadoEmEvocacao' ou nome equivalente) e o catálogo filtrado
  certo.
- **`core/conjurarMagia.ts`** (`decidirConjuracao`) já tem o padrão
  exato de "bônus condicional somado ao `mod` do dano, com linha extra
  na `explicacao`" — `bonusExplosaoAgonizante` (Bruxo, mod. de
  Carisma). Evocação Potencializada é o MESMO padrão: mod. de
  Inteligência somado quando `m.escola === 'Evocação' &&
  m.classes.includes('Mago')` e a classe ativa é Mago nível 10+.
  Sempre positivo pro jogador (só reduziria dano com INT negativo,
  praticamente impossível num Mago) — auto-aplicado, sem toggle.
- **`useUsarMagiaPainel.tsx`** (`conjurarMagia`) tem hoje
  `onErrou: () => {}` — no-op literal. Truque Potente (metade de dano
  no erro de truque de ataque) é o primeiro caso real que precisa
  preencher esse callback.
- **`CombatTab.tsx` `abrirSalvaguarda`** já rola o dano ANTES de abrir
  o popup e monta `textoFalhaSalvaguarda` combinando o número rolado
  com o texto da planilha. `magia.salvaguardaSucesso` hoje é só texto
  fixo da planilha (comentário no próprio arquivo, linha ~1169,
  confirma: "reconhecer TIPO de sucesso (metade/nenhum/cheio) precisa
  de coluna nova" — gap já conhecido). Truque Potente é a oportunidade
  de resolver esse gap, mas só pro caso Evocador+truque: quando a
  magia é truque (`circulo === 0`) e o personagem tem Truque Potente,
  o texto de Sucesso deixa de vir da planilha e passa a ser calculado
  (metade do `totalRolado`, arredondado pra baixo) + "sem efeitos
  adicionais".
- **`descansoLongo()`** (`FichaShell.tsx:1436`) é o resetter certo pro
  contador de Sobrecarga (ver seção 4) — mesmo padrão de
  `dadosDeVidaGastos`/outros campos zerados ali.
- **`core/recursosVisiveis.ts`** NÃO serve pra Sobrecarga (seção 4
  explica por quê) — mas é o padrão a olhar se algo aqui precisasse de
  pool com máximo fixo (não é o caso).

## 3. Decisões de leitura (confirmadas pelo Osmar — não precisa reconfirmar)

- **Truque Potente aplica em QUALQUER truque com dano que o Mago
  conjure, não só truques de Evocação.** O texto não restringe por
  escola ("seus truques que causam dano", sem qualificar escola) —
  diferente de Versado em Evocação/Evocação Potencializada/Sobrecarga
  (que restringem por escola ou por "magia de Mago"). Confirmado: não
  há necessidade de checar `escola` aqui, só `danoBaseDado != null &&
  circulo === 0`.
- **Esculpir Magias vira só texto (Perfil), sem card/toggle
  interativo.** A característica protege OUTRAS criaturas (aliados)
  de uma magia de área — o app não modela um roster de criaturas na
  cena (mesmo limite já aceito em toda a Ficha: `SalvaguardaDoAlvoModal`
  só informa CD/dano, o Mestre resolve quem é atingido e quem se
  salva na mesa). Não tem nada pro app calcular ou marcar — nem
  "quantas criaturas" muda um número que o app usa em algum lugar.
- **Sobrecarga + Crítico — confirmado.** "Causar dano máximo" (sem
  rolar dados) e "dobrar dados no crítico" são 2 regras que o livro
  não cobre cruzadas explicitamente. Leitura confirmada: Sobrecarga
  SUBSTITUI a rolagem de dano (não é "role e pegue o maior", é "não
  role, use o valor máximo possível") — se o ataque também for
  crítico, dobra os DADOS antes de aplicar o máximo (equivalente a
  "dano máximo de todos os dados, já contando o dobro do crítico"), já
  que a mecânica de crítico do app dobra a quantidade de dados antes
  de rolar (`core/danoCritico.ts`) e "dano máximo" é só "todo dado no
  valor mais alto possível" — aplicar depois de já saber quantos dados
  existem.

## 4. Decisões de implementação (chapéu de execução decide o detalhe fino por entrega)

- **Truque Potente — caso Ataque (errou):** preencher `onErrou` em
  `useUsarMagiaPainel.tsx` (só quando a subclasse ativa é Evocador
  nível 3+ e a magia é truque com `danoBaseDado`) — ao errar, rola o
  dano normal (mesma fórmula de sempre) e mostra um botão/label
  específico ("Truque Potente — metade do dano") que aplica
  `Math.floor(total / 2)` como resultado final antes de fechar, em vez
  do dano cheio. Não soma efeito adicional nenhum (o truque já não tem
  efeito de status modelado pelo app hoje, então isso não muda nada
  além do número).
- **Truque Potente — caso Salvaguarda (sucesso):** em
  `abrirSalvaguarda` (`CombatTab.tsx`), quando a magia é truque e a
  subclasse ativa é Evocador nível 3+, sobrescrever
  `textoSucesso`/mostrar o número: `${Math.floor(totalRolado / 2)} —
  sem efeitos adicionais` em vez do texto fixo de
  `magia.salvaguardaSucesso`. Falha continua igual (dano cheio, texto
  da planilha).
- **Versado em Evocação:** replica o wiring de Perito em Necromancia
  em `LevelUpShell.tsx` (novo `LuStep`, `catalogoVersadoEmEvocacao`
  filtrando `escola === 'Evocação' && classes.includes('Mago') &&
  circulo <= circuloMaximoNoNivel`, mesma função de contagem de
  bônus-por-nível). Nome da função em `core/evocador.ts` (arquivo novo,
  mesmo padrão de `core/raizesDevastadoras.ts` — característica
  própria, não acopla ao nome de Necromante).
- **Esculpir Magias:** nenhum código de mecânica — só aparece no
  Perfil (lista de características da subclasse), sem `[PH]` (é texto
  de regra real, só sem interação, igual às ações genéricas do Cap.
  1 — CLAUDE.md §12).
- **Evocação Potencializada:** somado dentro de
  `decidirConjuracao`/`abrirSalvaguarda`, mesmo padrão de
  `bonusExplosaoAgonizante` — checa `subclasseAtiva === 'Evocador' &&
  nivel >= 10 && m.escola === 'Evocação' && m.classes.includes('Mago')`,
  soma `modInt` ao `mod` do dano (com linha própria na `explicacao`,
  "Evocação Potencializada"). Aplica tanto no caminho de Ataque quanto
  no de Salvaguarda (os dois já passam pelo mesmo cálculo de dano
  base).
- **Sobrecarga:** estado novo em `FichaShell.tsx`
  (`sobrecargaUsosDesdeDescanso: number`, default 0, resetado dentro de
  `descansoLongo()`) — NÃO entra em `recursosVisiveis.ts` (esse
  arquivo é só pra pools com `maximo` fixo; Sobrecarga não tem teto,
  só escala). Card na tela de "Rolar Dano" de qualquer magia de Mago
  com dano e espaço gasto de círculo 1-5 (Ação/Ação Bônus/Reação,
  onde já se usa magia): oferece "☠️ Sobrecarga — dano máximo" como
  opção alternativa ao botão normal de rolar; ao tocar, aplica dano
  máximo (ver fórmula de leitura da seção 3) e, se
  `sobrecargaUsosDesdeDescanso > 0`, imediatamente sequencia um popup
  de dano Necrótico auto-infligido (`(1 + sobrecargaUsosDesdeDescanso)
  d12 × círculo do espaço gasto`, ignora Resistência/Imunidade —
  informativo, o app não modela Resistência/Imunidade de qualquer
  forma) antes de incrementar o contador.

## 5. Quebra em entregas

1. **Entrega 1** — Dado no banco: as 5 características em
   `caracteristicasSubclasse.ts`, com a legenda de margem cortada em
   Sobrecarga. Confirma Evocador selecionável + aparece no Perfil
   (inclui Esculpir Magias, que fecha nesta entrega — só texto).
2. **Entrega 2** — Versado em Evocação (nível 3): `core/evocador.ts` +
   wiring em `LevelUpShell.tsx`, catálogo restrito a
   Evocação+Mago+círculo disponível.
3. **Entrega 3** — Truque Potente (nível 3): metade de dano no erro
   (ataque) e no sucesso da salvaguarda (truque), sem efeito adicional.
4. **Entrega 4** — Evocação Potencializada (nível 10): mod. de
   Inteligência somado ao dano de magia de Evocação de Mago.
5. **Entrega 5** — Sobrecarga (nível 14): dano máximo opcional +
   contador de usos desde o Descanso Longo + dano Necrótico
   auto-infligido escalando.
6. **Entrega 6** — Fechamento: testes/tsc/build,
   `aprendizados/classes/mago.md` (ou equivalente, criar se não
   existir) atualizado, `PENDENCIAS.md` "Escolha de subclasse — versão
   placeholder" perde o Evocador da lista.
