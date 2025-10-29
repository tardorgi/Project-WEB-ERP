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
          <label>Razão Social:</label>
          <input name="RAZAO_SOCIAL" value={form.RAZAO_SOCIAL || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>Estado:</label>
          <input name="ESTADO" value={form.ESTADO || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>Cidade:</label>
          <input name="CIDADE" value={form.CIDADE || ''} onChange={handleChange} />
        </div>
        <div className="form-linha">
          <label>CNPJ:</label>
          <input name="CNPJ" value={form.CNPJ || ''} onChange={handleChange} />
        </div>

        <div className="form-linha">
          <label>Telefone 1:</label>
          <input name="TELEFONE_1" value={form.TELEFONE_1 || ''} onChange={handleChange} />
        </div>

        <div className="modal-botoes">
          <button onClick={() => onSalvar(form)}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
