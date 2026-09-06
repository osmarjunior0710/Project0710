import { especies } from '../../../data/rulesets/dnd2024/especies';
import type { StepProps } from './StepProps';

const especiesOrdenadas = [...especies].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

export default function EspecieStep({ selection, update }: StepProps) {
  return (
    <>
      <div className="section-title">Selecione uma espécie</div>
      {especiesOrdenadas.map((e) => (
        <div
          key={e.id}
          className={`opt-card ${selection.especie === e.nome ? 'selected' : ''} ${!e.disponivel ? 'btn-disabled' : ''}`}
          onClick={() => e.disponivel && update({ especie: e.nome })}
        >
          <div className="opt-card-row">
            <div className="opt-card-img">🖼</div>
            <div className="opt-card-info">
              <div className="opt-card-name">
                {e.nome}
                {!e.disponivel && <span className="tag" style={{ marginLeft: 6 }}>(em breve)</span>}
              </div>
              <div className="opt-card-desc">{e.introducaoCurta}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="label" style={{ marginTop: 6 }}>
        As 10 espécies do Livro do Jogador estão disponíveis. Alguns traços ativos (ex: Mãos
        Curativas e Revelação Celestial do Aasimar) ainda não têm ação própria em Combat — aparecem
        como texto na aba Perfil por enquanto. Ver <code>EmDev.md</code>.
      </div>
    </>
  );
}
