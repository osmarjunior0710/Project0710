import { useState } from 'react';
import {
  calcularCustoCarrinho,
  calcularModAtaque,
  classeEhProficiente,
  construirCatalogoLoja,
  formatarPO,
  itensAdquiridosPorKits,
  itensAdquiridosPorOrigemOuClasse,
  type GrupoLoja,
  type ItemAdquiridoPorKit,
  type ItemAdquiridoPorOrigemOuClasse,
  type LojaItem,
} from '../../../core/loja';
import { calcularOuroInicial } from '../../../core/calculoPersonagem';
import { calcularCapacidadeMaxima, calcularCargaTotal, calcularItensIniciais, pesoDaLinha, type ItemMochila } from '../../../core/mochila';
import { buscarDescricaoItem } from '../../../data/rulesets/dnd2024/buscarDescricaoItem';
import ItemComDescricao from '../../components/ItemComDescricao';
import { corDaCarga } from '../../utils/corCarga';
import type { StepProps } from './StepProps';
import styles from './LojaStep.module.css';

const GRUPOS_ARMA_ARMADURA = new Set([
  'armas-simples-cac',
  'armas-simples-dist',
  'armas-marciais-cac',
  'armas-marciais-dist',
  'armadura-leve',
  'armadura-media',
  'armadura-pesada',
  'escudos',
]);

const catalogo = construirCatalogoLoja();

function quantidadeNoCarrinho(selection: StepProps['selection'], nome: string): number {
  return selection.itens.find((i) => i.nome === nome)?.quantidade ?? 0;
}

function ItemCard({
  item,
  selection,
  update,
  ouroRestante,
  adquiridoPorKit,
  adquiridoPorOrigemOuClasse,
}: {
  item: LojaItem;
  selection: StepProps['selection'];
  update: StepProps['update'];
  ouroRestante: number;
  adquiridoPorKit?: ItemAdquiridoPorKit;
  adquiridoPorOrigemOuClasse?: ItemAdquiridoPorOrigemOuClasse;
}) {
  const qtd = quantidadeNoCarrinho(selection, item.nome);
  const podeComprar = item.custoPO !== null && item.custoPO <= ouroRestante;

  function mudarQuantidade(delta: number) {
    const atual = [...selection.itens];
    const idx = atual.findIndex((i) => i.nome === item.nome);
    const qtdAtual = idx >= 0 ? atual[idx].quantidade : 0;
    const nova = qtdAtual + delta;
    if (nova <= 0) {
      if (idx >= 0) atual.splice(idx, 1);
    } else if (idx >= 0) {
      atual[idx] = { nome: item.nome, quantidade: nova };
    } else {
      atual.push({ nome: item.nome, quantidade: nova });
    }
    update({ itens: atual });
  }

  const modAtaque =
    item.dano !== undefined && item.propriedades !== undefined
      ? calcularModAtaque(selection, { grupo: item.grupo, propriedades: item.propriedades })
      : null;

  const ehKit = item.grupo === 'kits';

  return (
    <div className={`box ${styles.itemCard} ${qtd > 0 ? styles.itemCardComprado : ''}`}>
      <div className={styles.itemNome}>{ehKit ? <ItemComDescricao nome={item.nome} descricao={item.efeito ?? null} /> : item.nome}</div>

      {item.dano && (
        <div className={styles.itemLinha}>
          <span className={styles.itemLinhaLabel}>Dano/Efeito</span>
          <span className={styles.itemLinhaValor}>{item.dano}</span>
        </div>
      )}
      {item.propriedades !== undefined && (
        <div className={styles.itemLinha}>
          <span className={styles.itemLinhaLabel}>Propriedades</span>
          <span className={styles.itemLinhaValor}>{item.propriedades || '—'}</span>
        </div>
      )}
      {item.classeArmadura && (
        <div className={styles.itemLinha}>
          <span className={styles.itemLinhaLabel}>Dano/Efeito</span>
          <span className={styles.itemLinhaValor}>CA {item.classeArmadura}</span>
        </div>
      )}
      {item.furtividade && item.furtividade !== '—' && (
        <div className={styles.itemLinha}>
          <span className={styles.itemLinhaLabel}>Propriedades</span>
          <span className={styles.itemLinhaValor}>Desvantagem em Furtividade</span>
        </div>
      )}
      {item.dano !== undefined && modAtaque && (
        <div className={styles.itemLinha}>
          <span className={styles.itemLinhaLabel}>Mod. de Ataque</span>
          <span className={`${styles.itemLinhaValor} ${modAtaque.proficiente ? styles.modProficiente : styles.modSemProficiencia}`}>
            {modAtaque.mod >= 0 ? `+${modAtaque.mod}` : modAtaque.mod}
            {!modAtaque.proficiente && ' (sem proficiência)'}
          </span>
        </div>
      )}
      {item.atributo && (
        <div className={styles.itemLinha}>
          <span className={styles.itemLinhaLabel}>Atributo</span>
          <span className={styles.itemLinhaValor}>{item.atributo}</span>
        </div>
      )}
      <div className={styles.itemLinha}>
        <span className={styles.itemLinhaLabel}>Peso</span>
        <span className={styles.itemLinhaValor}>{item.peso ?? '— (sem peso cadastrado)'}</span>
      </div>
      <div className={styles.itemLinha}>
        <span className={styles.itemLinhaLabel}>Custo</span>
        <span className={styles.itemLinhaValor}>{item.custoTexto}</span>
      </div>
      {!ehKit && item.efeito && <div className={styles.itemEfeitoTexto}>{item.efeito}</div>}

      <div className={styles.stepperRow}>
        <button type="button" className={styles.stepperBtn} onClick={() => mudarQuantidade(-1)} disabled={qtd === 0}>
          −
        </button>
        <span className={styles.stepperQtd}>{qtd}</span>
        <button type="button" className={styles.stepperBtn} onClick={() => mudarQuantidade(1)} disabled={!podeComprar}>
          +
        </button>
      </div>
      {adquiridoPorKit && (
        <div className={styles.adquiridoPorKitRow}>
          <span className={`tag ${styles.tagAdquirido}`}>
            {adquiridoPorKit.quantidade}x adquirido por {adquiridoPorKit.kits.join(', ')}
          </span>
        </div>
      )}
      {adquiridoPorOrigemOuClasse && adquiridoPorOrigemOuClasse.quantidadeOrigem > 0 && (
        <div className={styles.adquiridoPorKitRow}>
          <span className={`tag ${styles.tagAdquirido}`}>{adquiridoPorOrigemOuClasse.quantidadeOrigem}x adquirido no kit de origem</span>
        </div>
      )}
      {adquiridoPorOrigemOuClasse && adquiridoPorOrigemOuClasse.quantidadeClasse > 0 && (
        <div className={styles.adquiridoPorKitRow}>
          <span className={`tag ${styles.tagAdquirido}`}>{adquiridoPorOrigemOuClasse.quantidadeClasse}x adquirido no kit de classe</span>
        </div>
      )}
    </div>
  );
}

