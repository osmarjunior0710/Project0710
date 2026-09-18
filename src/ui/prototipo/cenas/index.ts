import type { ComponentType } from 'react';
import ExemploRolagemSimples from './ExemploRolagemSimples';

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
];
