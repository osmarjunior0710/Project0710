import { useState } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import type { Magia } from "../../data/rulesets/dnd2024/magias";
import styles from "./MagiaComDescricao.module.css";

interface MagiaComDescricaoProps {
  magia: Magia;
  /** texto a mostrar (ex: nome já formatado) — se omitido, usa `magia.nome` */
  rotulo?: string;
}

function tipoMagia(circulo: number): string {
  return circulo === 0 ? "Truque" : `${circulo}º Círculo`;
}

/** Card padronizado pra qualquer magia/truque — sempre os mesmos campos,
 * na mesma ordem, com toggle Desc. curta/longa (padrão da versão anterior
 * do app). Ainda só usado pra Magias; PENDENCIAS.md tem a nota de
 * replicar esse padrão pra Itens/Armas/Armaduras/Itens Mágicos depois.
 * Padrão de formatação único (2026-09, achado do Osmar): toda menção a
 * magia/truque em qualquer tela vira essa MESMA pill (fundo lilás claro
 * + ⓘ dentro dela) — antes cada tela tinha um jeito diferente
 * (sublinhado sem ícone, texto solto + ícone separado). Não deixar
 * nenhuma tela nova inventar formatação própria. */
export default function MagiaComDescricao({
  magia,
  rotulo,
}: MagiaComDescricaoProps) {
  const [aberto, setAberto] = useState(false);
  const [descLonga, setDescLonga] = useState(false);
  useLockBodyScroll(aberto);

  const temAmbasDescricoes =
    !!magia.descricaoCurta &&
    !!magia.descricaoCompleta &&
    magia.descricaoCurta !== magia.descricaoCompleta;
  const descricaoAtual =
    (descLonga ? magia.descricaoCompleta : magia.descricaoCurta) ??
    magia.descricaoCompleta ??
    magia.descricaoCurta;

  const abrir = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDescLonga(false);
    setAberto(true);
  };

  return (
    <>
      <span className={styles.pill} onClick={abrir}>
        {rotulo ?? magia.nome}
        <span className={styles.pillIcone}>ⓘ</span>
      </span>
      {aberto &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={(e) => {
              e.stopPropagation();
              setAberto(false);
            }}
          >
            <div className={styles.card} onClick={(e) => e.stopPropagation()}>
              <div className={styles.title}>{magia.nome}</div>
              <div className={styles.tipo}>{tipoMagia(magia.circulo)}</div>

              {temAmbasDescricoes && (
                <div className={styles.toggleRow}>
                  <div
                    className={`${styles.toggleBtn} ${!descLonga ? styles.toggleBtnAtivo : ""}`}
                    onClick={() => setDescLonga(false)}
                  >
                    Desc. curta
                  </div>
                  <div
                    className={`${styles.toggleBtn} ${descLonga ? styles.toggleBtnAtivo : ""}`}
                    onClick={() => setDescLonga(true)}
                  >
                    Desc. longa
                  </div>
                </div>
              )}

              <div className={styles.meta}>
                {(magia.tempoConjuracao || magia.alcance) && (
                  <div className={styles.metaRow}>
                    {magia.tempoConjuracao && (
                      <span>
                        <strong>Tempo:</strong> {magia.tempoConjuracao}
                      </span>
                    )}
                    {magia.alcance && (
                      <span>
                        <strong>Alcance:</strong> {magia.alcance}
                      </span>
                    )}
                  </div>
                )}
                {magia.componentes && (
                  <div className={styles.metaRow}>
                    <strong>Componentes:</strong> {magia.componentes}
                  </div>
                )}
                {magia.duracao && (
                  <div className={styles.metaRow}>
                    <strong>Duração:</strong> {magia.duracao}
                  </div>
                )}
              </div>

              {descricaoAtual && (
                <div className={styles.desc}>{descricaoAtual}</div>
              )}

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
          </div>,
          document.body,
        )}
    </>
  );
}
