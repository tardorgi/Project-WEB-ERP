import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import './Empresa.css';
import BarraSuperior from '../../BarraSuperior/BarraSuperior';
import BarraLateral from '../../BarraLateral/BarraLateral';

export default function Empresa() {
  const [empresas, setEmpresas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [formEmpresa, setFormEmpresa] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const editorRef = useRef(null);

  // Monta a URL do backend dinamicamente pelo host
  const host = window.location.hostname;
  const backendURL = `http://${host}:3001`;

  // Barra lateral começa escondida (igual Principal)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleToggleSidebar = () => setSidebarOpen(open => !open);

  // Reabre sidebar ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    axios.defaults.baseURL = backendURL;
    carregarEmpresas();
  }, [backendURL]);

  const carregarEmpresas = async () => {
    try {
      const res = await axios.get('/empresa');
      setEmpresas(res.data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  };

  const handleRowClick = (empresa) => {
    setSelecionada(empresa);
    setFormEmpresa(empresa);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleChange = (e) => {
    setFormEmpresa({ ...formEmpresa, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (dados) => {
    try {
      await axios.put(`/empresa/${dados.EMPRESA}`, dados);
      await carregarEmpresas();
      cancelarEdicao();
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
    }
  };

  const handleSalvarNovo = async () => {
    try {
      await axios.post('/empresa', formEmpresa);
      await carregarEmpresas();
      cancelarEdicao();
    } catch (err) {
      console.error('Erro ao criar empresa:', err);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Deseja excluir esta empresa?')) return;
    try {
      await axios.delete(`/empresa/${id}`);
      await carregarEmpresas();
      cancelarEdicao();
    } catch (err) {
      console.error('Erro ao excluir empresa:', err);
    }
  };

  const cancelarEdicao = () => {
    setSelecionada(null);
    setIsEditing(false);
    setIsCreating(false);
    setFormEmpresa({});
  };

  return (
    <div className={`principal-container ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <BarraSuperior onToggleSidebar={handleToggleSidebar} />
      <BarraLateral visivel={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="listas-container">
        <div className="menu-bloco">
          <div className="menu-header">
            <h3>Empresa</h3>
            <img src="/icons/cadastro.png" alt="Empresa" className="menu-icon" />
          </div>
          <div className="menu-itens" style={{ flexDirection: 'column', gap: 0 }}>
            <div className="cabecalho" style={{ marginTop: 0, marginBottom: 10 }}>
              <h2 className="empresa-header"> </h2>
              <div className="acoes-topo">
                <button
                  className="btn-criar"
                  onClick={() => {
                    setFormEmpresa({});
                    setIsCreating(true);
                    setIsEditing(false);
                  }}
                >
                  <img
                    src="/icons/adicionar.png"
                    alt="Adicionar"
                    className="btn-icone"
                  />
                  Nova Empresa
                </button>
                <div className="btn-group">
                  <button
                    className="btn-excluir"
                    disabled={!selecionada}
                    onClick={() => handleExcluir(selecionada?.EMPRESA)}
                  >
                    <img
                      src="/icons/cancelar.png"
                      alt="Cancelar"
                      className="btn-icone"
                    />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
            <div className="tabela-container">
              <table className="tabela-empresa">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Razão Social</th>
                    <th>Estado</th>
                    <th>Cidade</th>
                    <th>CNPJ</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((e, i) => (
                    <tr
                      key={i}
                      onClick={() => handleRowClick(e)}
                      className={
                        selecionada?.EMPRESA === e.EMPRESA ? 'selecionado' : ''
                      }
                    >
                      <td>{e.EMPRESA}</td>
                      <td>{e.RAZAO_SOCIAL}</td>
                      <td>{e.ESTADO}</td>
                      <td>{e.CIDADE}</td>
                      <td>{e.CNPJ}</td>
                      <td>{e.TELEFONE_1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {(isEditing || isCreating) && (
        <Draggable handle=".editor-header" nodeRef={editorRef}>
          <div ref={editorRef} className="floating-editor moderno">
            <div className="editor-header">
              <span className="drag-icon">⠿</span>
              <span className="editor-title">
                {isCreating ? 'Nova Empresa' : 'Editar Empresa'}
              </span>
            </div>

            <div className="form-blocos">
              <div className="form-linha full">
                <label>Razão Social</label>
                <input
                  name="RAZAO_SOCIAL"
                  value={formEmpresa.RAZAO_SOCIAL || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-linha dupla">
                <div>
                  <label>CNPJ</label>
                  <input
                    name="CNPJ"
                    value={formEmpresa.CNPJ || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>IE</label>
                  <input
                    name="IE"
                    value={formEmpresa.IE || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-linha dupla">
                <div>
                  <label>Cidade</label>
                  <input
                    name="CIDADE"
                    value={formEmpresa.CIDADE || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Estado</label>
                  <input
                    name="ESTADO"
                    value={formEmpresa.ESTADO || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-linha full">
                <label>Telefone 1</label>
                <input
                  name="TELEFONE_1"
                  value={formEmpresa.TELEFONE_1 || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-botoes">
              <img
                src="/icons/salvar.png"
                alt="Salvar"
                title="Salvar"
                className="botao-icon"
                onClick={() =>
                  isCreating
                    ? handleSalvarNovo()
                    : handleSalvar(formEmpresa)
                }
              />
              <img
                src="/icons/cancelar.png"
                alt="Cancelar"
                title="Cancelar"
                className="botao-icon"
                onClick={cancelarEdicao}
              />
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
}
