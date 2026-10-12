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
- [ ] E4d — Defesa Psiônica, Mente Aguçada, Retaliação Psíquica (estado entre turnos / Reação).
- [ ] E5 — Restauração/Surto/Reservas/Força Vital. E6a-d — subclasses. E7 — Talentos Selvagens.
- [x] Psiônico ligado na criação de personagem com selo "UA · não oficial" (a partir de agora cada entrega já fica visível pra testar).
- Decidido (2026-10): pré-requisito e proficiências de multiclasse = Mago (provisório, marcado UA); cor roxa #b36bd6.