/** Resumo do que a Origem/Classe já concedeu de graça (antes de
 * comprar qualquer coisa na Loja) — pra explicar por que a barra de
 * peso do topo já não começa vazia. Só aparece se tiver item (some
 * sozinho se o jogador escolheu "só ouro" na Origem/Classe). */
function EquipadoResumo({ titulo, itens }: { titulo: string; itens: ItemMochila[] }) {
  const [aberto, setAberto] = useState(false);
  if (itens.length === 0) return null;

  return (
    <div className="box-solid" style={{ marginBottom: 8 }}>
      <div className={styles.grupoHeader} onClick={() => setAberto(!aberto)}>
        <span className={styles.grupoTitulo}>{titulo}</span>
        <span className={styles.grupoContagem}>
          ({itens.length} {itens.length === 1 ? 'item' : 'itens'}) {aberto ? '▾' : '▸'}
        </span>
      </div>
      {aberto &&
        itens.map((it, i) => {
          const descricao = buscarDescricaoItem(it.nome);
          const rotulo = it.quantidade > 1 ? `${it.quantidade}× ${it.nome}` : it.nome;
          return (
            <div key={`${it.nome}-${i}`} className={styles.equipadoLinha}>
              <span>
                <ItemComDescricao nome={it.nome} descricao={descricao} rotulo={rotulo} />
              </span>
              <span className={styles.equipadoPeso}>{pesoDaLinha(it)}</span>
            </div>
          );
        })}
    </div>
  );
}

