import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import classes from './NavBar.module.css';
import logo from '../assets/Vincci.jpg';
import imageMap from '../utils/imageMap'; // Ajuste o caminho conforme necessário
import Spinner from '../components/spinner'; // Importa o Spinner
function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para controle do spinner

  const location = useLocation();
  const { item } = location.state || {};

  const handleLinkClick = () => {
    console.log('Link clicado, ativando spinner');
    setLoading(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const formatTitleForURL = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/searchPacotes.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm: query }),
      });
      const data = await response.json();
      
      setSearchResults(data);
    } catch (error) {
      console.error("Erro ao buscar pacotes:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchSearchResults(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && !e.target.closest(`.${classes.navItens}`) && !e.target.closest(`.${classes.hamburgerMenu}`)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMenuOpen]);

  
  const handlePacoteClick = (pacote) => {
    setIsModalOpen(false);
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className={classes.content}>
      <nav className={classes.navbarContent}>
        <div className={classes.hamburgerMenu} onClick={toggleMenu}>
          <i className={isMenuOpen ? 'bi bi-x' : 'bi bi-list'}></i>
        </div>
        <div className={classes.logo}>
          <span><img src={logo} alt="Logo" /></span>
          <h1>VINCCI PUB</h1>
        </div>

        <div className={`${classes.navItens} ${isMenuOpen ? classes.open : ''}`}>
          <ul>
            <i className="bi bi-search" onClick={toggleModal} style={{ cursor: 'pointer' }}></i>
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/Pacotes">PACOTES</Link></li>
            <Link to="#"><img src={logo} className={classes.logoImg} alt="Logo" /></Link>
            <li><Link to="/sobre">SOBRE NÓS</Link></li>
            <li><Link to="/fale-conosco">FALE CONOSCO</Link></li>
            <div className={classes.servicos}>
              <Link to="/Minha-Conta"><i className="bi bi-person"></i></Link>
              <Link to="/Carrinho"><i className="bi bi-cart"></i></Link>
            </div>
          </ul>
        </div>
      </nav>

      {isModalOpen && (
        <div className={classes.modalOverlay} onClick={toggleModal}>
          <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Pesquisar</h2>
            <div className={classes.searchContainer}>
              <input
                type="text"
                placeholder="Digite sua busca..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={classes.searchInput}
              />
              {searchTerm && (
                <button className={classes.clearButton} onClick={clearSearch}>
                  Limpar
                </button>
              )}
            </div>
            <div className={classes.searchResults}>
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((item, index) => (
                    <div className={classes.pacotesType} key={index} onClick={() => handlePacoteClick(item)}>
                      <img src={imageMap[item.img]} alt={item.title} />
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                      <div className={classes.pacotesPreco}>
                        <p>{item.price}</p>
                      </div>
                      <Link 
                        to={`/Orçamento/${formatTitleForURL(item.title)}`}
                        state={{ item }}
                        onClick={handleLinkClick} // Ativa o spinner ao clicar
                      >
                        SAIBA MAIS
                      </Link>
                    </div>
                  ))}
                </ul>
              ) : (
                <p className={classes.vazioSearch}>Nenhum pacote encontrado.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exibe o spinner quando 'loading' for true */}
      {loading && <Spinner />} {/* Mostra o Spinner se loading for true */}
    </div>
  );
}

export default Navbar;
