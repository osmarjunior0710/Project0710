// Gerado a partir de dnd-master-referencia.xlsx, aba "Ferramentas"
// (coluna "Variantes" pra Instrumento Musical/Kit de Jogos; linhas da
// categoria "Ferramentas de Artesão" pra esse grupo; coluna "Uso (ação
// Usar Objeto)" como descrição). Não editar à mão.
//
// Instrumento Musical e Kit de Jogos só têm 1 linha de "Uso" na planilha
// (vale pra qualquer variante do grupo) — por isso os itens desses dois
// grupos compartilham a mesma descrição entre si.

export interface OpcaoFerramenta {
  nome: string;
  preco: string | null;
  peso: string | null;
  descricao: string | null;
  atributo: string | null;
}

/** Opções de ferramenta de 1 ou mais grupos juntos (ex.: Monge —
 * "Ferramentas de Artesão OU Instrumento Musical", as 2 listas somadas
 * numa escolha só) — ver `classesProficienciasIniciais.ts`
 * `ferramentasEscolha.grupo`. */
export function opcoesDosGrupos(grupo: string | string[]): OpcaoFerramenta[] {
  const grupos = Array.isArray(grupo) ? grupo : [grupo];
  return grupos.flatMap((g) => gruposFerramenta[g] ?? []);
}