function Grupo({
  grupo,
  selection,
  update,
  ouroRestante,
  soProficiente,
  adquiridosPorKits,
  adquiridosPorOrigemOuClasse,
}: {
  grupo: GrupoLoja;
  selection: StepProps['selection'];
  update: StepProps['update'];
  ouroRestante: number;
  soProficiente: boolean;
  adquiridosPorKits: Map<string, ItemAdquiridoPorKit>;
  adquiridosPorOrigemOuClasse: Map<string, ItemAdquiridoPorOrigemOuClasse>;
}) {
  const [aberto, setAberto] = useState(false);
  const itensVisiveis = soProficiente && GRUPOS_ARMA_ARMADURA.has(grupo.id) ? grupo.itens.filter((it) => classeEhProficiente(selection, it)) : grupo.itens;

  if (itensVisiveis.length === 0) return null;

  const comprados = itensVisiveis
    .map((item) => ({ item, qtd: quantidadeNoCarrinho(selection, item.nome) }))
    .filter((x) => x.qtd > 0);

  return (
    <div className="box-solid" style={{ marginBottom: 8 }}>
      <div className={styles.grupoHeader} onClick={() => setAberto(!aberto)}>
        <span className={styles.grupoTitulo}>{grupo.titulo}</span>
        <span className={styles.grupoContagem}>
          ({itensVisiveis.length} {itensVisiveis.length === 1 ? 'item' : 'itens'}) {aberto ? '▾' : '▸'}
        </span>
      </div>

      {!aberto && comprados.length > 0 && (
        <div className={styles.compradoResumo}>
          <div className={styles.compradoTitulo}>Comprado</div>
          {comprados.map(({ item, qtd }) => (
            <div key={item.nome} className={styles.compradoLinha}>
              <span>
                {item.nome} ×{qtd}
              </span>
              <span>{item.custoPO !== null ? formatarPO(item.custoPO * qtd) : '—'}</span>
            </div>
          ))}
        </div>
      )}

      {aberto &&
        itensVisiveis.map((item) => (
          <ItemCard
            key={item.nome}
            item={item}
            selection={selection}
            update={update}
            ouroRestante={ouroRestante}
            adquiridoPorKit={adquiridosPorKits.get(item.nome)}
            adquiridoPorOrigemOuClasse={adquiridosPorOrigemOuClasse.get(item.nome)}
          />
        ))}
    </div>
  );
}

export default function LojaStep({ selection, update }: StepProps) {
  const [soProficiente, setSoProficiente] = useState(false);
  const ouroInicial = calcularOuroInicial(selection);
  const custoCarrinho = calcularCustoCarrinho(selection.itens, catalogo);
  const ouroRestante = Math.round((ouroInicial - custoCarrinho) * 100) / 100;
  const adquiridosPorKits = itensAdquiridosPorKits(selection.itens, catalogo);

  const itensMochila = calcularItensIniciais(selection);
  const adquiridosPorOrigemOuClasse = itensAdquiridosPorOrigemOuClasse(itensMochila, catalogo);
  const carga = calcularCargaTotal(itensMochila);
  const capacidadeMaxima = calcularCapacidadeMaxima(selection);
  const percentualCarga = capacidadeMaxima ? Math.round((carga.kg / capacidadeMaxima) * 100) : 0;
  const itensOrigem = itensMochila.filter((i) => i.origemDoItem === 'Origem');
  const itensClasse = itensMochila.filter((i) => i.origemDoItem === 'Classe');

  return (
    <>
      <div className={`box-solid ${styles.ouroBox}`}>
        <div className={styles.ouroBoxTopo}>
          <div className={styles.ouroLabelCol}>
            <span className="label">ouro inicial</span>
            <span>{ouroInicial} PO</span>
          </div>
          <div className={styles.ouroLabelCol} style={{ alignItems: 'flex-end' }}>
            <span className="label">restante</span>
            <span className={`${styles.ouroValor} ${ouroRestante <= 0 ? styles.ouroValorZerado : ''}`}>{formatarPO(ouroRestante)}</span>
          </div>
        </div>
        <div className={styles.cargaRow}>
          <div className={styles.cargaBarOuter}>
            <div className={styles.cargaBarInner} style={{ width: `${Math.min(100, percentualCarga)}%`, background: corDaCarga(percentualCarga) }} />
          </div>
          <span className={styles.cargaIcone}>🎒</span>
        </div>
        <div className={styles.cargaTexto}>
          {carga.kg.toString().replace('.', ',')} kg / máx. {capacidadeMaxima ?? '—'} kg
        </div>
      </div>

      <label className={styles.filtroRow}>
        <input type="checkbox" checked={soProficiente} onChange={(e) => setSoProficiente(e.target.checked)} />
        <span style={{ fontSize: 12 }}>Filtrar por proficiência (mostra só armas e armaduras que sua classe usa bem)</span>
      </label>

      {(itensOrigem.length > 0 || itensClasse.length > 0) && (
        <>
          <div className="section-title">Você já está levando</div>
          <EquipadoResumo titulo="Escolhido (Origem)" itens={itensOrigem} />
          <EquipadoResumo titulo="Escolhido (Classe)" itens={itensClasse} />
        </>
      )}

      <div className="section-title">Itens à venda</div>
      {catalogo.map((grupo) => (
        <Grupo
          key={grupo.id}
          grupo={grupo}
          selection={selection}
          update={update}
          ouroRestante={ouroRestante}
          soProficiente={soProficiente}
          adquiridosPorKits={adquiridosPorKits}
          adquiridosPorOrigemOuClasse={adquiridosPorOrigemOuClasse}
        />
      ))}
    </>
  );
}
