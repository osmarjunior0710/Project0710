# Psiônico (Unearthed Arcana 2025 — não oficial)

Fonte: `livros-referencia/unearthed-arcana/Psionico_Atualizacoes_UA_2025.pdf`; levantamento e texto literal em `sdd/sdd-psionico.md`. Abordagem: Psiônico nível 20 no
Char Multiclasse desde o começo, tudo `[PH]`, mecânicas entrando aos poucos (`EmDev.md`).

Subclasse **Psicinético** — ver `aprendizados/classes/psionico-psicinetico.md` (foco próprio, 100% fechado). As outras 3
subclasses (Metamorfo, Dobrador Psíquico, Telepata) e os Talentos Selvagens (E7) ainda não têm foco próprio.

## E1a — esqueleto da classe
- `classePsionico.ts` (tabelas conferidas vs PDF: espaços = Mago, truques pela tabela, Dados de Energia Psiônica) + características com texto literal, status `placeholder-*`.
- Registrada em `classes.ts` / `caracteristicasClasse.ts` / proficiências / conjurador completo / cor (roxo) / multiclasse **igual ao Mago (provisório, decisão do Osmar)**.
- `disponivel: false` até a classe ficar jogável (wizard mostra "em breve"); Char Multiclasse já a usa.

## E2 — magias
- `magiasPsionico.ts` é **gerado** (script descartável: planilha aba UA Psion + texto do PDF + campos estruturados conferidos no PDF): 18 magias novas (17 do PDF + Animar Mortos da planilha) e a lista da classe (143 do PDF + Animar Mortos).
- `magias.ts` ficou assim: `magiasOficiais` (gerado da planilha) → `magias = aplicarListaPsionico(magiasOficiais)`: magia oficial da lista só ganha `'Psiônico'` em `classes` (sem duplicar); as novas são acrescentadas.
- **A lista do PDF usa nomes diferentes do catálogo** em 8 oficiais (Amizade→Amigos, Prestidigitação→Prestidigitação Arcana, Escudo→Escudo Arcano, Boca Mágica→Boca Encantada, Levitar→Levitação, Metamorfose 4º→Polimorfia, Inverter Gravidade→Inverter a Gravidade, Palavra de Poder: Curar→Salvar) e em 5 UA (nome da lista ≠ nome do texto: usamos o da planilha).
- **Achado no catálogo:** "Animar Mortos" NÃO tem entrada própria em `magias.ts` — o texto dela ficou colado no fim da descrição de outra magia (extração da planilha). Por isso entra como magia nova da aba UA Psion. Ver `PENDENCIAS.md`.
- Conferido na tela (360px, Char Multiclasse): aba Magias e picker "Usar Magia" (Ação) listam as magias do Psiônico, com a etiqueta da classe.

## E3 — recurso base e as 3 primeiras características de classe
- **Dados de Energia Psiônica** (E3a): contador em Combate com descanso Curto (-1) e Longo (reseta tudo) — vira o recurso
  central que praticamente toda característica futura do Psiônico gasta ou rola.
- **Conexão Telepática** (E3c): Ação Bônus, rola o dado, grátis 1x por Descanso Longo, anota o alcance.
- **Telecinese Sutil** (E3d): Mãos Mágicas de graça, fora do limite normal de truques conhecidos.
- **Impulso Telecinético** (E3b): Ação Bônus com 2 saídas (sem dado = 1,5m fixo; com Dado de Energia = 5m × resultado,
  só gasto se o alvo FALHAR a salvaguarda) — este popup voltou a ser tocado depois, em E6c-c (Técnicas Telecinéticas
  acrescentou uma 3ª opção, 1d4, ver `aprendizados/classes/psionico-psicinetico.md`).

## E4 — as 11 Disciplinas Psiônicas (escolha no Level Up)
Quebra em 4 sub-focos, do jeito mais simples pro mais complexo:
- **E4a** — escolha em si (Level Up nível 2: 2 disciplinas, +1 em 5/10/13/17, pode trocar 1 por nível) + regra "1 disciplina
  comum por turno" (`disciplinasPsionicas.ts`), com 2 exceções que NÃO contam no limite (Defesa Psiônica, Mente Aguçada).
- **E4b** — as 4 disciplinas "soma +nDx numa rolagem" (Consciência Expandida/Língua Diabólica/Mente Atenta/Mira Inerrante):
  botão no popup de rolagem, dado só gasto se a rolagem base DER CERTO.
- **E4c** — as 4 disciplinas "pós-conjuração com escolha" (Aperfeiçoamento de Precognição/Bio-Retorno/Insinuação do
  Id/Pensamentos Destrutivos): popup novo (`DisciplinaPosConjuracaoModal.tsx`) que pergunta "usar?" depois de conjurar
  magia de escola específica. 2 ajustes do Osmar na sequência (E4c.1/E4c.2) corrigiram 2 problemas reais: (1) 2 popups
  abrindo ao mesmo tempo (Disciplina + Salvaguarda) fazia o resultado da Disciplina "sumir" atrás do segundo — corrigido
  adiando a Salvaguarda até a Disciplina resolver, com o resultado virando linha extra dentro dela via o campo `aviso`
  genérico (este é o MESMO campo reaproveitado depois por Esmagamento Aprimorado e Telecinese Intensificada — ver
  `DECISOES-CLASSES.md`); (2) pips sem rótulo/cor errada — corrigido pro padrão visual que todo recurso com contador usa.
