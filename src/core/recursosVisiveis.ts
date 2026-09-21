// Recursos de classe "com contador de usos" que a aba Combate mostra numa
// área própria, abaixo do HP (só leitura — o gasto continua nos painéis de
// Ação/Ação Bônus/Reação). Calculado por CLASSE, com o nível DAQUELA classe,
// olhando TODAS as classes do personagem (não só a que está em foco no
// pill): um Bárbaro/Bardo/Bruxo vê as 3 linhas juntas.
//
// DIRETRIZ (pedido do Osmar, 2026-09): toda classe nova (ou característica
// nova) que tenha um recurso com contador — "tantos usos, recarrega em X" —
// que NÃO seja Espaço de Magia comum, entra aqui. Ver DECISOES-CLASSES.md.

import type { Classe } from '../data/rulesets/dnd2024/classes';
import { dadoInspiracao, usosInspiracaoMaximo } from './inspiracaoBardo';
import { espacosDeMagiaAtivos } from './magiasPersonagem';
import type { PersonagemClasse } from './multiclasse';
import type { WizardSelection } from './personagem';
import { quantidadeFuria, quantidadeRecuperarFolego } from './recursosClasse';

export interface RecursoVisivel {
  /** Estável, pra key de lista e testes. */
  id: string;
  nome: string;
  maximo: number;
  restantes: number;
  /** Um parágrafo por item — vira o texto do ⓘ. */
  descricao: string[];
}

export interface EntradaRecursosVisiveis {
  /** Todas as classes do personagem, com o nível de CADA uma. */
  classes: PersonagemClasse[];
  catalogo: Classe[];
  selecao: WizardSelection;
  gastos: {
    furia: number;
    folego: number;
    inspiracao: number;
    /** `espacosGastosPorClasseECirculo` — a chave do pool de Pacto é o nome da classe. */
    espacosPorClasseECirculo: Record<string, Record<number, number>>;
  };
}

function recuperaEm(classe: Classe, nomeRecurso: string): string {
  return classe.recursos.find((r) => r.nome === nomeRecurso)?.recuperaEm ?? 'ver a característica da classe';
}

export function montarRecursosVisiveis(e: EntradaRecursosVisiveis): RecursoVisivel[] {
  const lista: RecursoVisivel[] = [];
  for (const c of e.classes) {
    const classe = e.catalogo.find((x) => x.nome === c.classe);
    if (!classe || c.nivel <= 0) continue;

    if (classe.nome === 'Bárbaro') {
      const maximo = quantidadeFuria(classe, c.nivel);
      if (maximo > 0) {
        lista.push({
          id: 'furia',
          nome: 'Fúria',
          maximo,
          restantes: Math.max(0, maximo - e.gastos.furia),
          descricao: [
            'Estado de combate do Bárbaro: ativada como Ação Bônus (painel de Ação Bônus), dá resistência a dano Contundente, Cortante e Perfurante e bônus de dano em ataques baseados em Força.',
            `Recarrega: ${recuperaEm(classe, 'Fúrias')}.`,
          ],
        });
      }
    }

    if (classe.nome === 'Bardo') {
      const maximo = usosInspiracaoMaximo(e.selecao, classe, c.nivel);
      if (maximo > 0) {
        lista.push({
          id: 'inspiracao-de-bardo',
          nome: 'Inspiração de Bardo',
          maximo,
          restantes: Math.max(0, maximo - e.gastos.inspiracao),
          descricao: [
            `Ação Bônus: concede a uma criatura um d${dadoInspiracao(classe, c.nivel)} pra somar a um teste, jogada de ataque ou salvaguarda. Os usos são iguais ao seu modificador de Carisma (mínimo 1).`,
            `Recarrega: ${recuperaEm(classe, 'Dados de Inspiração de Bardo (tipo do dado)')}.`,
          ],
        });
      }
    }

    if (classe.nome === 'Bruxo') {
      const pacto = espacosDeMagiaAtivos(classe, c.nivel)[0];
      if (pacto && pacto.maximo > 0) {
        const gastos = e.gastos.espacosPorClasseECirculo[classe.nome]?.[pacto.circulo] ?? 0;
        lista.push({
          id: 'magia-de-pacto',
          nome: 'Magia de Pacto',
          maximo: pacto.maximo,
          restantes: Math.max(0, pacto.maximo - gastos),
          descricao: [
            `Seus espaços de magia de Bruxo são todos do mesmo círculo (${pacto.circulo}º) e sempre valem pro círculo máximo.`,
            `Recarrega: ${recuperaEm(classe, 'Espaço de Magia de Pacto (quantidade)')}.`,
          ],
        });
      }
    }

    if (classe.nome === 'Guerreiro') {
      const maximo = quantidadeRecuperarFolego(classe, c.nivel);
      if (maximo > 0) {
        lista.push({
          id: 'recuperar-folego',
          nome: 'Recuperar Fôlego',
          maximo,
          restantes: Math.max(0, maximo - e.gastos.folego),
          descricao: [
            `Ação Bônus: você recupera Pontos de Vida iguais a 1d10 + seu nível de Guerreiro (${c.nivel}).`,
            `Recarrega: ${recuperaEm(classe, 'Recuperar Fôlego (usos)')}.`,
          ],
        });
      }
    }
  }
  return lista;
}
