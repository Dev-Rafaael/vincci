import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Register.module.css'; // Você pode criar um CSS para estilização

function Register() {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/caminho_para_o_seu_script_php/cadastrar_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeCompleto, email, senha }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Cadastro realizado com sucesso!');
        navigate('/login'); // Redireciona para a página de login
      } else {
        alert('Erro ao cadastrar: ' + data.message);
      }
    } catch (err) {
      alert('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleRegister} className={classes.registerForm}>
      <h2>Cadastrar</h2>
      <input
        type="text"
        placeholder="Nome Completo"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        required
      />
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
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default Register;
