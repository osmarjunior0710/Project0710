# EmDev.md

> Arquivo da conta principal / branch padrão (ver seção 14.1 do
> `CLAUDE.md`). A outra conta usa `EmDevB.md` — nunca escreva aqui a
> partir da branch `claude/read-claude-md-c75hsf`.
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

## Foco: classe Psiônico (Unearthed Arcana 2025, não oficial)

Fonte e quebra: `sdd/sdd-psionico.md` (decisões 2.1). Abordagem aprovada: Psiônico nível 20 no Char Multiclasse com tudo [PH], implementando aos poucos.

- [x] E1a — esqueleto: classe (tabelas conferidas vs PDF), 12 características com texto literal [PH], proficiências, equipamento, conjurador completo, cor provisória, Char Multiclasse nível 20, teste de integridade.  (wizard mostra "em breve").
- [ ] E1b — (adiado por decisão do Osmar, junto das E6a-d) 4 subclasses (homebrew:true) + 28 características [PH]; hoje o Char usa subclasse null.
- [x] E2 — lista de magias do Psiônico (143 do PDF) + 18 magias novas UA (inclui Animar Mortos); conferido nas abas Magias e Combate (360px).
- [x] E3a — contador de Dados de Energia Psiônica (Combate), descansos Curto (-1) e Longo (todos). Conferido em 360px.
- [x] E3c — Conexão Telepática (Ação Bônus: rola o dado, grátis 1x por Descanso Longo, anota alcance). Conferido em 360px.
- [x] E3d — Telecinese Sutil (Mãos Mágicas de graça, fora do limite de truques). Conferido em Magias e Combate (360px).
- [x] E3b — Impulso Telecinético (Ação Bônus; sem dado 1,5 m ou com dado 5 m x resultado, dado só gasto se o alvo falhar). Conferido em 360px. E3 completo.
- [x] E4a — escolha das Disciplinas Psiônicas (Level Up nível 2: 2, +1 em 5/10/13/17, troca 1 por nível), Perfil, Char Multiclasse, regra do turno (1 por turno, 1 vez cada, exceções Defesa Psiônica e Mente Aguçada) no core com testes. Conferido em 360px.
- [x] E4b — Consciência Expandida, Língua Diabólica, Mente Atenta, Mira Inerrante: botão +nDx no popup de rolagem (perícia da ação ou ataque), dado só gasto se der certo, bloqueio 1 disciplina por turno. Conferido em 360px.
- [x] E4c — Aperfeiçoamento de Precognição, Bio-Retorno, Insinuação do Id, Pensamentos Destrutivos: gatilho novo `GatilhoDisciplina` `{tipo: 'conjuracao', escolas, exigeSalvaguarda?}` em `disciplinasPsionicas.ts` (dado) + `disciplinaParaConjuracao` (core); `decidirConjuracao` ganhou `disciplinaPosConjuracao` (igual padrão Colheita Macabra), plugado nos 3 call sites (MagiasTab/useUsarMagiaPainel/ReacaoPanelContent). Popup novo `DisciplinaPosConjuracaoModal.tsx` (Sim/Não) + resultado via `AvisoModal.tsx` reaproveitado, ambos vivendo no `FichaShell.tsx` (sobrevivem à troca de aba, igual Colheita Macabra) — `usarDisciplinaPosConjuracao` rola os dados (ou aplica o mínimo de 1 direto quando mod. INT ≤ 0, sem dado pra rolar) e aplica cada efeito (Bio-Retorno vira PV Temporário de verdade via `ganharPvTemporario`; os outros 3 são texto informativo). Testado ao vivo (Insinuação do Id com Enfeitiçar Pessoa — popup, dado, resultado "subtrai N"; Bio-Retorno com Aumentar/Reduzir — 4 dados = mod. INT, PV Temporário aplicado de verdade no Combate "+21 temp"). Pensamentos Destrutivos não está nas 6 disciplinas padrão do Char Multiclasse (slice alfabético), mesma lógica validada pelos testes de `core/`. `npx tsc -b`, `npm test -- --run` (1017/1017), `npm run build` verdes.
- [x] E4c.1 — 2 ajustes do Osmar testando ao vivo: (1) botão "Gastar N Dado(s)" do `DisciplinaPosConjuracaoModal` trocou o texto "(N restantes)" por `TickPips` de verdade (mesmo componente usado em todo recurso com contador — `LICOES-RAPIDAS.md`/`CONVENCOES-UI.md` "pips já mostram a quantidade"); (2) Insinuação do Id/Pensamentos Destrutivos sempre vêm de magia com salvaguarda — abrir o popup da Disciplina E o `SalvaguardaDoAlvoModal` ao mesmo tempo fazia o resultado da Disciplina "sumir" atrás do segundo popup (Osmar reportou "rolei o dado mas não aparece em lugar nenhum"). Corrigido adiando a abertura da Salvaguarda até a Disciplina resolver (`aoResolverSalvaguarda` em `DisciplinaPosConjuracaoPendente`, novo tipo exportado de `core/conjurarMagia.ts`) — o texto do resultado vira linha extra (`🔮 Dado Psiônico: <nome> — <texto>`) DENTRO do próprio popup de Salvaguarda, via o campo `aviso` que já existia (pedido explícito do Osmar: "mais uma linha depois do sucesso/falha"). Mudou em `CombatTab.tsx` (`abrirSalvaguarda` ganhou 3º parâmetro) e `MagiasTab.tsx` (extraiu `abrirSalvaguardaComAviso`, cópia do mesmo fluxo). Testado ao vivo: Insinuação do Id com Enfeitiçar Pessoa — só 1 popup por vez, resultado aparece certinho dentro da tela de Enfeitiçar Pessoa; Aperfeiçoamento de Precognição com Contramagia continua no `AvisoModal` separado de sempre (nunca tem salvaguarda, não muda). `npx tsc -b`, `npm test -- --run` (1017/1017), `npm run build` verdes.
- [x] E4c.2 — Osmar testou de novo e os pips do item (1) acima tinham 2 problemas: apareciam sozinhos (sem rótulo, sem o padrão "nome à esquerda, pips à direita" usado em `RecursosDeClasse.tsx`) e com a cor azul padrão em vez da cor roxa do Psiônico (`corRecursoClasse.ts`). Corrigido: linha agora é `Dados de Energia Psiônica (dN) ⟷ pips`, mesmo rótulo/layout usado no resto do app, com `cor={corDoRecursoDaClasse('Psiônico')}` no `TickPips`. `npx tsc -b`, `npm test -- --run` (1017/1017), `npm run build` verdes.
- [x] E4d-a — Defesa Psiônica: card novo em Combate (igual padrão "Defesa Superior" do Monge), toque em "Ativar" gasta 1 Dado de Energia Psiônica sem rolar nada (`core/defesaPsionica.ts`). Redesenhado depois do feedback do Osmar sobre os 2 chapéus novos (QA/Jogador leigo + nunca deixar manual o que dá pra automatizar, CLAUDE.md §6.4 regras 5-6): NUNCA precisa de botão de encerrar manual — a Vantagem na Salvaguarda de Inteligência já entra sozinha (mesmo padrão de "Sentido de Perigo" em `AtributosTab.tsx`, com label "(Vantagem — Defesa Psiônica)" do lado da linha), e o estado ativo encerra sozinho no "Fim do Turno" E também no Descanso Curto E no Descanso Longo (pedido extra do Osmar: a duração "até o início do próximo turno" é bem menor que 1h/8h dos descansos, então os 2 também têm que encerrar). Imunidade a Amedrontado/Enfeitiçado é só texto informativo no card (app não tem rastreador de condição própria do personagem pra automatizar essa parte). Testado ao vivo em 390px: ativar gasta o dado (pip cinza), label de Vantagem aparece na Salvaguarda de Inteligência, "Fim do Turno" e "Descanso Curto" (via FAB de Ações Rápidas) encerram sozinhos e voltam o card pro estado "Ativar". `npx tsc -b`, `npm test -- --run` (1019/1019), `npm run build` verdes.
- [x] E4d-b — Mente Aguçada (estado entre turnos). Quebra feita: (1) Ativar (1 dado, rola e anota) + "Ignorando Psiônicos" (texto informativo, 1 minuto/até Incapacitado — encerramento manual, igual Defesa Superior, NÃO dá pra automatizar por Fim do Turno porque a duração real não bate com 1 turno); (2) "Modo de Ataque" (1x/turno, trocar o MENOR dado de um dano Psíquico pelo número anotado) — confirmado só magias causam dano Psíquico no app (nenhuma arma), + a Disciplina Pensamentos Destrutivos (já implementada, caminho separado em `FichaShell.tsx`). Motor de dado (`RollContext`) já guarda cada dado individual em `estado.dadosIndividuais` quando a rolagem tem 2+ dados (mesma infra do Perfurador) — dá pra ler sem mexer no motor. Protótipo em `/prototipo/mente-agucada` (`MenteAgucadaCena.tsx`) valida o fluxo: ativa → simula dano de magia (2+ dados) → o app acha sozinho o menor dado e só oferece a troca quando o anotado é MAIOR (nunca pergunta quando trocar seria pior, pedido do Osmar — decisão "óbvia" não vira escolha manual). Osmar testou e achou 1 bug de UI: o botão de troca apareceu atrás do popup de dano em vez de dentro dele. Corrigido — `ConfirmarFechamento` (`RollContext.tsx`) ganhou suporte a `rotulo` como FUNÇÃO `(estado) => string | null` (só resolve depois da rolagem concluir, com os dados já definidos; `null` esconde o botão) — o popup de dano agora ganha um 2º botão nativo "🔮 Trocar menor resultado (N) por (Y)" ao lado do "OK", só quando compensa. `aoTocar` lê um `useRef` (não o `estado` do hook, que já virou `null` pelo `fechar()` no instante do toque) pra pegar o resultado certo. Validado ao vivo: troca aplica e soma certo no total, trava "1x por turno" funciona (2ª rolagem no mesmo turno só mostra "OK"). `npx tsc -b`, `npm test -- --run` (1019/1019), `npm run build` verdes. 2ª rodada de feedback do Osmar: não gostou do botão ao lado do "OK" — pediu TÍTULO + CARD CLICÁVEL empilhados abaixo do total (dentro do mesmo popup), card vira cinza quando usado, efeito visual no dado trocado + no total atualizando. Trocado o mecanismo: `RollContext` ganhou `OfertaTrocaDeDado` (título + `avaliar(estado) => {texto, dadoId, novoValor} | null`, mostrado como título+card empilhados, nunca ao lado de outro botão) + `trocarOfertaDeDado()` (aplica a troca DENTRO do próprio contexto — marca `trocado: true` no `DadoIndividual`, recalcula o total, trava "1x" via `ofertaTrocaDeDadoUsada`). `RollOverlay` ganhou CSS novo: `.dieTrocado` (giro + anel roxo no dado trocado), `.totalAtualizado` (pulso no total), `.ofertaCard`/`.ofertaCardUsada` (card roxo clicável / cinza desabilitado). A cena não precisa mais de `useRef` nem cálculo próprio de "menor dado" fora do `avaliar` — o app cuida de tudo, a cena só reage via `useEffect` quando `ofertaTrocaDeDadoUsada` vira `true` pra travar o turno/logar. Validado ao vivo: dado trocado (1→12) com anel roxo, total pulsando (22→33), card "Já usada nesta rolagem" em cinza. `npx tsc -b`, `npm test -- --run` (1019/1019), `npm run build` verdes. Osmar aprovou o protótipo final ("Agora sim! É isso") — levado pra produção na mesma entrega. `core/menteAgucada.ts` novo: `temMenteAgucada`/`podeAtivarMenteAgucada` (padrão Defesa Psiônica) + `avaliarTrocaMenteAgucada` (lógica pura do "Modo de Ataque": sempre o menor dado, só quando o anotado é maior — mesma função usada nos 6 pontos de injeção, sem duplicar). `ui/roll/ofertaMenteAgucada.ts` novo: monta `OfertaTrocaDeDado` a partir de `(tipoDano, ativa, anotado, usadoNesteTurno, onTrocado)` — `undefined` quando não ativa ou dano não é Psíquico, reaproveitado em TODOS os pontos. Card em Combate (padrão Defesa Superior — encerramento manual, já que "1 minuto" não bate com nenhum gatilho automático do app) com o número anotado mostrado na descrição; Descanso Curto/Longo encerram sozinhos (mesmo raciocínio de Defesa Psiônica: 1h/8h é bem mais longo que "1 minuto"). "Modo de Ataque" ligado em 6 lugares: `CombatTab.abrirSalvaguarda` (Ação/Bônus), `MagiasTab.abrirSalvaguardaComAviso`, `ReacaoPanelContent` (salvaguarda + ataque-acerto), `useUsarMagiaPainel` (ataque-acerto, Ação/Bônus) e Pensamentos Destrutivos em `FichaShell.usarDisciplinaPosConjuracao`. `core/conjurarMagia.ts` ganhou `tipo` em `DanoPendenteMagia`/`RollDadosSpec` (faltava pro caminho de "ataque", só "salvaguarda" já tinha). Achado 2 bugs de staleness durante a implementação (não testados ao vivo, corrigidos por inspeção de código): (1) `totalRolado`/`somaDados` capturados ANTES da troca (em `onResultado`) nunca refletiam o valor trocado DEPOIS — corrigido com `onTrocado(novoTotal)` (RollContext passa o total já recalculado) atualizando a variável capturada; (2) Pensamentos Destrutivos aplicava o efeito (`aplicar()`) direto no `onResultado`, antes do jogador poder trocar — corrigido movendo `aplicar()` pra dentro de `confirmarFechamento.aoTocar` (só roda quando o popup fecha, com a soma já final). Testado ao vivo em 390px: Defesa Psiônica (mesma família de card) continua funcionando sem regressão. `npx tsc -b`, `npm test -- --run` (1025/1025), `npm run build` verdes. **Resolvido depois** (pedido do Osmar: "vale você forçar essa habilidade... pra podermos ficar testando coisas") — Mente Aguçada não estava nas 6 disciplinas padrão do Char Multiclasse (slice alfabético, mesma limitação de Pensamentos Destrutivos). `core/personagemTesteMulticlasse.ts` trocou o slice alfabético por uma ordem explícita (`ORDEM_TESTE_DISCIPLINAS_PSIONICAS`) priorizando mecânicas distintas — as 4 que só somam 1 dado numa perícia (Consciência Expandida/Língua Diabólica/Mente Atenta/Mira Inerrante) são idênticas entre si, 1 já cobre o grupo. Testado ao vivo de ponta a ponta: card aparece, Ativar rola e anota (d12), conjurar Grito Psíquico (14d6 Psíquico) mostra "Mente Aguçada" + card de troca dentro do popup, trocar o menor dado funciona (giro + anel roxo, total atualiza certo), e o total JÁ TROCADO chega correto na tela de Sucesso/Falha da Salvaguarda (confirma que os 2 bugs de staleness corrigidos por inspeção de código estavam certos). `npx tsc -b`, `npm test -- --run` (1025/1025), `npm run build` verdes.
- [x] E4d-c — Retaliação Psíquica (Reação): card novo no painel de Reação (grupo "Psiônico"), gasta 1 Dado de Energia Psiônica, rola, calcula a redução (`reducaoRetaliacaoPsiquica` em `core/retaliacaoPsiquica.ts` = 2×dado + mod. Inteligência, mínimo 2) e abre `SalvaguardaDoAlvoModal` — mesmo componente que Defletir Ataques (Monge) já usa pra "Redirecionar", reaproveitado sem mudança nenhuma. Sucesso e Falha mostram a redução (vale sempre) + Falha soma o dano Psíquico extra no atacante — os 2 números já calculados juntos, na mesma tela (o app não tem ficha de monstro pra aplicar isso sozinho, igual todo o resto dessa família: Defletir Ataques, Ataque de Sopro, Lançar no Inferno). CD = a mesma CD de conjuração do Psiônico já usada no Impulso Telecinético (`cdImpulso`). Com essa entrega, **as 11 Disciplinas Psiônicas estão 100% implementadas** — `disciplinasPsionicas.ts` não tem mais nenhuma `placeholder-*`, constante `PH` removida do arquivo. `core/personagemTesteMulticlasse.ts` ganhou Retaliação Psíquica na ordem de teste (trocou Aperfeiçoamento de Precognição, já bem testado antes, por ela). Testado ao vivo em 390px: card aparece no grupo "Psiônico" da Reação, rola (5 no d12), CD 18, "Reduza 14... e o atacante sofre 14 de dano Psíquico" (Falha) / "Reduza 14..." (Sucesso), "Reação" marca usada. `npx tsc -b`, `npm test -- --run` (1029/1029), `npm run build` verdes.
- [x] E4d-c.1 — Osmar testou Retaliação Psíquica e reportou "tirei 1 no dado e deu 4 de redução" — investigado: a conta estava certa (2×dado + mod. Inteligência do personagem dele, não do Char Multiclasse), o problema real era a tela não explicar de onde veio o número. Adicionado `explicarReducaoRetaliacaoPsiquica` (`core/retaliacaoPsiquica.ts`, com teste) e um novo prop genérico `explicacaoResultado` no `SalvaguardaDoAlvoModal` (ⓘ "Como foi calculado" abaixo do texto de Sucesso, reaproveitável por qualquer entrega futura que use esse popup com número calculado — CLAUDE.md §6.5) — só ligado em Retaliação Psíquica por ora. `npx tsc -b`, `npm test -- --run` (1031/1031), `npm run build` verdes. **Não testado ao vivo na tela nesta rodada** (sem navegador disponível nesta sessão) — pedir ao Osmar pra confirmar o ⓘ no celular antes de considerar 100% fechado.
- [x] E5a — Restauração Psiônica (nível 5): card novo em Combate (grupo Psiônico, mesmo padrão "opt-card" de Defesa Psiônica/Mente Aguçada), fora da economia de Ação/Bônus/Reação (meditação de 1 minuto, igual Astúcia Mágica do Bruxo — botão de 3 estados: disponível/já usada/nada a recuperar). Toque recupera TODOS os Dados de Energia Psiônica gastos de uma vez (sem rolar dado), 1x por Descanso Longo (`restauracaoPsionicaUsada`, reseta junto dos outros recursos Psiônicos no Descanso Longo). `core/restauracaoPsionica.ts` novo (`temRestauracaoPsionica`/`podeUsarRestauracaoPsionica`, com testes). `npx tsc -b`, `npm test -- --run` (1033/1033), `npm run build` verdes. **Não testado ao vivo na tela** (sem navegador disponível nesta sessão) — pedir ao Osmar pra confirmar o card em Combate antes de fechar.
- [x] E5b — Reservas Psiônicas (nível 18): automático em TODA rolagem de Iniciativa (sem escolha do jogador — mesmo molde de Foco Perfeito do Monge, `core/focoPerfeito.ts`), recupera Dados de Energia Psiônica gastos até ter 4, se tiver 3 ou menos. `core/reservasPsionicas.ts` novo (`dadosRecuperadosReservasPsionicas`, com testes). `alternarIniciativa` (CombatTab) ganhou `aplicarReservasPsionicas()` ao lado de `aplicarFocoPerfeito()` — as 2 agora retornam a mensagem (em vez de chamar `setFeedback` cada uma) e são combinadas numa string só, porque o Char Multiclasse tem Monge 15+ E Psiônico 18+ ao mesmo tempo — sem isso, uma mensagem sobrescreveria a outra quando as 2 disparassem juntas na mesma Iniciativa. `npx tsc -b`, `npm test -- --run` (1037/1037), `npm run build` verdes. Osmar confirmou ao vivo: funcionando.
- [x] E5c — Surto Psiônico (nível 7): depois de o Osmar sugerir um "funil único" pra evitar esquecer de ligar o Surto numa
  característica futura, o motor de dado (`RollContext.tsx`) ganhou essa capacidade de forma genérica — ver
  `DECISOES-CLASSES.md` "Surto Psiônico — funil único" pro padrão completo. Resumo técnico: `RollDadosOptions` ganhou
  `ehDadoDeEnergiaPsionica`/`forcarGrid`/`onSurtoPsionicoAplicado`; novo `SurtoPsionicoProvider` registrado 1x
  (`registrarSurtoPsionico`, mesmo padrão de `registrarDadoPsionico`) decide sozinho quando oferecer (nível 7+, tem Dado de
  Vida, rolagem marcada OU com `dadoPsionico.valores`, 1+ valor ≤3) — `ofertaSurtoPsionico`/`aplicarSurtoPsionico` novos no
  contexto; card "⚡ Surto Psiônico" novo no `RollOverlay.tsx`, 2º slot independente do card de troca da Mente Aguçada (os
  dois podem aparecer juntos no mesmo popup). Novo funil `ui/roll/rolarDadoDeEnergiaPsionica.ts` troca `rolarDados` direto
  em Conexão Telepática, Mente Aguçada (ativação), Retaliação Psíquica, Impulso Telecinético e a rolagem das disciplinas de
  conjuração (Bio-Retorno etc.) — as 4 disciplinas "+nDx num teste/ataque" (Consciência Expandida etc.) já ganham o Surto de
  graça, sem nenhuma mudança nelas, por já usarem o mecanismo pré-existente `DadoPsionicoProvider`. `core/surtoPsionico.ts`
  novo (`temSurtoPsionico`/`dadosElegiveisSurtoPsionico`/`aplicarSurtoPsionicoEmValores`, com testes). `gastar` do provider
  desconta sempre o MENOR tipo de Dado de Vida disponível (poupa os maiores pra cura). 3 dos 5 call sites migrados (Mente
  Aguçada, disciplinas de conjuração, Retaliação Psíquica) já tinham ou ganharam o cuidado de só aplicar o resultado ao
  FECHAR o popup (`confirmarFechamento.aoTocar`) — Conexão Telepática e Impulso Telecinético também passaram a fechar assim
  (antes aplicavam direto em `onResultado`), pro Surto não poder "sumir" atrás de um valor já aplicado antes de rolar.
  `npx tsc -b`, `npm test -- --run` (1040/1040), `npm run build` verdes. Osmar testou ao vivo (Bio-Retorno) e confirmou:
  funcionando.