export const gruposFerramenta: Record<string, OpcaoFerramenta[]> = {
  "Instrumento Musical": [
    { nome: "Alaúde", preco: "35 PO", peso: "1 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Flauta", preco: "2 PO", peso: "0,5 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Flauta de Pan", preco: "12 PO", peso: "1 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Gaita de Foles", preco: "30 PO", peso: "3 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Lira", preco: "30 PO", peso: "1 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Oboé", preco: "2 PO", peso: "0,5 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Tambor", preco: "6 PO", peso: "1,5 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Trombeta", preco: "3 PO", peso: "1 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Violino", preco: "30 PO", peso: "0,5 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
    { nome: "Xilofone", preco: "25 PO", peso: "5 kg", descricao: "Tocar uma música conhecida (CD 10) ou improvisar uma música (CD 15)", atributo: "Carisma" },
  ],
  "Kit de Jogos": [
    { nome: "Dados", preco: "1 PP", peso: null, descricao: "Discernir se alguém está trapaceando (CD 10) ou ganhar o jogo (CD 20)", atributo: "Sabedoria" },
    { nome: "Xadrez-do-Dragão", preco: "1 PO", peso: null, descricao: "Discernir se alguém está trapaceando (CD 10) ou ganhar o jogo (CD 20)", atributo: "Sabedoria" },
    { nome: "Baralho", preco: "5 PP", peso: null, descricao: "Discernir se alguém está trapaceando (CD 10) ou ganhar o jogo (CD 20)", atributo: "Sabedoria" },
    { nome: "Conjunto do Jogo dos Três Dragões", preco: "1 PO", peso: null, descricao: "Discernir se alguém está trapaceando (CD 10) ou ganhar o jogo (CD 20)", atributo: "Sabedoria" },
  ],
  "Ferramentas de Artesão": [
    { nome: "Ferramentas de Ferreiro", preco: "20 PO", peso: "4 kg", descricao: "Forçar a abertura de uma porta ou recipiente (CD 20)", atributo: "Força" },
    { nome: "Ferramentas de Funileiro", preco: "50 PO", peso: "5 kg", descricao: "Monte um item Minúsculo composto de sucata, que se desfaz em 1 minuto (CD 20)", atributo: "Destreza" },
    { nome: "Ferramentas de Carpinteiro", preco: "8 PO", peso: "3 kg", descricao: "Selar ou abrir uma porta ou recipiente (CD 20)", atributo: "Força" },
    { nome: "Ferramentas de Cartógrafo", preco: "15 PO", peso: "3 kg", descricao: "Elaborar o mapa de uma pequena área (CD 15)", atributo: "Sabedoria" },
    { nome: "Ferramentas de Joalheiro", preco: "25 PO", peso: "1 kg", descricao: "Discernir o valor de uma gema (CD 15)", atributo: "Inteligência" },
    { nome: "Ferramentas de Oleiro", preco: "10 PO", peso: "1,5 kg", descricao: "Discernir como um objeto de cerâmica foi manuseado nas últimas 24 horas (CD 15)", atributo: "Inteligência" },
    { nome: "Ferramentas de Coureiro", preco: "5 PO", peso: "2,5 kg", descricao: "Moldar a estética de um item de couro (CD 10)", atributo: "Destreza" },
    { nome: "Ferramentas de Pedreiro", preco: "10 PO", peso: "4 kg", descricao: "Cinzelar um símbolo ou buraco na pedra (CD 10)", atributo: "Força" },
    { nome: "Ferramentas de Entalhador", preco: "1 PO", peso: "2,5 kg", descricao: "Entalhar um padrão em madeira (CD 10)", atributo: "Destreza" },
    { nome: "Ferramentas de Sapateiro", preco: "5 PO", peso: "2,5 kg", descricao: "Modificar calçado para conceder Vantagem no próximo teste de Destreza (Acrobacia) do usuário (CD 10)", atributo: "Destreza" },
    { nome: "Ferramentas de Tecelão", preco: "1 PO", peso: "2,5 kg", descricao: "Reparar um rasgo em uma roupa (CD 10) ou costurar um ornamento Minúsculo (CD 10)", atributo: "Destreza" },
    { nome: "Ferramentas de Navegador", preco: "25 PO", peso: "1 kg", descricao: "Traçar uma rota (CD 10) ou determinar a posição observando as estrelas (CD 15)", atributo: "Sabedoria" },
    { nome: "Ferramentas de Vidreiro", preco: "30 PO", peso: "2,5 kg", descricao: "Discernir como um objeto de vidro foi manuseado nas últimas 24 horas (CD 15)", atributo: "Inteligência" },
    { nome: "Suprimentos de Alquimista", preco: "50 PO", peso: "4 kg", descricao: "Identificar uma substância (CD 15) ou iniciar um incêndio (CD 15)", atributo: "Inteligência" },
    { nome: "Suprimentos de Calígrafo", preco: "10 PO", peso: "2,5 kg", descricao: "Escrever texto com uma caligrafia que protege contra falsificação (CD 15)", atributo: "Destreza" },
    { nome: "Suprimentos de Cervejeiro", preco: "20 PO", peso: "4,5 kg", descricao: "Detectar bebida envenenada (CD 15) ou identificar álcool (CD 10)", atributo: "Inteligência" },
    { nome: "Suprimentos de Pintor", preco: "10 PO", peso: "2,5 kg", descricao: "Fazer uma pintura reconhecível de algo que você viu (CD 10)", atributo: "Sabedoria" },
    { nome: "Utensílios de Cozinheiro", preco: "1 PO", peso: "4 kg", descricao: "Melhorar o sabor dos alimentos (CD 10) ou detectar alimentos estragados ou envenenados (CD 15)", atributo: "Sabedoria" },
  ],
  // Ferramentas "avulsas" da planilha (categoria "Outras Ferramentas",
  // fora de Instrumento Musical/Kit de Jogos) — preço/peso completados
  // direto da planilha mestra (aba Ferramentas) pra entrarem na Loja;
  // antes só tinham descrição (ver `descricaoFerramentaFixa` abaixo).
  "Ferramentas Avulsas": [
    { nome: "Ferramentas de Ladrão", preco: "25 PO", peso: "0,5 kg", descricao: "Abrir uma fechadura (CD 15) ou desarmar uma armadilha (CD 15)", atributo: "Destreza" },
    { nome: "Kit de Disfarce", preco: "25 PO", peso: "1,5 kg", descricao: "Aplicar maquiagem (CD 10)", atributo: "Carisma" },
    { nome: "Kit de Falsificação", preco: "15 PO", peso: "2,5 kg", descricao: "Imitar 10 ou menos palavras escritas de outra pessoa (CD 15) ou duplicar um selo de cera (CD 20)", atributo: "Destreza" },
    { nome: "Kit de Herbalismo", preco: "5 PO", peso: "1,5 kg", descricao: "Identificar uma planta (CD 10)", atributo: "Inteligência" },
    { nome: "Kit de Veneno", preco: "50 PO", peso: "1 kg", descricao: "Detectar um objeto envenenado (CD 10)", atributo: "Inteligência" },
  ],
};

// Ferramentas de categoria "fixa" (não fazem parte de um grupo de escolha) —
// usadas pra dar descrição ao InfoChip de "Per. com Ferramentas:" na tela de
// Escolhas da Origem.
export const descricaoFerramentaFixa: Record<string, string> = {
  "Suprimentos de Calígrafo": "Escrever texto com uma caligrafia que protege contra falsificação (CD 15)",
  "Ferramentas de Ladrão": "Abrir uma fechadura (CD 15) ou desarmar uma armadilha (CD 15)",
  "Kit de Falsificação": "Imitar 10 ou menos palavras escritas de outra pessoa (CD 15) ou duplicar um selo de cera (CD 20)",
  "Kit de Herbalismo": "Identificar uma planta (CD 10)",
  "Ferramentas de Carpinteiro": "Selar ou abrir uma porta ou recipiente (CD 20)",
  "Ferramentas de Cartógrafo": "Elaborar o mapa de uma pequena área (CD 15)",
  "Ferramentas de Navegador": "Traçar uma rota (CD 10) ou determinar a posição observando as estrelas (CD 15)",
  "Kit de Disfarce": "Aplicar maquiagem (CD 10)",
  "Kit de Veneno": "Detectar um objeto envenenado (CD 10)",
};
