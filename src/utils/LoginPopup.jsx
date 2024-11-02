import React, { useState } from 'react';
import classes from './LoginPopup.module.css';

const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          senha,
        }),
      });
  
      const result = await response.json();
      console.log('Login Response:', result);
  
      if (result.success) {
        // Se o login for bem-sucedido, agora envie os dados adicionais
        await handleAdditionalData();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Erro ao tentar fazer login. Tente novamente mais tarde.');
    }
  };
  
  const handleAdditionalData = async () => {
    try {
      const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
      
        }),
      });
  
      const result = await response.json();
      console.log('Additional Data Response:', result);
  
      if (result.success) {
        // Dados adicionais enviados com sucesso
        console.log('Dados adicionais enviados com sucesso');
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Erro ao tentar enviar dados adicionais. Tente novamente mais tarde.');
    }
  };
  

  return (
    <div className={classes.overlay}>
      <div className={classes.popup}>
        <button className={classes.closeButton} onClick={onClose}>X</button>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
        <button onClick={handleLogin}>Logar</button>
      </div>
    </div>
  );
};

export default LoginPopup;
