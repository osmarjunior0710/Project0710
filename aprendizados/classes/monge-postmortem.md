# Postmortem — Monge (classe base + Combatente dos Elementos), 2026-10

> Escrito pelo Claude Code a pedido do Osmar, depois de fechar os 2 focos do
> Monge (`monge.md` e `monge-elementos.md`). Objetivo: separar o que
> funcionou, o que custou retrabalho e o que ainda está em aberto, pra
> próxima classe (Clérigo, Druida, Ladino...) começar melhor.

## Números do trabalho

- 2 focos, ~25 publicações pequenas (cada uma testável sozinha, com
  Changelog e carimbo de versão), de `v202610_0925` a `v202610_1802`.
- Classe base: 22 características (nível 1-20) + 3 correções de texto de
  regra achadas na revisão final. Subclasse Elementos: 5 características em
  6 entregas. Testes automatizados: 862 → 923.
- Tudo validado ao vivo em 360/412px no "Char Multiclasse".

## O que funcionou (manter)

1. **Entrega pequena + proposta com o texto da regra antes de codar.**
   Quase toda decisão de UI saiu certa na 1ª ou 2ª rodada porque o Osmar
   viu o texto e a proposta antes (ex.: Ápice Elemental virou escolha do
   jogador por uma pergunta dele, antes de ir ao ar).
2. **Reaproveitar o que existe** (`SalvaguardaDoAlvoModal`, `ElementoSintoniaModal`
   reaproveitado 3x, reroll compartilhado, `confirmarFechamento` em array,
   padrão de toggle da Defesa Superior). Cada característica nova custou
   pouco quando o padrão já estava lá.
3. **Personagem de teste único (Char Multiclasse nível 20).** Pegou
   problemas de interface cheia (popup largo, botões demais) que um
   personagem simples nunca mostraria.
4. **Revisão final lendo o PDF do capítulo inteiro.** Achou 3 erros de regra
   que 20+ entregas não pegaram (ver abaixo).
5. **Fluxo de publicar com sync + checklist** funcionou quando a outra conta
   publicou no meio (merge limpo, retestado, push).

## O que deu errado (e a causa)

| # | Problema | Causa raiz | Como foi pego |
|---|---|---|---|
| 1 | As 22 características do Monge nunca tinham sido importadas pra `caracteristicasClasse.ts` — o Perfil mostrava "descrição ainda não importada" em todas. Eu mesmo disse que apareciam. | A Entrega 1 importou só a progressão; ninguém abriu o Perfil. **Afirmei sem conferir na tela.** | Eu, ao verificar uma afirmação minha |
| 2 | SDD errado nas 3 técnicas base (Defesa Paciente/Passo do Vento/Torrente) — o app mostrava efeitos trocados. | SDD escrito sem copiar o texto do PDF; cada entrega seguinte confiou no SDD. | Revisão final contra o PDF |
| 3 | Golpe Atordoante usável 2x na Torrente de Golpes. | Sequência encadeada: o 2º ataque nasce de dentro do callback do 1º, com a closure velha. Testei 2 ataques separados, não a sequência. | Osmar, testando |
| 4 | Popup de dano esticado até as bordas no celular. | Meus rótulos de rolagem eram compridos e o card não tinha largura máxima. | Osmar (print) |
| 5 | Popups do ⓘ presos dentro do painel lateral. | `transform` do painel vira containing block de `position: fixed`. | Osmar (print) |
| 6 | Caixas de seleção tracejadas. | Usei `.opt-card` (nasce tracejado) em modal; a regra do projeto é borda contínua = toca. | Osmar |
| 7 | Dado extra do Ápice aplicado sozinho. | Interpretei "pode causar" como sempre vantajoso; ignorei que perde a escolha (esperar crítico/alvo). | Osmar, perguntando |
| 8 | Push sem versão/Changelog numa publicação. | Script em Node chamou o `date` do Windows (falhou) e abortou depois de gravar só um arquivo. | Eu, lendo o resultado do push |
| 9 | Vários scripts de edição quebraram. | Aspas dentro de `node -e` no shell (~6 vezes). | Erro imediato |
| 10 | Testes "falhando" que eram do ambiente: modal deslocado, dados 3D travados em "Rolando...", "Fim do Turno" que não clicava. | `scrollIntoView` rola o `#root` (overflow hidden); o painel só anima 3D com frames; o botão é `div`, não `button`. | Investigação |

## Mudanças de processo — APROVADAS pelo Osmar e aplicadas (2026-10)

