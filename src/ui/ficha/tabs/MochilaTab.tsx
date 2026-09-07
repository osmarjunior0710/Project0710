import { useState } from 'react';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import { buscarDescricaoItem, buscarDescricaoCompletaItem } from '../../../data/rulesets/dnd2024/buscarDescricaoItem';
import { calcularCargaTotal, pesoDaLinha, type ItemMochila } from '../../../core/mochila';
import {
  identificarEquipamento,
  slotsValidos,
  resumoEquipado,
  categoriaMochila,
  NOME_SLOT,
  NOME_CATEGORIA_MOCHILA,
  type SlotEquipamento,
  type CategoriaMochila,
} from '../../../core/equipamento';
import ItemComDescricao from '../../components/ItemComDescricao';
import InfoValor from '../../components/InfoValor';
import { corDaCarga } from '../../utils/corCarga';
import { itemExigeSintonizacao, contarSintonizados, LIMITE_SINTONIZACAO } from '../../../core/sintonizacao';
import styles from './MochilaTab.module.css';

interface MochilaTabProps {
  itens: ItemMochila[];
  itensDetalhados: boolean;
  pesoAtivo: boolean;
  capacidadeMaxima: number | null;
  explicacaoCapacidadeMaxima: ExplicacaoCalculo;
  onAlterarQuantidade: (id: string, delta: number) => void;
  onRemoverItem: (id: string) => void;
  onAdicionarItem: (nome: string, quantidade: number) => void;
  onEquipar: (id: string, slot: SlotEquipamento) => void;
  onDesequipar: (id: string) => void;
  onAlternarSintonizacao: (id: string) => void;
  onAlternarDuasMaos: (id: string) => void;
}

function LinhaEquipar({
  item,
  onEquipar,
  onDesequipar,
  onAlternarDuasMaos,
}: {
  item: ItemMochila;
  onEquipar: (id: string, slot: SlotEquipamento) => void;
  onDesequipar: (id: string) => void;
  onAlternarDuasMaos: (id: string) => void;
}) {
  const info = identificarEquipamento(item.nome);
  const slots = slotsValidos(info);
  if (slots.length === 0) return null;

  const mostrarVersatil = info.dadoVersatil && item.slot === 'maoPrincipal';

  if (info.duasMaos) {
    const equipado = item.slot === 'maoPrincipal';
    return (
      <div className={styles.equiparRow}>
        <button
          type="button"
          className={`${styles.equiparBtn} ${equipado ? styles.equiparBtnAtivo : ''}`}
          onClick={() => (equipado ? onDesequipar(item.id) : onEquipar(item.id, 'maoPrincipal'))}
        >
          {equipado ? '✓ Empunhada (2 mãos)' : 'Equipar (ocupa as 2 mãos)'}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.equiparRow}>
      {slots.map((slot) => {
        const ativo = item.slot === slot;
        return (
          <button
            key={slot}
            type="button"
            className={`${styles.equiparBtn} ${ativo ? styles.equiparBtnAtivo : ''}`}
            onClick={() => (ativo ? onDesequipar(item.id) : onEquipar(item.id, slot))}
          >
            {ativo ? `✓ ${NOME_SLOT[slot]}` : NOME_SLOT[slot]}
          </button>
        );
      })}
      {mostrarVersatil && (
        <button
          type="button"
          className={`${styles.equiparBtn} ${item.duasMaosAtivo ? styles.equiparBtnAtivo : ''}`}
          onClick={() => onAlternarDuasMaos(item.id)}
        >
          {item.duasMaosAtivo ? `✓ 2 mãos (${info.dadoVersatil})` : `Empunhar com 2 mãos (${info.dadoVersatil})`}
        </button>
      )}
    </div>
  );
}

