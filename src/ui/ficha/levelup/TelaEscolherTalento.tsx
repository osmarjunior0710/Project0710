import type { Atributo } from '../../../data/wizardFixtures';
import { talentos, type CategoriaTalento, type Talento } from '../../../data/rulesets/dnd2024/talentos';
import { talentoTemPlaceholder } from '../../../core/classificarTalento';

interface TelaEscolherTalentoProps {
  nivelAtual: number;
  atributosFinais: Record<Atributo, number>;
  /** Categoria filtrada — `'Geral'` (padrão) pro passo ASI/Talento do
   * Level Up, `'Dádiva Épica'` pro passo próprio dela. Mesma tela,
   * só troca o catálogo (CLAUDE.md 6.1: reaproveitar em vez de
   * duplicar). */
  categoria?: CategoriaTalento;
  talentosGeraisAtuais: string[];
  /** IDs marcados com 📌 — "quero pegar isso num level up futuro".
   * Persistido por personagem (ver DECISOES-DESIGN.md). */
  favoritos: string[];
  onToggleFavorito: (id: string) => void;
  selecionado: string | null;
  onSelecionar: (id: string) => void;
}

function motivoIndisponivel(t: Talento, nivelAtual: number, atributosFinais: Record<Atributo, number>): string | null {
  if (t.prerequisitos.nivelMinimo !== null && nivelAtual < t.prerequisitos.nivelMinimo) {
    return `Requer nível ${t.prerequisitos.nivelMinimo}+`;
  }
  const faltando = t.prerequisitos.atributosMinimos.filter((a) => (atributosFinais[a] ?? 10) < 13);
  if (faltando.length > 0) {
    return `Requer ${faltando.join('/')} 13+`;
  }
  return null;
}

/** Linha "Atributos: ..." mostrada entre o título e a descrição, só
 * pros talentos que concedem ASI — direto de `concedeAsi` (dado real,
 * já confirmado), nunca `[PH]`. */
function descricaoAsi(t: Talento): string | null {
  if (t.concedeAsi.tipo === 'nenhum') return null;
  if (t.concedeAsi.tipo === 'distribuir-dois') {
    return 'Atributos: +2 em um, ou +1 em dois (à sua escolha, máx. 20)';
  }
  const nomes = t.concedeAsi.atributos;
  if (nomes.length === 1) return `Atributos: +1 em ${nomes[0]}`;
  return `Atributos: +1 em ${nomes.slice(0, -1).join(', ')} ou ${nomes[nomes.length - 1]}`;
}

function CardTalento({
  t,
  disponivel,
  motivo,
  favoritado,
  selecionado,
  onSelecionar,
  onToggleFavorito,
}: {
  t: Talento;
  disponivel: boolean;
  motivo: string | null;
  favoritado: boolean;
  selecionado: boolean;
  onSelecionar: () => void;
  onToggleFavorito: () => void;
}) {
  const asi = descricaoAsi(t);
  return (
    <div
      className={`opt-card ${selecionado ? 'selected' : ''}`}
      style={disponivel ? { cursor: 'pointer' } : { opacity: 0.45, pointerEvents: 'none' }}
      onClick={() => disponivel && onSelecionar()}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div className="opt-card-name">
          {t.nome}
          {!disponivel && <span style={{ color: 'var(--danger)', fontSize: 11 }}> · {motivo}</span>}
        </div>
        <div
          role="button"
          aria-label={favoritado ? 'Remover dos favoritos' : 'Marcar como favorito'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito();
          }}
          style={{
            flexShrink: 0,
            fontSize: 17,
            lineHeight: 1,
            padding: 8,
            marginTop: -8,
            marginRight: -8,
            opacity: favoritado ? 1 : 0.3,
            cursor: 'pointer',
          }}
        >
          📌
        </div>
      </div>
      {asi && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{asi}</div>}
      <div className="opt-card-desc">
        {talentoTemPlaceholder(t) ? '[PH] sem efeito mecânico ainda — ' : ''}
        {t.beneficios}
      </div>
      {t.prerequisitos.outro && (
        <div style={{ color: 'var(--text-faint)', fontSize: 11, marginTop: 4 }}>
          ⚠️ Requer: {t.prerequisitos.outro} — confirme que seu personagem atende
        </div>
      )}
    </div>
  );
}

/** Lista de seleção de Talento Geral (Fase 3 do plano de Talentos) —
 * renderizada dentro do passo "asi" do Level Up, junto do resto do
 * passo. Só um <> de opt-cards controlado pelo pai: tocar num talento
 * só marca a seleção (`onSelecionar`), mesmo padrão de toda outra
 * escolha do Level Up — quem confirma e avança é sempre o "Avançar"
 * do passo, não um botão próprio desta lista. Talento fica salvo
 * `[PH]` — Fase 4 aplica o efeito mecânico de verdade, talento por
 * talento.
 *
 * Talentos marcados com 📌 aparecem numa seção "Favoritos" no topo —
 * planejamento pro futuro, não precisa ser escolhido nesse Level Up
 * pra ficar marcado. Some da lista de favoritos assim que o jogador
 * de fato escolhe o talento (deixa de fazer sentido "planejar" algo
 * que já foi pego). */
export default function TelaEscolherTalento({
  nivelAtual,
  atributosFinais,
  categoria = 'Geral',
  talentosGeraisAtuais,
  favoritos,
  onToggleFavorito,
  selecionado,
  onSelecionar,
}: TelaEscolherTalentoProps) {
  const opcoes = talentos.filter(
    (t) => t.categoria === categoria && (t.repetivel || !talentosGeraisAtuais.includes(t.id) || t.id === selecionado),
  );
  const favoritosNaLista = opcoes.filter((t) => favoritos.includes(t.id) && t.id !== selecionado);
  const idsFavoritados = new Set(favoritosNaLista.map((t) => t.id));
  const resto = opcoes.filter((t) => !idsFavoritados.has(t.id));

  function renderCard(t: Talento) {
    const motivo = motivoIndisponivel(t, nivelAtual, atributosFinais);
    return (
      <CardTalento
        key={t.id}
        t={t}
        disponivel={motivo === null}
        motivo={motivo}
        favoritado={favoritos.includes(t.id)}
        selecionado={selecionado === t.id}
        onSelecionar={() => onSelecionar(t.id)}
        onToggleFavorito={() => onToggleFavorito(t.id)}
      />
    );
  }

  return (
    <>
      <div className="label" style={{ marginTop: 14, marginBottom: 10 }}>
        {categoria === 'Geral' ? 'Talentos Gerais' : `Talentos de ${categoria}`} (Cap. 5) — alguns já têm efeito
        mecânico de verdade, o resto ainda fica marcado <code>[PH]</code> na Ficha até chegar a vez dele. Toque no 📌
        pra planejar um talento pra um level up futuro.
      </div>
      {favoritosNaLista.length > 0 && (
        <>
          <div className="section-title" style={{ marginBottom: 4 }}>
            ⭐ Favoritos
          </div>
          {favoritosNaLista.map(renderCard)}
          <div className="section-title" style={{ marginTop: 10, marginBottom: 4 }}>
            Todos os talentos
          </div>
        </>
      )}
      {resto.map(renderCard)}
    </>
  );
}
