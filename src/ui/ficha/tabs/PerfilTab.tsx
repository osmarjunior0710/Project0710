import type { Classe } from '../../../data/rulesets/dnd2024/classes';
import { subclasses } from '../../../data/rulesets/dnd2024/subclasses';
import BadgeHomebrew from '../../components/BadgeHomebrew';
import IconeClasse from '../../components/IconeClasse';
import IconeOrigem from '../../components/IconeOrigem';
import IconeEspecie from '../../components/IconeEspecie';
import iconeTalentos from '../../../assets/icones-ui/talentos.webp';
import iconeIdiomas from '../../../assets/icones-ui/idiomas.webp';
import { origens } from '../../../data/rulesets/dnd2024/origens';
import { especies } from '../../../data/rulesets/dnd2024/especies';
import { talentos, talentosOrigem } from '../../../data/rulesets/dnd2024/talentos';
import {
  caracteristicasAcumuladas,
  caracteristicasSubclasseAcumuladas,
  NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE,
} from '../../../core/levelUp';
import type { WizardSelection } from '../../../core/personagem';
import type { PersonagemClasse } from '../../../core/multiclasse';
import { invocacoesMisticas } from '../../../data/rulesets/dnd2024/invocacoesMisticas';
import { invocacaoTemPlaceholder } from '../../../core/invocacoesMisticas';
import { talentoTemPlaceholder } from '../../../core/classificarTalento';
import { descricaoTracoResolvida, opcoesSubescolhaNoWizard, tracoComEscolhaDePericia } from '../../../core/especieSubescolha';

interface PerfilTabProps {
  selecao: WizardSelection;
  /** TODAS as classes do personagem (multiclasse, ver EmDev.md
   * "Entrega 5a") — cada uma ganha seu próprio bloco "Classe —
   * Nome"/"Subclasse", em vez de mostrar só 1. */
  classesAtual: PersonagemClasse[];
  catalogoClasses: Classe[];
  talentosGeraisAtuais: string[];
  /** Invocações Místicas (Bruxo) atuais — vazio pra qualquer outra
   * classe, a seção some sozinha. */
  invocacoesMisticasAtuais: string[];
  /** Truque vinculado a cada Invocação Mística que exige essa escolha
   * (Explosão Agonizante/Repulsiva) — ver `core/invocacoesMisticas.ts`. */
  invocacoesTruqueVinculado: Record<string, string>;
}

export default function PerfilTab({
  selecao,
  classesAtual,
  catalogoClasses,
  talentosGeraisAtuais,
  invocacoesMisticasAtuais,
  invocacoesTruqueVinculado,
}: PerfilTabProps) {
  // 1 bloco de Classe/Subclasse POR classe do personagem (Entrega 5a,
  // ver EmDev.md) — mesmo cálculo de antes (`caracteristicasAcumuladas`/
  // `caracteristicasSubclasseAcumuladas`), só que repetido pra cada
  // `PersonagemClasse` em vez de rodar 1 vez só pra "a classe ativa".
  // O placeholder "Característica de Subclasse" (ver levelUp.ts) nunca
  // vira card — a característica REAL já aparece certa na seção
  // "Subclasse" (`caracteristicasDaSubclasse`); mostrar o placeholder
  // também só duplicava a informação com um texto errado ("descrição
  // não importada", mesmo quando já foi).
  const blocosDeClasse = classesAtual.map((entry) => {
    const classeObj = catalogoClasses.find((c) => c.nome === entry.classe) ?? null;
    const caracteristicasClasse = classeObj
      ? caracteristicasAcumuladas(classeObj, entry.nivel).filter((c) => c.nome !== NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE)
      : [];
    const caracteristicasDaSubclasse = caracteristicasSubclasseAcumuladas(entry.subclasse ?? null, entry.nivel);
    const subclasseInfo = entry.subclasse ? subclasses.find((s) => s.nome === entry.subclasse) ?? null : null;
    return { entry, classeObj, caracteristicasClasse, caracteristicasDaSubclasse, subclasseInfo };
  });
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
      {blocosDeClasse.map(({ entry, classeObj, caracteristicasClasse, caracteristicasDaSubclasse, subclasseInfo }) => (
        <div key={entry.classe}>
          <div className="section-title">
            {classeObj && <IconeClasse id={classeObj.id} variante="titulo" />}
            Classe — {entry.classe} (nível {entry.nivel})
          </div>
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

          {caracteristicasDaSubclasse.length > 0 && (
            <>
              <div className="section-title" style={{ marginTop: 16 }}>
                {subclasseInfo && <IconeClasse id={subclasseInfo.id} variante="titulo" />}
                Subclasse{entry.subclasse ? ` — ${entry.subclasse}` : ''} {subclasseInfo?.homebrew && <BadgeHomebrew />}
              </div>
              {subclasseInfo?.homebrew && (
                <div className="label" style={{ marginBottom: 8 }}>
                  Não é regra oficial ainda — vai ser revisada quando o livro sair.
                </div>
              )}
              {caracteristicasDaSubclasse.map((c) => (
                <div key={c.nome} className="opt-card" style={{ cursor: 'default' }}>
                  <div className="opt-card-name">{c.nome}</div>
                  <div className="opt-card-desc">{c.descricao}</div>
                </div>
              ))}
            </>
          )}

          {classeObj?.id === 'bruxo' && invocacoesEscolhidas.length > 0 && (
            <>
              <div className="section-title" style={{ marginTop: 16 }}>
                Invocações Místicas
              </div>
              {invocacoesEscolhidas.map((inv) => {
                const truqueVinculado = invocacoesTruqueVinculado[inv.id];
                return (
                  <div key={inv.id} className="opt-card" style={{ cursor: 'default' }}>
                    <div className="opt-card-name">{inv.nome}</div>
                    <div className="opt-card-desc">
                      {invocacaoTemPlaceholder(inv, truqueVinculado) ? '[PH] sem efeito mecânico ainda — ' : ''}
                      {truqueVinculado && `🎯 Vinculada a ${truqueVinculado} — `}
                      {inv.beneficios}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ))}

      {talentosGeraisEscolhidos.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 16 }}>
            <img src={iconeTalentos} alt="" className="section-title-icone" />
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
        {origem && <IconeOrigem id={origem.id} variante="titulo" />}
        Origem{origem ? ` — ${origem.nome}` : ''}
      </div>
      {talento ? (
        <div className="opt-card" style={{ cursor: 'default' }}>
          <div className="opt-card-name">
            {talento.nome}
            {origem?.talentoOrigemVariante ? ` (${origem.talentoOrigemVariante})` : ''}
          </div>
          <div className="opt-card-desc">
            {talentoTemPlaceholder(talento) ? '[PH] sem efeito mecânico ainda — ' : ''}
            {talento.beneficios}
          </div>
        </div>
      ) : (
        <div className="label" style={{ marginBottom: 12 }}>
          Nenhum Talento de Origem ainda.
        </div>
      )}

      <div className="section-title" style={{ marginTop: 16 }}>
        {especie && <IconeEspecie id={especie.id} variante="titulo" />}
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
                    — escolhido: <strong>{talentoVersatil.nome}</strong>.{' '}
                    {talentoTemPlaceholder(talentoVersatil) ? '[PH] sem efeito mecânico ainda — ' : ''}
                    {talentoVersatil.beneficios}
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
        <img src={iconeIdiomas} alt="" className="section-title-icone" />
        Idiomas
      </div>
      <div className="label" style={{ marginBottom: 12 }}>
        {selecao.linguas.length > 0 ? selecao.linguas.join(', ') : '—'}
      </div>
    </>
  );
}
