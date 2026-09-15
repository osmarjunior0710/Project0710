import styles from '../../components/TrocarArmaMaestria.module.css';
import type { CalculoDanoMagia } from '../../../core/magiaDano';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import InfoValor from '../../components/InfoValor';

interface MagiaSalvaguardaModalProps {
  nomeMagia: string;
  atributo: string;
  cd: number | null;
  /** Quebra da CD (B8) — `null` quando `cd` também é `null`. */
  explicacaoCd: ExplicacaoCalculo | null;
  textoSucesso: string | null;
  textoFalha: string | null;
  dano: CalculoDanoMagia | null;
  upcastTexto: string | null;
  onRolarDano: () => void;
  /** Só em magias com `danoCondicionalDado` (ex.: Badalar Fúnebre —
   * dano diferente se o alvo já estiver ferido) — o app não rastreia
   * PV do alvo, então mostra os 2 botões e o jogador escolhe qual bate
   * com a cena. `danoCondicional`/`danoCondicionalTexto` ausentes =
   * magia comum, sem 2º botão. */
  danoCondicional?: CalculoDanoMagia | null;
  danoCondicionalTexto?: string | null;
  onRolarDanoCondicional?: () => void;
  onFechar: () => void;
}

/** Popup "Modal de Salvaguarda" — mesmo padrão visual de
 * `AtaqueDeSoproModal`/`LancarNoInfernoModal` (popup pequeno
 * centralizado, sem estado próprio). Diferente do Modal de Ataque
 * (rola d20, o app decide se acertou comparando com a CA), aqui é o
 * ALVO que rola a salvaguarda — fora do app, na mesa — então o modal
 * só mostra a CD, o atributo exigido, e o que acontece em cada
 * resultado (textos padronizados em `salvaguardaSucesso`/
 * `salvaguardaFalha`, ver DECISOES-DADOS.md). O jogador confere com o
 * Mestre quem passou/falhou e toca "Rolar Dano" quando for a hora —
 * sempre dano cheio, igual ao Ataque de Sopro; o app nunca tenta
 * rastrear sucesso/falha sozinho nem reduzir à metade automaticamente. */
export default function MagiaSalvaguardaModal({
  nomeMagia,
  atributo,
  cd,
  explicacaoCd,
  textoSucesso,
  textoFalha,
  dano,
  upcastTexto,
  onRolarDano,
  danoCondicional,
  danoCondicionalTexto,
  onRolarDanoCondicional,
  onFechar,
}: MagiaSalvaguardaModalProps) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{nomeMagia}</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Alvo faz salvaguarda de {atributo}</div>
        <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>
          CD {cd ?? '—'} {explicacaoCd && <InfoValor titulo={nomeMagia} explicacao={explicacaoCd} />}
        </div>
        {textoSucesso && (
          <div style={{ fontSize: 12, color: 'var(--good)', marginBottom: 4 }}>✅ Sucesso: {textoSucesso}</div>
        )}
        {textoFalha && (
          <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 14 }}>❌ Falha: {textoFalha}</div>
        )}
        {dano?.upcastNaoAutomatico && upcastTexto && (
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 10 }}>
            Círculo usado é maior que o base — dano abaixo NÃO inclui o upcast. Efeito real: {upcastTexto}
          </div>
        )}
        {dano ? (
          <div className="btn btn-primary" style={{ padding: 12 }} onClick={onRolarDano}>
            🎲 Rolar Dano ({dano.quantidade}d{dano.lados}
            {dano.mod ? ` + ${dano.mod}` : ''} {dano.tipo ?? ''})
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Veja a descrição da magia (ⓘ) pro efeito.</div>
        )}
        {danoCondicional && onRolarDanoCondicional && (
          <div className="btn btn-primary" style={{ padding: 12, marginTop: 8 }} onClick={onRolarDanoCondicional}>
            🎲 Rolar Dano — {danoCondicionalTexto} ({danoCondicional.quantidade}d{danoCondicional.lados}
            {danoCondicional.mod ? ` + ${danoCondicional.mod}` : ''} {danoCondicional.tipo ?? ''})
          </div>
        )}
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