- **E4d** — as 3 disciplinas "estado entre turnos/Reação" (Defesa Psiônica/Mente Aguçada/Retaliação Psíquica). Defesa
  Psiônica fixou o padrão "nunca precisa de botão de encerrar manual quando a duração bate com um gatilho automático do
  app" (aqui: "até o início do próximo turno" = Fim do Turno + Descanso Curto + Longo, todos encerram sozinhos). Mente
  Aguçada foi a entrega mais iterada do foco inteiro — 3 rodadas de feedback do Osmar até o popup de "trocar o menor dado
  por um número anotado" virar o padrão definitivo (`OfertaTrocaDeDado` no `RollContext`, título + card clicável
  empilhados, nunca ao lado de outro botão) — esse padrão depois virou a base do Surto Psiônico (E5c) e Transe
  Destrutivo (E6c-f). 2 bugs de staleness encontrados por inspeção de código (não ao vivo) nessa entrega: valor
  capturado ANTES de uma troca/aplicação nunca refletia o valor DEPOIS — a lição generalizada ("sempre que o motor pode
  mudar um resultado DEPOIS do `onResultado`, quem chama precisa de um callback próprio tipo `onXAplicado` pra atualizar
  a variável capturada") voltou a se provar certa em toda entrega seguinte que usou o mesmo molde.

Com E4d-c (Retaliação Psíquica), as 11 Disciplinas Psiônicas ficaram 100% implementadas, zero `placeholder-*` restante.

## E5 — as 4 características de nível alto (5/7/18/20) + o "funil único"
- **E5a** Restauração Psiônica (nível 5) e **E5b** Reservas Psiônicas (nível 18) são simples: a primeira reaproveita o
  padrão de 3 estados do Astúcia Mágica do Bruxo, a segunda é automática em toda rolagem de Iniciativa (mesmo molde do
  Foco Perfeito do Monge) — a única pegadinha foi as 2 mensagens de recuperação (Foco Perfeito + Reservas Psiônicas)
  precisarem ser combinadas numa string só quando o personagem tem as 2 classes ao mesmo tempo (Char Multiclasse sempre
  tem), senão uma sobrescrevia a outra.
- **E5c** Surto Psiônico (nível 7) é a entrega mais importante do foco em termos de ARQUITETURA: o Osmar pediu um "funil
  único" pra garantir que nenhuma característica futura esquecesse de aplicar o Surto — em vez de cada característica
  saber da regra, o MOTOR de dado (`RollContext.tsx`) decide sozinho quando oferecer, a partir de 1 provider registrado
  1x e de uma MARCAÇÃO na rolagem (`ehDadoDeEnergiaPsionica`) que um funil fino (`rolarDadoDeEnergiaPsionica.ts`) aplica
  automaticamente. Ver `DECISOES-CLASSES.md` "Surto Psiônico — funil único" pro padrão completo, generalizável pra
  qualquer "dado especial que N características diferentes rolam" de qualquer classe futura — reaproveitado por
  praticamente toda entrega Psiônico depois dessa. 3 rodadas de ajuste do Osmar testando ao vivo (E5c.1-E5c.3): mostrar
  quantos Dados de Vida restam antes de decidir gastar (Dado de Vida não tem pips visíveis, diferente do Dado de
  Energia); **a 1ª ocorrência** do problema "botão desabilitado com `btn-primary` + opacity ad-hoc ainda parece
  clicável" (registrado em `LICOES-RAPIDAS.md`, ~8 arquivos fora do Psiônico ainda não auditados) — esse mesmo tipo de
  problema voltou a aparecer depois em Esmagamento Aprimorado (E6c-e) e virou a convenção de cor de botão
  (`CONVENCOES-UI.md`); e hierarquia visual do card (título preso dentro do card, não boiando solto).
- **E5d-prep + E5d** Força Vital Incandescente (nível 20) reaproveitou a MESMA superfície do Surto, mas precisou de
  `temContextoDeTurno` (preparado em E5d-prep) pra respeitar "1x por turno" de verdade SEM travar errado quando a
  conjuração vem da aba Magias (sem conceito de turno nenhum) — bug latente achado nessa preparação: o Modo de Ataque da
  Mente Aguçada (já publicado) tinha exatamente esse problema e nunca tinha sido percebido. Esse campo
  (`DisciplinaPosConjuracaoPendente.temContextoDeTurno`) virou o padrão pra qualquer efeito "1x por turno" ligado a
  conjuração daqui pra frente (ver `DECISOES-CLASSES.md`). **Pendência conhecida** (`PENDENCIAS.md`): os dados extra da
  Força Vital rolam só em 2D, sem o motor 3D — aceito como 1ª versão, nunca resolvido depois (baixa prioridade).

## Padrões que este foco deixou pro resto do projeto
- `DECISOES-CLASSES.md` "Surto Psiônico — funil único", "Efeito '1x por turno' ligado a conjuração", "Conjurar uma magia
  específica sem gastar Espaço, pagando outro recurso" (este último da subclasse Psicinético, ver arquivo próprio).
- `CONVENCOES-UI.md` "Cores de botão" (azul = padrão, cinza médio = fechar, cinza claro = desativado, cor da classe =
  recurso específico) — nasceu de um popup Psiônico, mas já é regra pro app inteiro.
- O campo genérico `aviso`/`avisoDisciplina` nos popups de Salvaguarda/Disciplina — usado pela 1ª vez em E4c, reaproveitado
  sem mudança nenhuma em Esmagamento Aprimorado e Telecinese Intensificada.
