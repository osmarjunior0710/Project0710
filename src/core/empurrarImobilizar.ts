// Ataque Desarmado — opções Empurrar e Imobilizar (Glossário de Regras, Livro do Jogador 2024).
//
// "Sempre que você usar seu Ataque Desarmado, escolha uma das seguintes opções para seu efeito.
// Dano. [...] Empurrar. O alvo deve ser bem-sucedido em uma salvaguarda de Destreza ou Força (à sua
// escolha) contra um CD igual a 8 mais seu modificador de Força e Bônus de Proficiência, ou você o
// empurra 1,5 metro para longe ou impõe a condição Caído. Este empurrão só é possível se o alvo não
// for mais de um tamanho maior que você. Imobilizar. O alvo deve ser bem-sucedido em uma salvaguarda
// de Força ou Destreza (à sua escolha) ou ele tem a condição Imobilizado. A CD para a salvaguarda e
// qualquer tentativa de escapar é igual a 8 mais seu modificador de Força e Bônus de Proficiência.
// Esta imobilização só é possível se o alvo não for mais de um tamanho maior que você e se você tiver
// uma mão livre para agarrá-lo."
//
// Artes Marciais (Monge): "quando você usa a opção Empurrar ou Imobilizar do seu Ataque Desarmado,
// você pode usar seu modificador de Destreza em vez de seu modificador de Força para determinar a CD".
// O bônus de acerto do Ataque Desarmado já usa o atributo certo (Destreza do Monge quando maior),
// então CD = 8 + bônus de acerto (atributo + proficiência). O app não rola a salvaguarda do alvo.
// [codeimplementation]

import type { ExplicacaoCalculo } from './calculoPersonagem';

export type OpcaoAtaqueDesarmado = 'dano' | 'empurrar' | 'imobilizar';

/** CD das opções Empurrar/Imobilizar: 8 + o bônus de acerto do Ataque Desarmado (atributo + prof.). */
export function cdEmpurrarImobilizar(modAcertoDesarmado: number): number {
  return 8 + modAcertoDesarmado;
}

/** Conta do ⓘ: "CD base 8" + as linhas do acerto (mod. do atributo, Bônus de Proficiência). */
export function explicarCdEmpurrarImobilizar(linhasDoAcerto: { label: string; valor: string }[], cd: number): ExplicacaoCalculo {
  return {
    linhas: [{ label: 'CD base', valor: '8' }, ...linhasDoAcerto],
    total: { label: 'CD', valor: String(cd) },
  };
}

export const TEXTO_EMPURRAR = {
  titulo: '🤼 Empurrar',
  atributo: 'Destreza ou Força',
  falha: 'você o empurra 1,5 m para longe ou impõe a condição Caído (à sua escolha)',
  sucesso: 'nada acontece',
  aviso: 'Só vale se o alvo não for mais de um tamanho maior que você.',
} as const;

export function textosImobilizar(cd: number) {
  return {
    titulo: '🤝 Imobilizar',
    atributo: 'Força ou Destreza',
    falha: `o alvo tem a condição Imobilizado — a CD pra escapar também é ${cd}`,
    sucesso: 'nada acontece',
    aviso: 'Só vale se o alvo não for mais de um tamanho maior que você e se você tiver uma mão livre pra agarrá-lo.',
  };
}
