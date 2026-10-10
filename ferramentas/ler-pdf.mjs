// Leitor de PDF dos livros de referência (`livros-referencia/`) — procura um texto e mostra o trecho com a página.
// Existe porque o ambiente de trabalho não tem `pdftotext`/`pdftoppm` (2026-10, lição do "nível do truque na multiclasse").
//
// Uso (a partir da raiz do projeto):
//   npm run pdf -- <arquivo.pdf> "<regex>" [caracteres-depois=600]
//   npm run pdf -- livros-referencia/livro-do-jogador/03_-_Cap_2_Criacao_de_Personagens.pdf "Truques\." 500
//
// A busca ignora maiúsculas/minúsculas e quebra de linha (o texto de cada página é achatado). Nunca altera o PDF.
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'node:fs';

const [, , arquivo, padrao, depois = '600'] = process.argv;
if (!arquivo || !padrao) {
  console.error('Uso: npm run pdf -- <arquivo.pdf> "<regex>" [caracteres-depois]');
  process.exit(1);
}

const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(arquivo)), useSystemFonts: true }).promise;

if (padrao === '--tudo') {
  const de = Number(process.argv[4] ?? 1);
  const ate = Number(process.argv[5] ?? doc.numPages);
  for (let numero = de; numero <= Math.min(ate, doc.numPages); numero++) {
    const pagina = await doc.getPage(numero);
    const conteudo = await pagina.getTextContent();
    const linhas = conteudo.items.map((item) => item.str + (item.hasEOL ? '\n' : ' ')).join('');
    console.log('\n===== p.' + numero + ' =====\n' + linhas);
  }
  console.log('\n(' + doc.numPages + ' páginas no total)');
  process.exit(0);
}

let achados = 0;
for (let numero = 1; numero <= doc.numPages; numero++) {
  const pagina = await doc.getPage(numero);
  const conteudo = await pagina.getTextContent();
  const texto = conteudo.items.map((item) => item.str).join(' ').replace(/\s+/g, ' ');
  const regex = new RegExp(padrao, 'gi');
  let m;
  while ((m = regex.exec(texto)) !== null) {
    achados += 1;
    console.log(`--- p.${numero}: ...${texto.slice(Math.max(0, m.index - 150), m.index + Number(depois))}...`);
  }
}
console.log(`\n${achados} trecho(s) em ${doc.numPages} página(s).`);
