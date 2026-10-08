# Monge — classe base, nível 1-20 (sem subclasse)

> 8ª classe do projeto. Foco aberto e fechado em 2026-10. SDD:
> `sdd/sdd-monge.md`. Subclasses (Mão Espalmada, Misericórdia, Sombras,
> Elementos) ficam pra focos futuros, assim que o Osmar escolher qual
> o jogador vai usar — ver `PENDENCIAS.md` "Monge".

## Como foi quebrado

1. Dado no banco (`classes.ts`, CA sem armadura generalizada pra
   Destreza+Sabedoria, funções de Artes Marciais/Foco/Movimento).
2. Habilitar na criação (Ataque Desarmado com Dado de Artes Marciais e
   Destreza em vez de Força, `core/monge.ts`).
3. Pontos de Foco + 3 técnicas (Defesa Paciente, Passo do Vento,
   Torrente de Golpes), Metabolismo Incomum.
4. Queda Lenta, Golpe Atordoante, Defletir Ataques/Energia.
5. Níveis 6-20 em ordem de nível: Golpes Potencializados, Evasão, Foco
   Aprimorado, Restauro Pessoal (textonly), Sobrevivente Disciplinado,
   Foco Perfeito, Defesa Superior, Dádiva Épica (já genérica), Corpo e
   Mente.

## Decisões e padrões que vale reaproveitar

- **Efeito pós-acerto = botão no popup de dano** (`confirmarFechamento`
  em array: tipo de dano + Golpe Atordoante), e quando a característica
  é "CD do jogador, o alvo salva", abre o `SalvaguardaDoAlvoModal` que já
  existia — nunca um modal novo. 3+ botões empilham na vertical.
- **Closure velha em sequência encadeada** (bug real, Torrente de
  Golpes com Foco): o 2º ataque nasce de dentro do callback do 1º e
  enxerga o estado antigo — qualquer "1x por turno" tocado dentro dessa
  cadeia precisa de um `useRef` além do estado (`golpeAtordoanteUsadoRef`).
- **Reroll compartilhado** (`RollContext.rerolarD20Atual`): Inspiração
  Heroica e Sobrevivente Disciplinado usam o mesmo mecanismo de jogar de
  novo o d20; o que distingue é o flag (`ehSalvaguarda`) e o provider.
- **Bônus de atributo de nível 20 generalizado** (`core/campeaoPrimitivo.ts`
  → `TemCapstone`): Campeão Primitivo e Corpo e Mente. Ao dar bônus em
  DES/SAB, tudo que lia o valor CRU do atributo (Iniciativa, Percepção
  Passiva, CA do Monge) precisou ser ligado — grep por `valorFinalAtributo`.
- **Foco Perfeito aplicado sempre na Iniciativa** (Metabolismo Incomum
  restaura tudo, então o resultado final é igual e a tela mais simples).
- **O app não rastreia condições do personagem** — Restauro Pessoal e
  Evasão ficaram textonly/aviso por isso.
- **Popup de rolagem não pode crescer com o título**: ganhou
  `max-width` (340px) depois que rótulos compridos esticavam o card.

## Bugs e achados

- **Características do Monge nunca tinham sido importadas** pra
  `caracteristicasClasse.ts` (Perfil mostrava "Descrição detalhada ainda
  não importada" em todas). Importadas da planilha, limpando tabela
  colada em Defesa sem Armadura/Foco do Monge e a intro de subclasses em
  Corpo e Mente (mesmo padrão de contaminação de `CLAUDE.md` seção 8).
- **Revisão final contra o PDF** achou o SDD errado nas 3 técnicas:
  Defesa Paciente de graça = Desengajar (não Esquivar), com Foco =
  Desengajar + Esquivar; Passo do Vento de graça = Correr, com Foco =
  Desengajar + Correr + salto dobrado; Torrente de Golpes só existe com
  Foco — a opção "de graça" da tela é o Ataque Desarmado Adicional de
  Artes Marciais. Corrigido no app e no SDD.
- Nenhuma regra solta em caixa de texto no capítulo do Monge (leitura
  completa do PDF, seção 6.1.2 do `CLAUDE.md`).

## Status por característica (22)

Prontas (`codeimplementation`): Defesa sem Armadura, Foco do Monge,
Metabolismo Incomum, Defletir Ataques, Aumento no Valor de Atributo,
Queda Lenta, Ataque Extra, Golpe Atordoante, Golpes Potencializados,
Evasão, Foco Aprimorado, Defletir Energia, Sobrevivente Disciplinado,
Foco Perfeito, Defesa Superior, Dádiva Épica, Corpo e Mente.
Só texto (`textonly`): Movimento Acrobático, Restauro Pessoal.
Com `[PH]` (`placeholder-codeimplementation`): Artes Marciais (Empurrar/
Imobilizar com Destreza), Movimento sem Armadura (bônus de Deslocamento
não aplicado). Subclasse de Monge: sem status (escolha cai no fluxo
genérico de subclasse, que ainda bloqueia as 4 sem implementação).

## Personagem de teste

Foi validado o tempo todo no "Char Multiclasse" (nível 20 em todas as
classes) — a partir daqui esse é o jeito padrão (ver `CLAUDE.md` 6.4).
