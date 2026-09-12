import { useState } from 'react';
import { contarTrocas } from '../../../core/magiasPersonagem';

/**
 * Consolida o padrão repetido nos passos de escolha múltipla do
 * `LevelUpShell` (Truques, Livro de Magias, Magias Preparadas,
 * Invocações Místicas, Descobertas Mágicas, Especialista,
 * Proficiências Bônus, Perito em Necromancia) — todos seguiam a MESMA
 * forma (`useState<string[]>` iniciado com o que o personagem já tem +
 * função `toggle` que soma/remove até um máximo, com regra própria de
 * quando um item já conhecido pode ser destrocado) (G4.1 do foco de
 * saúde do projeto, ver `EmDevB.md`).
 *
 * `bloqueado` trava um nome por completo (nem soma nem remove) — usado
 * por Truques/Magias Preparadas (item já conhecido só troca no
 * Descanso Longo pra classes com `usaRedefinicaoPorDescanso`) e Livro
 * de Magias/Especialista (grimório/especialização nunca perdem o que
 * já foi ganho). `podeRemover`/`podeAdicionar` cobrem regras que
 * dependem do conjunto ATUAL de escolhidos (ex.: cadeia de
 * dependência de Invocações Místicas) — nenhum dos dois é chamado se
 * `bloqueado` já vetou o nome.
 *
 * Puramente derivado de um `useState` só seu (sem efeito), mas mora em
 * `ui/ficha/hooks/` seguindo a mesma convenção de `recursoGasto.ts` —
 * embrulha estado de React específico da tela de Level Up, não é
 * motor de cálculo de `core/`.
 */
export function useEscolhaMultipla(
  atuais: string[],
  max: number,
  opcoes?: {
    bloqueado?: (nome: string) => boolean;
    podeRemover?: (nome: string, escolhidos: string[]) => boolean;
    podeAdicionar?: (nome: string, escolhidos: string[]) => boolean;
  },
) {
  const [escolhidos, setEscolhidos] = useState<string[]>(atuais);

  function toggle(nome: string) {
    if (opcoes?.bloqueado?.(nome)) return;
    const i = escolhidos.indexOf(nome);
    if (i > -1) {
      if (opcoes?.podeRemover && !opcoes.podeRemover(nome, escolhidos)) return;
      setEscolhidos((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (opcoes?.podeAdicionar && !opcoes.podeAdicionar(nome, escolhidos)) return;
    if (escolhidos.length < max) setEscolhidos((prev) => [...prev, nome]);
  }

  const trocas = contarTrocas(atuais, escolhidos);

  return { escolhidos, setEscolhidos, toggle, trocas };
}
