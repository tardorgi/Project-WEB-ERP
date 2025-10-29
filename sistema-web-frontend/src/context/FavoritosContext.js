// src/context/FavoritosContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  // Define baseURL dinamicamente, sem “localhost”
  useEffect(() => {
    const host = window.location.hostname;            // ex: 192.168.0.157
    axios.defaults.baseURL = `http://${host}:3001`;    // porta do backend
  }, []);

  // Carrega lista de favoritos
  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const res = await axios.get('/favoritos');
        setFavoritos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err);
        setFavoritos([]);
      }
    };
    fetchFavoritos();
  }, []);

  // Adiciona um favorito (se ainda não existir)
  const fixarFavorito = async (item) => {
    const existe = favoritos.some(f => f.id === item.id);
    if (!existe) {
      try {
        await axios.post('/favoritos', item);
        setFavoritos(prev => [...prev, item]);
      } catch (err) {
        console.error('Erro ao adicionar favorito:', err);
      }
    }
  };

  // Remove um favorito por id
  const desafixarFavorito = async (itemId) => {
    try {
      await axios.delete('/favoritos', { data: { id: itemId } });
      setFavoritos(prev => prev.filter(f => f.id !== itemId));
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
    }
  };

  return (
    <FavoritosContext.Provider
      value={{ favoritos, fixarFavorito, desafixarFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);
