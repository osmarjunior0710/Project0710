import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import SalvaguardaDoAlvoModal from '../../ficha/combat/SalvaguardaDoAlvoModal';

/** Cena "Salvaguarda do Alvo" (ver sdd/sdd-fluxo-rolagem.md seção 6,
 * PENDENCIAS.md "Salvaguarda do Alvo") — hoje o popup real
 * (`SalvaguardaDoAlvoModal.tsx`) só mostra CD + texto de Sucesso/Falha
 * e 1 botão que sempre rola o dano CHEIO; o jogador divide por 2 na
 * mesa quando o texto diz "Metade do dano". Esta cena reaproveita o
 * MODAL REAL (não uma cópia) trocando o botão único por "Falhou"/
 * "Passou" (`acaoPrincipal`/`acaoSecundaria`), pra validar 2 coisas
 * antes de formalizar:
 *
 * 1. A interação em si (perguntar Passou/Falhou de verdade, igual
 *    Errei/Acertei) — sem depender de nenhuma coluna nova na planilha,
 *    já que aqui o "tipo de sucesso" é escolhido manualmente (toggle),
 *    não lido de `magia.salvaguardaSucesso`.
 * 2. Como mostrar o cálculo de "metade do dano" (arredondado pra
 *    baixo) depois de rolar — o app já soma e divide sozinho, ou só
 *    mostra "cheio" com uma nota? Ver o log depois de rolar.
 *
 * IMPORTANTE: isso é só validação de UX — a implementação real (que
 * entra depois de aprovada aqui + a coluna nova na planilha) continua
 * mostrando só o valor cheio, sem dividir nada (decisão do Osmar,
 * 2026-09). */

type TipoSucesso = 'metade' | 'nenhum' | 'cheio';

const LABEL_SUCESSO: Record<TipoSucesso, string> = {
  metade: 'Metade do dano',
  nenhum: 'Nenhum efeito',
  cheio: 'Dano completo (sem penalidade extra)',
};

export default function SalvaguardaDoAlvoCena() {
  const { rolarDados } = useRoll();
  const [tipoSucesso, setTipoSucesso] = useState<TipoSucesso>('metade');
  const [popupAberto, setPopupAberto] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  function reiniciar() {
    setPopupAberto(false);
    setLog([]);
  }

  function falhou() {
    setPopupAberto(false);
    empilhar('❌ Alvo FALHOU — rolando dano cheio…');
    rolarDados({
      label: 'Dano (Falha)',
      formula: '8d6',
      quantidade: 8,
      lados: 6,
      mod: 0,
      onResultado: (total) => empilhar(`Dano aplicado ao alvo: ${total} (cheio).`),
    });
  }

  function passou() {
    setPopupAberto(false);
    if (tipoSucesso === 'nenhum') {
      empilhar('✅ Alvo PASSOU — "Nenhum efeito", nada pra rolar.');
      return;
    }
    empilhar(`✅ Alvo PASSOU — rolando dano (${LABEL_SUCESSO[tipoSucesso]})…`);
    rolarDados({
      label: `Dano (Sucesso — ${LABEL_SUCESSO[tipoSucesso]})`,
      formula: '8d6',
      quantidade: 8,
      lados: 6,
      mod: 0,
      onResultado: (totalCheio) => {
        if (tipoSucesso === 'metade') {
          const metade = Math.floor(totalCheio / 2);
          empilhar(`Total rolado: ${totalCheio} → metade (arredondado pra baixo): ${metade}. Dano aplicado: ${metade}.`);
        } else {
          empilhar(`Dano aplicado ao alvo: ${totalCheio} (cheio, mesmo no sucesso — caso raro).`);
        }
      },
    });
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Simula uma magia com salvaguarda (8d6, CD 15 de Destreza) — escolha o tipo de sucesso da
        magia (hoje isso viria da planilha, mas ainda não tem coluna pra isso) e toque "Conjurar"
        pra ver o popup perguntar Passou/Falhou de verdade, em vez de só rolar cheio sempre.
      </p>

      <div className="label" style={{ marginBottom: 6 }}>
        Tipo de sucesso desta magia (toque pra trocar):
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {(['metade', 'nenhum', 'cheio'] as TipoSucesso[]).map((t) => (
          <div
            key={t}
            className={t === tipoSucesso ? 'btn btn-primary' : 'btn'}
            style={{ padding: '8px 12px', fontSize: 12 }}
            onClick={() => setTipoSucesso(t)}
          >
            {LABEL_SUCESSO[t]}
          </div>
        ))}
      </div>

      <div className="box-solid" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>👹 Ogro (alvo de mentirinha)</div>
          <div className="label" style={{ cursor: 'pointer' }} onClick={reiniciar}>
            🔄 reiniciar
          </div>
        </div>
      </div>

      <div className="btn btn-primary" onClick={() => setPopupAberto(true)}>
        ✨ Conjurar Magia (CD 15 Destreza)
      </div>

      {popupAberto && (
        <SalvaguardaDoAlvoModal
          titulo="Magia de Exemplo"
          atributo="Destreza"
          cd={15}
          explicacaoCd={null}
          textoSucesso={LABEL_SUCESSO[tipoSucesso]}
          textoFalha="Dano completo"
          acaoPrincipal={{ label: '❌ Falhou', onClick: falhou }}
          acaoSecundaria={{
            label: tipoSucesso === 'nenhum' ? '✅ Passou (nenhum efeito)' : '✅ Passou',
            onClick: passou,
          }}
          onFechar={() => setPopupAberto(false)}
        />
      )}

      {log.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="label" style={{ marginBottom: 6 }}>
            o que aconteceu
          </div>
          {log.map((linha, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 2 }}>
              {linha}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
