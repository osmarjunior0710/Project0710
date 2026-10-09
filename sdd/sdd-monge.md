# SDD — Monge (classe base, nível 1-20)

> Chapéu 2 (Game Designer) do foco Monge — como a mecânica da classe
> base deve funcionar de verdade, e onde ela colide com sistema já
> existente. Subclasses (Mão Espalmada, Misericórdia, Sombras,
> Elementos) ficam pra depois (foco separado, ver `EmDev.md`).
>
> Fonte: `dnd-master-referencia.xlsx` (abas "Progressão de Classe",
> "Características de Classe", "Proficiências de Classe", "Multiclasse")
> + `livros-referencia/livro-do-jogador/04b_-_..._Guardiao_a_Paladino.pdf`
> (páginas 159-166 do livro, PDF 41-48). Ver aviso de 2 células com dado
> bugado na planilha (Combatente das Sombras nível 3, Combatente dos
> Elementos nível 17) — não afeta a classe base, só as subclasses.

## 1. Dado de Artes Marciais — substitui dano, nunca soma

Diferente do Dano da Fúria do Bárbaro (bônus ADICIONAL ao dano normal),
o Dado de Artes Marciais SUBSTITUI o dado de dano do Ataque Desarmado/
arma de Monge, usando o maior dos dois quando a arma tiver um dado
melhor (regra real: "pode rolar 1d6 EM VEZ DO dano normal"). Escala
1d6→1d8→1d10→1d12 nos níveis 1/5/11/17.

**Implementação:** nova entrada em `RecursoClasse` ("Bônus de Artes
Marciais", guardando o número de LADOS do dado — 6/8/10/12 — não o
valor rolado, mesmo padrão de "número puro lido da planilha" já usado
em todo outro recurso). Função pura `core/dadoArtesMarciais.ts`,
`ladosDadoArtesMarciais(classe, nivel): number`. Usada em:
- Ataque Desarmado (dano normal hoje é fixo 1 — Bárbaro/Guerreiro
  testaram isso — Monge troca esse 1 pelo dado de Artes Marciais).
- Armas de Monge (Simples Corpo a Corpo + Marciais Corpo a Corpo com
  propriedade Leve) — usa o MAIOR entre o dado da arma e o de Artes
  Marciais, nunca os dois somados.

## 2. CA sem Armadura — generalizar a função existente, não hardcodar Monge

A função `calcularCAEquipado`/`explicarCAEquipado`
(`core/calculoPersonagem.ts`) já implementa "Defesa sem Armadura" do
Bárbaro, mas hardcoded pra Constituição e sempre mantendo o bônus com
Escudo. **Monge é diferente nos 2 pontos** (`DECISOES-DADOS.md`
"Cálculo de CA"): usa Sabedoria, não Constituição; e PERDE o benefício
se equipar Escudo (não só armadura).

**Implementação:** generaliza `temDefesaSemArmadura` pra retornar
`{ atributo: 'CON' | 'SAB'; perdeComEscudo: boolean } | null` — tabela
de lookup por classe (Bárbaro: CON/`false`; Monge: SAB/`true`), nunca
`if classe === 'Bárbaro'` espalhado. `calcularCAEquipado` passa a somar
o atributo certo, e zera o bônus (volta pra `10 + DES` puro) se
`perdeComEscudo` E tem escudo equipado.

## 3. Pontos de Foco — pool igual Fúria/Magia de Pacto, recupera nos 2 descansos

`RecursoClasse` simples (já existe o padrão). Recupera no Descanso
CURTO e no LONGO (igual Magia de Pacto do Bruxo) — `recuperaEm:
'Descanso Curto ou Longo'`. Entra em `core/recursosVisiveis.ts`
(DECISOES-CLASSES.md "Recurso de classe com contador") E nos resets de
`descansoLongo()`/`descansoCurto()` (grupo "Monge", ordem alfabética —
ver padrão já estabelecido no foco Multiclasse).

## 4. As 3 técnicas base (Defesa Paciente / Passo do Vento / Torrente de Golpes) — cada uma tem versão GRÁTIS e versão com Foco

**Corrigido na revisão final (2026-10, conferido contra o PDF):**
Defesa Paciente de graça = Desengajar (Ação Bônus); com 1 Foco =
Desengajar + Esquivar. Passo do Vento de graça = Correr (Ação Bônus);
com 1 Foco = Desengajar + Correr + salto dobrado. Torrente de Golpes
SÓ existe gastando 1 Foco (2 Ataques Desarmados) — a opção "de graça"
que o app mostra nela é o Ataque Desarmado Adicional de Artes Marciais
(nível 1, Ação Bônus, sem Foco), reaproveitado nessa mesma tela. **UI: 3 itens no
painel de Ação Bônus**, cada um abrindo uma escolha binária "de graça"
vs "gastar 1 Foco" no toque — mesmo padrão de escolha dupla já usado
em outras características com versão básica/aprimorada (ex.: magia
grátis vs espaço). Foco Aprimorado (nível 10) só muda o TEXTO do efeito
aprimorado de cada uma — não cria opção nova.

## 5. Torrente de Golpes — múltiplos Ataques Desarmados como 1 Ação Bônus

