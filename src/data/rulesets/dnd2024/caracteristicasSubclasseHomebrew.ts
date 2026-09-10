// Necromante (Mago) — subclasse HOMEBREW, transcrita à mão do PDF
// "Subclasses Arcanas" enviado pelo Osmar (não está na planilha mestra
// nem em nenhum livro oficial — regra ainda não confirmada, sujeita a
// revisão quando o material oficial sair). Diferente de
// `caracteristicasSubclasse.ts` (gerado da planilha, "Não editar
// valores à mão"), este arquivo É a fonte primária desse texto — não
// existe outro lugar de onde regenerar. Ver DECISOES-CLASSES.md "B0"
// (convenção de marcação homebrew) e "B1".

import type { CaracteristicaSubclasse } from './caracteristicasSubclasse';

export const caracteristicasSubclasseHomebrew: CaracteristicaSubclasse[] = [
  {
    classe: 'Mago',
    subclasse: 'Necromante',
    nivel: 3,
    nome: 'Perito em Necromancia',
    descricao:
      'Você aprende duas magias de Necromancia de até 2º círculo à sua escolha, que são adicionadas gratuitamente ao seu Livro de Magias. Além disso, sempre que você atingir um novo nível de círculo de magia disponível pra você, aprende mais uma magia de Necromancia daquele círculo ou de círculo inferior, também adicionada gratuitamente ao seu Livro de Magias.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    subclasse: 'Necromante',
    nivel: 3,
    nome: 'Grimório de Necromancia',
    descricao:
      'Você ganha três benefícios: Resistência Necrótica (você tem Resistência a dano Necrótico); Colheita Macabra (sempre que conjurar uma magia de Necromancia usando um espaço de magia, um Morto-Vivo aliado à sua escolha a até 18 metros recupera Pontos de Vida iguais ao dobro do círculo da magia); Familiar Morto-Vivo (ao conjurar Encontrar Familiar, você pode fazer seu familiar assumir a forma de Esqueleto ou Zumbi em vez das formas usuais).',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    subclasse: 'Necromante',
    nivel: 6,
    nome: 'Poder Funesto',
    descricao:
      'Sua Recuperação Arcana também reduz sua Exaustão em 1 nível, se você tiver algum. Além disso, seu dano de Necromancia ignora Resistência a dano Necrótico.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    subclasse: 'Necromante',
    nivel: 6,
    nome: 'Legião dos Mortos',
    descricao:
      'Você sempre tem a magia Animar Mortos preparada, e pode conjurá-la uma vez sem gastar um espaço de magia, recuperando esse uso ao completar um Descanso Longo. Além disso, os Mortos-Vivos que você convoca ou cria com uma magia de Necromancia ganham Pontos de Vida extras iguais ao seu nível de Mago, e seus ataques causam dano bônus igual ao seu modificador de Inteligência.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    subclasse: 'Necromante',
    nivel: 10,
    nome: 'Colheita dos Mortos',
    descricao:
      'Quando você ficar Ensanguentado, pode usar uma Reação pra reduzir a 0 Pontos de Vida um Morto-Vivo sob seu controle a até 18 metros e recuperar Pontos de Vida iguais ao dobro do nível do Morto-Vivo (ou ND, se aplicável).',
    tipoAcao: 'Reação',
  },
  {
    classe: 'Mago',
    subclasse: 'Necromante',
    nivel: 14,
    nome: 'Mestre da Morte',
    descricao:
      'Como Ação Bônus, você pode conceder Pontos de Vida Temporários a todos os Mortos-Vivos sob seu controle a até 18 metros, iguais ao seu nível de Mago. Além disso, sempre que um Morto-Vivo sob seu controle for reduzido a 0 Pontos de Vida, você pode usar sua Reação pra causar uma explosão de energia necrótica: cada criatura à sua escolha a até 3 metros do Morto-Vivo sofre dano Necrótico igual a 2d10 + seu modificador de Inteligência (salvaguarda de Destreza pra reduzir à metade, CD igual à sua CD de magia).',
    tipoAcao: 'Reação',
  },
];
