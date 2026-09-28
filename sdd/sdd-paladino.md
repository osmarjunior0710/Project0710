# SDD — Paladino

> Documento de especificação (Chapéu 2, ver `CLAUDE.md` seção 6.2).
> Referência de "como a mecânica deveria funcionar" — não é descartado
> ao fechar o foco, corrija aqui se um erro for achado durante a
> implementação.

## 1. Visão geral

Meio-conjurador (família "Conjurador parcial", `DECISOES-DADOS.md`),
mesma tabela de progressão de magia que Guardião (Magias Preparadas +
Espaços 1º-5º, teto no 5º círculo). Atributo de conjuração: Carisma.
Padrão de troca de magia: **Padrão B** (`DECISOES-CLASSES.md`) — troca
só 1 magia preparada por Descanso Longo, mecânica ainda não existente
no código (as 5 classes já implementadas usam Padrão A ou C).

## 2. Progressão compartilhada (`progressao-meio-conjurador.ts`)

Arquivo novo em `data/rulesets/dnd2024/`, usado por Paladino e (depois)
Guardião — tabela idêntica nos dois, confirmada linha a linha na
planilha (`Progressão de Classe`, coluna "Recursos da Classe"):

```
Nível → { magiasPreparadas: number; espacos: [1º,2º,3º,4º,5º] }
1  → 2  | [2,-,-,-,-]
2  → 3  | [2,-,-,-,-]
3  → 4  | [3,-,-,-,-]
4  → 5  | [3,-,-,-,-]
5  → 6  | [4,2,-,-,-]
6  → 6  | [4,2,-,-,-]
7  → 7  | [4,3,-,-,-]
8  → 7  | [4,3,-,-,-]
9  → 9  | [4,3,2,-,-]
10 → 9  | [4,3,2,-,-]
11 → 10 | [4,3,3,-,-]
12 → 10 | [4,3,3,-,-]
13 → 11 | [4,3,3,1,-]
14 → 11 | [4,3,3,1,-]
15 → 12 | [4,3,3,2,-]
16 → 12 | [4,3,3,2,-]
17 → 14 | [4,3,3,3,1]
18 → 14 | [4,3,3,3,1]
19 → 15 | [4,3,3,3,2]
20 → 15 | [4,3,3,3,2]
```

Nunca calcular por fórmula — importar como tabela (mesma regra já
registrada em `DECISOES-DADOS.md` pra Magias Preparadas).

## 3. Maestria em Arma (nível 1)

**Confirmado com o Osmar (2026-09):** sem progressão — fixo em 2 tipos
de arma do nível 1 ao 20, igual às outras classes. Troca por Descanso
Longo, reaproveitando o padrão já existente (`DECISOES-CLASSES.md`
"Maestria em Arma troca por Descanso Longo") — `core/maestriaArma.ts`
já é genérico (`quantidadeMaestriaEmArma` lê de `classes.ts` via
`valorRecursoClasse`), só falta a linha "Maestria em Arma: 2" em todos
os 20 níveis de Paladino em `classes.ts` (não existe na planilha pra
essa classe — usar valor fixo confirmado aqui, não copiar da
planilha).

## 4. Mãos Consagradas (nível 1)

