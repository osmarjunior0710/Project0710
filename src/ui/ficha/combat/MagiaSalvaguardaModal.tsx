import styles from '../../components/TrocarArmaMaestria.module.css';
import type { CalculoDanoMagia } from '../../../core/magiaDano';

interface MagiaSalvaguardaModalProps {
  nomeMagia: string;
  atributo: string;
  cd: number | null;
  textoSucesso: string | null;
  textoFalha: string | null;
  dano: CalculoDanoMagia | null;
  upcastTexto: string | null;
  onRolarDano: () => void;
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
  textoSucesso,
  textoFalha,
  dano,
  upcastTexto,
  onRolarDano,
  onFechar,
}: MagiaSalvaguardaModalProps) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{nomeMagia}</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Alvo faz salvaguarda de {atributo}</div>
        <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>CD {cd ?? '—'}</div>
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
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