Ao usar a versão com Foco, concede 2 Ataques Desarmados (3 com Foco
Aprimorado, nível 10) como UMA Ação Bônus — **não** é "Ataque Extra"
(que já existe, nível 5, dobra a Ação normal). Interage com Ataque
Extra: um Monge nível 5+ pode atacar 2x na Ação E mais 2x (3x com Foco
Aprimorado) na Ação Bônus via Torrente — total de até 5 Ataques
Desarmados num turno. **Implementação:** mesmo padrão de "clique em
Atacar quantas vezes a regra permitir" já usado pra Ataque Extra (não
é um fluxo automatizado de N rolagens em sequência) — Torrente de
Golpes só PRECISA liberar o botão de Atacar Desarmado dentro do painel
de Ação Bônus, sem motor novo.

## 6. Golpe Atordoante — efeito pós-acerto, gasta Foco, salvaguarda CON

1x por turno, ao ACERTAR um ataque (não ao decidir atacar) — mesmo
padrão de "efeito bônus pós-ataque/pós-conjuração" já registrado em
`DECISOES-DESIGN.md` ("Efeito bônus pós-conjuração que atravessa aba —
modal no FichaShell"). Reaproveita esse modal: depois de um Ataque
Desarmado/arma de Monge acertar, oferece "gastar 1 Foco pra tentar
Golpe Atordoante?" — se sim, rola salvaguarda de Constituição do alvo
(CD 8+SAB+prof) e aplica Atordoado (falha) ou Desloc. reduzido+
Vantagem no próximo ataque (sucesso) — ambos como texto informativo
(o app não rastreia condição em criaturas inimigas, mesmo tratamento
já dado a toda outra condição imposta a alvo externo).

## 7. Defletir Ataques — Reação que reduz dano recebido (padrão NOVO)

**Não existe ainda nenhum mecanismo de "reduzir dano recebido
reativamente"** no app — é genuinamente novo (PV Temporário absorve,
Resistência divide por 2, Evasão anula/divide, mas nenhum "role um
dado e subtraia do dano"). Fluxo: jogador recebe dano de ataque
corpo-a-corpo/físico → toca Reação → "Defletir Ataques" → rola 1d10 +
mod. Destreza + nível de Monge (RollOverlay) → resultado é a REDUÇÃO
(não aplica automático no PV, só mostra — quem desconta o dano final é
o jogador, nos botões −5/−1/Manual já existentes, mesmo padrão de
"a ficha nunca calcula dano recebido sozinha" usado em toda a aba
Combate). Se o resultado zerar o dano (jogador decide, fora do app),
pode gastar 1 Foco extra pra rolar contra-ataque (2x dado de Artes
Marciais + DES, salvaguarda DES do alvo) — É um 2º prompt encadeado,
mesmo padrão de bônus-extra-opcional-pós-rolagem
(`DECISOES-DESIGN.md` "Bônus opcional somado a uma rolagem concluída").
Nível 13 (Defletir Energia) só remove a restrição de tipo de dano — é
sempre a MESMA função, não uma característica nova.

## 8. Metabolismo Incomum / Foco Perfeito — gatilho em Rolar Iniciativa

Já existe o hook `aoRolarIniciativa` (`FichaShell.tsx`, usado hoje só
pelo reset de turno + recuperação de Inspiração do Bardo). Metabolismo
Incomum (nível 2, 1x por Descanso Longo) e Foco Perfeito (nível 15,
sem limite, mas só se Metabolismo Incomum NÃO foi usado nessa
iniciativa) encaixam no mesmo gatilho — como são OPCIONAIS (o jogador
PODE usar, não é automático), abre uma pergunta Sim/Não (mesmo padrão
visual das perguntas de Descanso, mas disparada por Iniciativa, não
Descanso) só quando aplicável (tem Foco gasto pra recuperar E ainda não
usou Metabolismo Incomum neste Descanso Longo).

## 9. Proficiências iniciais e equipamento

`classesProficienciasIniciais.ts`/`proficienciasArmaArmaduraClasse.ts`
ganham entrada nova (perícias: escolha 2 de Acrobacia/Atletismo/
Furtividade/História/Intuição/Religião; ferramenta: 1 de Artesão OU
Instrumento Musical; armas: Simples + Marciais Corpo a Corpo com
Leve; SEM treinamento de armadura nenhum — nem Leve). Equipamento
inicial: A) Lança+5 Adagas+ferramenta+Kit de Aventureiro+11 PO, ou B)
50 PO.

## 10. Multiclasse — já preparado, zero trabalho extra

`preRequisitosMulticlasse` (DES 13 + SAB 13), `conjuradoresMulticlasse`
(`'nenhum'`) e `proficienciasMulticlasse` (só Dado de Vida) já têm
entrada Monge no dado (`multiclasse.ts`/`conjuradorMulticlasse.ts`) —
só falta `proficienciasEntradaMulticlasse.ts` (a versão estruturada
usada pelo Level Up de verdade), que ainda só cobre Guerreiro/Bardo/
Bruxo/Mago — Monge entra ali como "nenhuma perícia/ferramenta à
escolha" (só Dado de Vida, igual Mago/Bruxo).

## 11. IDs estáveis

Toda característica nova que o código precisa RECONHECER (Defesa sem
Armadura já existe como ID; Pontos de Foco, Dado de Artes Marciais,
Torrente de Golpes etc. precisam de ID próprio em
`idsCaracteristicasClasse.ts`) — nunca comparação por nome de exibição
(seção 13 do CLAUDE.md).
