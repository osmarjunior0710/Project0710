import { origens } from '../../../data/rulesets/dnd2024/origens';
import { descricoesOrigensCurtas } from '../../../data/rulesets/dnd2024/descricoesOrigensCurtas';
import { talentosOrigem } from '../../../data/rulesets/dnd2024/talentos';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import { buscarDescricaoFerramenta } from '../../../data/rulesets/dnd2024/buscarDescricaoFerramenta';
import { nomesDuplicados } from '../../../core/duplicidadeSelecao';
import InfoChip from '../../components/InfoChip';
import IconeOrigem from '../../components/IconeOrigem';
import type { StepProps } from './StepProps';

function descricaoPericia(nome: string): string | null {
  const p = pericias.find((x) => x.nome === nome);
  return p ? `${p.atributo} — ${p.exemplo}` : null;
}

const origensOrdenadas = [...origens].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

export default function OrigemStep({ selection, update }: StepProps) {
  // Marcação de duplicidade — só Perícias por enquanto (única sobreposição
  // hoje alcançável no wizard: Perícia da Classe, escolhida na etapa
  // anterior, x Perícia fixa de CADA Origem, comparadas 1 a 1). Só pra
  // criação — a Ficha precisará de outra abordagem, ver DECISOES-DESIGN.md.

  return (
    <>
      <div className="section-title">Selecione uma origem</div>
      {origensOrdenadas.map((o) => {
        const duplicadas = nomesDuplicados(selection.periciasClasseEscolhidas, o.pericias);
        const duplicada = duplicadas.size > 0;
        const talento = talentosOrigem.find((t) => t.id === o.talentoOrigemId);
        const nomeTalento = `${talento?.nome ?? o.talentoOrigemId}${o.talentoOrigemVariante ? ` (${o.talentoOrigemVariante})` : ''}`;
        return (
          <div
            key={o.id}
            className={`opt-card ${selection.origem === o.nome ? 'selected' : ''} ${!o.disponivel ? 'btn-disabled' : ''} ${duplicada ? 'opt-card-duplicada' : ''}`}
            onClick={() =>
              o.disponivel &&
              update({ origem: o.nome, ferramentaOrigemEscolhida: null, proficienciasTalentoOrigemEscolhidas: [] })
            }
          >
            <div className="opt-card-row">
              <IconeOrigem id={o.id} />
              <div className="opt-card-info">
                <div className="opt-card-name">
                  {o.nome}
                  {!o.disponivel && <span className="tag" style={{ marginLeft: 6 }}>(em breve)</span>}
                </div>
                <div className="opt-card-desc">{descricoesOrigensCurtas[o.id]}</div>
                {duplicada && (
                  <div className="opt-card-desc" style={{ color: 'var(--warn)' }}>
                    ⚠️ {[...duplicadas].join(', ')} já escolhida na Classe
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                  <span className="label">Perícias</span>
                  <InfoChip nome={o.pericias[0]} descricao={descricaoPericia(o.pericias[0])} />
                  <InfoChip nome={o.pericias[1]} descricao={descricaoPericia(o.pericias[1])} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  <span className="label">Proficiência na Ferramenta</span>
                  {o.ferramenta.categoria === 'fixa' ? (
                    <InfoChip nome={o.ferramenta.nome} descricao={buscarDescricaoFerramenta(o.ferramenta.nome)} />
                  ) : (
                    <span className="tag">escolha 1 de {o.ferramenta.grupo}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  <span className="label">Talento</span>
                  <InfoChip
                    nome={nomeTalento}
                    descricao={talento?.beneficios ?? '⚠️ Talento não encontrado nos dados importados — avise o Osmar.'}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
