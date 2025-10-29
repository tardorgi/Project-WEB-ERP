// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Principal from './components/Principal/Principal';
import Empresa from './components/Cadastro/Empresa/Empresa';
import OrcamentoVenda from './components/Faturamento/OrcamentoVenda/OrcamentoVenda';
import { FavoritosProvider } from './context/FavoritosContext';

function App() {
  return (
    <FavoritosProvider>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/Empresa" element={<Empresa />} />
        <Route path="/orcamento-venda" element={<OrcamentoVenda />} />
      </Routes>
    </FavoritosProvider>
  );
}

export default App;
