# Monge — Combatente dos Elementos (subclasse)

> Foco aberto e fechado em 2026-10, depois da classe base (ver
> `aprendizados/classes/monge.md`). SDD: `sdd/sdd-monge-elementos.md`.
> Testado sempre no "Char Multiclasse" nível 20 (regra do `CLAUDE.md` 6.4).

## Como foi quebrado (6 entregas, em ordem de nível)

1. Dado + liberar a escolha da subclasse no Level Up (5 características
   importadas, nível 17 limpo da introdução do Paladino colada na planilha).
2. Manipular Elementos (nível 3): truque Elementalismo concedido por
   subclasse (`truquesConcedidos`, `core/magiasSubclasse.ts`, genérico).
3. Sintonia Elemental (nível 3): cartão Ativar (1 Foco)/Encerrar, toggle
   sem contador de tempo (padrão Defesa Superior).
4. Ataques Elementais: botão "🌪 Elemental" no popup de dano do Ataque
   Desarmado/Torrente → escolha dos 5 elementos → popup de salvaguarda de
   Força (empurrão opcional).
5. Explosão Elemental (nível 6): linha no painel de Ação, 2 Foco + Ação,
   3 dados de Artes Marciais, salvaguarda de Destreza (metade no sucesso).
6. Ápice Elemental (nível 17) em 3 partes: Golpes Potencializados (botão
   "➕ Ápice" no popup de dano, 1x por turno, 2 dados no crítico), Passo
   Destrutivo (Passo do Vento com a Sintonia liga o estado do turno + botão
   de dano por criatura) e Resistência a Dano (seletor dos 5 tipos).

## Decisões e padrões que vale reaproveitar

- **"Pode causar dano adicional" = escolha do jogador, não automático.** O
  Osmar apontou que aplicar sozinho no 1º acerto tira a escolha de esperar um
  crítico/alvo. Efeito opcional de "ao acertar" vira botão no popup de dano,
  com a trava de uso (1x por turno) lida por `useRef` + estado.
- **Truque concedido por subclasse** entra em `magiasConjuraveis` (Combate) e
  numa seção "Magias de Subclasse" (Magias), e conta como fonte de conjuração
  (a aba Magias aparece mesmo sem classe conjuradora). Teste das 2 telas (6.6).
- **Estado "do turno" persistido** (`apiceGolpesUsadoTurno`,
  `passoDestrutivoAtivoTurno`) reseta em `fimDoTurno()` do `FichaShell`.
- **Escolha de elemento reaproveitada**: `ElementoSintoniaModal` serve aos
  Ataques Elementais, à Explosão e ao Passo Destrutivo só trocando título/texto.
- **Modais de seleção têm borda contínua** (regra do projeto: contínua = toca,
  tracejada = informativa) — ajustada no estilo compartilhado
  `TrocarArmaMaestria.module.css`.
- **Popups do ⓘ vão pra um portal no `body`**: o painel lateral usa
  `transform`, que prende `position: fixed` dentro dele.
- **Ambiente de teste**: o painel do navegador só anima dados 3D enquanto
  desenha frames; `scrollIntoView` rola o `#root` (overflow hidden) e desloca
  modais — artefatos de teste, não bugs do app.

## Pendências e limites

- Nenhuma das habilidades da Sintonia conta tempo nem rastreia posição,
  alcance, Natação/Voo ou resistência de alvo: tudo é aviso/botão de rolagem.
- A CD das salvaguardas é a de Foco do Monge (8 + SAB + prof) — o texto da
  subclasse não cita CD própria.
- Dúvida registrada em `Feedback.md`: várias habilidades de "ao acertar" no
  mesmo acerto (hoje o popup fecha no primeiro botão tocado).