**CORREÇÃO (2026-09-28, lido direto no livro, Cap. 3 "Nível 1: Mãos
Consagradas"):** NÃO gasta espaço de magia, e não usa dado de cura. É
uma **reserva de Pontos de Vida** = 5 × nível de Paladino, que
reabastece no Descanso Longo. Como **Ação Bônus**, toca uma criatura e
restaura PV tirados dessa reserva (quantos quiser, até o que restar).
Também pode gastar 5 PV da reserva pra remover a condição Envenenado
(esses 5 PV não curam). Reaproveitar o padrão de "reserva de pontos"
que já exista (checar Inspiração de Bardo/Fôlego) antes de criar um
novo — o que muda é que o gasto é em PV, escolhido pelo jogador.

**Nível 14 (Toque Restaurador):** expande — ao usar Mãos Consagradas,
pode também remover condições (livro: Amedrontado, Atordoado, Cego,
Enfeitiçado, Paralisado ou Surdo — lista corrigida, a anterior deste
SDD estava errada) gastando 5 PV da reserva por condição. Interação:
é o MESMO recurso de Mãos Consagradas, não um banco separado — a
entrega 14 só adiciona a opção de condição ao fluxo já existente.

## 5. Canalizar Divindade (nível 3)

**Recurso novo, sem precedente no código** (nenhuma classe implementada
tem Canalizar Divindade ainda — Clérigo também não foi importado).
Banco de N usos (coluna "Bônus de Canalizar Divindade" da planilha:
2 usos nível 3-10, 3 usos nível 11-20), recarrega assim (**confirmado
no livro, Cap. 3 "Canalizar Divindade", 2026-09-28**): **1 uso gasto
volta ao completar um Descanso Curto**, e todos os usos voltam no
Descanso Longo. Se um efeito exige salvaguarda, a CD é a CD de magia da
Conjuração do Paladino.

Opções que gastam 1 uso: Sentido Divino (sempre disponível, built-in
na própria característica Canalizar Divindade), Destruição do Paladino
(nível 2 — na prática só usável a partir do nível 3, quando o banco de
usos existe), Repudiar Inimigos (nível 9). Cada subclasse soma mais 1-2
opções próprias (ex: Arma Sagrada da Devoção, Atleta Inigualável +
Destruição Inspiradora da Glória, Voto de Inimizade da Vingança, A Ira
da Natureza dos Anciões) — todas gastam do MESMO banco.

Entra em `core/recursosVisiveis.ts` na mesma entrega (contador visível
na aba Combate, mesmo padrão de Fúria/Inspiração/Fôlego). Cor do pip:
`corRecursoClasse.ts` ainda não tem slot livre pro Paladino — atribuir
UMA cor temporária qualquer dos valores já existentes do enum
(`CorRecurso`) por hora; o Osmar está fechando a cor final da classe
(ver protótipo `/prototipo` → "Cor de cada classe") e vai informar
depois — nunca inventar cor nova sem confirmar.

## 6. Destruição Divina (nível 2, "Destruição do Paladino")

Ataque especial: gasta um espaço de magia (upcast normal, dano cresce
por círculo do espaço) — texto real da característica (célula
limpa, sem a tabela colada): permite conjurar Destruição Divina
gastando Canalizar Divindade em vez de espaço de magia, 1x sem custo
de espaço, recuperando esse "grátis" só no Descanso Longo. Interação:
o BOTÃO de Destruição Divina no painel de Ação sempre existe a partir
do nível 2 (mesmo sem espaço/Canalizar Divindade — aí fica desabilitado
até ter recurso); a partir do nível 3 ganha a opção extra "usar
Canalizar Divindade" quando o banco de Canalizar existir.

## 7. Estilo de Luta / Combatente Abençoado (nível 2)

Escolha única no nível 2 (mesmo padrão de escolha do Guerreiro —
reaproveitar componente existente): ou um Estilo de Luta comum
(já implementado), ou "Combatente Abençoado" — 2 truques do Clérigo
sempre preparados, Carisma como atributo de conjuração pra eles. Como
Clérigo ainda não foi importado, esses 2 truques precisam existir em
`magias.ts` mesmo sem a classe Clérigo existir ainda (checar se já
estão lá por causa de outra importação; se não, importar só os 2
truques necessários, sem precisar da classe inteira).

## 8. Montaria Fiel (nível 5)

Convocar Montaria sempre preparada (não conta contra o limite normal
de Magias Preparadas) + 1 conjuração grátis por Descanso Longo (sem
gastar espaço). Reaproveitar o padrão de "magia sempre preparada fora
da lista normal" se já existir precedente (checar Druida — Druídico
como referência de "coisa extra concedida por característica de
classe" antes de inventar mecanismo novo); senão, é entrega nova.

## 9. Auras (nível 6, 10, 18) — decisão de escopo confirmada com o Osmar

**Confirmado (2026-09):** implementar SÓ o efeito no próprio Paladino
(ele está sempre dentro da própria aura) — efeito em aliados fica de
fora por enquanto, o app não tem noção de outros personagens na mesa.
Texto da característica na tela deixa isso explícito (algo como "Você
tem [benefício]. Aliados a até Xm também têm — aplique manualmente na
mesa."), sem usar `[PH]` (não é dado inventado, é regra real com escopo
reduzido de propósito — mais parecido com "Ajudar" do Cap.1, que
também é regra real sem cálculo automático completo).

- Nível 6 (Aura de Proteção): bônus passivo = CAR-mod em testes de
  resistência, mínimo +1 — aplicar direto no cálculo de salvaguarda do
  próprio Paladino (`core/`, função nova).
- Nível 10 (Aura de Coragem): Paladino fica imune a Assustado — flag de
  imunidade a condição (checar se já existe mecanismo de "imunidade a
  condição X" de outra fonte — item mágico/talento — antes de criar
  um novo).
- Nível 18 (Aura Expandida): só texto/informação (raio 3m→9m) — sem
  efeito mecânico adicional no PRÓPRIO Paladino (ele já estava dentro
  do raio de 3m, 9m não muda nada pra ele mesmo). Registrar como
  característica praticamente `textonly` do ponto de vista do motor
  (o dado real é o alcance, que só importa pra terceiros).

## 10. Repudiar Inimigos (nível 9)

Ação, gasta Canalizar Divindade: inimigos num raio precisam passar em
salvaguarda de Sabedoria ou ficam Assustados (Effeito de medo — checar
se `core/` já tem uma condição "Assustado" aplicável/removível — reuso
de Condições, seção 4 do CLAUDE.md, aba "Condições" da planilha).

## 11. Golpes Radiantes (nível 11)

+1d8 dano Radiante em UM ataque corpo a corpo/desarmado por turno —
mesmo padrão de "dado bônus condicional 1x por turno" que outras
classes já tem (Ataque Furtivo do Ladino é a referência mais próxima,
mesmo não implementado ainda — olhar como Guerreiro/Bárbaro tratam
"bônus por turno" se houver algo parecido lá).

## 12. Subclasses — estrutura (nível 3/7/15/20)

Todas as 4 seguem o mesmo formato: nível 3 dá "Magias do Juramento"
(sempre preparadas, tabela por nível de Paladino — mini-tabela própria
de cada subclasse, ver planilha) + 1-2 características ativas via
Canalizar Divindade; nível 7 dá uma Aura extra (empilha com Aura de
Proteção, mesmo raio, mesma decisão de escopo da seção 9 — só efeito
no próprio Paladino); nível 15 e 20 são características standalone
(sem Canalizar Divindade na maioria dos casos — confirmar caso a caso
na hora de implementar cada uma).

- **Devoção:** Arma Sagrada (imbuir arma, bônus CAR em acerto + dano
  radiante) · Aura de Devoção (imunidade a Enfeitiçado, escopo próprio
  só) · Destruição Protetora (efeito em Destruição Divina) · Resplendor
  Sagrado (buff de 10min, Ação Bônus, 1x/Descanso Longo).
- **Glória:** Atleta Inigualável + Destruição Inspiradora (2 opções de
  Canalizar Divindade no nível 3) · Aura de Vivacidade (deslocamento) ·
  Defesa Gloriosa (Reação, bônus de CA) · Lenda Viva (buff, Ação Bônus).
- **Vingança:** Voto de Inimizade (marca 1 inimigo, vantagem em
  ataque) · Vingador Implacável (Reação em Ataque de Oportunidade) ·
  Alma Vingativa (Reação de ataque extra) · Anjo Vingador (buff,
  gastando espaço de 5º pra recarregar).
- **Anciões:** A Ira da Natureza (videiras, salvaguarda em área) · Aura
  de Resistência (resistência a 3 tipos de dano) · Sentinela Imortal
  (evita 0 PV 1x/Descanso Longo) · Campeão Ancestral (buff, Ação
  Bônus).

## 13. Multiclasse

Combinação Guardião/Paladino já mapeada em
`conjuradorMulticlasse.ts` (fato de regra já classificado) — ligar
quando a entrega de Multiclasse do Paladino chegar, sem redesenhar.

## 14. Idioma extra de nível 1 — auditoria (PENDENCIAS.md)

Nível 1 do Paladino (Conjuração, Maestria em Arma, Mãos Consagradas):
nenhuma das 3 menciona idioma. **Confirmado: Paladino não concede
idioma extra de classe no nível 1** — pode remover Paladino da lista
de "ainda não auditado" em `PENDENCIAS.md` quando a entrega 1 (dado)
for concluída.
