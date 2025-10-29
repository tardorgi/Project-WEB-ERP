import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import './OrcamentoVenda.css';
import BarraSuperior from '../../BarraSuperior/BarraSuperior';
import BarraLateral from '../../BarraLateral/BarraLateral';

export default function OrcamentoVenda() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [itens, setItens] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const [isEditingOrcamento, setIsEditingOrcamento] = useState(false);
  const [isCreatingOrcamento, setIsCreatingOrcamento] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);

  const editorRefOrc = useRef(null);
  const editorRefItem = useRef(null);
  const menuRef = useRef(null);

  const host = window.location.hostname;
  const backendURL = `http://${host}:3001`;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleToggleSidebar = () => setSidebarOpen(open => !open);

  // Ordenação e filtros
  const [ordenacao, setOrdenacao] = useState(() => {
    const saved = localStorage.getItem('orcamentoVenda_ordenacao');
    return saved ? JSON.parse(saved) : { coluna: null, direcao: null };
  });
  const [filtros, setFiltros] = useState(() => {
    const salvo = localStorage.getItem('orcamentoVenda_filtros');
    return salvo ? JSON.parse(salvo) : {};
  });
  const [showMenu, setShowMenu] = useState({ coluna: null, anchor: null });
  const [selecionados, setSelecionados] = useState({});

  const [orcamentosOriginais, setOrcamentosOriginais] = useState([]);
  const [itensOriginais, setItensOriginais] = useState([]);
  const [operacoesColunas, setOperacoesColunas] = useState({
    PRECO_UNITARIO: { soma: null, media: null },
    VR_TOTAL_ITEM: { soma: null, media: null }
  });

  // Carrega orçamentos
  const carregarOrcamentos = useCallback(async () => {
    axios.defaults.baseURL = backendURL;
    try {
      const params = {};
      if (ordenacao.coluna && ordenacao.direcao) {
        params.ordenarPor = ordenacao.coluna;
        params.direcao = ordenacao.direcao;
      }
      Object.entries(filtros).forEach(([col, val]) => {
        if (val) params[`filtro_${col}`] = val;
      });
      const res = await axios.get('/orcamentoVenda', { params });
      setOrcamentos(res.data);
      if (Object.keys(filtros).length === 0) setOrcamentosOriginais(res.data);
    } catch (err) {
      console.error('Erro ao carregar orçamentos:', err);
    }
  }, [ordenacao, filtros, backendURL]);

  useEffect(() => carregarOrcamentos(), [carregarOrcamentos]);
  useEffect(() => localStorage.setItem('orcamentoVenda_ordenacao', JSON.stringify(ordenacao)), [ordenacao]);
  useEffect(() => localStorage.setItem('orcamentoVenda_filtros', JSON.stringify(filtros)), [filtros]);

  // Carrega itens ao selecionar orçamento
  const carregarItens = async (empresa, orc) => {
    try {
      const res = await axios.get(`/orcamentoVenda/${empresa}/${orc}/itens`);
      setItens(res.data);
      if (Object.keys(filtros).length === 0) setItensOriginais(res.data);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
      setItens([]);
    }
  };

  // Eventos de seleção/double-click
  const handleOrcamentoClick = orc => {
    setOrcamentoSelecionado(orc);
    setItemSelecionado(null);
    carregarItens(orc.EMPRESA, orc.ORCAMENTO);
  };
  const handleOrcamentoDblClick = orc => {
    setOrcamentoSelecionado(orc);
    setIsEditingOrcamento(true);
    setIsCreatingOrcamento(false);
  };
  const handleItemClick = itm => setItemSelecionado(itm);
  const handleItemDblClick = itm => {
    setItemSelecionado(itm);
    setIsEditingItem(true);
    setIsCreatingItem(false);
  };

  // Handlers change
  const handleChangeOrc = e => setOrcamentoSelecionado({ ...orcamentoSelecionado, [e.target.name]: e.target.value });
  const handleChangeItem = e => setItemSelecionado({ ...itemSelecionado, [e.target.name]: e.target.value });

  // Ações Orçamento
  const handleSalvarOrc = async () => {
    try {
      await axios.put(
        `/orcamentoVenda/${orcamentoSelecionado.EMPRESA}/${orcamentoSelecionado.ORCAMENTO}`,
        orcamentoSelecionado
      );
      await carregarOrcamentos();
      cancelarEdicaoOrc();
    } catch (err) { alert('Erro ao salvar Orçamento'); }
  };
  const handleSalvarNovoOrc = async () => {
    try {
      await axios.post('/orcamentoVenda', orcamentoSelecionado);
      await carregarOrcamentos();
      cancelarEdicaoOrc();
    } catch (err) { alert('Erro ao criar Orçamento'); }
  };
  const handleExcluirOrc = async () => {
    if (!window.confirm('Deseja excluir este Orçamento?')) return;
    try {
      await axios.delete(
        `/orcamentoVenda/${orcamentoSelecionado.EMPRESA}/${orcamentoSelecionado.ORCAMENTO}`
      );
      await carregarOrcamentos();
      cancelarEdicaoOrc();
    } catch (err) { alert('Erro ao excluir Orçamento'); }
  };
  const cancelarEdicaoOrc = () => {
    setOrcamentoSelecionado(null);
    setIsEditingOrcamento(false);
    setIsCreatingOrcamento(false);
  };

  // Ações Item
  const handleSalvarItem = async () => {
    try {
      await axios.put(
        `/orcamentoVenda/${itemSelecionado.EMPRESA}/${itemSelecionado.ORCAMENTO}/item/${itemSelecionado.ITEM}`,
        itemSelecionado
      );
      carregarItens(itemSelecionado.EMPRESA, itemSelecionado.ORCAMENTO);
      cancelarEdicaoItem();
    } catch (err) { alert('Erro ao salvar Item'); }
  };
  const handleSalvarNovoItem = async () => {
    try {
      await axios.post(
        `/orcamentoVenda/${itemSelecionado.EMPRESA}/${itemSelecionado.ORCAMENTO}/item`,
        itemSelecionado
      );
      carregarItens(itemSelecionado.EMPRESA, itemSelecionado.ORCAMENTO);
      cancelarEdicaoItem();
    } catch (err) { alert('Erro ao criar Item'); }
  };
  const handleExcluirItem = async () => {
    if (!window.confirm('Deseja excluir este Item?')) return;
    try {
      await axios.delete(
        `/orcamentoVenda/${itemSelecionado.EMPRESA}/${itemSelecionado.ORCAMENTO}/item/${itemSelecionado.ITEM}`
      );
      carregarItens(itemSelecionado.EMPRESA, itemSelecionado.ORCAMENTO);
      cancelarEdicaoItem();
    } catch (err) { alert('Erro ao excluir Item'); }
  };
  const cancelarEdicaoItem = () => {
    setItemSelecionado(null);
    setIsEditingItem(false);
    setIsCreatingItem(false);
  };

  // Formatação e cálculos
  const formatDecimal = v => (v == null || isNaN(v) ? '' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  const formatDate = d => d ? new Date(d).toISOString().slice(0,10) : '';
  const calcularOperacao = (col, tipo) => {
    const vals = itens.map(i => parseFloat(i[col]) || 0);
    const res = tipo==='soma'
      ? vals.reduce((a,b)=>a+b,0)
      : vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
    setOperacoesColunas(op => ({ ...op, [col]: { ...op[col], [tipo]: res }}));
  };

  // Filtro/menu (mantido como antes)
  // ... você pode reutilizar a implementação existente ...

  return (
    <div className={`principal-container ${sidebarOpen?'':'sidebar-collapsed'}`}>
      <BarraSuperior onToggleSidebar={handleToggleSidebar} />
      <BarraLateral visivel={sidebarOpen} onClose={()=>setSidebarOpen(false)} />

      <div className="listas-duplas">
        {/* Orçamentos */}
        <div className="lista-orcamentos">
          <div className="menu-header">
            <img src="/icons/faturamento.png" alt="Orçamento" className="menu-icon" />
            <h2 className="empresa-header">Orçamentos</h2>
            <div className="acoes-topo">
              <button className="btn-criar" onClick={()=>{ setOrcamentoSelecionado({}); setIsCreatingOrcamento(true); setIsEditingOrcamento(false); }}>
                <img src="/icons/adicionar.png" alt="Adicionar" className="btn-icone" /> Novo Orçamento
              </button>
              <button className="btn-excluir" disabled={!orcamentoSelecionado} onClick={handleExcluirOrc}>
                <img src="/icons/cancelar.png" alt="Excluir" className="btn-icone" /> Excluir
              </button>
            </div>
          </div>
          <div className="tabela-container">
            <table className="tabela-empresa">
              <thead>
                <tr>
                  <th onClick={e=>setShowMenu({coluna:'EMPRESA',anchor:e.target})}>Empresa</th>
                  <th onClick={e=>setShowMenu({coluna:'ORCAMENTO',anchor:e.target})}>Orçamento</th>
                  <th onClick={e=>setShowMenu({coluna:'DATA_ORCAMENTO',anchor:e.target})}>Data</th>
                  <th onClick={e=>setShowMenu({coluna:'TIPO_MOVIMENTO',anchor:e.target})}>Tipo Movimento</th>
                  <th onClick={e=>setShowMenu({coluna:'STATUS',anchor:e.target})}>Status</th>
                  <th onClick={e=>setShowMenu({coluna:'USUARIO',anchor:e.target})}>Usuário</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.map((o,i)=>(
                  <tr key={i}
                      className={orcamentoSelecionado===o?'selecionado':''}
                      onClick={()=>handleOrcamentoClick(o)}
                      onDoubleClick={()=>handleOrcamentoDblClick(o)}>
                    <td>{o.EMPRESA}</td>
                    <td>{o.ORCAMENTO}</td>
                    <td>{formatDate(o.DATA_ORCAMENTO)}</td>
                    <td>{o.TIPO_MOVIMENTO}</td>
                    <td>{o.STATUS}</td>
                    <td>{o.USUARIO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Itens do Orçamento */}
        <div className="lista-itens">
          <div className="menu-header">
            <img src="/icons/faturamento.png" alt="Itens" className="menu-icon" />
            <h2 className="empresa-header">Itens do Orçamento</h2>
            <div className="acoes-topo">
              <button className="btn-criar" disabled={!orcamentoSelecionado} onClick={()=>{ setItemSelecionado({}); setIsCreatingItem(true); setIsEditingItem(false); }}>
                <img src="/icons/adicionar.png" alt="Adicionar" className="btn-icone" /> Novo Item
              </button>
              <button className="btn-excluir" disabled={!itemSelecionado} onClick={handleExcluirItem}>
                <img src="/icons/cancelar.png" alt="Excluir" className="btn-icone" /> Excluir
              </button>
            </div>
          </div>
          <div className="tabela-container">
            <table className="tabela-empresa">
              <thead>
                <tr>
                  <th onClick={e=>setShowMenu({coluna:'ITEM',anchor:e.target})}>Item</th>
                  <th onClick={e=>setShowMenu({coluna:'MATERIAL',anchor:e.target})}>Material</th>
                  <th onClick={e=>setShowMenu({coluna:'DESCRICAO',anchor:e.target})}>Descrição</th>
                  <th onClick={e=>setShowMenu({coluna:'UNIDADE',anchor:e.target})}>Unidade</th>
                  <th onClick={e=>setShowMenu({coluna:'QUANTIDADE',anchor:e.target})}>Quantidade</th>
                  <th onClick={e=>setShowMenu({coluna:'PRECO_UNITARIO',anchor:e.target})}>
                    Preço Unitário
                    {operacoesColunas.PRECO_UNITARIO.soma!==null && <span className="coluna-operacoes">Σ {formatDecimal(operacoesColunas.PRECO_UNITARIO.soma)}</span>}
                    {operacoesColunas.PRECO_UNITARIO.media!==null && <span className="coluna-operacoes">μ {formatDecimal(operacoesColunas.PRECO_UNITARIO.media)}</span>}
                  </th>
                  <th onClick={e=>setShowMenu({coluna:'VR_TOTAL_ITEM',anchor:e.target})}>
                    Valor Total
                    {operacoesColunas.VR_TOTAL_ITEM.soma!==null && <span className="coluna-operacoes">Σ {formatDecimal(operacoesColunas.VR_TOTAL_ITEM.soma)}</span>}
                    {operacoesColunas.VR_TOTAL_ITEM.media!==null && <span className="coluna-operacoes">μ {formatDecimal(operacoesColunas.VR_TOTAL_ITEM.media)}</span>}
                  </th>
                </tr>
              </thead>
              <tbody>
                {itens.map((it,i)=>(
                  <tr key={i}
                      className={itemSelecionado===it?'selecionado':''}
                      onClick={()=>handleItemClick(it)}
                      onDoubleClick={()=>handleItemDblClick(it)}>
                    <td>{it.ITEM}</td>
                    <td>{it.MATERIAL}</td>
                    <td>{it.DESCRICAO}</td>
                    <td>{it.UNIDADE}</td>
                    <td>{it.QUANTIDADE}</td>
                    <td>{formatDecimal(it.PRECO_UNITARIO)}</td>
                    <td>{formatDecimal(it.VR_TOTAL_ITEM)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Orçamento */}
      {(isEditingOrcamento || isCreatingOrcamento) && (
        <Draggable handle=".editor-header" nodeRef={editorRefOrc}>
          <div ref={editorRefOrc} className="floating-editor moderno">
            <div className="editor-header">
              <span className="drag-icon">⠿</span>
              <span className="editor-title">{isCreatingOrcamento ? 'Novo Orçamento' : 'Editar Orçamento'}</span>
            </div>
            <div className="form-blocos">
              <div className="form-linha dupla">
                <div><label>Empresa</label><input name="EMPRESA" value={orcamentoSelecionado?.EMPRESA||''} onChange={handleChangeOrc} disabled={isEditingOrcamento} /></div>
                <div><label>Orçamento</label><input name="ORCAMENTO" value={orcamentoSelecionado?.ORCAMENTO||''} onChange={handleChangeOrc} disabled={isEditingOrcamento} /></div>
              </div>
              <div className="form-linha dupla">
                <div><label>Data</label><input name="DATA_ORCAMENTO" type="date" value={formatDate(orcamentoSelecionado?.DATA_ORCAMENTO)} onChange={handleChangeOrc} /></div>
                <div><label>Tipo Movimento</label><input name="TIPO_MOVIMENTO" value={orcamentoSelecionado?.TIPO_MOVIMENTO||''} onChange={handleChangeOrc} /></div>
              </div>
              <div className="form-linha dupla">
                <div><label>Status</label><input name="STATUS" value={orcamentoSelecionado?.STATUS||''} onChange={handleChangeOrc} /></div>
                <div><label>Usuário</label><input name="USUARIO" value={orcamentoSelecionado?.USUARIO||''} onChange={handleChangeOrc} /></div>
              </div>
            </div>
            <div className="modal-botoes">
              <img src="/icons/salvar.png" alt="Salvar" className="botao-icon" onClick={()=> isCreatingOrcamento ? handleSalvarNovoOrc() : handleSalvarOrc()} />
              <img src="/icons/cancelar.png" alt="Cancelar" className="botao-icon" onClick={cancelarEdicaoOrc} />
            </div>
          </div>
        </Draggable>
      )}

      {/* Modal Item */}
      {(isEditingItem || isCreatingItem) && (
        <Draggable handle=".editor-header" nodeRef={editorRefItem}>
          <div ref={editorRefItem} className="floating-editor moderno">
            <div className="editor-header">
              <span className="drag-icon">⠿</span>
              <span className="editor-title">{isCreatingItem ? 'Novo Item' : 'Editar Item'}</span>
            </div>
            <div className="form-blocos">
              <div className="form-linha dupla">
                <div><label>Item</label><input name="ITEM" value={itemSelecionado?.ITEM||''} onChange={handleChangeItem} disabled={isEditingItem} /></div>
                <div><label>Material</label><input name="MATERIAL" value={itemSelecionado?.MATERIAL||''} onChange={handleChangeItem} /></div>
              </div>
              <div className="form-linha dupla">
                <div><label>Descrição</label><input name="DESCRICAO" value={itemSelecionado?.DESCRICAO||''} onChange={handleChangeItem} /></div>
                <div><label>Unidade</label><input name="UNIDADE" value={itemSelecionado?.UNIDADE||''} onChange={handleChangeItem} /></div>
              </div>
              <div className="form-linha dupla">
                <div><label>Quantidade</label><input name="QUANTIDADE" type="number" value={itemSelecionado?.QUANTIDADE||''} onChange={handleChangeItem} /></div>
                <div><label>Preço Unitário</label><input name="PRECO_UNITARIO" type="number" value={itemSelecionado?.PRECO_UNITARIO||''} onChange={handleChangeItem} /></div>
              </div>
            </div>
            <div className="modal-botoes">
              <img src="/icons/salvar.png" alt="Salvar" className="botao-icon" onClick={()=> isCreatingItem ? handleSalvarNovoItem() : handleSalvarItem()} />
              <img src="/icons/cancelar.png" alt="Cancelar" className="botao-icon" onClick={cancelarEdicaoItem} />
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
}
