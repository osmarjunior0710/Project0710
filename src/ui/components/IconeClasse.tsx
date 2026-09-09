// WebP em vez de PNG (Osmar pediu compressão — mesmas artes 512×512,
// ~82% menores sem perda visível no tamanho de emblema exibido; ver
// DECISOES-DESIGN.md "Ícones de classe/subclasse viram WebP").
const iconeModulos = import.meta.glob('../../assets/icones-classes/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function iconePng(id: string): string | undefined {
  const entrada = Object.entries(iconeModulos).find(([caminho]) => caminho.endsWith(`/${id}.webp`));
  return entrada?.[1];
}

function bannerPng(id: string): string | undefined {
  const entrada = Object.entries(iconeModulos).find(([caminho]) => caminho.endsWith(`/${id}-banner.webp`));
  return entrada?.[1];
}

/** `true` = já existe emblema próprio (arquivo `{id}-banner.webp`) pra
 * esse id — `false` = ainda cai no fallback 🖼, ou seja, é placeholder
 * de arte (ver seção 12 do CLAUDE.md). Usado por quem precisa marcar
 * "[PH]" explicitamente quando falta arte própria (ex: card de escolha
 * de subclasse), não só deixar o 🖼 falar por si. */
export function temBannerProprio(id: string): boolean {
  return bannerPng(id) !== undefined;
}

interface IconeClasseProps {
  id: string;
  /** classe CSS pra caixa quando não há emblema-banner (fallback ícone
   * antigo ou 🖼) — ex: "opt-card-img". O emblema em si usa sempre
   * "opt-card-img-emblema", que já é responsivo o bastante pra
   * qualquer contexto que o reaproveite (ver DECISOES-DESIGN.md). */
  classeCaixaFallback?: string;
}

/** Emblema redondo da classe (arquivo `{id}-banner.png`) — mesmo
 * componente usado na seleção de Classe do wizard e em qualquer outro
 * lugar que precise mostrar de qual classe é o personagem (ex: Lista
 * de Personagens). Classes sem arte própria ainda usam uma cópia do
 * emblema do Guerreiro como placeholder. */
export default function IconeClasse({ id, classeCaixaFallback = 'opt-card-img' }: IconeClasseProps) {
  const banner = bannerPng(id);
  if (banner) return <img src={banner} alt="" className="opt-card-img-emblema" />;
  return <div className={classeCaixaFallback}>{iconePng(id) ? <img src={iconePng(id)} alt="" /> : '🖼'}</div>;
}
