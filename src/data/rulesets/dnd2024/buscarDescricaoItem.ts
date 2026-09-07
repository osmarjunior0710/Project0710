import { equipamentoAventura } from './equipamentoAventura';
import { montariasVeiculos } from './montariasVeiculos';
import { armas } from './armas';
import { armaduras } from './armaduras';
import { gruposFerramenta } from './ferramentas';
import { itensMagicos } from './itensMagicos';

const indiceDescricao = new Map<string, string>();
const indiceDescricaoCompleta = new Map<string, string>();
const indicePeso = new Map<string, string>();

for (const it of equipamentoAventura) {
  if (it.descricaoCurta) indiceDescricao.set(it.nome.toLowerCase(), it.descricaoCurta);
  indiceDescricaoCompleta.set(it.nome.toLowerCase(), it.descricaoCompleta);
  if (it.peso) indicePeso.set(it.nome.toLowerCase(), it.peso);
}
for (const it of montariasVeiculos) {
  if (it.descricao) indiceDescricao.set(it.nome.toLowerCase(), it.descricao);
}
for (const it of armas) {
  indiceDescricao.set(it.nome.toLowerCase(), it.descricaoCurta);
  indiceDescricaoCompleta.set(it.nome.toLowerCase(), it.descricaoCompleta);
  if (it.peso) indicePeso.set(it.nome.toLowerCase(), it.peso);
}
for (const it of armaduras) {
  indiceDescricao.set(it.nome.toLowerCase(), it.descricaoCurta);
  indiceDescricaoCompleta.set(it.nome.toLowerCase(), it.descricaoCompleta);
  if (it.peso) indicePeso.set(it.nome.toLowerCase(), it.peso);
}
for (const grupo of Object.values(gruposFerramenta)) {
  for (const it of grupo) {
    if (it.descricao) indiceDescricao.set(it.nome.toLowerCase(), it.descricao);
    if (it.peso) indicePeso.set(it.nome.toLowerCase(), it.peso);
  }
}
for (const it of itensMagicos) {
  indiceDescricao.set(
    it.nome.toLowerCase(),
    `${it.categoria} · ${it.raridade}${it.requerSintonizacao ? ' · exige Sintonização' : ''}. ${it.efeitoResumido}`,
  );
  if (it.descricaoCompleta) indiceDescricaoCompleta.set(it.nome.toLowerCase(), it.descricaoCompleta);
}

/** Busca a descrição de um item pelo nome (case-insensitive). Cobre
 * Equipamento de Aventura, Montarias/Veículos, Armas, Armaduras,
 * Ferramentas (grupos de escolha) e Itens Mágicos (Categoria ·
 * Raridade · Efeito Resumido). */
export function buscarDescricaoItem(nome: string): string | null {
  return indiceDescricao.get(nome.toLowerCase().trim()) ?? null;
}

/** Busca a descrição completa de um item pelo nome (case-insensitive).
 * Só preenchida pra categorias que já ganharam o campo `descricaoCompleta`
 * (Armaduras primeiro — ver AUDITORIA-CONTEUDO.md); `null` pras demais até
 * chegar a vez delas. */
export function buscarDescricaoCompletaItem(nome: string): string | null {
  return indiceDescricaoCompleta.get(nome.toLowerCase().trim()) ?? null;
}

/** Busca o peso de um item pelo nome (case-insensitive). `null` quando
 * o item não tem peso cadastrado na planilha (lacuna real de dado —
 * ver PENDENCIAS.md) ou não foi encontrado. */
export function buscarPesoItem(nome: string): string | null {
  return indicePeso.get(nome.toLowerCase().trim()) ?? null;
}
