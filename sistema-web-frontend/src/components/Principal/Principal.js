// src/components/Principal/Principal.js
import React, { useState, useRef, useEffect } from 'react';
import './Principal.css';
import { useNavigate } from 'react-router-dom';
import BarraSuperior from '../BarraSuperior/BarraSuperior';
import BarraLateral from '../BarraLateral/BarraLateral';
import menus from '../../constants/menus';
import { useFavoritos } from '../../context/FavoritosContext';

export default function Principal() {
  const navigate = useNavigate();

  // inicializa sidebar aberta somente se for desktop (>768px)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const handleToggleSidebar = () => setSidebarOpen(open => !open);

  // opcional: reativa sidebar ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const { favoritos, fixarFavorito, desafixarFavorito } = useFavoritos();
  const carrosselRefs = useRef([]);

  useEffect(() => {
    carrosselRefs.current.forEach(ref => {
      if (!ref) return;
      let isDragging = false, startX = 0, scrollLeft = 0;

      const mouseDown = e => {
        isDragging = true;
        startX = e.pageX - ref.offsetLeft;
        scrollLeft = ref.scrollLeft;
        ref.style.cursor = 'grabbing';
      };
      const mouseLeave = () => { isDragging = false; ref.style.cursor = 'grab'; };
      const mouseUp    = () => { isDragging = false; ref.style.cursor = 'grab'; };
      const mouseMove  = e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - ref.offsetLeft;
        ref.scrollLeft = scrollLeft - (x - startX);
      };

      ref.addEventListener('mousedown',  mouseDown);
      ref.addEventListener('mouseleave', mouseLeave);
      ref.addEventListener('mouseup',    mouseUp);
      ref.addEventListener('mousemove',  mouseMove);

      return () => {
        ref.removeEventListener('mousedown',  mouseDown);
        ref.removeEventListener('mouseleave', mouseLeave);
        ref.removeEventListener('mouseup',    mouseUp);
        ref.removeEventListener('mousemove',  mouseMove);
      };
    });
  }, []);

  const renderItem = (item, categoria) => {
    const id = `${categoria}-${item.route}`;
    const isFav = favoritos.some(f => f.id === id);

    return (
      <div key={id} className="menu-item">
        <span onClick={() => navigate(`/${item.route}`)}>
          {item.label}
        </span>
        <img
          src={isFav ? '/icons/estrela_ativa.png' : '/icons/estrela_inativa.png'}
          alt="favorito"
          className="icone-estrela"
          onClick={e => {
            e.stopPropagation();
            isFav
              ? desafixarFavorito(id)
              : fixarFavorito({ ...item, id, categoria });
          }}
        />
      </div>
    );
  };

  return (
    <div className={`principal-container ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <BarraSuperior onToggleSidebar={handleToggleSidebar} />
      <BarraLateral visivel={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="listas-container">
        {menus.map((menu, idx) => (
          <div key={menu.title} className="menu-bloco">
            <div className="menu-header">
              <h3>{menu.title}</h3>
              <img src={`/icons/${menu.icon}`} alt={menu.title} className="menu-icon" />
            </div>
            <div
              className="menu-itens"
              ref={el => (carrosselRefs.current[idx] = el)}
            >
              {menu.items.map(item => renderItem(item, menu.title))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
