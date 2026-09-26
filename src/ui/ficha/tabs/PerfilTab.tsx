import { useState } from 'react';
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
import { idiomaExtraClasse } from '../../../data/rulesets/dnd2024/idiomaExtraClasse';
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
import AprenderIdiomaShell from './AprenderIdiomaShell';
import styles from './PerfilTab.module.css';

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
  onAdicionarIdiomas: (novos: string[]) => void;
  onRemoverIdioma: (idioma: string) => void;
}

export default function PerfilTab({
  selecao,
  classesAtual,
  catalogoClasses,
  talentosGeraisAtuais,
  invocacoesMisticasAtuais,
  invocacoesTruqueVinculado,
  onAdicionarIdiomas,
  onRemoverIdioma,
}: PerfilTabProps) {
  /** Id do idioma com o ✕ "armado" — mesma dupla confirmação de
   * Pets/"Apagar personagem" (ver `DECISOES-FICHA.md`). */
  const [confirmandoIdioma, setConfirmandoIdioma] = useState<string | null>(null);
  const [telaAprenderIdioma, setTelaAprenderIdioma] = useState(false);

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
  // Idioma fixo de Classe (ex: Druídico do Druida) — soma de TODAS as
  // classes do personagem (multiclasse), não só a primeira, ver
  // `idiomaExtraClasse.ts`. Junto com "Comum", nunca ganha botão de
  // remover (pedido do Osmar) — mesmo tratamento do `LinguasStep.tsx`
  // do wizard.
  const idiomasFixos = ['Comum', ...classesAtual.flatMap((c) => idiomaExtraClasse[c.classe]?.fixo ?? [])];

  if (telaAprenderIdioma) {
    return (
      <AprenderIdiomaShell
        atuais={selecao.linguas}
        onConfirmar={(novos) => {
          onAdicionarIdiomas(novos);
          setTelaAprenderIdioma(false);
        }}
        onFechar={() => setTelaAprenderIdioma(false)}
      />
    );
  }

  return (
    <div className={styles.perfilRoot} onClick={() => setConfirmandoIdioma(null)}>
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
      {selecao.linguas.map((idioma) => {
        const fixo = idiomasFixos.includes(idioma);
        return (
          <div key={idioma} className={`opt-card ${styles.idiomaRow}`} style={{ cursor: 'default' }}>
            <div className="opt-card-name">{idioma}</div>
            {!fixo && (
              <div
                className={`${styles.removerBtn} ${confirmandoIdioma === idioma ? styles.removerBtnConfirm : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmandoIdioma === idioma) {
                    onRemoverIdioma(idioma);
                    setConfirmandoIdioma(null);
                  } else {
                    setConfirmandoIdioma(idioma);
                  }
                }}
              >
                {confirmandoIdioma === idioma ? 'Confirmar' : '✕'}
              </div>
            )}
          </div>
        );
      })}
      <div className={`box ${styles.aprenderBox}`} onClick={() => setTelaAprenderIdioma(true)}>
        <div className="label">+ Aprender novo idioma</div>
      </div>
    </div>
  );
}
