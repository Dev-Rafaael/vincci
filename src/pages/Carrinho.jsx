import React, { useContext,useMemo,lazy,useEffect,useState   } from 'react';
import classes from './Carrinho.module.css';
import { Link } from 'react-router-dom';
import imageMap from '../utils/imageMap'; // Ajuste o caminho conforme necessário
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
function Carrinho() {
  const { cartItems, removeFromCart, updateCartItem } = useContext(CartContext);
  const [horario, setHorario] = useState('');
  const [convidados, setConvidados] = useState('');
  const [bartenders, setBartenders] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);
  const [mostrarValor, setMostrarValor] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
 

  const handleSaveChanges = (e) => {
    e.preventDefault();


    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000); // Limpar modal após 5 segundos
  
    // Calcular o novo valor
    const novoValor = calcularValor();

    // Atualizar o item editado com o novo valor
    const updatedItem = {
      ...editableItem,
      horario,
      convidados,
      bartenders,
      valorTotalFormatado: `R$ ${novoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };

    updateCartItem(updatedItem);
    handleCloseModal();
  };

  const calcularValor = () => {
    let valor = 0;

    const valoresHorario = {
      '3': 200,
      '4': 300,
      '5': 400,
    };

    const valoresConvidados = {
      '50': 500,
      '100': 700,
      'Superior A 100': 1000,
    };

    const valoresBartenders = {
      '1': 150,
      '2': 250,
      'Superior A 2': 400,
    };

    valor += valoresHorario[horario] || 0;
    valor += valoresConvidados[convidados] || 0;
    valor += valoresBartenders[bartenders] || 0;

    return valor; // Retornar o valor calculado
  };

  useEffect(() => {
    const valor = calcularValor();
    setValorTotal(valor);

    if (horario && convidados && bartenders) {
      setMostrarValor(true);
    } else {
      setMostrarValor(false);
    }
  }, [horario, convidados, bartenders]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditableItem(null);
    setMostrarValor(false); // Resetar estado de mostrar o valor
  };

  const handleEditItem = (item) => {
    setEditableItem(item);
    setIsModalOpen(true);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleFinalizarCompra = () => {
    navigate('/Pagamento');
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const valorNumerico = parseFloat(item.valorTotalFormatado.replace('R$', '').replace(/\./g, '').replace(',', '.'));
      return acc + valorNumerico;
    }, 0);
  };

  const total = useMemo(() => calculateTotal(), [cartItems]);
  
  if (!cartItems || cartItems.length === 0) {
    return (
      <main>
        <section className={classes.carrinho}>
          <header className={classes.navCarrinho}>
            <h1>O carrinho está vazio.</h1>
            <div>
              <Link to="/Pacotes/" className={classes.btnCompra}>Escolher Pacotes</Link>
            </div>
          </header>
        </section>
      </main>
    );
  }

  return (
    <main>
      {isModalOpen && (
        <div className={classes.modalOverlay}>
          <div className={classes.modalContent}>
            <h2>Editar Item</h2>
            <form onSubmit={handleSaveChanges}>
              <div className={classes.select}>
                <label htmlFor="Horario">Horário Da Festa:</label>
                <select name="Horario" id="Horario" value={horario} onChange={(e) => setHorario(e.target.value)} required>
                  <option value="" disabled>Selecione o Horário</option>
                  <option value="3">3 Horas</option>
                  <option value="4">4 Horas</option>
                  <option value="5">5 Horas</option>
                </select>
              </div>
              <div className={classes.select}>
                <label htmlFor="Convidados">Nº Convidados:</label>
                <select name="Convidados" id="Convidados" value={convidados} onChange={(e) => setConvidados(e.target.value)} required>
                  <option value="" disabled>Selecione uma Opção</option>
                  <option value="50">Até 50 pessoas</option>
                  <option value="100">Até 100 pessoas</option>
                  <option value="Superior A 100">Superior a 100 pessoas</option>
                </select>
              </div>
              <div className={classes.select}>
                <label htmlFor="Bartenders">Nº De Bartenders:</label>
                <select name="Bartenders" id="Bartenders" value={bartenders} onChange={(e) => setBartenders(e.target.value)} required>
                  <option value="" disabled>Selecione uma Opção</option>
                  <option value="1">Apenas 1</option>
                  <option value="2">2 Bartenders</option>
                  <option value="Superior A 2">Superior a 2 Bartenders</option>
                </select>
              </div>

              {mostrarValor && (
                <div className={classes.valor}>
                  <p>Valor: R${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              )}

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
            <p>Pacote Atualizado com sucesso!</p>
          </div>
        </div>
      )}
      <section className={classes.carrinho}>
        <header className={classes.navCarrinho}>
          <h1>CARRINHO</h1>
        </header>
        <section className={classes.itemSection}>
          <div className={classes.carrinhoTitle} >
            <h1>Meu Carrinho <span>________</span></h1>
          </div>

          <section className={classes.produtos} >
            <div className={classes.itens}>
              {cartItems.map((item, index) => (
                <article key={index} className={classes.articleProdutos}>
                  <div className={classes.produtosServico}>
                  <p className={classes.quantidadeItens}>ITEM {index + 1}</p>
                  <div className={classes.buttons}>
                          <button 
                          type="button" 
                          className={`${classes.btnEdit} ${classes.btnPrimary}`} 
                          title="Editar item"
                          onClick={() => handleEditItem(item)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                          <button 
                            type="button" 
                            className={`${classes.btnDel} ${classes.btnPrimary}`} 
                            title="Remover item"
                            onClick={() => removeFromCart(item.item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        </div>
                  <div className={classes.itemContent}>
                    <figure className={classes.imgItem}>
                      <img src={imageMap[item.item.img]} alt={`Imagem do item ${item.item.title}`} loading={lazy}/>
                    </figure>

                    <section className={classes.infoSection}>
                      <div className={classes.infoPacote}>
                        <div className={classes.info}>
                          <h3><strong>{item.item.title}</strong></h3>
                          <p>Horário: <span>{item.horario} Horas</span></p>
                          <p>Nº Bartenders: <span>{item.bartenders} Bartenders</span></p>
                          <p>Nº Convidados: <span>{item.convidados} Convidados</span></p>
                        </div>
                        
                      </div>

                      <div className={classes.preco}>
                        <p><strong>R${item.valorTotalFormatado}</strong></p>
                      </div>
                    </section>
                  </div>
                </article>
              ))}
            </div>

            <article className={classes.articleSumario}>
              <section className={classes.card}>
                <header className={classes.cardHeader}>
                  <h5>Resumo</h5>
                </header>
                <div className={classes.cardBody}>
                  <ul className={classes.listGroup}>
                    <li className={classes.listGroupItem}>
                      <p>Produtos</p>
                      <span>
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL', 
                          minimumFractionDigits: 2 
                        }).format(calculateTotal())}
                      </span>
                    </li>
                    <li className={classes.listGroupItem}>
                      <p>Frete</p><span>Grátis</span>
                    </li>
                    <li className={classes.listGroupItem}>
                      <div>
                        <h4>Total</h4>
                      </div>
                      <span>
                        <strong>
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL', 
                            minimumFractionDigits: 2 
                          }).format(calculateTotal())}
                        </strong>
                      </span>
                    </li>
                  </ul>
                  <nav className={classes.navLinks}>
                    <Link to="/Identificação/" className={classes.pagamento}>Ir para pagamento</Link>
                    <Link to="/Pacotes" className={classes.continuar}>Continuar comprando</Link>
                  </nav>
                </div>
              </section>
            </article>
          </section>
        </section>
      </section>
    </main>
  );
}

export default Carrinho;


