/** Ao apertar "Avançar" com escolha faltando: rola até o 1º cabeçalho de
 * seção incompleto e o faz piscar em vermelho por alguns segundos. Heurística
 * de DOM (vale pra qualquer passo do wizard sem cada um precisar declarar o
 * que falta):
 * - cabeçalho = `.section-title` OU `.label` que começa com "Escolha";
 * - com contador "(n/N)" → falta se n < N;
 * - sem contador e com "escolh" no texto → falta se nenhum item da seção
 *   (até o próximo cabeçalho) está marcado (`.checked` ou `.selected`).
 * Devolve `true` se achou algo pra destacar. */
const DURACAO_MS = 3200;

function ehCabecalho(el: Element): boolean {
  if (el.classList.contains('section-title')) return true;
  return el.classList.contains('label') && /^escolh/i.test(el.textContent?.trim() ?? '');
}

function faltaNaSecao(titulo: Element): boolean {
  const texto = titulo.textContent ?? '';
  const contador = texto.match(/\((\d+)\/(\d+)\)/);
  if (contador) return Number(contador[1]) < Number(contador[2]);
  if (!/escolh/i.test(texto)) return false;
  let el = titulo.nextElementSibling;
  while (el && !ehCabecalho(el)) {
    if (el.matches('.checked, .selected') || el.querySelector('.checked, .selected')) return false;
    el = el.nextElementSibling;
  }
  return true;
}

export function destacarPendencia(raiz: HTMLElement | null): boolean {
  if (!raiz) return false;
  const alvo = [...raiz.querySelectorAll('.section-title, .label')].filter(ehCabecalho).find(faltaNaSecao) as
    | HTMLElement
    | undefined;
  if (!alvo) return false;
  alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
  alvo.setAttribute('data-pendente', 'true');
  window.setTimeout(() => alvo.removeAttribute('data-pendente'), DURACAO_MS);
  return true;
}
