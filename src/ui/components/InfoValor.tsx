import { useState } from 'react';
import type { ExplicacaoCalculo } from '../../core/calculoPersonagem';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import styles from './InfoValor.module.css';

interface InfoValorProps {
  titulo: string;
  /** Parágrafo(s) de regra antes da tabela — mesmo texto que `InfoTexto`
   * mostraria sozinho, só que aqui some com a tabela de conta embaixo.
   * Padrão único pra todo popup informativo (2026-09, pedido do Osmar):
   * Título / Descrição (quando existir) / Tabela / fechar. Omitido =
   * só título + tabela (a maioria dos números simples não precisa de
   * explicação de regra, só da conta). */
  descricao?: string | string[];
  explicacao: ExplicacaoCalculo;
}

/** "ⓘ" clicável ao lado de um número calculado automaticamente — abre
 * um popup com a conta em forma de tabela (efeito à esquerda, valor à
 * direita, total na última linha). Mesmo padrão de popup de
 * InfoChip/ItemComDescricao, só que o gatilho é um ícone solto (pra
 * ficar colado num número), não um chip nem texto sublinhado.
 *
 * stopPropagation em TODO clique dentro do overlay (não só no ícone que
 * abre) é proposital: o popup é renderizado dentro da linha clicável
 * que mostra o número (ex: linha de perícia que rola dado ao tocar) —
 * mesmo com `position: fixed` cobrindo a tela toda visualmente, no DOM
 * o overlay continua sendo filho dessa linha, então sem o
 * stopPropagation um toque pra fechar o popup borbulha pro onClick da
 * linha por baixo e dispara a rolagem de dado sem querer. */
export default function InfoValor({ titulo, descricao, explicacao }: InfoValorProps) {
  const [aberto, setAberto] = useState(false);
  useLockBodyScroll(aberto);

  return (
    <>
      <span
        className={styles.icon}
        onClick={(e) => {
          e.stopPropagation();
          setAberto(true);
        }}
      >
        ⓘ
      </span>
      {aberto && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            e.stopPropagation();
            setAberto(false);
          }}
        >
          <div className={styles.card} onClick={(e) => e.stopPropagation()}>
            <div className={styles.title}>{titulo}</div>
            {descricao &&
              (Array.isArray(descricao) ? descricao : [descricao]).map((p, i) => (
                <p key={i} style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 10px', textTransform: 'none' }}>
                  {p}
                </p>
              ))}
            <div className={styles.tabela}>
              {explicacao.linhas.map((linha, i) => (
                <div className={styles.linha} key={i}>
                  <span className={styles.label}>{linha.label}</span>
                  <span className={styles.valor}>{linha.valor}</span>
                </div>
              ))}
              <div className={`${styles.linha} ${styles.linhaTotal}`}>
                <span className={styles.label}>{explicacao.total.label}</span>
                <span className={styles.valor}>{explicacao.total.valor}</span>
              </div>
            </div>
            <div
              className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                setAberto(false);
              }}
            >
              fechar
            </div>
          </div>
        </div>
      )}
    </>
  );
}
