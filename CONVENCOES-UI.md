# CONVENCOES-UI.md

> Lista curta de convenções de UI que já custaram retrabalho. **Consulte antes de criar qualquer modal,
> popup, caixa de escolha ou linha de painel** (regra do `CLAUDE.md` seção 6.4). Nasceu do postmortem do
> Monge (2026-10, `aprendizados/classes/monge-postmortem.md`): quase todo item abaixo foi apontado pelo
> Osmar depois de eu já ter entregue o contrário. A explicação longa de cada padrão está na família
> `DECISOES-*.md`; aqui fica só o "o que fazer", em uma linha.

## Bordas e caixas

- **Contínua = toca; tracejada = só informativa.** Caixa de escolha/botão/seleção tem borda contínua;
  cartão de listagem ou stat sem toque fica tracejado. (`DECISOES-DESIGN.md` "Borda azul = interativo".)
- `.opt-card` global **nasce tracejado**. Dentro de modal com o cartão padrão (`TrocarArmaMaestria.module.css`)
  ele já fica contínuo; dentro de painel lateral, usar `style={{ borderStyle: 'solid' }}` na caixa de escolha.
- Entre **grupos** de informação: linha cheia cinza. Dentro do **mesmo grupo**: tracejada. Sem "vão" vazio
  como separador.

## Popups e modais

- **Largura máxima**: o card de rolagem/modal tem `max-width: min(340px, calc(100vw - 32px))`. Título comprido
  quebra linha; **rótulo de rolagem curto** (ex.: "Defesa Paciente — PV Temporários", não "… (Foco Aprimorado)").
- **Popup do ⓘ** (`InfoValor`, `InfoTexto`, `MagiaComDescricao`) vai num **portal no `body`** (o painel lateral
  usa `transform`, que prende `position: fixed` dentro dele). z-index 125: acima do painel (110/111), abaixo
  do popup de rolagem (135).
- **Modal de escolha** (cartão central) tem `z-index: 120` quando abre por cima de painel lateral.
- **3 ou mais botões** de fechamento no popup de dano empilham na vertical; 2 ficam lado a lado.
- Decisão que o jogador **precisa ver** (escolha obrigatória) não fecha tocando fora: só pelos botões.
- Efeito "ao acertar" é **botão no popup de dano**, não card solto na tela. Efeito "CD do jogador, alvo salva"
  usa o `SalvaguardaDoAlvoModal` que já existe — nunca um modal novo.

## Texto e contadores

- **Pips já mostram a quantidade**: não repetir "3/5" ao lado (`LICOES-RAPIDAS.md`).
- `[PH]` só em texto que não é regra validada (seção 12 do `CLAUDE.md`); característica com
  `statusImplementacao: 'placeholder-*'` ganha `[PH]` sozinha.
- Informação importante nunca fica atrás de hover (seção 5 do `CLAUDE.md`).

## Layout e teste

- Largura de teste: **360px** (mais apertado) e **412px**; 390px é a referência de partida.
- Alvo de toque mínimo `var(--touch-target-min)`; nada pequeno demais pro dedo.
- Topo da aba Atributos (decidido pelo Osmar, 2026-10): Level | PV; Ins. Heroica | Iniciativa | Bônus Prof.;
  Percepção Passiva | CA | Deslocamento.

## Antes de codar um efeito opcional

- Texto com **"você pode"** = opção do jogador. A proposta diz se é **automático ou escolha** antes de
  codar (o Ápice Elemental foi entregue automático e o Osmar pediu escolha — ver o postmortem).
- Limitação técnica que muda o que o jogador **vê ou faz** é pergunta **antes** de codar, não nota de rodapé
  no relatório (`LICOES-RAPIDAS.md`, Arma Sagrada).