Onde cada uma foi parar: 1 → `CLAUDE.md` 6.4 regra 1 + teste `core/caracteristicasComTexto.test.ts`;
2 → `CLAUDE.md` 6.2 (SDD cita o texto literal); 3 → `CLAUDE.md` 6.4 regra 2; 4 → `CONVENCOES-UI.md` +
`CLAUDE.md` 6.4 regra 4; 5 → `CLAUDE.md` 6.4 regra 3 + `CONVENCOES-UI.md`; 6 e 7 → `CLAUDE.md` seção 21 +
`LICOES-RAPIDAS.md`. Texto original da proposta:

1. **Checklist de "dado importado" por classe/subclasse**: depois de importar
   texto, abrir o Perfil e o Level Up e conferir na tela (a auditoria pode ser
   um teste automatizado: toda característica da progressão tem texto).
2. **SDD cita o texto do PDF literalmente** na seção de cada característica, e a
   entrega só conta como pronta se o app bate com esse texto (evita o erro #2).
3. **Teste de sequências encadeadas** (Ataque Extra, Torrente) em toda
   característica "1x por turno" ligada a ataque — checar o 2º e o 3º golpe.
4. **Lista de convenções de UI** perto do `CLAUDE.md` (borda contínua = toca;
   popup com largura máxima; popup do ⓘ em portal; título de rolagem curto),
   pra eu consultar antes de criar um modal.
5. **Pergunta obrigatória em característica "pode"/opcional**: se o texto diz
   "você pode", a proposta deve dizer se é automático ou escolha, antes de codar.
6. **Scripts de edição via arquivo** (`Write` + `node arquivo.cjs`), nunca
   `node -e` com texto de código; e script de versão com `date` do Git Bash.
7. **Dicas do ambiente de teste** em `LICOES-RAPIDAS.md` (ver abaixo).

## Tudo que ficou em aberto (inventário completo)

**Monge base** (`PENDENCIAS.md` "Monge"):
- Artes Marciais: Empurrar/Imobilizar (opções do Ataque Desarmado) — `[PH]`.
- Movimento sem Armadura: bônus de Deslocamento — `[PH]` (o app **nem exibe**
  Deslocamento hoje; só a espécie tem o texto).
- 3 subclasses sem mecânica (Mão Espalmada, Misericórdia, Sombras); 2 células da
  planilha bugadas (Sombras nível 3; Elementos nível 17, já tratada).
- Condições do personagem não rastreadas (Restauro Pessoal, Evasão, Defesa
  Superior, Sintonia, Resistência do Ápice viraram aviso/botão).
- Sobrevivente Disciplinado só nas salvaguardas da aba Atributos e sem
  Vantagem/Desvantagem.
- CD/ataque de magia com DES/SAB não leem Corpo e Mente (nenhuma classe
  implementada conjura com esses atributos).

**Elementos:** CD das salvaguardas é a de Foco (o texto da subclasse não cita CD);
nenhuma habilidade conta tempo/posição/alcance; Passo dos Elementos é só texto.

**Transversais:**
- `Feedback.md`: vários efeitos de "ao acertar" no mesmo acerto (hoje 1 por acerto).
- `Backlog.md` (outra conta): popup de confirmação pros painéis Ação/Bônus/Reação.
- `PENDENCIAS.md` já tinha: Bárbaro e Paladino faltam em
  `proficienciasEntradaMulticlasse.ts`; Ataque Desarmado só com a opção Dano
  (vale pra todas as classes — o Empurrar/Imobilizar do Monge é esse mesmo).
- Auditoria de textos (2026-10): nenhuma característica de nenhuma classe está
  sem texto, exceto as vagas genéricas "Característica de Subclasse" e dois
  nomes de tabela com tratamento próprio (Especialização do Bardo, Arcana
  Mística do Bruxo).

## Dicas do ambiente de teste (também em `LICOES-RAPIDAS.md`)

- Dados 3D só avançam se o painel desenha frames: faça `tabs_select` + um
  screenshot, ou a rolagem fica em "Rolando...".
- Não use `scrollIntoView` no teste: rola o `#root` e desloca todos os modais.
- "Fim do Turno" e vários botões do app são `div` (não `button`): clique por
  coordenada/ref, não por `querySelectorAll('button')`.
- Se o navegador de teste perder o armazenamento, a ficha do Char Multiclasse
  é recriada pelo atalho na lista (login stub → Lista → atalho).
