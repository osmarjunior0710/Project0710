// WebP em vez de PNG, mesmo padrão de `IconeClasse.tsx` (ver
// DECISOES-DESIGN.md "Ícones de classe/subclasse viram WebP").
const iconeModulos = import.meta.glob('../../assets/icones-especies/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function bannerPng(id: string): string | undefined {
  const entrada = Object.entries(iconeModulos).find(([caminho]) => caminho.endsWith(`/${id}-banner.webp`));
  return entrada?.[1];
}

interface IconeEspecieProps {
  id: string;
  /** classe CSS pra caixa quando não há emblema ainda (fallback 🖼) —
   * ex: "opt-card-img". O emblema em si usa sempre
   * "opt-card-img-emblema", igual `IconeClasse`. */
  classeCaixaFallback?: string;
  /** 'titulo' = ícone pequeno (20px) pra usar ao lado de um
   * `section-title` (ex: aba Perfil) — sem emblema próprio ainda,
   * não renderiza nada. Omitido/`'emblema'` = comportamento de sempre. */
  variante?: 'emblema' | 'titulo';
}

/** Emblema redondo da espécie (arquivo `{id}-banner.webp`) — mesmo
 * componente/convenção de `IconeClasse.tsx`, pasta própria
 * (`assets/icones-especies/`) porque é outra categoria de escolha.
 * Espécie sem arte própria ainda usa o placeholder 🖼 genérico. */
export default function IconeEspecie({ id, classeCaixaFallback = 'opt-card-img', variante = 'emblema' }: IconeEspecieProps) {
  const banner = bannerPng(id);
  if (variante === 'titulo') {
    return banner ? <img src={banner} alt="" className="section-title-icone" /> : null;
  }
  if (banner) return <img src={banner} alt="" className="opt-card-img-emblema" />;
  return <div className={classeCaixaFallback}>🖼</div>;
}
