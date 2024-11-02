import { useState, useContext } from 'react';
import { AccountContext } from '../contexts/AccountContext';
import { useNavigate } from 'react-router-dom';
import classes from './Cadastrar.module.css';
import InputMask from 'react-input-mask';

const Cadastro = () => {
    const [cpf, setCpf] = useState("");
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [sexo, setSexo] = useState("");
    const [telefone, setTelefone] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [rua, setRua] = useState("");
    const [numeroEndereco, setNumeroEndereco] = useState("");
    const [cep, setCep] = useState("");
    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [estado, setEstado] = useState("Sao Paulo"); // valor padrão
    const { setAccountItems } = useContext(AccountContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  
    const handleContratarClick = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Inicia o estado de carregamento
    
        const itemParaConta = {
            cpf,
            nome_completo: nomeCompleto, // Corrigido
            email,
            senha,
            sexo,
            telefone,
            data_nascimento: dataNascimento, // Corrigido
            rua,
            numero_endereco: numeroEndereco, // Corrigido
            cep,
            bairro,
            cidade,
            estado
        };

        try {
          const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/cadastrar_usuario.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(itemParaConta), // Certifique-se de que itemParaConta está definido corretamente
          });
  
          if (!response.ok) {
              throw new Error('Erro ao cadastrar: ' + response.statusText);
          }
  
          const data = await response.json();

          if (data.success) { // Alteração: Verifica se o cadastro foi bem-sucedido
            console.log('Cadastro realizado com sucesso:', data); // Log adicional
            navigate('/Login', { state: { email,senha } }); // Passa o email cadastrado para o Login
        } else {
            setError(data.message || 'Erro desconhecido');
        }
          if (!data) {
              throw new Error('Resposta vazia da API');
          }
  
          console.log('Cadastro realizado com sucesso:', data);
      } catch (error) {
          console.error('Erro ao cadastrar:', error);
          setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
  };
    return (
        <main className={classes.cadastroIdentificacao}>
            <h1>Cadastro de Usuário</h1>
            <div className={classes.ContentIdentificacao}>
                <form className={classes.formIdentificacao}  onSubmit={handleContratarClick}>
                    <label htmlFor="nome">Nome Completo</label>
                    <input
                        type="text"
                        name="nome"
                        id="nome"
                        placeholder='Digite Seu Nome Completo'
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        required
                    />
                    <article className={classes.inline}>
                        <label htmlFor="cpf">CPF
                            <InputMask mask="999.999.999-99" value={cpf} onChange={(e) => setCpf(e.target.value)} required>
                                {(inputProps) => <input {...inputProps} type="text" placeholder="Digite Seu CPF" />}
                            </InputMask>
                        </label>
                        <label htmlFor="data">Data de Nascimento
                            <input type="date" name="data" id="data" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                        </label>
                    </article>
                    <article className={classes.inline}>
                        <label htmlFor="email">E-Mail
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder='Digite Seu E-Mail'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label htmlFor="senha">Senha
                            <input
                                type="password"
                                name="senha"
                                id="senha"
                                placeholder='Digite uma senha'
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </label>
                    </article>
                    <article className={classes.inline}>
                        <label htmlFor="sexo">Sexo
                            <select name="sexo" id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} required>
                                <option value="" disabled>Selecione uma Opção</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                            </select>
                        </label>
                        <label htmlFor="telefone">DDD + Celular
                            <InputMask mask="(99) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} required>
                                {(inputProps) => <input {...inputProps} type="text" placeholder="(11) 91092-8922" />}
                            </InputMask>
                        </label>
                    </article>
                    <article className={classes.inline}>
                        <label htmlFor="rua">Endereço (Rua):
                            <input
                                type="text"
                                id="rua"
                                name="rua"
                                placeholder='Digite O Nome Da Rua'
                                value={rua}
                                onChange={(e) => setRua(e.target.value)}
                                required
                            />
                        </label>
                        <label htmlFor="numeroRua">Número:
                            <input
                                type="text"
                                id="numeroRua"
                                name="numeroRua"
                                placeholder='Digite O Número Da Rua'
                                value={numeroEndereco}
                                onChange={(e) => setNumeroEndereco(e.target.value)}
                                required
                            />
                        </label>
                    </article>
                    <article className={classes.inline}>
                        <label htmlFor="CEP">CEP:
                            <InputMask mask="99999-999" value={cep} onChange={(e) => setCep(e.target.value)} required>
                                {(inputProps) => <input {...inputProps} type="text" placeholder="Digite o CEP" />}
                            </InputMask>
                        </label>
                        <label htmlFor="bairro">Bairro:
                            <input
                                type="text"
                                id="bairro"
                                name="bairro"
                                placeholder='Digite O Nome Do Bairro'
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                required
                            />
                        </label>
                    </article>
                    <article className={classes.inline}>
                        <label htmlFor="cidade">Cidade:
                            <input
                                type="text"
                                id="cidade"
                                name="cidade"
                                placeholder='Digite O Nome Da Cidade'
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                required
                            />
                        </label>
                        <label htmlFor="estado">Estado:
                            <select name="estado" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                                <option value="Sao Paulo">São Paulo</option>
                                {/* Adicione outras opções de estados conforme necessário */}
                            </select>
                        </label>
                    </article>
                </form>
            </div>
            <div className={classes.btn}>
                <button type="submit" className={classes.btnEntrar} onClick={handleContratarClick}  disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
            </div>
        </main>
    );
};

export default Cadastro;