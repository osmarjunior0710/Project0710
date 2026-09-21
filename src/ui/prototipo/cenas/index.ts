import type { ComponentType } from 'react';
import PopupAtaqueSalvaguardaCena from './PopupAtaqueSalvaguardaCena';
import ConfirmacaoCriticoCena from './ConfirmacaoCriticoCena';

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
 * cards padrão do app).
 *
 * Cenas fechadas (decisão já tomada e registrada em
 * `DECISOES-COMBATE.md`, ou virou feature real) são apagadas daqui —
 * o histórico de como se chegou lá fica no Git, não precisa ocupar
 * espaço na lista. Removidas em 2026-09: "Exemplo — Rolagem simples"
 * (só prova de conceito da infra), "Acerto/Erro — Ataque com efeito"
 * e "Esmagador/Talhador" (as 2 decisões já viraram o fluxo real de
 * produção). */
export const cenasPrototipo: CenaPrototipo[] = [
  {
    id: 'popup-ataque-salvaguarda',
    titulo: 'Popup de Ataque/Salvaguarda — explorar layout único',
    descricao:
      'Ataque (Acerto/Erro, fluxo real de hoje) lado a lado com um mockup de Salvaguarda do Alvo onde cada bloco de informação (CD, dano da falha, dano do sucesso, aviso, dano condicional) liga/desliga por toggle.',
    Componente: PopupAtaqueSalvaguardaCena,
  },
  {
    id: 'confirmacao-critico',
    titulo: 'House rule — Confirmação de crítico',
    descricao:
      'Fluxo de 1 natural e 20 natural em ataque, com e sem a house rule (2º d20 de confirmação). Teste de Perícia nunca ganha o 2º dado.',
    Componente: ConfirmacaoCriticoCena,
  },
];
