import dadoD4 from '../../assets/icones-dados/dado-d4.webp';
import dadoD6 from '../../assets/icones-dados/dado-d6.webp';
import dadoD8 from '../../assets/icones-dados/dado-d8.webp';
import dadoD10 from '../../assets/icones-dados/dado-d10.webp';
import dadoD12 from '../../assets/icones-dados/dado-d12.webp';
import dadoD20 from '../../assets/icones-dados/dado-d20.webp';
import dadoD100 from '../../assets/icones-dados/dado-d100.webp';

export type LadosComArte = 4 | 6 | 8 | 10 | 12 | 20 | 100;

/** Arte por tipo de dado — compartilhada entre qualquer tela que role
 * dado de verdade (RollOverlay, tela dramática de PV do Level Up).
 * `d100` usa a mesma arte de "2×d10" (na mesa física seriam 2 d10; o
 * app rola 1-100 direto numa jogada só, mas a arte mantém a
 * referência visual do par). */
const IMG_POR_LADOS: Record<LadosComArte, string> = {
  4: dadoD4,
  6: dadoD6,
  8: dadoD8,
  10: dadoD10,
  12: dadoD12,
  20: dadoD20,
  100: dadoD100,
};

/** `undefined` = tipo de dado sem arte (ex.: "1d1" de um valor fixo
 * disfarçado de rolagem) — quem usa deve cair de volta na moldura
 * genérica antiga nesse caso. */
export function artePorLados(lados: number | undefined): string | undefined {
  return lados !== undefined && lados in IMG_POR_LADOS ? IMG_POR_LADOS[lados as LadosComArte] : undefined;
}
