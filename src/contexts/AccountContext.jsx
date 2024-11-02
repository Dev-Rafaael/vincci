import React, { createContext, useState, useEffect } from 'react';

// Criação do contexto
export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accountItems, setAccountItems] = useState(() => {
    // Carrega o estado inicial do localStorage
    try {
      const savedAccount = localStorage.getItem('account');
      return savedAccount ? JSON.parse(savedAccount) : []; 
    } catch (error) {
      console.error('Erro ao acessar o localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    // Salva `accountItems` no localStorage sempre que ele é atualizado
    localStorage.setItem('account', JSON.stringify(accountItems));
  }, [accountItems]);

  const addToAccount = (newAccount) => {
    if (newAccount) {
      setAccountItems([newAccount]);
    } else {
      console.warn('Tentativa de adicionar um valor inválido à conta.');
    }
  };

  const updateAccount = (updatedAccount) => {
    setAccountItems(prevItems => 
      prevItems.map(item => 
        item.email === updatedAccount.email ? updatedAccount : item
      )
    );
  };

  const logout = () => {
    setAccountItems([]);
    localStorage.removeItem('account');
  };

  return (
    <AccountContext.Provider value={{ accountItems, setAccountItems, addToAccount, updateAccount, logout }}>
      {children}
    </AccountContext.Provider>
  );
};
