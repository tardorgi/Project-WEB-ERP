import { useState, useEffect } from 'react';
import './Empresa.css';

export default function ModalEmpresa({ aberta, onClose, onSalvar, empresa }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(empresa || {});
  }, [empresa]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!aberta) return null;

  return (
    <div className="modal-fundo">
      <div className="modal">
        <h3>{empresa ? 'Alterar Empresa' : 'Nova Empresa'}</h3>
        <div className="form-linha">
          <label>Empresa:</label>
          <input name="EMPRESA" value={form.EMPRESA || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>Orçamento:</label>
          <input name="ORCAMENTO" value={form.ORCAMENTO || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>Data Orçamento:</label>
          <input name="DATA_ORCAMENTO" value={form.DATA_ORCAMENTO || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>Tipo Movimento:</label>
          <input name="TIPO_MOVIMENTO" value={form.TIPO_MOVIMENTO || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>Status:</label>
          <input name="STATUS" value={form.STATUS || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>Usuário:</label>
          <input name="USUARIO" value={form.USUARIO || ''} onChange={handleChange} />
        </div>
        <div className="modal-botoes">
          <button onClick={() => onSalvar(form)}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
