# Deslocamento (função única) + Empurrar/Imobilizar — foco dos 2 `[PH]` do Monge (2026-10)

> Veio do postmortem do Monge (`aprendizados/classes/monge-postmortem.md`): os dois `[PH]` que
> sobraram na classe base eram, na verdade, **sistemas gerais** (valem pra qualquer classe), não
> detalhes do Monge. Padrão da decisão em `DECISOES-FICHA.md` "Deslocamento — uma função soma todas
> as fontes".

## Entregas

1. **Deslocamento** — `core/deslocamento.ts`: `calcularDeslocamento` soma as fontes (cada uma com `tem` e
   `ativa`), devolve total + conta pro ⓘ. Caixa "Deslocamento" na aba Atributos (layout novo do topo:
   Level|PV; Ins. Her.|Iniciativa|Bônus Prof.; Perc. Passiva|CA|Deslocamento) e linha passiva embaixo da
   Reação no Combate.
2. **Empurrar/Imobilizar** (`core/empurrarImobilizar.ts`) — opções do Ataque Desarmado (Glossário), vale pra
   qualquer classe: no "Atacar — Ataque Desarmado" abre Dano/Empurrar/Imobilizar; as duas últimas não rolam
   ataque, gastam um dos ataques e abrem o popup de salvaguarda do alvo (CD = 8 + bônus de acerto).
3. **Generalização** (desenho do Osmar): depois de escolher a Torrente de Golpes/Ataque Adicional abre "Só
   atacar" x "Atacar, empurrar ou imobilizar"; no 2º modo, a escolha Dano/Empurrar/Imobilizar vem antes de
   CADA ataque da sequência (modo guardado num `ref` por causa da closure velha).
4. **Revisão das fontes** (esta nota).

## Revisão das fontes do Deslocamento (o que está coberto e o que não está)

**Coberto (ligado no motor):** base da espécie (todas as 10 espécies leem certo: 9 m, Golias 10,5 m; Elfo
Silvestre 10,5 m por `deslocamentoMetros` na sub-espécie), Movimento sem Armadura (Monge, só sem armadura nem
escudo), Movimento Rápido (Bárbaro, só sem Armadura Pesada), Velocista (+3), Dádiva da Velocidade (+9), Forma
Grande (+3), Passo Destrutivo (+6 no turno), penalidade de −3 m por Força abaixo do mínimo da armadura (Cota de
Malha 13, Talas 15, Placas 15). Exaustão (−1,5 m por nível) existe como entrada, sempre 0.
Informativos no ⓘ (não somam): Voo e Natação do Passo dos Elementos (Sintonia ativa, nível 11+) e Voo das
Asas Celestiais ativas.

**Não coberto (e por quê) — vira pendência:**
- **Itens mágicos:** 26 itens citam deslocamento. Só 2 mudam a caminhada (Botas de Caminhar e Saltar — mínimo 9 m e
  ignora a redução de armadura pesada; Botas de Velocidade — dobra, ativável). O resto dá voo/natação/escalada.
  Falta um espaço de "calçado/item equipado" no app; o motor já aceita `extras`.
- **Velocidades de voo/natação/escalada** de itens e de espécies (Voo Dracônico não tem estado "ativo", só "gasto").
- **Condições** (Exaustão, Imobilizado, Contido, Paralisado...) e **efeitos de magia** (Passos Largos, Lentidão,
  Velocidade...): o app não rastreia condições/efeitos ativos (ver `Backlog.md` "tracking de status/efeitos").
- **Bônus só durante a ação Correr** (Corrida Aprimorada do Valentão de Taverna, Agressor, Psicinético): o app não
  modela a ação Correr como estado.
- **Fontes de classes/subclasses ainda não implementadas** (Paladino/Glória "Aura de Vivacidade" +3 m, Guardião
  "Explorador Experiente"): entram como 1 item na lista quando a classe/subclasse existir.

## Lições

- Um `[PH]` aparentemente "de uma classe" pode ser um sistema geral que não existe no app (o app **não mostrava o
  Deslocamento em lugar nenhum**) — checar a tela antes de achar que é só ligar uma função.
- Ao estender um fluxo encadeado (Torrente), o estado de modo tem que viver num `ref` (mesma lição do Golpe
  Atordoante).
- Minha primeira busca por itens mágicos "contou 0" por erro de expressão regular — conferir contagem suspeita antes
  de afirmar que "não há nada".
