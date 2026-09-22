import { useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import AtivarEfeitoModal from '../../components/AtivarEfeitoModal';
import EscolherEfeitoModal from '../../components/EscolherEfeitoModal';
import SalvaguardaDoAlvoModal from '../../ficha/combat/SalvaguardaDoAlvoModal';
import styles from '../../components/TrocarArmaMaestria.module.css';

/** Cena de exploração: Esmagador (talento, dano Contundente) e Raízes
 * Devastadoras (Bárbaro, Trilha da Árvore do Mundo nível 10, arma
 * Pesada/Versátil) podem gatilhar no MESMO acerto — ex.: Clava Grande
 * (Duas Mãos, Pesada, Contundente). O livro não proíbe usar os 2 no
 * mesmo golpe (gatilhos diferentes: tipo de dano × propriedade de
 * arma), então o app precisa decidir como oferecer os 2 juntos.
 * Pergunta do Osmar, 2026-09 — ver `DECISOES-COMBATE.md` quando
 * decidido.
 *
 * 3 layouts, todos disparados pelo MESMO ataque real (`useRoll`).
 * Opções A e B reaproveitam os modais de produção de verdade
 * (`AtivarEfeitoModal`, `EscolherEfeitoModal`, `SalvaguardaDoAlvoModal`)
 * — zero componente novo. Opção C precisa de uma lista própria
 * (`check-row` pro toggle solto + `opt-card` "selected" pra escolha
 * única), porque nenhum modal de produção mistura os 2 formatos numa
 * lista só ainda — se ela vencer, essa lista vira um componente novo de
 * verdade.
 *
 * **Correção 2026-09 (Osmar reparou):** a 1ª versão desta cena
 * mostrava "qual efeito escolher" como uma lista solta na própria
 * tela — quebra o padrão real do Esmagador/Talhador/Golpe Brutal
 * (`AcaoPanelContent.tsx` `confirmarFechamentoDoAtaque`), onde o botão
 * do popup de dano abre DIRETO o próximo popup (`AtivarEfeitoModal`),
 * nunca uma tela/lista solta. Corrigido: toda etapa de "qual efeito" —
 * mesmo as novas, com 2 efeitos possíveis — continua dentro do mesmo
 * `overlay`/`card` (`TrocarArmaMaestria.module.css`, o mesmo CSS que os
 * modais reais usam), empilhando popup em cima de popup, igual ao
 * fluxo de produção.
 */

type Layout = 'A' | 'B' | 'C';

function PopupCard({ titulo, children, onFechar }: { titulo: string; children: React.ReactNode; onFechar?: () => void }) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        {children}
      </div>
    </div>
  );
}

