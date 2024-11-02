import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Importando a biblioteca de cookies

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Carregar itens do cookie ao montar o componente
  useEffect(() => {
    const storedCartItems = Cookies.get('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Salvar itens no cookie sempre que o estado de cartItems mudar
  useEffect(() => {
    if (cartItems.length > 0) {
      Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 }); // Define cookie com expiração de 7 dias
    } else {
      Cookies.remove('cartItems'); // Remove o cookie se o carrinho estiver vazio
    }
  }, [cartItems]);

  // Função para adicionar item ao carrinho
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const updatedCart = [...prevItems, item];
      Cookies.set('cartItems', JSON.stringify(updatedCart), { expires: 7 });
      return updatedCart;
    });
  };
  const isItemInCart = (id) => {
    return cartItems.some(item => item.item.id === id);
  };

  // Função para remover item do carrinho
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const updatedCartItems = prevItems.filter(item => item.item.id !== itemId);
      Cookies.set('cartItems', JSON.stringify(updatedCartItems), { expires: 7 }); // Atualiza o cookie após remover
      return updatedCartItems;
    });
  };
  const updateCartItem = (updatedItem) => {
    setCartItems(prevItems => {
      const updatedCartItems = prevItems.map(item => 
        item.item.id === updatedItem.item.id ? updatedItem : item
      );
      Cookies.set('cartItems', JSON.stringify(updatedCartItems), { expires: 7 });
      return updatedCartItems;
    });
  };
  
  const submitCartData = () => {
    // Retorna os dados do carrinho para serem usados em outra página
    return cartItems;
  };
  return (
    <CartContext.Provider value={{ cartItems, addToCart, isItemInCart, removeFromCart, updateCartItem, submitCartData }}>
    {children}
  </CartContext.Provider>
  );
};

export { CartContext, CartProvider };

