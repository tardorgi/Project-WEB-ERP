import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../../context/FavoritosContext';
import menus from '../../constants/menus';
import './BarraLateral.css';

export default function BarraLateral({ visivel, onClose }) {
  const navigate = useNavigate();
  const { favoritos, fixarFavorito, desafixarFavorito } = useFavoritos();

  // Estado para menus abertos (array de titles)
  const [abertos, setAbertos] = useState([]);

  // Agrupa favoritos por categoria (title)
  const favoritosPorCategoria = menus
    .map(menu => ({
      title: menu.title,
      items: favoritos.filter(fav =>
        menu.items.some(mi => mi.route === fav.route)
      ),
    }))
    .filter(grupo => grupo.items.length > 0);

  const toggleFavorito = item => {
    favoritos.some(f => f.id === item.id)
      ? desafixarFavorito(item.id)
      : fixarFavorito(item);
  };

  // Função para abrir/fechar grupo
  const toggleGrupo = title => {
    setAbertos(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* Overlay apenas para mobile */}
      <div
        className={`sidebar-overlay ${visivel ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* usa .barra-lateral para o CSS de colapso */}
      <aside className={`barra-lateral ${visivel ? 'visible' : ''}`}>
        <div className="sidebar-header">
          <h3>Favoritos</h3>
        </div>

        {favoritos.length === 0 && (
          <p className="nenhum-favorito">Nenhum favorito fixado</p>
        )}

        {favoritosPorCategoria.map(grupo => (
          <div key={grupo.title}>
            <div
              className="categoria-separador"
              onClick={() => toggleGrupo(grupo.title)}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {grupo.title}
              <span style={{ fontSize: 18, marginLeft: 8 }}>
                {abertos.includes(grupo.title) ? '▼' : '►'}
              </span>
            </div>
            {abertos.includes(grupo.title) &&
              grupo.items.map(item => (
                <div key={item.id} className="menu-item">
                  <span onClick={() => navigate(`/${item.route}`)}>
                    {item.label}
                  </span>
                  <img
                    src={
                      favoritos.some(f => f.id === item.id)
                        ? '/icons/estrela_ativa.png'
                        : '/icons/estrela_inativa.png'
                    }
                    alt="favorito"
                    className="icone-estrela"
                    onClick={() => toggleFavorito(item)}
                  />
                </div>
              ))}
          </div>
        ))}
      </aside>
    </>
  );
}
