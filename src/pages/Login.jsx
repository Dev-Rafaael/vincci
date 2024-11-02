import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from '../contexts/AccountContext';
import { useNavigate, useLocation } from 'react-router-dom';
import classes from './Login.module.css';

function Login({ onClose }) {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || ''); // Pega o email do estado ou define vazio
  const [senha, setSenha] = useState('');
  const { setAccountItems } = useContext(AccountContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost/ecommerce-pub/my-ecommerce-backend/api/verificar_login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (data.user) {
        setAccountItems([data.user]);
        navigate('/Minha-Conta');
      } else {
        setError(data.message || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={classes.loginForm}>
      <div className={classes.loginContent}>
        <h2>ENTRAR</h2>
        {error && <div className={classes.errorMessage}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <div className={classes.btnLogin}>
          <button type="submit" className={classes.btnEntrar} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <button type="button" onClick={onClose} className={classes.btnFechar}>Fechar</button>
        </div>
      </div>
    </form>
  );
}

export default Login;
