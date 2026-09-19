import type { ComponentType } from 'react';
import ExemploRolagemSimples from './ExemploRolagemSimples';
import AcertoErroCena from './AcertoErroCena';
import EsmagadorTalhadorCena from './EsmagadorTalhadorCena';

export interface CenaPrototipo {
  id: string;
  titulo: string;
  descricao: string;
  Componente: ComponentType;
}

/** Catálogo de cenas do ambiente de Protótipo (ver
 * `sdd/sdd-fluxo-rolagem.md`) — adicionar uma cena nova é só uma
 * entrada aqui, sem mexer em rota nem no shell. Cada cena tem estado
 * 100% local, sem `armazenamentoPersonagens`/`core/calculoPersonagem`
 * — só pode reaproveitar UI genérica de verdade (RollContext, botões/
 * cards padrão do app). */
export const cenasPrototipo: CenaPrototipo[] = [
  {
    id: 'exemplo-rolagem',
    titulo: 'Exemplo — Rolagem simples',
    descricao: 'Prova que o ambiente consegue rolar dado de verdade fora do fluxo de personagem.',
    Componente: ExemploRolagemSimples,
  },
  {
    id: 'acerto-erro',
    titulo: 'Acerto/Erro — Ataque com efeito',
    descricao: '3 variantes trocáveis pra decidir o fluxo de ataque→dano→efeito (ver sdd-fluxo-rolagem.md).',
    Componente: AcertoErroCena,
  },
  {
    id: 'esmagador-talhador',
    titulo: 'Esmagador/Talhador — gatilho automático por tipo de dano',
    descricao:
      'Ataque sem "renunciar" nada antes — só pergunta Acerto/Erro quando a arma bate o tipo de dano, tem o talento e ele ainda não foi usado no turno. Popup final com "Ativar"/"Não usar".',
    Componente: EsmagadorTalhadorCena,
  },
];
