import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import styles from '../../components/TrocarArmaMaestria.module.css';
import EscolherEfeitoModal from '../../components/EscolherEfeitoModal';

/** Cena única de exploração dos 2 fluxos de popup que a aba Combate usa hoje
 * (ver `sdd/sdd-fluxo-rolagem.md`):
 *
 * - **Ataque (Acerto/Erro)** — já é o fluxo real de produção (todo ataque
 *   normal, Ataque Bônus, Cortar, ataque de magia). Reaproveita o
 *   `RollContext`/`RollOverlay` de verdade e o `EscolherEfeitoModal` real,
 *   só pra servir de referência lado a lado.
 * - **Salvaguarda do Alvo** — ainda não decidido (Lançar no Inferno, Ataque
 *   de Sopro, magia com salvaguarda, Golpe de Escudo). Em vez de fixar um
 *   layout, esta cena monta um popup MOCKUP local (não é o
 *   `SalvaguardaDoAlvoModal` real) com cada bloco de informação
 *   ligado/desligado por um toggle, pra decidir o design final vendo as
 *   combinações lado a lado (pedido do Osmar, 2026-09).
 *
 * Nenhuma das 2 metades aqui formaliza nada em produção — é só um
 * ambiente pra testar combinações antes de mexer no
 * `SalvaguardaDoAlvoModal.tsx` de verdade. */

type Mecanica = 'ataque' | 'salvaguarda';
type TipoSucesso = 'texto' | 'metade' | 'cheio';

const OPCOES_EFEITO_EXEMPLO = [
  { nome: 'Empurrar', texto: 'Empurra o alvo 1,5m pra um espaço livre (se ele não for maior que você).' },
  { nome: 'Derrubar', texto: 'O alvo fica Caído.' },
];

