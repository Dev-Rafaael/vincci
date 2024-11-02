import React, { useState, useContext,useEffect,lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import classes from './Identificação.module.css';
import { AccountContext } from '../contexts/AccountContext';
import imageMap from '../utils/imageMap';
import InputMask from 'react-input-mask';

const formatTitleForURL = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

const Identificação = () => {
  const [cpf, SetCpf] = useState("");
  const [nomeCompleto, SetNomeCompleto] = useState("");
  const [email, SetEmail] = useState("");
  const [senha, SetSenha] = useState("");
  const [sexo, SetSexo] = useState("");
  const [telefone, SetTelefone] = useState("");
  const [dataNascimento, SetDataNascimento] = useState("");
  const [rua, SetRua] = useState("");
  const [numeroEndereco, SetNumeroEndereco] = useState("");
  const [cep, SetCep] = useState("");
  const [cidade, SetCidade] = useState("");
  const [bairro, SetBairro] = useState("");
  const [estado, SetEstado] = useState("Sao Paulo"); // valor padrão
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { item, horario, convidados, bartenders, valorTotalFormatado, mainImage } = location.state || {};

 

  const scrollToPosition = (targetPosition, duration) => {
    const start = window.pageYOffset; 
    const distance = targetPosition - start;
    let startTime = null;

    
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

 
    const ease = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    // Rola suavemente até a posição 400px a partir do topo em 1 segundo (1000ms)
    scrollToPosition(400, 1500);
  }, []);

  // Se o item não foi selecionado, exibe uma mensagem
  if (!item) {
    return <div>Nenhum item foi selecionado.</div>;
  }

  // Breadcrumbs
  const breadcrumbs = [
    { label: item.title, url: `/Orçamento/${item.title}`, state: { item, mainImage } }, 
    { label:'IDENTIFICAÇAO', url: '/Identificação/',state: { item, mainImage } },
    { label: 'PAGAMENTO', url: '#' }
  ];
 
  // Função para enviar dados ao backend e navegar para o Checkout
  const handleContratarClick = async () => {
    console.log({ cpf, nomeCompleto, email, senha, sexo, telefone, dataNascimento, rua, numeroEndereco, cep, bairro, cidade, estado });

    if ( !cpf || !nomeCompleto || !email || !senha || !sexo || !telefone || !dataNascimento || !rua || !numeroEndereco || !cep || !bairro || !cidade || !estado) {
      alert('Por favor, preencha todos os campos e selecione as opções necessárias antes de continuar.');
      return;
    }
  
    const itemParaConta = {
      cpf,
      nomeCompleto,
      email,
      senha,
      sexo,
      telefone,
      dataNascimento,
      horario,
      bartenders,
      convidados,
      valorTotalFormatado,
      img: item.img,
      title: item.title,
      description: item.description,
      rua,
      numeroEndereco,
      cep,
      bairro,
      cidade,
      estado
    };
 
  
  
    try {
      const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/service.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemParaConta),
      
        
      });
 
      // Verifica o tipo de conteúdo da resposta
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
      
  
        if (data.success) {
          const redirectUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.preferenceId}`;
          window.location.href = redirectUrl; // Redireciona para o URL do Checkout Pro
        } else if (data.error) {
          if (data.error.includes('Duplicate entry')) {
            setShowPopup(true);
          } else {
            alert(`Erro: ${data.error}`);
          }
        }
      } else {
        const errorText = await response.text(); // Obtenha a resposta como texto
        console.error('Erro ao enviar dados (resposta não é JSON):', errorText);
        alert('O servidor retornou uma resposta inesperada.');
      }
    } catch (error) {
      alert('Houve um problema ao enviar os dados. Verifique os detalhes no console.');
      console.error('Erro ao enviar dados:', error);
    }
  };
  
  // Função para fechar o popup de erro
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <>
      {showPopup && (
        <div className={classes.popup}>
          <div className={classes.popupContent}>
            <p>O e-mail já está em uso. Por favor, faça login para continuar.</p>
            <div className={classes.btnPopup}>
            <button onClick={() => { handleClosePopup(); navigate('/login'); }}>Ir para Login</button>
            <button onClick={handleClosePopup} className={classes.btnClose}>Fechar</button>
            </div>
          </div>
        </div>
      )}
      <section className={classes.Identificacao}>
        <div className={classes.navIdentificacao}>
          <h1>IDENTIFICAÇÃO</h1>
          <Breadcrumbs paths={breadcrumbs} />
        </div>
        <section className={classes.IdentificacaoContent}>
        <aside className={classes.sidebar}>
          <div className={classes.textContainer}>
            <h2>IDENTIFICAÇÃO</h2>
          </div>
        </aside>
          <div className={classes.cadastroIdentificacao}  data-aos="fade-up" data-aos-delay="200">
            <h2>Agora, iremos criar o seu cadastro:</h2>
            <p>Está quase acabando...</p>
            <div className={classes.ContentIdentificacao}>
              <form action="#" className={classes.formIdentificacao}>
               
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" name="nome" id="nome" placeholder='Digite Seu Nome Completo' value={nomeCompleto} onChange={(e) => SetNomeCompleto(e.target.value)} required />
                <article className={classes.inline}>
                <label htmlFor="cpf">CPF
                <InputMask mask="999.999.999-99" value={cpf} onChange={(e) => SetCpf(e.target.value)} required>
                {(inputProps) => <input {...inputProps} type="text" placeholder="Digite Seu CPF" />}
              </InputMask>
            </label>
                <label htmlFor="data">Data de Nascimento
                <input type="date" name="data" id="data" value={dataNascimento} onChange={(e) => SetDataNascimento(e.target.value)} required />
              </label>
              </article>
                <article className={classes.inline}>
                <label htmlFor="email">E-Mail
                <input type="email" name="email" id="email" placeholder='Digite Seu E-Mail' value={email} onChange={(e) => SetEmail(e.target.value)} required />
                </label>
                <label htmlFor="senha">Senha
                <input type="password" name="senha" id="senha" placeholder='Digite uma senha' value={senha} onChange={(e) => SetSenha(e.target.value)} required />
               </label> 
               </article>
               <article className={classes.inline}>
                <label htmlFor="sexo">Sexo
                <select name="sexo" id="sexo" value={sexo} onChange={(e) => SetSexo(e.target.value)} required>
                  <option value="" disabled>Selecione uma Opção</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
                </label>
                <label htmlFor="telefone">DDD + Celular
                  <InputMask mask="(99) 99999-9999" value={telefone} onChange={(e) => SetTelefone(e.target.value)} required>
                    {(inputProps) => <input {...inputProps} type="text" placeholder="(11) 91092-8922" />}
                  </InputMask>
                </label>
                </article>
                <article className={classes.inline}>
                  <label for="rua">Endereço (Rua):
                  <input type="text" id="rua" name="rua" placeholder='Digite O Nome Da Rua' value={rua} onChange={(e) => SetRua(e.target.value)} required/>
                </label>
                  <label for="numeroRua">Número:
                  <input type="text" id="numeroRua" name="numeroRua"  placeholder='Digite O Número Da Rua' value={numeroEndereco} onChange={(e) => SetNumeroEndereco(e.target.value)}required/>
                </label>
                </article>
                <article className={classes.inline}>
                  <label for="CEP">CEP:
                  <InputMask mask="99999-999" value={cep} onChange={(e) => SetCep(e.target.value)} required>
                    {(inputProps) => <input {...inputProps} type="text" placeholder="Digite o CEP" />}
                  </InputMask>
                </label>
                  <label for="bairro">Bairro:
                  <input type="text" id="bairro" name="bairro" placeholder='Digite O Nome Do Bairro' value={bairro} onChange={(e) => SetBairro(e.target.value)} required/>
                </label>
                </article>
                <article className={classes.inline}>
                  <label for="cidade">Cidade:
                  <input type="text" id="cidade" name="cidade" placeholder='Digite O Nome Da Cidade' value={cidade} onChange={(e) => SetCidade(e.target.value)} required/>
                </label>
                <label for="estado">Estado:
              <select name="estado" id="estado" value={estado} onChange={(e) => SetEstado(e.target.value)} required>
                <option value="Sao Paulo">São Paulo</option>
              </select>
            </label>

              </article>
            </form>
            </div>
            <div className={classes.InfoCadastro}>
              <p>Utilizamos seus dados pessoais somente para o cadastro em nossa plataforma, que nos permite lhe prestar nossos serviços. Apos o cadastro ser concluido sera possivel fazer login no nosso site usando os mesmos dados aqui inseridos</p>
            </div>
            <div className={classes.btn}>
              <button onClick={handleContratarClick}>CONTRATAR</button>
            </div>
          </div>
          <section className={classes.InfoPacote}  data-aos="fade-up" data-aos-delay="200">
            <div className={classes.imgPacote}>
              <img src={mainImage} alt={item.title} loading={lazy} />
            </div> 
            <h4>{item.title}</h4> 
            <p>{item.description}</p>
            <div className={classes.itemPrice}>
              <p>R$ {valorTotalFormatado}</p>
            </div>
            <div className={classes.infoAdicionais}>
              <h2>Informações adicionais:</h2>
              <div className={classes.info}>
                <p>Horario Da Festa:</p>
                <p>{horario} Horas</p>
              </div>
              <div className={classes.info}>
                <p>Nº Bartenders:</p>
                <p>{bartenders} Bartenders</p>
              </div>
              <div className={classes.info}>
                <p>Nº Convidados:</p>
                <p>{convidados} Convidados</p>
              </div>
            </div>
          </section>    
        </section>
      </section>
    </>
  );
};

export default Identificação;
// const handleContratarClick = async () => {
//   if (!horario || !convidados || !bartenders) {
//     alert('Por favor, selecione todas as opções antes de continuar.');
//     return;
//   }

//   const itemParaConta = {
//     cpf,
//     nomeCompleto,
//     email,
//     senha,
//     sexo,
//     telefone,
//     dataNascimento,
//     horario,
//     bartenders,
//     convidados,
//     valorTotalFormatado,
//     img: item.img,  // Adiciona o caminho da imagem
//     title: item.title,  // Adiciona o título do item
//     description: item.description  // Adiciona a descrição do item
//   };

//   console.log('Enviando dados...', itemParaConta);

//   try {
//     const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/service.php', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(itemParaConta),
//     });
//     const data = await response.json();

//     console.log('Resposta recebida:', data);

//     if (data.success) {
//       addToAccount(itemParaConta);
//       navigate('./Account/');
//     } else {
//       alert(`Erro: ${data.error}`);
//     }

//     if (data.error) {
//       if (data.error.includes('Duplicate entry')) {
//         setShowPopup(true);
//       } else {
//         alert(`Erro: ${data.error}`);
//       }
//     } else {
//       console.log('Dados enviados:', data);
//       navigate('/Checkout/', { 
//         state: { 
//           item,
//           horario,
//           convidados,
//           bartenders,
//           valorTotalFormatado
//         }  
//       });
//     }
//   } catch (error) {

//   }
// };