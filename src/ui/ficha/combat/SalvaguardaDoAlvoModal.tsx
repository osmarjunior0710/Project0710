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
  /** Botão pra um dano à PARTE, sem relação com Sucesso/Falha (ex.:
   * dano condicional de Badalar Fúnebre) — continua manual, diferente
   * do dano principal (já vem rolado quando o popup abre). */
  acaoSecundaria?: AcaoSalvaguardaDoAlvo | null;
  /** Nota extra mostrada só quando a magia não tem fórmula de dano
   * própria pro app rolar sozinho (ex.: magia sem dano, só status). */
  semAcaoTexto?: string | null;
  onFechar: () => void;
}

/** Popup genérico pra qualquer "CD do jogador, o ALVO (inimigo/NPC)
 * que faz a salvaguarda" — Ataque de Sopro (Draconato), Lançar no
 * Inferno (Bruxo), Salvaguarda de Magia e Golpe de Escudo (Mestre em
 * Escudos) são todos o MESMO caso: o app não modela PV/atributo de
 * monstro, então nunca rola a salvaguarda do alvo sozinho — só mostra
 * a CD (+ quebra ⓘ) e o texto de Sucesso/Falha; o jogador resolve na
 * mesa.
 *
 * Fluxo Acerto/Erro estendido pra cá (2026-09, ver
 * DECISOES-COMBATE.md "Salvaguarda do Alvo — popup único"): quando a
 * ação tem dano, o dado já rolou ANTES desse popup abrir (ver
 * `abrirSalvaguarda`/`abrirAtaqueDeSopro`/`abrirLancarNoInferno` em
 * `CombatTab.tsx`) — `textoFalha`/`textoSucesso` chegam prontos, com o
 * valor já calculado quando aplicável. Por isso só sobrou 1 botão
 * (Ok) — fecha só por ele, nunca tocando fora, pra não perder a leitura
 * por engano. */
export default function SalvaguardaDoAlvoModal({
  titulo,
  atributo,
  cd,
  explicacaoCd,
  textoSucesso,
  textoFalha,
  aviso,
  acaoSecundaria,
  semAcaoTexto,
  onFechar,
}: SalvaguardaDoAlvoModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Alvo faz salvaguarda de {atributo}</div>
        <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>
          CD {cd ?? '—'} {explicacaoCd && <InfoValor titulo={titulo} explicacao={explicacaoCd} />}
        </div>
        <div style={{ borderTop: '1px dashed var(--line)', margin: '8px 0 12px' }} />
        <div className="label" style={{ marginBottom: 4 }}>
          Falha
        </div>
        <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{textoFalha ?? '—'}</div>
        <div style={{ borderTop: '1px dashed var(--line)', margin: '0 0 12px' }} />
        <div className="label" style={{ marginBottom: 4 }}>
          Sucesso
        </div>
        <div style={{ fontSize: 13, color: 'var(--good)' }}>{textoSucesso ?? '—'}</div>
        {aviso && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 10 }}>{aviso}</div>}
        {semAcaoTexto && <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 10 }}>{semAcaoTexto}</div>}
        {acaoSecundaria && (
          <div className="btn btn-primary" style={{ marginTop: 12 }} onClick={acaoSecundaria.onClick}>
            {acaoSecundaria.label}
          </div>
        )}
        <div className="btn btn-primary" style={{ marginTop: 16 }} onClick={onFechar}>
          Ok
        </div>
      </div>
    </div>
  );
}
