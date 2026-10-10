# Psiônico (Unearthed Arcana 2025 — não oficial)

Fonte: `livros-referencia/unearthed-arcana/Psionico_Atualizacoes_UA_2025.pdf`; levantamento e texto literal em `sdd/sdd-psionico.md`. Abordagem: Psiônico nível 20 no
Char Multiclasse desde o começo, tudo `[PH]`, mecânicas entrando aos poucos (`EmDev.md`).

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
