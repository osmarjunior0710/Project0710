import type { Classe } from '../../../data/rulesets/dnd2024/classes';
import { origens } from '../../../data/rulesets/dnd2024/origens';
import { especies } from '../../../data/rulesets/dnd2024/especies';
import { talentos, talentosOrigem } from '../../../data/rulesets/dnd2024/talentos';
import {
  caracteristicasAcumuladas,
  caracteristicasSubclasseAcumuladas,
  NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE,
} from '../../../core/levelUp';
import type { WizardSelection } from '../../../core/personagem';
import { invocacoesMisticas } from '../../../data/rulesets/dnd2024/invocacoesMisticas';
import { invocacaoTemPlaceholder } from '../../../core/invocacoesMisticas';
import { talentoTemPlaceholder } from '../../../core/classificarTalento';
import { descricaoTracoResolvida, opcoesSubescolhaNoWizard, tracoComEscolhaDePericia } from '../../../core/especieSubescolha';

interface PerfilTabProps {
  selecao: WizardSelection;
  classe: Classe | null;
  nivel: number;
  subclasse: string | null;
  talentosGeraisAtuais: string[];
  /** Invocações Místicas (Bruxo) atuais — vazio pra qualquer outra
   * classe, a seção some sozinha. */
  invocacoesMisticasAtuais: string[];
}

export default function PerfilTab({
  selecao,
  classe,
  nivel,
  subclasse,
  talentosGeraisAtuais,
  invocacoesMisticasAtuais,
}: PerfilTabProps) {
  // O placeholder "Característica de Subclasse" (ver levelUp.ts) nunca
  // vira card aqui — a característica REAL já aparece certa na seção
  // "Subclasse" logo abaixo (`caracteristicasDaSubclasse`); mostrar o
  // placeholder aqui também só duplicava a informação com um texto
  // errado ("descrição não importada", mesmo quando já foi).
  const caracteristicasClasse = classe
    ? caracteristicasAcumuladas(classe, nivel).filter((c) => c.nome !== NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE)
    : [];
  const caracteristicasDaSubclasse = caracteristicasSubclasseAcumuladas(subclasse, nivel);
  const origem = origens.find((o) => o.nome === selecao.origem) ?? null;
  const talento = origem ? talentosOrigem.find((t) => t.id === origem.talentoOrigemId) ?? null : null;
  const especie = especies.find((e) => e.nome === selecao.especie) ?? null;
  const talentosGeraisEscolhidos = talentosGeraisAtuais
    .map((id) => talentos.find((t) => t.id === id))
    .filter((t) => t !== undefined);
  const invocacoesEscolhidas = invocacoesMisticasAtuais
    .map((id) => invocacoesMisticas.find((i) => i.id === id))
    .filter((i) => i !== undefined);

  return (
    <>
      <div className="section-title">Classe{classe ? ` — ${classe.nome}` : ''}</div>
      {caracteristicasClasse.length === 0 && (
        <div className="label" style={{ marginBottom: 12 }}>
          Nenhuma característica de classe ainda.
        </div>
      )}
      {caracteristicasClasse.map((c) => (
        <div key={c.nome} className="opt-card" style={{ cursor: 'default' }}>
          <div className="opt-card-name">{c.nome}</div>
          {c.descricao ? (
            <div className="opt-card-desc">{c.descricao}</div>
          ) : (
            <div className="opt-card-desc" style={{ color: 'var(--text-faint)' }}>
              Descrição detalhada ainda não importada pra essa característica.
            </div>
          )}
        </div>
      ))}

      {invocacoesEscolhidas.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 16 }}>
            Invocações Místicas
          </div>
          {invocacoesEscolhidas.map((inv) => (
            <div key={inv.id} className="opt-card" style={{ cursor: 'default' }}>
              <div className="opt-card-name">{inv.nome}</div>
              <div className="opt-card-desc">
                {invocacaoTemPlaceholder(inv) ? '[PH] sem efeito mecânico ainda — ' : ''}
                {inv.beneficios}
              </div>
            </div>
          ))}
        </>
      )}

      {caracteristicasDaSubclasse.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 16 }}>
            Subclasse{subclasse ? ` — ${subclasse}` : ''}
          </div>
          {caracteristicasDaSubclasse.map((c) => (
            <div key={c.nome} className="opt-card" style={{ cursor: 'default' }}>
              <div className="opt-card-name">{c.nome}</div>
              <div className="opt-card-desc">{c.descricao}</div>
            </div>
          ))}
        </>
      )}

      {talentosGeraisEscolhidos.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 16 }}>
            Talentos
          </div>
          {talentosGeraisEscolhidos.map((t, i) => (
            <div key={`${t.id}-${i}`} className="opt-card" style={{ cursor: 'default' }}>
              <div className="opt-card-name">{t.nome}</div>
              <div className="opt-card-desc">
                {talentoTemPlaceholder(t) ? '[PH] sem efeito mecânico ainda — ' : ''}
                {t.beneficios}
              </div>
            </div>
          ))}
        </>
      )}

      <div className="section-title" style={{ marginTop: 16 }}>
        Origem{origem ? ` — ${origem.nome}` : ''}
      </div>
      {talento ? (
        <div className="opt-card" style={{ cursor: 'default' }}>
          <div className="opt-card-name">
            {talento.nome}
            {origem?.talentoOrigemVariante ? ` (${origem.talentoOrigemVariante})` : ''}
          </div>
          <div className="opt-card-desc">{talento.beneficios}</div>
        </div>
      ) : (
        <div className="label" style={{ marginBottom: 12 }}>
          Nenhum Talento de Origem ainda.
        </div>
      )}

      <div className="section-title" style={{ marginTop: 16 }}>
        Espécie{especie ? ` — ${especie.nome}` : ''}
      </div>
      {especie && opcoesSubescolhaNoWizard(especie) && especie.subescolha && (
        <div className="summary-row" style={{ marginBottom: 8 }}>
          <span>{especie.subescolha.nome}</span>
          <span>{selecao.subescolhaEspecieEscolhida ?? '—'}</span>
        </div>
      )}

      {especie && especie.traços.length > 0 ? (
        especie.traços.map((t) => {
          const talentoVersatil =
            t.id === 'versatil' && selecao.talentoEspecieEscolhido
              ? talentos.find((tt) => tt.id === selecao.talentoEspecieEscolhido)
              : null;
          const ehTracoPericia = t === tracoComEscolhaDePericia(especie);
          return (
            <div key={t.nome} className="opt-card" style={{ cursor: 'default' }}>
              <div className="opt-card-name">{t.nome}</div>
              <div className="opt-card-desc">
                {descricaoTracoResolvida(t, especie, selecao)}
                {ehTracoPericia && selecao.periciaEspecieEscolhida && (
                  <> — escolhida: <strong>{selecao.periciaEspecieEscolhida}</strong></>
                )}
                {talentoVersatil && (
                  <>
                    {' '}
                    — escolhido: <strong>{talentoVersatil.nome}</strong>. {talentoVersatil.beneficios}
                  </>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="label" style={{ marginBottom: 12 }}>
          Nenhum traço de espécie ainda.
        </div>
      )}

      <div className="section-title" style={{ marginTop: 16 }}>
        Idiomas
      </div>
      <div className="label" style={{ marginBottom: 12 }}>
        {selecao.linguas.length > 0 ? selecao.linguas.join(', ') : '—'}
      </div>
    </>
  );
}
