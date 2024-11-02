import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../contexts/AccountContext';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import classes from './Account.module.css';
import InputMask from 'react-input-mask';

function Account() {
  const { accountItems, setAccountItems, logout } = useContext(AccountContext);
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [emailParaDeletar, setEmailParaDeletar] = useState("");
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Carregar accountItems do localStorage ao montar o componente
  useEffect(() => {
    // Verifica o localStorage para garantir que os dados estejam atualizados
    const savedAccount = localStorage.getItem('account');
    if (savedAccount && accountItems.length === 0 && typeof setAccountItems === 'function') {
      setAccountItems(JSON.parse(savedAccount));
    }
  
    if (accountItems && accountItems.length > 0) {
      // Armazena os dados na sessão, caso existam
      sessionStorage.setItem('userAccount', JSON.stringify(accountItems[0]));
    }
  }, [accountItems, setAccountItems]);


  const updateAccountItem = (updatedItem) => {
    setAccountItems((prevItems) =>
      prevItems.map((item) =>
        item.email === updatedItem.email ? updatedItem : item
      )
    );
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);

    if (!nomeCompleto || !email || !sexo || !dataNascimento || !telefone) {
      alert('Preencha todos os campos');
      return;
    }

    const updatedData = {
      nomeCompleto,
      email,
      sexo,
      dataNascimento,
      telefone,
      update: true
    };

    fetch('http://localhost/ecommerce-pub/my-ecommerce-backend/api/verificar_login.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro na rede ou no servidor.');
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === 'success') {
        updateAccountItem({
          email,
          nome_completo: nomeCompleto,
          sexo,
          data_nascimento: dataNascimento,
          telefone,
        });

        handleCloseModal();
      } else {
        alert('Erro ao atualizar conta: ' + data.message);
      }
    })
    .catch((error) => {
      alert('Erro ao atualizar conta: ' + error.message);
    });
  };

  const handleOpenModal = (email) => {
    setEmailParaDeletar(email);
    setIsModalDelete(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalDelete(false);
    setSenha("");
  };

  const handleDeleteAccount = (email, senha) => {
    if (!senha) {
      alert('Por favor, insira sua senha para confirmar.');
      return;
    }

    fetch('http://localhost/ecommerce-pub/my-ecommerce-backend/api/verificar_login.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'success') {
        alert('Conta deletada com sucesso!');
        handleLogout();
      } else {
        alert('Erro ao deletar conta: ' + data.message);
      }
    })
    .catch((error) => {
      alert('Erro ao deletar conta: ' + error.message);
    });

    handleCloseModal();
  };

  const handleEditAccountClick = (item) => {
    setNomeCompleto(item.nome_completo);
    setEmail(item.email);
    setSexo(item.sexo || '');
    setDataNascimento(item.data_nascimento || '');
    setTelefone(item.telefone || '');
    
    setIsModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo({
      top: window.innerHeight / 2,
      behavior: 'smooth', 
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/Minha-Conta');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';

    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };

  if (!accountItems || accountItems.length === 0) {
    return (
      <main className={classes.mainAccount}>
        <header className={classes.navAccount}>
          <h2>O CADASTRO ESTA VAZIO.</h2>
          <div className={classes.buttonContainer}>
            <Link to="/Cadastro" className={classes.btnCadastrar}>Cadastrar</Link>
            <Link to="/Login" className={classes.btnLogar}>Entrar</Link>
          </div>
        </header>
      </main>
    );
  }
  return (
    <main className={classes.mainAccount}>
      {isModalOpen && (
  <div className={classes.modalOverlay}>
    <div className={classes.modalContent}>
      <h2>Editar Conta</h2>
      <form onSubmit={handleSaveChanges}>
        
        <div className={classes.formGroup}>
          <label htmlFor="nomeCompleto">Nome Completo:</label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            required
          />
        </div>


        <div className={classes.formGroup}>
        <label htmlFor="sexo">Sexo </label>
                <select name="sexo" id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} required>
                  <option value="" disabled>Selecione uma Opção</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
              </select>
        </div>

        <div className={classes.formGroup}>
        <label htmlFor="data">Data de Nascimento
              <input type="date" name="data" id="data" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
          </label>
        </div>

        <div className={classes.formGroup}>
        <label htmlFor="telefone">DDD + Celular
                  <InputMask mask="(99) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} required>
                    {(inputProps) => <input {...inputProps} type="text" placeholder="(11) 91092-8922" />}
                  </InputMask>
                </label>
        </div>

        <div className={classes.modalButtons}>
          <button type="button" onClick={handleCloseModal} className={classes.closeButton}>Voltar</button>
          <button type="submit" className={classes.saveButton}>Salvar</button>
        </div>
      </form>
    </div>
  </div>
)}
 {showSuccessModal && (
        <div className={classes.modalMessageOverlay}>
          <div className={classes.modalMessageContent}>
            <p>Conta Atualizada com sucesso!</p>
          </div>
        </div>
      )}
      <div className={classes.navAccount}>
        <h1>MINHA CONTA</h1>
      </div>
      <div className={classes.accountTitle}>
        <h1>Minha Conta <span>________</span></h1>
      </div>
      {accountItems.map((item) => (
        <section key={item.email} className={classes.accountSection}>
          <aside className={classes.accountAside}>
            <figure>
            <img
                src={item.sexo === "feminino" 
                  ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp" 
                  : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"}
                alt="avatar"
              />
              <figcaption>
                <h1>Olá {item.nome_completo}</h1>
                <p>Seja Bem Vindo(a)!!</p>
                <button className={classes.btnLogout} onClick={handleLogout}>LOGOUT</button> {/* Botão de Logout */}
              </figcaption>
            </figure>
          </aside>

          <section className={classes.infoSection}>
            <article className={classes.infoArticle}>
            <div className={classes.contentInfo}>
              <h2>INFORMAÇÕES PESSOAIS</h2>

              <div className={classes.serviceButton}>
              <button onClick={() => handleEditAccountClick(item) } className={classes.btn}>
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => handleOpenModal(item.email)} className={classes.btnDelete}>
      <i className="fas fa-trash"></i>
    </button>

    {isModalDelete && (
      <div className={classes.modalOverlay}>
        <div className={classes.modalContent}>
          <h2>Confirme a exclusão</h2>
          <p>Por favor, insira sua senha para confirmar a exclusão da conta.</p>
          
          <input
            type="password"
            placeholder="Insira sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)} // Atualiza a senha no estado
          />

          <div className={classes.modalButtons}>
            <button onClick={handleCloseModal} className={classes.closeButton}>Cancelar</button>
            <button onClick={() => handleDeleteAccount(emailParaDeletar, senha)} className={classes.deleteButton}>
              Deletar Conta
            </button>
          </div>
        </div>
      </div>
    )}
                </div>
                
            </div>
              
              <dl>
                <div className={classes.flexRow}>
                  <dt>Nome Completo</dt>
                  <dd>{item.nome_completo}</dd>
                </div>
                <div className={classes.flexRow}>
                  <dt>Sexo</dt>
                  <dd>{item.sexo || 'Não informado'}</dd>
                </div>
                <div className={classes.flexRow}>
                  <dt>Email</dt>
                  <dd>{item.email}</dd>
                </div>
                <div className={classes.flexRow}>
                  <dt>Telefone</dt>
                  <dd>{item.telefone || 'Não informado'}</dd>
                </div>
                <div className={classes.flexRow}>
                  <dt>Data de Nascimento</dt>
                  <dd>{formatDate(item.data_nascimento) || 'Não informado'}</dd>
                </div>
              
              </dl>
            </article>
           
          </section>
        </section>
      ))}
    </main>
  );
}

export default Account;