- [x] E5c.1 — Osmar testou ao vivo (Bio-Retorno, 3d12: 1/1/6) e achou 2 problemas de UX: (1) não entendeu o que o botão
  fazia só pelo texto corrido; (2) não tinha como saber quantos Dados de Vida tinha sobrando pra decidir se valia a pena
  (Dado de Vida não tem pips visíveis na aba Combate, diferente do Dado de Energia Psiônica). Corrigido: `ofertaSurtoPsionico`
  virou `{titulo, descricao}` em vez de 1 string só — `titulo` = a AÇÃO (ex.: "Gastar 1 Dado de Vida (d12, 5 restantes)"),
  `descricao` = o EFEITO (ex.: "Resultados 1, 2 ou 3 viram 4 (2 dados afetados)"), empilhados dentro do mesmo card
  (`.ofertaCardDuasLinhas` novo no CSS). `SurtoPsionicoProvider` ganhou `proximoTipo: {tipo, restantes}` (o tipo que
  `gastar` vai descontar, calculado em `FichaShell.tsx` a partir de `reservaDadosDeVida`) pra montar o texto sem o jogador
  precisar ir atrás da informação em outra tela. `npx tsc -b`, `npm test -- --run` (1040/1040), `npm run build` verdes.
  Osmar confirmou ao vivo: funcionando.
