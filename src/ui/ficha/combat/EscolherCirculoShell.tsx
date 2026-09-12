import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import type { OpcaoGastoEspaco } from '../../../core/magiasPersonagem';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TickPips from '../../components/TickPips';
import styles from '../levelup/LevelUpShell.module.css';

interface EscolherCirculoShellProps {
  magia: Magia;
  /** Já junta a classe ativa + a ponte de Magia de Pacto (quando
   * aplicável, ver `opcoesGastoComPonte`) — cada opção rotulada com a
   * classe dona do espaço. Pra 100% dos personagens sem ponte, todas
   * as opções vêm da mesma classe (comportamento idêntico a antes). */
  opcoes: OpcaoGastoEspaco[];
  onVoltar: () => void;
  onConjurar: (circulo: number, classeNome: string) => void;
}

/** Tela cheia (Tela 3 do fluxo "Usar Magia") — sempre aparece antes de
 * conjurar uma magia de círculo > 0, mesmo quando só existe 1 círculo
 * disponível pra gastar (ver `circulosDisponiveisParaConjurar`) — o
 * Osmar pediu isso de propósito, pra deixar claro qual espaço tá
 * sendo gasto mesmo sem uma escolha real (ex: Bardo com só 1 magia de
 * 2º círculo — precisa saber que vai gastar um espaço de 2º, não de
 * 1º). Mostra o texto real da magia (que já traz "Upcast: +Xd8 por
 * círculo" pras ~130 magias que escalam, ver `descricaoCurta`) — o
 * cálculo exato por círculo escolhido fica pra quando a planilha tiver
 * esse dado estruturado (ver PENDENCIAS.md "Upcast — efeito calculado
 * por círculo"), por enquanto o jogador lê o texto e faz a conta. */
export default function EscolherCirculoShell({ magia, opcoes, onVoltar, onConjurar }: EscolherCirculoShellProps) {
  // Ponte de Magia de Pacto (SDD Multiclasse seção 8.5) — só quando 2+
  // classes diferentes aparecem entre as opções mostra de qual classe
  // é cada espaço; com 1 classe só (100% dos personagens sem essa
  // combinação), fica idêntico a antes.
  const temMaisDeUmaClasse = new Set(opcoes.map((o) => o.classeNome)).size > 1;
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>Conjurar {magia.nome}</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className="opt-card" style={{ cursor: 'default', marginBottom: 12 }}>
          <div className="opt-card-name">
            <MagiaComDescricao magia={magia} />
          </div>
          {magia.descricaoCurta && <div className="opt-card-desc">{magia.descricaoCurta}</div>}
        </div>

        <div className="section-title">Em qual círculo?</div>
        <div className="label" style={{ marginBottom: 8 }}>
          Escolha o espaço de magia pra gastar — círculos mais altos custam mais caro, mas costumam melhorar o
          efeito (veja o texto acima).
          {temMaisDeUmaClasse && ' Você tem espaço de mais de 1 classe pra gastar — escolha de qual pool.'}
        </div>
        {opcoes.map(({ circulo, classeNome, maximo, gasto }) => (
          <div key={`${classeNome}-${circulo}`} className="opt-card" onClick={() => onConjurar(circulo, classeNome)}>
            <div className="opt-card-name">
              {circulo}º Círculo{temMaisDeUmaClasse ? ` (${classeNome})` : ''}
            </div>
            <div className="opt-card-desc">
              <TickPips total={maximo} usados={gasto} tamanho="lg" />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={onVoltar}>
          ← Voltar
        </div>
      </div>
    </div>
  );
}