export default function EsmagadorRaizesCena() {
  const { rolarD20, rolarDados } = useRoll();
  const [layout, setLayout] = useState<Layout>('A');
  const [log, setLog] = useState<string[]>([]);

  function empilhar(linha: string) {
    setLog((l) => [linha, ...l]);
  }

  // Opção A — popup com os 2 cartões, empilha o modal de cada efeito por cima
  const [aListaAberta, setAListaAberta] = useState(false);
  const [aEsmagador, setAEsmagador] = useState<'pendente' | 'usado' | 'pulado'>('pendente');
  const [aRaizes, setARaizes] = useState<'pendente' | 'Derrubar' | 'Empurrar' | 'pulado'>('pendente');
  const [aModalEsmagador, setAModalEsmagador] = useState(false);
  const [aModalEscolha, setAModalEscolha] = useState(false);
  const [aModalSalvaguarda, setAModalSalvaguarda] = useState(false);

  // Opção B — fila sequencial (0 = fechado, 1 = pergunta Esmagador, 2 = pergunta Raízes)
  const [bPasso, setBPasso] = useState(0);
  const [bModalEscolha, setBModalEscolha] = useState(false);
  const [bModalSalvaguarda, setBModalSalvaguarda] = useState(false);

  // Opção C — popup único (toggle solto + escolha única), 1 "Confirmar"
  const [cAberto, setCAberto] = useState(false);
  const [cEsmagador, setCEsmagador] = useState(false);
  const [cRaizes, setCRaizes] = useState<'Derrubar' | 'Empurrar' | null>(null);
  const [cModalSalvaguarda, setCModalSalvaguarda] = useState(false);

  function abrirEfeitos() {
    setAEsmagador('pendente');
    setARaizes('pendente');
    setCEsmagador(false);
    setCRaizes(null);
    if (layout === 'A') setAListaAberta(true);
    if (layout === 'B') setBPasso(1);
    if (layout === 'C') setCAberto(true);
  }

  function atacar() {
    rolarD20({
      label: '🗡 Ataque — Clava Grande',
      formula: '1d20+7',
      mod: 7,
      confirmarAcerto: {
        onAcertou: () => {
          rolarDados({
            label: 'Dano da Clava Grande (Contundente)',
            formula: '2d6+4',
            quantidade: 2,
            lados: 6,
            mod: 4,
            onResultado: (total) => empilhar(`Dano aplicado: ${total}.`),
            confirmarFechamento: { rotulo: '💥🌳 Efeitos do golpe', aoTocar: abrirEfeitos },
          });
        },
        onErrou: () => empilhar('Errou — nenhum efeito gatilha.'),
      },
    });
  }

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        Grondar (Bárbaro nível 10, Trilha da Árvore do Mundo, talento Esmagador) ataca com Clava Grande
        (Pesada + Contundente) — Esmagador E Raízes Devastadoras qualificam no mesmo golpe. Escolha o
        layout e toque em "Atacar" — o botão do popup de dano abre o próximo popup em sequência, igual ao
        fluxo real do Esmagador hoje.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className={layout === 'A' ? 'btn btn-primary' : 'btn'} onClick={() => setLayout('A')}>
          A · Popup com 2 cartões
        </div>
        <div className={layout === 'B' ? 'btn btn-primary' : 'btn'} onClick={() => setLayout('B')}>
          B · Popups em fila
        </div>
        <div className={layout === 'C' ? 'btn btn-primary' : 'btn'} onClick={() => setLayout('C')}>
          C · Popup único
        </div>
      </div>

      <div className="box-solid" style={{ marginBottom: 12, padding: 10, fontSize: 12, color: 'var(--text-faint)' }}>
        {layout === 'A' &&
          'O popup mostra os 2 efeitos juntos, cada um resolve independente (toca em qualquer um, na ordem que quiser) — o popup só fecha quando você tocar "Fechar".'}
        {layout === 'B' &&
          'Popup pergunta 1 efeito de cada vez (Esmagador primeiro, Raízes depois) — garante que os 2 sejam sempre oferecidos, um popup leva ao próximo.'}
        {layout === 'C' &&
          'Popup único: Esmagador é toggle solto, Raízes é escolha única (Derrubar OU Empurrar) — 1 "Confirmar" aplica tudo e fecha.'}
      </div>

      <div className="btn btn-primary" onClick={atacar}>
        🗡 Atacar
      </div>

      {/* ---------------- Opção A ---------------- */}
      {aListaAberta && (
        <PopupCard titulo="Efeitos disponíveis" onFechar={() => setAListaAberta(false)}>
          {aEsmagador === 'pendente' && (
            <div className="opt-card" onClick={() => setAModalEsmagador(true)}>
              <div className="opt-card-name">💥 Esmagador</div>
              <div className="opt-card-desc">Empurra o alvo 1,5m (se não maior que você). 1x/turno.</div>
            </div>
          )}
          {aEsmagador === 'usado' && (
            <div className="opt-card">
              <div className="opt-card-name">✓ Esmagador — usado</div>
              <div className="opt-card-desc">Alvo empurrado 1,5m.</div>
            </div>
          )}
          {aEsmagador === 'pulado' && (
            <div className="opt-card" style={{ opacity: 0.6 }}>
              <div className="opt-card-name">Esmagador — não usado</div>
            </div>
          )}

          {aRaizes === 'pendente' && (
            <div className="opt-card" onClick={() => setAModalEscolha(true)}>
              <div className="opt-card-name">🌳 Raízes Devastadoras</div>
              <div className="opt-card-desc">Ativa Derrubar ou Empurrar, além da maestria da arma.</div>
            </div>
          )}
          {(aRaizes === 'Derrubar' || aRaizes === 'Empurrar') && (
            <div className="opt-card">
              <div className="opt-card-name">✓ Raízes — {aRaizes}</div>
              <div className="opt-card-desc">
                {aRaizes === 'Derrubar' ? 'CD 15 informada ao Mestre (Constituição).' : 'Alvo empurrado até 3m (Grande ou menor).'}
              </div>
            </div>
          )}
          {aRaizes === 'pulado' && (
            <div className="opt-card" style={{ opacity: 0.6 }}>
              <div className="opt-card-name">Raízes Devastadoras — não usado</div>
            </div>
          )}

          <div className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setAListaAberta(false)}>
            Fechar
          </div>
        </PopupCard>
      )}
      {aModalEsmagador && (
        <AtivarEfeitoModal
          titulo="💥 Esmagador"
          textoEfeito="Empurra o alvo até 1,5m pra um espaço livre, se ele não for maior que você."
          restricaoTexto="Este efeito só pode ser usado uma vez por turno."
          onAtivar={() => {
            setAModalEsmagador(false);
            setAEsmagador('usado');
            empilhar('Esmagador ativado — alvo empurrado 1,5m.');
          }}
          onNaoUsar={() => {
            setAModalEsmagador(false);
            setAEsmagador('pulado');
          }}
        />
      )}
      {aModalEscolha && (
        <EscolherEfeitoModal
          titulo="🌳 Raízes Devastadoras"
          opcoes={[
            { nome: 'Derrubar', texto: 'Salvaguarda de Constituição — falha: Caído.' },
            { nome: 'Empurrar', texto: 'Automático — empurra até 3m (Grande ou menor).' },
          ]}
          onEscolher={(nomes) => {
            setAModalEscolha(false);
            const escolha = nomes[0] as 'Derrubar' | 'Empurrar';
            if (escolha === 'Empurrar') {
              setARaizes('Empurrar');
              empilhar('Raízes — Empurrar: alvo empurrado até 3m.');
            } else {
              setAModalSalvaguarda(true);
            }
          }}
          onFechar={() => {
            setAModalEscolha(false);
            setARaizes('pulado');
          }}
        />
      )}
      {aModalSalvaguarda && (
        <SalvaguardaDoAlvoModal
          titulo="Raízes Devastadoras — Derrubar"
          atributo="Constituição"
          cd={15}
          explicacaoCd={{
            linhas: [
              { label: 'Base', valor: '8' },
              { label: 'Força', valor: '+3' },
              { label: 'Proficiência', valor: '+4' },
            ],
            total: { label: 'CD', valor: '15' },
          }}
          textoSucesso="nada acontece"
          textoFalha="fica com a condição Caído"
          onFechar={() => {
            setAModalSalvaguarda(false);
            setARaizes('Derrubar');
            empilhar('Raízes — Derrubar: CD 15 informada.');
          }}
        />
      )}

      {/* ---------------- Opção B ---------------- */}
      {bPasso === 1 && (
        <PopupCard titulo="Efeito 1 de 2">
          <div className="opt-card">
            <div className="opt-card-name">💥 Esmagador</div>
            <div className="opt-card-desc">Empurra o alvo 1,5m (se não maior que você). 1x/turno.</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <div
              className="btn"
              style={{ flex: 1 }}
              onClick={() => {
                setBPasso(2);
              }}
            >
              Pular
            </div>
            <div
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                empilhar('Esmagador ativado — alvo empurrado 1,5m.');
                setBPasso(2);
              }}
            >
              Ativar
            </div>
          </div>
        </PopupCard>
      )}
      {bPasso === 2 && (
        <PopupCard titulo="Efeito 2 de 2">
          <div className="opt-card">
            <div className="opt-card-name">🌳 Raízes Devastadoras</div>
            <div className="opt-card-desc">Ativa Derrubar ou Empurrar, além da maestria da arma.</div>
          </div>
          <div className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => setBModalEscolha(true)}>
            Escolher efeito
          </div>
          <div
            className="btn"
            style={{ marginTop: 8 }}
            onClick={() => {
              setBPasso(0);
            }}
          >
            Pular
          </div>
        </PopupCard>
      )}
      {bModalEscolha && (
        <EscolherEfeitoModal
          titulo="🌳 Raízes Devastadoras"
          opcoes={[
            { nome: 'Derrubar', texto: 'Salvaguarda de Constituição — falha: Caído.' },
            { nome: 'Empurrar', texto: 'Automático — empurra até 3m (Grande ou menor).' },
          ]}
          onEscolher={(nomes) => {
            setBModalEscolha(false);
            const escolha = nomes[0] as 'Derrubar' | 'Empurrar';
            if (escolha === 'Empurrar') {
              empilhar('Raízes — Empurrar: alvo empurrado até 3m.');
              setBPasso(0);
            } else {
              setBModalSalvaguarda(true);
            }
          }}
          onFechar={() => setBModalEscolha(false)}
        />
      )}
      {bModalSalvaguarda && (
        <SalvaguardaDoAlvoModal
          titulo="Raízes Devastadoras — Derrubar"
          atributo="Constituição"
          cd={15}
          explicacaoCd={{
            linhas: [
              { label: 'Base', valor: '8' },
              { label: 'Força', valor: '+3' },
              { label: 'Proficiência', valor: '+4' },
            ],
            total: { label: 'CD', valor: '15' },
          }}
          textoSucesso="nada acontece"
          textoFalha="fica com a condição Caído"
          onFechar={() => {
            setBModalSalvaguarda(false);
            empilhar('Raízes — Derrubar: CD 15 informada.');
            setBPasso(0);
          }}
        />
      )}

      {/* ---------------- Opção C ---------------- */}
      {cAberto && (
        <PopupCard titulo="Efeitos disponíveis neste acerto" onFechar={() => setCAberto(false)}>
          <div className="check-row" onClick={() => setCEsmagador((v) => !v)}>
            <div className={`check-box ${cEsmagador ? 'checked' : ''}`} />
            <span className="check-label">💥 Esmagador — empurra 1,5m</span>
          </div>

          <div className="section-title" style={{ marginTop: 10 }}>
            🌳 Raízes Devastadoras — escolha 1
          </div>
          <div
            className={`opt-card ${cRaizes === 'Derrubar' ? 'selected' : ''}`}
            onClick={() => setCRaizes((v) => (v === 'Derrubar' ? null : 'Derrubar'))}
          >
            <div className="opt-card-name">Derrubar</div>
            <div className="opt-card-desc">Salvaguarda de Constituição — falha: Caído.</div>
          </div>
          <div
            className={`opt-card ${cRaizes === 'Empurrar' ? 'selected' : ''}`}
            onClick={() => setCRaizes((v) => (v === 'Empurrar' ? null : 'Empurrar'))}
          >
            <div className="opt-card-name">Empurrar</div>
            <div className="opt-card-desc">Automático — empurra até 3m (Grande ou menor).</div>
          </div>

          <div
            className="btn btn-primary"
            style={{ marginTop: 10 }}
            onClick={() => {
              if (cRaizes === 'Derrubar') {
                setCModalSalvaguarda(true);
              } else {
                if (cEsmagador) empilhar('Esmagador ativado — alvo empurrado 1,5m.');
                if (cRaizes === 'Empurrar') empilhar('Raízes — Empurrar: alvo empurrado até 3m.');
                setCAberto(false);
              }
            }}
          >
            Confirmar
          </div>
        </PopupCard>
      )}
      {cModalSalvaguarda && (
        <SalvaguardaDoAlvoModal
          titulo="Raízes Devastadoras — Derrubar"
          atributo="Constituição"
          cd={15}
          explicacaoCd={{
            linhas: [
              { label: 'Base', valor: '8' },
              { label: 'Força', valor: '+3' },
              { label: 'Proficiência', valor: '+4' },
            ],
            total: { label: 'CD', valor: '15' },
          }}
          textoSucesso="nada acontece"
          textoFalha="fica com a condição Caído"
          onFechar={() => {
            setCModalSalvaguarda(false);
            if (cEsmagador) empilhar('Esmagador ativado — alvo empurrado 1,5m.');
            empilhar('Raízes — Derrubar: CD 15 informada.');
            setCAberto(false);
          }}
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
