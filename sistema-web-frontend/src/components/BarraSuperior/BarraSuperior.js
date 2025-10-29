// src/components/BarraSuperior/BarraSuperior.js
import React, { useState, useEffect, useRef } from 'react';
import './BarraSuperior.css';
import { useNavigate } from 'react-router-dom';
import menus from '../../constants/menus';

const todasOpcoes = menus.flatMap(menu =>
  menu.items.map(item => ({
    ...item,
    categoria: menu.title, 
  }))
);

export default function BarraSuperior({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const sugestaoRefs = useRef([]);
  const containerRef = useRef();

  useEffect(() => {
    if (search.trim() === '') {
      setSugestoes([]);
    } else {
      const filtrados = todasOpcoes.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
      );

      const sugestoesAgrupadas = [];
      const categoriasUnicas = Array.from(new Set(filtrados.map(item => item.categoria)));

      categoriasUnicas.forEach(categoria => {
        sugestoesAgrupadas.push({ type: 'category', label: categoria }); 
        filtrados
          .filter(item => item.categoria === categoria)
          .forEach(item => sugestoesAgrupadas.push({ type: 'item', ...item })); 
      });

      setSugestoes(sugestoesAgrupadas);
      setHighlightIndex(0);
    }
  }, [search]);

  useEffect(() => {
    const ref = sugestaoRefs.current[highlightIndex];
    if (ref) {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightIndex, sugestoes]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSugestoes([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = e => {
    if (sugestoes.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let nextIndex = highlightIndex + 1;
      while (nextIndex < sugestoes.length && sugestoes[nextIndex].type === 'category') {
        nextIndex++;
      }
      setHighlightIndex(Math.min(nextIndex, sugestoes.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let prevIndex = highlightIndex - 1;
      while (prevIndex >= 0 && sugestoes[prevIndex].type === 'category') {
        prevIndex--;
      }
      setHighlightIndex(Math.max(prevIndex, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = sugestoes[highlightIndex];
      if (selectedItem && selectedItem.type === 'item') {
        navigate(`/${selectedItem.route}`);
        setSearch('');
        setSugestoes([]);
      }
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="barra-superior">
      {/* Botão de mais opções sempre visível */}
      <img
        src="/icons/mais_opcoes.png"
        alt="Menu"
        className="mais-opcoes"
        onClick={onToggleSidebar}
      />
      <img
        src="/icons/lts_logo_completo.png"
        alt="LTS Logo"
        className="logo-barra-superior"
        onClick={() => navigate('/')}
        title="Tela Inicial"
        style={{ cursor: 'pointer' }}
      />
      <div
        className={`search-container${showSearch ? ' show-input' : ''}`}
        ref={containerRef}
      >
        <input
          type="text"
          placeholder="Pesquisar menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            display: !isMobile || showSearch ? 'block' : 'none'
          }}
        />
        <img
          src="/icons/pesquisar.png"
          alt="Pesquisar"
          className="search-icon"
          onClick={() => setShowSearch(show => !show)}
        />
        {search && sugestoes.length > 0 && (
          <ul className="sugestoes-menu">
            {sugestoes.map((item, index) => {
              if (item.type === 'category') {
                return (
                  <li key={item.label} className="categoria-titulo">
                    {item.label}
                    <hr className="divisoria" />
                  </li>
                );
              } else {
                return (
                  <li
                    key={`${item.label}-${item.categoria}`}
                    className={index === highlightIndex ? 'ativo' : ''}
                    onClick={() => {
                      navigate(`/${item.route}`);
                      setSearch('');
                      setSugestoes([]);
                    }}
                    ref={el => (sugestaoRefs.current[index] = el)}
                  >
                    {item.label}
                  </li>
                );
              }
            })}
          </ul>
        )}
      </div>
    </div>
  );
}