- [x] E5c.2 — Osmar testou com 0 Dados de Energia Psiônica restantes e achou o botão "Gastar N Dados..." do
  `DisciplinaPosConjuracaoModal` (Bio-Retorno etc.) ainda parecendo disponível (azul forte) mesmo desabilitado —
  a lógica já bloqueava o clique (`pointerEvents: 'none'`), mas `opacity: 0.5` sobre `btn-primary` (azul/negrito)
  continuava lendo como "clicável". Corrigido reaproveitando o padrão de `EscolherEfeitoModal.tsx`: classe
  `btn-disabled` (opacity 0.35, já usada em outros lugares do app) em vez de opacity solta, + o texto do botão
  passou a dizer POR QUE está desabilitado ("Sem Dados de Energia Psiônica suficientes") em vez de só repetir o
  custo. Conferi `ImpulsoTelecineticoModal.tsx`/`CombatTab.tsx` (outros botões Psiônico) — sem o mesmo problema.
  Achado ~8 outros arquivos fora do foco Psiônico com a MESMA combinação (`btn btn-primary` + desabilitar
  condicional) ainda não auditados — anotado em `LICOES-RAPIDAS.md` (1ª ocorrência; se aparecer de novo em
  outro foco, vira regra permanente). `npx tsc -b`, `npm test -- --run` (1040/1040), `npm run build` verdes.
