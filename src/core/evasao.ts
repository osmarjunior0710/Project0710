// Evasão (Monge, nível 7) — "Ao ser alvo de um efeito que permita uma
// salvaguarda de Destreza para receber apenas metade do dano, você não
// recebe dano em caso de sucesso e sofre apenas metade do dano se falhar.
// Você não se beneficia dessa característica se tem a condição
// Incapacitado." Só aviso informativo ao lado da Salvaguarda de Destreza
// (o app não rastreia dano de efeito de monstro). [codeimplementation]

export function temEvasao(nivelMonge: number): boolean {
  return nivelMonge >= 7;
}

export const TEXTO_EVASAO = '(Evasão: passou = 0 dano, falhou = metade)';
