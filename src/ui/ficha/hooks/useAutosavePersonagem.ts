import { useEffect } from 'react';
import { armazenamentoPersonagens, type PersonagemSalvo } from '../../../core/armazenamentoPersonagens';

/**
 * Salva o personagem automaticamente sempre que um dos valores em
 * `deps` mudar — extraído do `FichaShell.tsx` (G3.1 do foco de saúde
 * do projeto, ver `EmDevB.md`) pra não precisar caçar esse `useEffect`
 * no meio de um componente de quase 2000 linhas toda vez que uma
 * classe nova ganha um campo novo pra persistir.
 *
 * `dados` é o objeto `PersonagemSalvo` completo já montado pelo
 * chamador (mesmo formato de antes, comportamento idêntico); `deps` é
 * a mesma lista granular de valores que já disparava o autosave —
 * mantida separada de `dados` de propósito: se `dados` fosse a própria
 * dependência, um objeto novo a cada render dispararia o efeito
 * sempre, mudando a cadência de salvamento. Isso NÃO reduz o "esquecer
 * de incluir um campo novo" (ainda é preciso adicionar em 3 lugares:
 * `useState`, este objeto, e `deps`) — só tira o efeito gigante de
 * dentro do componente. Ver Backlog.md pra uma versão mais profunda
 * (1 registro genérico de recursos) que resolveria isso de vez.
 */
export function useAutosavePersonagem(dados: PersonagemSalvo, deps: readonly unknown[]) {
  useEffect(() => {
    armazenamentoPersonagens.salvar(dados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
