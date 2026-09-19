import styles from '../../components/TrocarArmaMaestria.module.css';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import InfoValor from '../../components/InfoValor';

export interface AcaoSalvaguardaDoAlvo {
  label: string;
  onClick: () => void;
}

interface SalvaguardaDoAlvoModalProps {
  titulo: string;
  atributo: string;
  cd: number | null;
  /** Quebra da CD (B8) — `null` quando `cd` também é `null`. */
  explicacaoCd: ExplicacaoCalculo | null;
  textoSucesso: string | null;
  textoFalha: string | null;
  /** Aviso extra opcional (ex.: upcast não automático de magia). */
  aviso?: string | null;
  /** Botão principal, geralmente "Rolar Dano" — `null`/ausente = ação
   * sem dano (ex.: Golpe de Escudo, que só empurra/derruba). */
  acaoPrincipal?: AcaoSalvaguardaDoAlvo | null;
  /** 2º botão opcional (ex.: dano condicional de Badalar Fúnebre). */
  acaoSecundaria?: AcaoSalvaguardaDoAlvo | null;
  /** Texto mostrado no lugar do botão principal quando não há nenhuma
   * ação de dano pra oferecer (ex.: magia sem fórmula própria). */
  semAcaoTexto?: string | null;
  onFechar: () => void;
}

/** Popup genérico pra qualquer "CD do jogador, o ALVO (inimigo/NPC)
 * que faz a salvaguarda" — Ataque de Sopro (Draconato), Lançar no
 * Inferno (Bruxo), Salvaguarda de Magia e Golpe de Escudo (Mestre em
 * Escudos) são todos o MESMO caso: o app não modela PV/atributo de
 * monstro, então nunca rola a salvaguarda do alvo sozinho — só mostra
 * a CD (+ quebra ⓘ) e o texto de Sucesso/Falha; o jogador resolve na
 * mesa e toca a ação (rolar dano — ou só fecha, quando não há dano,
 * como Golpe de Escudo). Antes eram 3 modais quase idênticos copiados
 * à mão (`AtaqueDeSoproModal`/`LancarNoInfernoModal`/
 * `MagiaSalvaguardaModal`) — unificados aqui, ver DECISOES-COMBATE.md
 * ("Salvaguarda do alvo — modal único"). */
export default function SalvaguardaDoAlvoModal({
  titulo,
  atributo,
  cd,
  explicacaoCd,
  textoSucesso,
  textoFalha,
  aviso,
  acaoPrincipal,
  acaoSecundaria,
  semAcaoTexto,
  onFechar,
}: SalvaguardaDoAlvoModalProps) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Alvo faz salvaguarda de {atributo}</div>
        <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>
          CD {cd ?? '—'} {explicacaoCd && <InfoValor titulo={titulo} explicacao={explicacaoCd} />}
        </div>
        {textoSucesso && (
          <div style={{ fontSize: 12, color: 'var(--good)', marginBottom: 4 }}>✅ Sucesso: {textoSucesso}</div>
        )}
        {textoFalha && (
          <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 14 }}>❌ Falha: {textoFalha}</div>
        )}
        {aviso && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 10 }}>{aviso}</div>}
        {acaoPrincipal && (
          <div className="btn btn-primary" style={{ padding: 12 }} onClick={acaoPrincipal.onClick}>
            {acaoPrincipal.label}
          </div>
        )}
        {acaoSecundaria && (
          <div className="btn btn-primary" style={{ padding: 12, marginTop: 8 }} onClick={acaoSecundaria.onClick}>
            {acaoSecundaria.label}
          </div>
        )}
        {!acaoPrincipal && semAcaoTexto && (
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{semAcaoTexto}</div>
        )}
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