- [x] E5c.3 — Osmar achou o layout do card de Surto "triste": o título "⚡ Surto Psiônico" ficava boiando
  solto ACIMA do card roxo (via `.ofertaTitulo`, pensado só pra rótulo curto de 1 linha), e dentro do card
  a linha de AÇÃO ("Gastar 1 Dado de Vida...") acabava lendo como se fosse o título, com a descrição do
  efeito como legenda pequena embaixo — sem hierarquia clara. Corrigido: título da característica agora
  DENTRO do próprio card, como a linha mais proeminente (15px negrito), com a ação (13px) e o efeito (11px,
  mais apagado) empilhados abaixo — 3 linhas, todas centralizadas (elogiado pelo Osmar: "ficou ótimo pra
  ler"). `.ofertaCardTitulo`/`.ofertaCardSurto` novos no CSS; estado "já usada" também simplificado pra 1
  linha só dentro do mesmo card, sem título solto fora. `npx tsc -b`, `npm test -- --run` (1040/1040),
  `npm run build` verdes.
- [x] E5d-prep — Flag `temContextoDeTurno` (preparação pro E5d, sugerida pelo Osmar): corrigido bug latente no Modo de
  Ataque da Mente Aguçada (já publicado) — a troca é oferecida tanto em rolagens da aba Combate (COM turno) quanto da
  aba Magias (SEM turno, sem Ação/Bônus/Reação), mas `menteAgucadaUsadaNoTurno` só zerava no "Fim do Turno" (botão que
  só existe na aba Combate). Conjurar pela aba Magias fora de combate, depois de já ter usado a troca numa luta
  anterior, travava a troca pra sempre sem motivo. Corrigido generalizando o precedente de
  `rolagemTemLimiteDeTurno()` (já usado pelas Disciplinas de ataque): `DisciplinaPosConjuracaoPendente.temContextoDeTurno`
  novo (`core/conjurarMagia.ts`), preenchido certo nos 3 pontos que decidem a conjuração
  (`useUsarMagiaPainel.tsx`/`ReacaoPanelContent.tsx` = `true`, `MagiasTab.tsx` = `false`) e repassado pros 9 call sites
  de `ofertaMenteAgucada` — sem contexto de turno, a troca sempre é oferecida E nunca trava o turno de verdade na aba
  Combate depois. Padrão documentado em `DECISOES-CLASSES.md` "Efeito '1x por turno' ligado a conjuração". Prop
  `onMenteAgucadaTrocada` removido de `MagiasTab.tsx` (ficou morto). `npx tsc -b`, `npm test -- --run` (1041/1041),
  `npm run build` verdes. Osmar confirmou ao vivo: Modo de Ataque continua funcionando igual na aba Combate.
- [x] E5d — Força Vital Incandescente (nível 20): mesma superfície do Surto Psiônico (`ehDadoDeEnergiaPsionica` OU
  `dadoPsionico`), mas rola dado(s) NOVO(S) de verdade (2D, sem motor 3D nesta 1ª versão — ver pendência abaixo) em vez
  de só transformar os já rolados, e respeita "1x por turno" de verdade usando a flag `temContextoDeTurno` preparada no
  E5d-prep. Card com 2 botões ("Gastar 1 Dado de Vida"/"Gastar 2 Dados de Vida", o 2º só aparece se tiver 2+ restantes;
  card inteiro some com 0 restantes). `core/forcaVitalIncandescente.ts` novo (`temForcaVitalIncandescente`/
  `maximoDadosDeVidaForcaVital`, com testes). Motor (`RollContext.tsx`) ganhou `ForcaVitalIncandescenteProvider`
  (registrado 1x, mesmo padrão de `SurtoPsionicoProvider`), `RollState.forcaVital`/`temContextoDeTurno`,
  `ofertaForcaVitalIncandescente`/`aplicarForcaVitalIncandescente`/`onForcaVitalAplicada` novos — "tem contexto de
  turno" lido POR ROLAGEM: grid usa `estado.temContextoDeTurno` (ausente = true, os 4 pontos que usam o funil sem
  passar nada são exclusivos da aba Combate), `dadoPsionico` reaproveita `opcao.limitaPorTurno` (já existia pra "1
  disciplina por turno"). `gastarDadosDeVida` desconta o(s) MENOR(ES) tipo(s) primeiro, cruzando tipos se precisar.
  Todos os 5 pontos que usam o funil (`rolarDadoDeEnergiaPsionica`) ganharam `onForcaVitalAplicada` (mesmo cuidado de
  staleness do Surto). `npx tsc -b`, `npm test -- --run` (1044/1044), `npm run build` verdes. **Pendência conhecida,
  registrada em PENDENCIAS.md**: os dados extra rolam só em 2D (sem física do motor 3D) — diferente do resto do app,
  que já usa 3D quando ativo; aceitável pra 1ª entrega, mas inconsistente visualmente.
- [x] E5d.1 — Osmar testou ao vivo e achou o mesmo problema já corrigido no Surto Psiônico (E5c.1): os 2 botões não
  diziam quantos Dados de Vida sobravam pra decidir se valia a pena. Corrigido igual: `ForcaVitalIncandescenteProvider`
  ganhou `totalDisponivel` (contagem real, sem o teto de 2 do `maximo`), repassado em `ofertaForcaVitalIncandescente` e
  mostrado em cada botão ("Gastar 1 Dado de Vida (N disponíveis) — rola +1 dado extra"). `npx tsc -b`,
  `npm test -- --run` (1044/1044), `npm run build` verdes. Osmar testou ao vivo e confirmou: "Sucesso, tudo
  funcional" — E5 (a/b/c/d) e a flag `temContextoDeTurno` 100% validados na tela.
- [ ] E6a-d — subclasses (4, homebrew). E7 — Talentos Selvagens. Com E5 completo, só falta isso pra fechar o foco inteiro.
  - Começando por **Psicinético** (técnica telecinética, escolhida pelo Osmar). SDD em `sdd/sdd-psionico.md`
    linhas ~1000-1095 (texto literal do UA) + de-para das 10 magias confirmado contra o catálogo ("Muralha de
    Força" do UA = "Muralha de Energia" já importado, tradução oficial diferente da tradução de fã do UA).
  - [x] E6c-a — Magias do Psicinético (nível 3): sempre preparadas, cresce por nível (3/5/7/9), mesmo molde de
    `magiasJuramentoDaDevocao.ts`. `subclasses.ts` ganhou as 4 subclasses do Psiônico (homebrew: true) — só
    Psicinético implementada (mesmo padrão do Monge: as outras 3 aparecem mas `subclasseImplementada` ainda
    não libera). Novo ID `magiasDoPsicinetico` em `idsCaracteristicasSubclasse.ts`; entrada nova em
    `caracteristicasSubclasse.ts` com `magiasFixasPorNivel: {3: [Nuvem de Adagas, Levitação, Escudo Arcano,
    Onda Trovejante], 5: [Lentidão, Esmagamento Telecinético], 7: [Esfera Resiliente de Otiluke, Moldar
    Rochas], 9: [Telecinese, Muralha de Energia]}`. `core/magiasPsicinetico.ts` novo, com testes. Wirado em
    `useMagiasEConjuracao.ts` (spread em `magiasConjuraveis`, cobre Combate E Magias de uma vez, CLAUDE.md
    §6.6) e `MagiasTab.tsx` (seção própria "Magias do Psicinético", padrão de Juramento da Devoção).
    `core/personagemTesteMulticlasse.ts`: subclasse do Psiônico agora é 'Psicinético' (era `null`).
    `npx tsc -b`, `npm test -- --run` (1054/1054), `npm run build` verdes. **Não testado ao vivo na tela**
    (sem navegador disponível nesta sessão) — pedir ao Osmar pra confirmar a seção na aba Magias e o picker
    "Usar Magia" da aba Combate antes de considerar 100% fechado.
  - [x] E6c-a.1 — Osmar testou e reportou o botão de Voltar (topo da Ficha) não respondendo ao toque (só o
    gesto de voltar do celular funcionava). Investigado com navegador headless (Playwright, emulando toque):
    reproduzido só no Char Multiclasse (não no personagem demo) — console mostrava "Maximum update depth
    exceeded" repetido. Causa raiz (BUG PRÉ-EXISTENTE, não introduzido pela E6c-a): `reservaDadosDeVida`
    (`FichaShell.tsx`) nascia como array NOVO a cada render (sem `useMemo`); os `useEffect` de Surto Psiônico
    e Força Vital Incandescente (E5c/E5d) dependem dele e chamam `registrarSurtoPsionico`/
    `registrarForcaVitalIncandescente` com objeto novo sempre — o `setState` disparado no `RollContext`
    re-renderiza a Ficha, que recria o array, que dispara o efeito de novo: loop infinito só pra quem tem
    Psiônico nível 7+ (o Char Multiclasse sempre teve isso, mesmo antes da subclasse Psicinético — só não
    tinha sido percebido até agora, com a aba Magias sendo visitada de novo nos testes de hoje). Corrigido
    memoizando `reservaDadosDeVida` pelas 2 entradas reais (`classesAtual`, `dadosDeVidaGastos`) — quebra o
    ciclo sem tocar nos 2 `useEffect`. Confirmado com o mesmo script de navegador: console limpo, botão
    volta pra lista normalmente. `npx tsc -b`, `npm test -- --run` (1049/1049), `npm run build` verdes.
  - [x] E6c-c — Técnicas Telecinéticas (nível 3): 2 melhorias ao Impulso Telecinético (Propulsão
    Telecinética) da classe base. (1) 3ª opção de dado no popup — "Com 1d4" (rolagem comum, NÃO passa pelo
    funil `rolarDadoDeEnergiaPsionica`, então Surto Psiônico/Força Vital Incandescente não se aplicam a
    ela, por design — confirmado no código), nunca gasta recurso, distância = 5m × resultado, igual à opção
    de Dado de Energia. (2) ao "Inimigo falhou" na salvaguarda, abre `EscolherEfeitoModal` (mesmo padrão de
    Golpe Brutal) com Nenhum/Impulso (+3m veloc.)/Desorientar (sem Ataque de Oportunidade)/Projétil
    Telecinético (dano de Força = valor do dado da Propulsão, energia OU d4 — Projétil só aparece na lista
    se algum dado foi rolado). 2 chapéus de QA aplicados antes de codar (agora regra permanente, ver
    CLAUDE.md §6.4 item 5): QA Técnico confirmou que quem não tem a característica mantém o fluxo de 2
    opções de sempre; QA Jogador Noob achou 2 furos na proposta original (opção de Dado de Energia não
    mostrava quantos restavam; texto de Projétil Telecinético não mostrava o dano calculado) — corrigidos
    antes de codar. `core/tecnicasTelecineticas.ts` novo (`temTecnicasTelecineticas`/
    `danoProjetilTelecinetico`, com testes). Testado ao vivo (navegador headless, 412px, Char Multiclasse,
    3D dado desligado pra rolagem instantânea): as 3 opções de dado aparecem com contador de dados
    restantes; escolher "Com 1d4" rola e NÃO gasta nenhum pip do Dado de Energia Psiônica; escolher "Com
    Dado de Energia" + "Nenhum" no efeito extra GASTA 1 pip normalmente (regressão confirmada); "Projétil
    Telecinético" mostra o dano certo na opção E no toast final. `npx tsc -b`, `npm test -- --run`
    (1053/1053), `npm run build` verdes.
  - [x] E6c-b — Telecinese Poderoso (nível 3): "Ao conjurar Mão Mágica, seu alcance aumenta em 9 metros e
    a mão pode carregar até 9 quilos." Puramente informativo (o app não rastreia peso carregado pela mão
    espectral). `core/telecinesePoderoso.ts` novo (`temTelecinesePoderoso`/`aplicarTelecinesePoderosoEmMagia`,
    com testes) — pega a magia "Mãos Mágicas" (concedida de graça por Telecinese Sutil, classe base) e
    devolve uma CÓPIA com `alcance: '18 metros'` (9+9) + uma nota no fim explicando o bônus, sem tocar no
    catálogo global (Bardo/Bruxo/Feiticeiro/Mago continuam com Mãos Mágicas em 9m). Achado testando ao vivo:
    a nota só entrava na `descricaoCompleta`, mas o popup (`MagiaComDescricao`) sempre abre na aba "Desc.
    curta" por padrão — ficava contraditório (alcance 18m no topo, texto de baixo sem menção ao bônus,
    "até 5kg"). Corrigido: a nota entra nas DUAS descrições. Aplicado nos 2 pontos que resolvem
    `magiasSubclasseAtuais` pra objetos `Magia` (`useMagiasEConjuracao.ts`, que alimenta o picker "Usar
    Magia" do Combate, E `MagiasTab.tsx` — CLAUDE §6.6). Testado ao vivo (navegador headless, 412px, Char
    Multiclasse): "Alcance: 18 metros" + nota aparecem certinho nas duas telas. `npx tsc -b`,
    `npm test -- --run` (1059/1059), `npm run build` verdes.
  - [x] E6c-d — Campo de Rebatimento (nível 6): reler o texto bruto mostrou que NÃO é um card de
    narração simples (ideia descartada de uma conversa antiga) — tem dano real + PV Temporário pro
    próprio personagem (que o app já rastreia). Implementado no mesmo molde de Retaliação Psíquica:
    `core/campoDeRebatimento.ts` novo (`temCampoDeRebatimento`/`podeAtivarCampoDeRebatimento`/
    `danoCampoDeRebatimento`/`danoCampoDeRebatimentoSucesso`/`explicarDanoCampoDeRebatimento`, com
    testes). Card de Reação novo ("🛡 Campo de Rebatimento", disponível sempre — app não sabe se
    Escudo Arcano foi conjurado nem se o ataque errou, narrativo) — gasta 1 Dado de Energia, rola,
    abre `SalvaguardaDoAlvoModal` (Destreza, CD do Psiônico) com Falha=dado+mod.INT / Sucesso=metade
    já calculados, e os 2 `acoesResultado` aplicam PV Temporário automaticamente
    (`onGanharPvTempCampoDeRebatimento` → `ganharPvTemporario`, FichaShell) — nunca fica pro jogador
    fazer na mão. Osmar notou que o card (e o já existente de Retaliação Psíquica) não mostravam
    quantos Dados de Energia restavam antes de decidir gastar — em vez de repetir o número em cada
    card, seguimos a sugestão dele e trouxemos o padrão já usado pelo Bardo (linha de pips no topo
    do grupo, habilidades embaixo): nova linha "Dados de Energia Psiônica (dX)" + `TickPips` no topo
    do grupo "Psiônico" do painel de Reação (`ReacaoPanelContent.tsx`), reaproveitando os dados que
    `conexaoTelepatica` já carrega (zero estado novo). Testado ao vivo (navegador headless, 412px,
    Char Multiclasse, 3D dado desligado): painel de Reação mostra "Psiônico → pips (d12) → Retaliação
    Psíquica → Campo de Rebatimento" na ordem certa; rolar e escolher "Atacante falhou" aplicou "+14
    TEMP" no PV e gastou 1 pip de Dado de Energia corretamente. `npx tsc -b`, `npm test -- --run`
    (1067/1067), `npm run build` verdes.
