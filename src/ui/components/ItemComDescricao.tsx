import { useState } from 'react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import styles from './ItemComDescricao.module.css';

interface ItemComDescricaoProps {
  nome: string;
  descricao: string | null;
  /** Versão completa (mais longa) da descrição, se existir — quando
   * presente e diferente de `descricao`, o popup ganha um toggle
   * "Desc. curta/longa" (mesmo padrão do `MagiaComDescricao`). */
  descricaoCompleta?: string | null;
  /** texto a mostrar (ex: "2× Adaga") — se omitido, usa `nome` */
  rotulo?: string;
  /** 'sublinhado' (padrão): o texto inteiro fica sublinhado e clicável —
   * usar quando o termo está dentro de uma frase/parágrafo de texto
   * corrido (ex: descrição de kit, lista de itens da Loja).
   * 'icone': o texto fica normal, com um "ⓘ" solto ao lado — usar
   * dentro de linhas de estatística/checkbox, onde o nome do item não
   * deveria mudar de aparência ou competir visualmente com outros
   * ícones da linha (ex: Mochila com "itens detalhados" desligado,
   * lista de Maestria em Arma no wizard e na Ficha). */
  variante?: 'sublinhado' | 'icone';
}

/** Termo tocável que abre um popup com nome + descrição, sem trocar de
 * tela. Padrão registrado no DECISOES-DESIGN.md ("tooltip em texto
 * sublinhado"). Se não houver descrição, renderiza só texto simples. */
export default function ItemComDescricao({ nome, descricao, descricaoCompleta, rotulo, variante = 'sublinhado' }: ItemComDescricaoProps) {
  const [aberto, setAberto] = useState(false);
  const [descLonga, setDescLonga] = useState(false);
  useLockBodyScroll(aberto);

  if (!descricao) return <>{rotulo ?? nome}</>;

  const temAmbasDescricoes = !!descricaoCompleta && descricaoCompleta !== descricao;
  const descricaoAtual = descLonga && descricaoCompleta ? descricaoCompleta : descricao;

  const abrir = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDescLonga(false);
    setAberto(true);
  };

  return (
    <>
      {variante === 'icone' ? (
        <>
          {rotulo ?? nome}
          <span className={styles.icone} onClick={abrir}>
            ⓘ
          </span>
        </>
      ) : (
        <span className={styles.termo} onClick={abrir}>
          {rotulo ?? nome}
        </span>
      )}
      {aberto && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            e.stopPropagation();
            setAberto(false);
          }}
        >
          <div className={styles.card} onClick={(e) => e.stopPropagation()}>
            <div className={styles.title}>{nome}</div>
            {temAmbasDescricoes && (
              <div className={styles.toggleRow}>
                <div className={`${styles.toggleBtn} ${!descLonga ? styles.toggleBtnAtivo : ''}`} onClick={() => setDescLonga(false)}>
                  Desc. curta
                </div>
                <div className={`${styles.toggleBtn} ${descLonga ? styles.toggleBtnAtivo : ''}`} onClick={() => setDescLonga(true)}>
                  Desc. longa
                </div>
              </div>
            )}
            <div className={styles.desc}>{descricaoAtual}</div>
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