function Linha({
  item,
  itensDetalhados,
  pesoAtivo,
  onAlterarQuantidade,
  onRemoverItem,
  onEquipar,
  onDesequipar,
  onAlternarDuasMaos,
  onAlternarSintonizacao,
  sintonizadosAtual,
}: {
  item: ItemMochila;
  itensDetalhados: boolean;
  pesoAtivo: boolean;
  onAlterarQuantidade: (id: string, delta: number) => void;
  onRemoverItem: (id: string) => void;
  onEquipar: (id: string, slot: SlotEquipamento) => void;
  onDesequipar: (id: string) => void;
  onAlternarDuasMaos: (id: string) => void;
  onAlternarSintonizacao: (id: string) => void;
  sintonizadosAtual: number;
}) {
  const descricao = buscarDescricaoItem(item.nome);
  const descricaoCompleta = buscarDescricaoCompletaItem(item.nome);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);

  function tocarTrash() {
    if (confirmandoRemocao) {
      onRemoverItem(item.id);
      return;
    }
    setConfirmandoRemocao(true);
    setTimeout(() => setConfirmandoRemocao(false), 3000);
  }

  return (
    <div className={styles.itemRow}>
      <div className={styles.itemTop}>
        <span className={styles.itemName}>
          {itensDetalhados ? (
            item.nome
          ) : (
            <ItemComDescricao
              nome={item.nome}
              descricao={descricao}
              descricaoCompleta={descricaoCompleta}
              rotulo={item.nome}
              variante="icone"
            />
          )}
        </span>
        <span
          className={`${styles.trashBtn} ${confirmandoRemocao ? styles.trashBtnConfirmando : ''}`}
          onClick={tocarTrash}
        >
          {confirmandoRemocao ? 'confirmar 🗑' : '🗑'}
        </span>
      </div>
      {itensDetalhados && descricao && <div className={styles.itemDesc}>{descricao}</div>}
      <LinhaEquipar item={item} onEquipar={onEquipar} onDesequipar={onDesequipar} onAlternarDuasMaos={onAlternarDuasMaos} />
      {itemExigeSintonizacao(item.nome) && (
        <div className={styles.equiparRow}>
          <button
            type="button"
            className={`${styles.equiparBtn} ${item.sintonizado ? styles.equiparBtnAtivo : ''}`}
            disabled={!item.sintonizado && sintonizadosAtual >= LIMITE_SINTONIZACAO}
            onClick={() => onAlternarSintonizacao(item.id)}
          >
            {item.sintonizado
              ? '✓ Sintonizado'
              : sintonizadosAtual >= LIMITE_SINTONIZACAO
                ? `Sintonização cheia (${LIMITE_SINTONIZACAO}/${LIMITE_SINTONIZACAO})`
                : '✨ Sintonizar'}
          </button>
        </div>
      )}
      <div className={styles.itemBottom}>
        {pesoAtivo ? <span className={styles.itemWeight}>{pesoDaLinha(item)}</span> : <span />}
        <div className={styles.stepperRow}>
          <button
            type="button"
            className={styles.stepperBtn}
            disabled={item.quantidade === 0}
            onClick={() => onAlterarQuantidade(item.id, -1)}
          >
            −
          </button>
          <span className={styles.stepperQtd}>{item.quantidade}</span>
          <button type="button" className={styles.stepperBtn} onClick={() => onAlterarQuantidade(item.id, 1)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

const ORDEM_CATEGORIAS: CategoriaMochila[] = ['arma', 'armadura', 'joia', 'outros'];

function GrupoItens({
  categoria,
  itens,
  expandido,
  onToggle,
  itensDetalhados,
  pesoAtivo,
  onAlterarQuantidade,
  onRemoverItem,
  onEquipar,
  onDesequipar,
  onAlternarDuasMaos,
  onAlternarSintonizacao,
  sintonizadosAtual,
}: {
  categoria: CategoriaMochila;
  itens: ItemMochila[];
  expandido: boolean;
  onToggle: () => void;
  itensDetalhados: boolean;
  pesoAtivo: boolean;
  onAlterarQuantidade: (id: string, delta: number) => void;
  onRemoverItem: (id: string) => void;
  onEquipar: (id: string, slot: SlotEquipamento) => void;
  onDesequipar: (id: string) => void;
  onAlternarDuasMaos: (id: string) => void;
  onAlternarSintonizacao: (id: string) => void;
  sintonizadosAtual: number;
}) {
  if (itens.length === 0) return null;

  return (
    <>
      <div className={styles.grupoHeader} onClick={onToggle}>
        <span>
          {NOME_CATEGORIA_MOCHILA[categoria]} ({itens.length})
        </span>
        <span>{expandido ? '▾' : '▸'}</span>
      </div>
      {expandido &&
        itens.map((it) => (
          <Linha
            key={it.id}
            item={it}
            itensDetalhados={itensDetalhados}
            pesoAtivo={pesoAtivo}
            onAlterarQuantidade={onAlterarQuantidade}
            onRemoverItem={onRemoverItem}
            onEquipar={onEquipar}
            onDesequipar={onDesequipar}
            onAlternarDuasMaos={onAlternarDuasMaos}
            onAlternarSintonizacao={onAlternarSintonizacao}
            sintonizadosAtual={sintonizadosAtual}
          />
        ))}
    </>
  );
}

function AdicionarItem({ onAdicionarItem }: { onAdicionarItem: (nome: string, quantidade: number) => void }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  function confirmar() {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return;
    onAdicionarItem(nomeLimpo, quantidade);
    setNome('');
    setQuantidade(1);
  }

  return (
    <div className={`box ${styles.addBox}`}>
      <div className="label" style={{ marginBottom: 6 }}>
        ganhou ou achou um item? adiciona aqui
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          placeholder="nome do item..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <div className={styles.stepperRow}>
          <button type="button" className={styles.stepperBtn} onClick={() => setQuantidade((v) => Math.max(1, v - 1))}>
            −
          </button>
          <span className={styles.stepperQtd}>{quantidade}</span>
          <button type="button" className={styles.stepperBtn} onClick={() => setQuantidade((v) => v + 1)}>
            +
          </button>
        </div>
      </div>
      <div className="btn btn-primary" style={{ marginTop: 8, textAlign: 'center' }} onClick={confirmar}>
        + Adicionar item
      </div>
    </div>
  );
}

export default function MochilaTab({
  itens,
  itensDetalhados,
  pesoAtivo,
  capacidadeMaxima,
  explicacaoCapacidadeMaxima,
  onAlterarQuantidade,
  onRemoverItem,
  onAdicionarItem,
  onEquipar,
  onDesequipar,
  onAlternarDuasMaos,
  onAlternarSintonizacao,
}: MochilaTabProps) {
  const carga = calcularCargaTotal(itens);
  const percentual = capacidadeMaxima ? Math.round((carga.kg / capacidadeMaxima) * 100) : 0;
  const sobrecarregado = capacidadeMaxima !== null && carga.kg > capacidadeMaxima;
  const equipado = resumoEquipado(itens);
  const sintonizadosAtual = contarSintonizados(itens);
  const itensSintonizados = itens.filter((it) => it.sintonizado);

  const [gruposExpandidos, setGruposExpandidos] = useState<Record<CategoriaMochila, boolean>>({
    arma: true,
    armadura: true,
    joia: true,
    outros: true,
  });
  function toggleGrupo(categoria: CategoriaMochila) {
    setGruposExpandidos((prev) => ({ ...prev, [categoria]: !prev[categoria] }));
  }
  const itensPorCategoria: Record<CategoriaMochila, ItemMochila[]> = { arma: [], armadura: [], joia: [], outros: [] };
  for (const it of itens) itensPorCategoria[categoriaMochila(it.nome)].push(it);

  return (
    <>
      {pesoAtivo && (
        <>
          <div className="section-title">Carga</div>
          <div className={`box ${styles.cargaBox}`}>
            <div className={styles.cargaRow}>
              <span>{carga.kg.toString().replace('.', ',')} kg carregados</span>
              <span>
                máx. {capacidadeMaxima ?? '—'} kg
                <InfoValor titulo="Capacidade máxima de carga" explicacao={explicacaoCapacidadeMaxima} />
              </span>
            </div>
            <div className={styles.weightBarOuter}>
              <div
                className={styles.weightBarInner}
                style={{ width: `${Math.min(100, percentual)}%`, background: corDaCarga(percentual) }}
              />
            </div>
          </div>
          {sobrecarregado && (
            <div className="label" style={{ marginTop: 4, color: 'var(--danger)' }}>
              Carga acima da capacidade máxima.
            </div>
          )}
          {carga.itensSemPeso > 0 && (
            <div className="label" style={{ marginTop: 4 }}>
              {carga.itensSemPeso} {carga.itensSemPeso === 1 ? 'item não entra' : 'itens não entram'} nessa soma —
              sem peso cadastrado na planilha ainda.
            </div>
          )}
        </>
      )}

      <div className="section-title">Equipado agora</div>
      <div className={`box ${styles.equipadoBox}`}>
        <div className={styles.equipadoLinha}>
          <span>Mão Principal</span>
          <span>{equipado.maoPrincipal?.nome ?? '—'}</span>
        </div>
        <div className={styles.equipadoLinha}>
          <span>Mão Secundária</span>
          <span>
            {equipado.maoSecundariaOcupadaPorDuasMaos
              ? 'ocupada (arma de 2 mãos)'
              : (equipado.maoSecundaria?.nome ?? '—')}
          </span>
        </div>
        <div className={styles.equipadoLinha}>
          <span>Armadura</span>
          <span>{equipado.armadura?.nome ?? '—'}</span>
        </div>
        <div className={styles.equipadoLinha}>
          <span>Escudo</span>
          <span>{equipado.escudo?.nome ?? '—'}</span>
        </div>
      </div>
      <div className="label" style={{ marginTop: 4, marginBottom: 4 }}>
        Armadura, Escudo e arma da Mão Principal/Secundária já valem
        de verdade na CA e no "Atacar" da aba Combat.
      </div>

      {sintonizadosAtual > 0 && (
        <>
          <div className="section-title">
            Sintonizados agora ({sintonizadosAtual}/{LIMITE_SINTONIZACAO})
          </div>
          <div className={`box ${styles.equipadoBox}`}>
            {itensSintonizados.map((it) => (
              <div key={it.id} className={styles.equipadoLinha}>
                <span>✨ {it.nome}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-title">Itens</div>
      {itens.length === 0 && <div className="label">Mochila vazia.</div>}
      {ORDEM_CATEGORIAS.map((categoria) => (
        <GrupoItens
          key={categoria}
          categoria={categoria}
          itens={itensPorCategoria[categoria]}
          expandido={gruposExpandidos[categoria]}
          onToggle={() => toggleGrupo(categoria)}
          itensDetalhados={itensDetalhados}
          pesoAtivo={pesoAtivo}
          onAlterarQuantidade={onAlterarQuantidade}
          onRemoverItem={onRemoverItem}
          onEquipar={onEquipar}
          onDesequipar={onDesequipar}
          onAlternarDuasMaos={onAlternarDuasMaos}
          onAlternarSintonizacao={onAlternarSintonizacao}
          sintonizadosAtual={sintonizadosAtual}
        />
      ))}

      <AdicionarItem onAdicionarItem={onAdicionarItem} />
    </>
  );
}