- [x] Psiônico ligado na criação de personagem com selo "UA · não oficial" (a partir de agora cada entrega já fica visível pra testar).
- Decidido (2026-10): pré-requisito e proficiências de multiclasse = Mago (provisório, marcado UA); cor roxa #b36bd6.

## Mini-fix: header da Ficha — "Multiclasse" com 3+ classes

Fora do foco Psiônico (pedido avulso do Osmar, 2026-10). Com 3 ou mais classes, a linha do header
(embaixo do nome) virava texto corrido comprido demais ("Classe N (Sub) / Classe N (Sub) / ..."). Agora
colapsa pra "Multiclasse (Nível {total})" + ⓘ que abre popup (reaproveitado `InfoTexto`, já existia — zero
componente novo) listando 1 linha por classe, mesmo formato de texto que já era usado (`Classe Nível
(Subclasse)`). Com 1 ou 2 classes, comportamento inalterado. `src/ui/ficha/FichaShell.tsx`.
`npx tsc -b`, `npm test -- --run` (1049/1049), `npm run build` verdes. Testado ao vivo (navegador headless,
360px-equivalente/Pixel 7, Char Multiclasse): "Multiclasse (Nível 160) ⓘ" aparece certo, popup lista as 8
classes certinho ("Bárbaro 20 (Trilha da Árvore do Mundo)", ..., "Guerreiro 20" sem subclasse).