export default function PopupAtaqueSalvaguardaCena() {
  const { rolarD20, rolarDados } = useRoll();
  const [mecanica, setMecanica] = useState<Mecanica>('salvaguarda');
  const [log, setLog] = useState<string[]>([]);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  // --- Ataque (Acerto/Erro) — fluxo real, só de referência ---
  const [ataqueTemEfeitoExtra, setAtaqueTemEfeitoExtra] = useState(true);
  const [atacando, setAtacando] = useState(false);
  const [efeitoAberto, setEfeitoAberto] = useState(false);

  function atacar() {
    setAtacando(true);
    rolarD20({
      label: 'Ataque de Espada',
      formula: '1d20+5',
      mod: 5,
      confirmarAcerto: {
        onAcertou: () => {
          empilhar('Acertou — rolando dano…');
          rolarDados({
            label: 'Dano da Espada',
            formula: '1d8+3',
            quantidade: 1,
            lados: 8,
            mod: 3,
            onResultado: (total) => {
              empilhar(`Dano aplicado: ${total}.`);
              setAtacando(false);
            },
            confirmarFechamento: ataqueTemEfeitoExtra
              ? { rotulo: '⚔️ Efeito Especial', aoTocar: () => setEfeitoAberto(true) }
              : {},
          });
        },
        onErrou: () => {
          empilhar('Errou.');
          setAtacando(false);
        },
      },
    });
  }

  // --- Salvaguarda do Alvo — mockup local, toggles ligam/desligam bloco ---
  const [mostrarCd, setMostrarCd] = useState(true);
  const [falhaTemDano, setFalhaTemDano] = useState(true);
  const [tipoSucesso, setTipoSucesso] = useState<TipoSucesso>('metade');
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mostrarDanoCondicional, setMostrarDanoCondicional] = useState(false);
  const [fecharSoComOk, setFecharSoComOk] = useState(true);

  const [popupSalvaguarda, setPopupSalvaguarda] = useState<{ falha: string; sucesso: string; condicional: string | null } | null>(
    null,
  );

  function montarSucesso(totalCheio: number | null): string {
    if (tipoSucesso === 'texto') return 'nada acontece';
    if (totalCheio === null) return '—';
    if (tipoSucesso === 'metade') return `${Math.floor(totalCheio / 2)} de dano`;
    return `${totalCheio} de dano (cheio, sem penalidade extra)`;
  }

  function conjurar() {
    const precisaRolar = falhaTemDano || tipoSucesso !== 'texto';
    if (!precisaRolar) {
      setPopupSalvaguarda({ falha: 'empurra 1,5m ou derruba (Caído), à sua escolha', sucesso: montarSucesso(null), condicional: null });
      return;
    }
    // `confirmarFechamento` (em vez de `onResultado` puro) faz o overlay do
    // dado só fechar pelo botão "OK" dele mesmo — que já abre o popup
    // seguinte no mesmo toque. Sem isso, o popup novo abria por baixo/por
    // cima do overlay de resultado ainda aberto (2 telas empilhadas).
    let totalRolado = 0;
    rolarDados({
      label: 'Dano da Magia',
      formula: '8d6',
      quantidade: 8,
      lados: 6,
      mod: 0,
      onResultado: (total) => {
        totalRolado = total;
        empilhar(`Total rolado: ${total}.`);
      },
      confirmarFechamento: {
        aoTocar: () =>
          setPopupSalvaguarda({
            falha: falhaTemDano ? `${totalRolado} de dano` : 'dano completo',
            sucesso: montarSucesso(totalRolado),
            condicional: null,
          }),
      },
    });
  }

  function rolarDanoCondicional() {
    let totalRolado = 0;
    rolarDados({
      label: 'Dano Condicional (ex.: Badalar Fúnebre)',
      formula: '2d8',
      quantidade: 2,
      lados: 8,
      mod: 0,
      onResultado: (total) => {
        totalRolado = total;
        empilhar(`Dano condicional rolado: ${total}.`);
      },
      confirmarFechamento: {
        aoTocar: () => setPopupSalvaguarda((p) => (p ? { ...p, condicional: `${totalRolado} de dano extra` } : p)),
      },
    });
  }

  function ToggleRow({ ligado, onToggle, children }: { ligado: boolean; onToggle: () => void; children: React.ReactNode }) {
    return (
      <div style={{ cursor: 'pointer', marginBottom: 4 }} onClick={onToggle}>
        {ligado ? '☑' : '☐'} {children}
      </div>
    );
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Escolha a mecânica e ligue/desligue os blocos de informação — o popup no fim mostra exatamente
        essa combinação, pra decidir o layout final olhando as opções lado a lado.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div className={mecanica === 'ataque' ? 'btn btn-primary' : 'btn'} onClick={() => setMecanica('ataque')}>
          🗡 Ataque (Acerto/Erro)
        </div>
        <div className={mecanica === 'salvaguarda' ? 'btn btn-primary' : 'btn'} onClick={() => setMecanica('salvaguarda')}>
          ✨ Salvaguarda do Alvo
        </div>
      </div>

      {mecanica === 'ataque' && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 10 }}>
            Este é o fluxo REAL de hoje (todo ataque já funciona assim) — só de referência pra comparar
            com a Salvaguarda do Alvo.
          </p>
          <div className="box-solid" style={{ marginBottom: 12, padding: 10 }}>
            <ToggleRow ligado={ataqueTemEfeitoExtra} onToggle={() => setAtaqueTemEfeitoExtra((v) => !v)}>
              tem efeito extra pra escolher depois do dano (Golpe Brutal/Esmagador/Talhador/Ancestralidade
              Gigante)
            </ToggleRow>
          </div>
          <div className={atacando ? 'btn btn-disabled' : 'btn btn-primary'} onClick={atacando ? undefined : atacar}>
            🗡 Atacar
          </div>
          {efeitoAberto && (
            <EscolherEfeitoModal
              titulo="⚔️ Efeito Especial"
              opcoes={OPCOES_EFEITO_EXEMPLO}
              onEscolher={(nomes) => {
                empilhar(`Efeito escolhido: ${nomes.join(', ')}.`);
                setEfeitoAberto(false);
              }}
              onFechar={() => setEfeitoAberto(false)}
            />
          )}
        </>
      )}

      {mecanica === 'salvaguarda' && (
        <>
          <div className="box-solid" style={{ marginBottom: 12, padding: 10 }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Blocos de informação
            </div>
            <ToggleRow ligado={mostrarCd} onToggle={() => setMostrarCd((v) => !v)}>
              mostrar CD + atributo
            </ToggleRow>
            <ToggleRow ligado={falhaTemDano} onToggle={() => setFalhaTemDano((v) => !v)}>
              falha causa dano (calculado) — desligado = só texto (ex.: Golpe de Escudo)
            </ToggleRow>
            <div style={{ marginTop: 6, marginBottom: 2 }}>sucesso:</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {(['texto', 'metade', 'cheio'] as TipoSucesso[]).map((t) => (
                <span
                  key={t}
                  className="tag"
                  style={{
                    cursor: 'pointer',
                    borderColor: tipoSucesso === t ? 'var(--accent)' : undefined,
                    fontWeight: tipoSucesso === t ? 'bold' : undefined,
                  }}
                  onClick={() => setTipoSucesso(t)}
                >
                  {t === 'texto' ? 'nenhum efeito (só texto)' : t === 'metade' ? 'metade do dano' : 'dano cheio'}
                </span>
              ))}
            </div>
            <ToggleRow ligado={mostrarAviso} onToggle={() => setMostrarAviso((v) => !v)}>
              mostrar aviso (ex.: upcast não automático)
            </ToggleRow>
            <ToggleRow ligado={mostrarDanoCondicional} onToggle={() => setMostrarDanoCondicional((v) => !v)}>
              tem dano condicional extra (ex.: Badalar Fúnebre — botão separado, opcional)
            </ToggleRow>
            <ToggleRow ligado={fecharSoComOk} onToggle={() => setFecharSoComOk((v) => !v)}>
              fecha só com "Ok" (desligado = toque fora também fecha, comportamento antigo)
            </ToggleRow>
          </div>

          <div className="btn btn-primary" onClick={conjurar}>
            ✨ Conjurar Magia (CD 15 Destreza)
          </div>

          {popupSalvaguarda && (
            <div className={styles.overlay} onClick={fecharSoComOk ? undefined : () => setPopupSalvaguarda(null)}>
              <div className={styles.card} onClick={(e) => e.stopPropagation()}>
                <div className={styles.title}>Magia de Exemplo</div>
                {mostrarCd && (
                  <>
                    <div style={{ fontSize: 13, marginBottom: 6 }}>Alvo faz salvaguarda de Destreza</div>
                    <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>CD 15</div>
                  </>
                )}
                <div style={{ borderTop: '1px dashed var(--line)', margin: '8px 0 12px' }} />
                <div className="label" style={{ marginBottom: 4 }}>
                  Falha
                </div>
                <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{popupSalvaguarda.falha}</div>
                <div style={{ borderTop: '1px dashed var(--line)', margin: '0 0 12px' }} />
                <div className="label" style={{ marginBottom: 4 }}>
                  Sucesso
                </div>
                <div style={{ fontSize: 13, color: 'var(--good)' }}>{popupSalvaguarda.sucesso}</div>
                {mostrarAviso && (
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 10 }}>
                    Círculo usado é maior que o base — dano acima NÃO inclui o upcast.
                  </div>
                )}
                {mostrarDanoCondicional && (
                  <div className="btn btn-primary" style={{ marginTop: 12 }} onClick={rolarDanoCondicional}>
                    🎲 {popupSalvaguarda.condicional ?? 'Rolar Dano Condicional (2d8)'}
                  </div>
                )}
                <div className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setPopupSalvaguarda(null)}>
                  Ok
                </div>
              </div>
            </div>
          )}
        </>
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
