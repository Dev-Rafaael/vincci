

import React, { useState,useEffect,useContext,lazy } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import drink8 from '../assets/drink8.jpg';
import drink9 from '../assets/drink9.jpg';
import drink10 from '../assets/drink10.jpg';
import drink11 from '../assets/drink11.jpg';
import Breadcrumbs from '../components/Breadcrumbs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import imageMap from '../utils/imageMap'; // Ajuste o caminho conforme necessário
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination'; // Certifique-se de importar o CSS da paginação
import classes from './Orçamento.module.css';
const menuItems = [
  { id: 1, img: drink10, title: "Drinks sem álcool", description: "Bartenders para festas, São Paulo", info: "Bartender para festa Open Bar em São Paulo com 12 opções de Drinks com e sem álcool.", price: "A partir de R$550,00",    thumbnail: ["drink1", "drink2"]  },
  { id: 2, img: drink11, title: "Barman + lista de compras", description: "Bartenders para festas, São Paulo", info: "Economize, pague apenas pela mão de obra de Barman para festa e receba uma lista sugestiva de compras.", price: "A partir de R$1.689,99" },
  { id: 3, img: drink8, title: "Drinks com e sem álcool", description: "Bartenders para festas, São Paulo", info: "6 opções de Drinks Clássicos + Festival de Caipirinhas com 3 frutas e 3 opções de destilados.", price: "A partir de R$1.889,99" },
  { id: 4, img: drink9, title: "Pacote de Drinks Clássicos", description: "Bartenders para festas, São Paulo", info: "6 opções de Drinks Clássicos + Festival de Caipirinhas com 3 frutas e 3 opções de destilados.", price: "A partir de R$550,00" },
];


const formatTitleForURL = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

const Orçamento = ({ searchData }) => {
  const [horario, setHorario] = useState('');
  const [convidados, setConvidados] = useState('');
  const [bartenders, setBartenders] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarValor, setMostrarValor] = useState(false); 
  const { addToCart, isItemInCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { title } = useParams();
  const formattedTitle = formatTitleForURL(title);
  const item = location.state?.item || menuItems.find(item => formatTitleForURL(item.title) === formattedTitle);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Use o mapeamento correto aqui
  const [thumbnails,setThumbnails]=useState([]) // Usa todos os valores do mapeamento como miniaturas // Usa todos os valores do mapeamento como miniaturas
  const initialMainImage = location.state?.mainImage || imageMap[item.img]; // Manter a mainImage se disponível
  const [mainImage, setMainImage] = useState(initialMainImage);
  const [showModal, setShowModal] = useState(false);
  const [drinks,setDrinks]=useState([])
  const [imagens,setImagens]=useState([])
  const [pacoteIndex, setPacoteIndex] = useState(0);

  // ENVIAR PARA O BANCO DE DADOS 


  useEffect(() => {
    if (mainImage) {
      localStorage.setItem('selectedMainImage', mainImage);
    }
  }, [mainImage]);

  if (!item) {
    return <div>Item não encontrado</div>;
  }

  const breadcrumbs = [
    { label: 'PACOTES', url: '/Pacotes' },
    { label: item.title, url: `/Orçamento/${item.title}`, state: { item, mainImage } }, 
    { label: 'IDENTIFICAÇAO', url: '#' }
  ];


  const handleThumbnailClick = (src) => {
    setMainImage(src); 
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  
//  CALCULAR VALOR 
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

  setValorTotal(valor);
};

useEffect(() => {
  calcularValor();

  if (horario && convidados && bartenders) {
    setMostrarValor(true);
  } else {
    setMostrarValor(false);
  }
}, [horario, convidados, bartenders]);

// NAVEGAR PARA IDENTIFICACAO 
const handleContratarClick = async () => {
  if (!horario || !convidados || !bartenders || !valorTotal) {
    alert('Por favor, selecione todas as opções antes de continuar.');
    return;
  }

  const valorTotalFormatado = valorTotal.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formData = new FormData();
  formData.append("horario", horario);
  formData.append("convidados", convidados);
  formData.append("bartenders", bartenders);
  formData.append("valorTotal", valorTotal);

  try {
    const response = await fetch("http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/processa_orcamento.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
   

    if (response.ok) {
      if (isItemInCart(item.id)) {
        setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 5000);
      } else {
        const itemParaCarrinho = {
          item,
          horario,
          convidados,
          bartenders,
          valorTotalFormatado,
          mainImage,
        };
        addToCart(itemParaCarrinho);

        navigate('/Identificação/', { 
          state: { 
            item,
            horario,
            convidados,
            bartenders,
            valorTotalFormatado,
            mainImage,
          }  
        });
      }
    } else {
      console.error('Erro ao processar o orçamento:', result);
    }
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
  }
};
  // EFFEITO DE APARECER 
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duração da animação em milissegundos
      easing: 'ease-in-out', // Tipo de easing
    });
  }, []);

  const scrollToPosition = (targetPosition, duration) => {
    const start = window.pageYOffset; // Posição inicial
    const distance = targetPosition - start;
    let startTime = null;

    // Função de animação
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Função de ease (easeInOutQuad) para suavizar a animação
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

  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/getPacotes.php');
        const data = await response.json();
        console.log(data); // Adicionar log para verificar a estrutura dos dados
        const drinksParaPacote = data.filter(drink => drink.pacoteId === item.id);
        
        setDrinks(drinksParaPacote);
      } catch (error) {
        console.error('Erro ao buscar pacotes:', error);
      }
    };
  
    fetchPacotes();
  }, [item.id]);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/getPacotes.php');
      const data = await response.json();
      console.log(data); // Verifique a estrutura dos dados no console
  
      const pacoteSelecionado = data.find(pacote => pacote.id === item.id);
  
      if (pacoteSelecionado && pacoteSelecionado.carousel_images) {
        // Remover duplicatas
        const uniqueImages = [...new Set(pacoteSelecionado.carousel_images)];
        setImagens(uniqueImages);
      } else {
        console.log('Nenhum pacote encontrado ou pacote sem imagens');
      }
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error);
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, [item.id]);

  return (
    <>
     
      <section className={classes.Serviço}>
        <div className={classes.navOrcamento}>
          <h1>{item.title}</h1>
          <Breadcrumbs paths={breadcrumbs} />   
        </div>
   
        <div className={classes.servicos}>
        <aside className={classes.sidebar} >
          <div className={classes.textContainer}>
            <h2>{item.title}</h2>
          </div>
        </aside>
       
          <div className={classes.carousel}  data-aos="fade-up" data-aos-delay="200">
            <div className={classes.mainImage}>
            <img src={mainImage} alt="Imagem Principal" onClick={handleOpenModal} loading="lazy" />
              <button className={classes.enlargeButton} onClick={handleOpenModal}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="rgb(183, 143, 63)">
                  <path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/>
                </svg>
              </button>
            </div>
            <div className={classes.thumbnailWrapper}>
            <div className={classes.thumbnailImages} loading={lazy}>
            <Swiper
      spaceBetween={50}
      slidesPerView={3}
      effect="slide" // Efeito atual
      pagination={{ clickable: true }} // Garante que a paginação esteja ativa
      autoplay={{
        delay: 3000, // Tempo de espera entre os slides (em milissegundos)
        disableOnInteraction: false, // Permite que o autoplay continue após interação manual
      }}
      coverflowEffect={{
        rotate: 50, // Rotação das imagens
        stretch: 20, // Espaçamento das imagens
        depth: 100, // Profundidade do efeito
        modifier: 1, // Modificador do efeito
        slideShadows: true, // Ativa as sombras
      }}
      
    >
      {imagens.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={imageMap[image]} alt={`Imagem ${index}`}   className={classes.thumbnail}    onClick={() => handleThumbnailClick(imageMap[image])} />
        </SwiperSlide>
      ))}
    </Swiper>
          </div>
          </div>
          </div>
          {isModalOpen && (
            <div className={classes.modal} onClick={handleCloseModal}>
              <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={classes.close} onClick={handleCloseModal}>&times;</span>
                <img src={mainImage} alt="Imagem Ampliada" className={classes.modalImage} loading={lazy}/>
              </div>
            </div>
          )}
              
       <section className={classes.servicoContent}>
      <h3>{item.title}</h3>
      <h2>Pacote {item.title}</h2>
      <p>{item.info}</p>
      <div className={classes.form}>
        <form action="/processa_formulario.php" method="POST">
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

          {/* Mostrar valor apenas se todos os selects estiverem selecionados */}
          {mostrarValor && (
            <div className={classes.valor}>
              <p>
                Valor: R${' '}
                {valorTotal
                  ? valorTotal.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : '0,00'}
              </p>
            </div>
          )}
    
        </form>
        <button onClick={handleContratarClick}>CONTRATAR</button>
       
      </div> 
      {showModal && (
        <article className={classes.modalStyle} >
         <div className={classes.modal}>
              <h2>Item já adicionado</h2>
              <p>Este item já foi adicionado ao carrinho.</p>
            <div className={classes.btnModal}>
             <Link to={"/Pacotes"} className={classes.voltarPacotes}>Voltar</Link>
              <Link to={"/Carrinho"}><i className="bi bi-cart"></i></Link>
            </div>
        </div>
        </article>
      )}
    </section>
        </div>
    
        <section className={classes.section}>
          <div className={classes.sectionTitle} data-aos="fade-up">
            <h1>Drinks Inclusos<span>________</span></h1>
          </div> 
         
  <article className={classes.sectionDrinks} key={pacoteIndex}>
      <div>
      {item.drinks && item.drinks.length > 0 ? (
      <div className={classes.drinksContainer}>
     {item.drinks.map((drink, index) => (
        <div className={classes.drinks} key={index}>
          <img src={imageMap[drink.image]} alt={drink.name} /> 
          <h2>{drink.name}</h2> 
          <p>{drink.description}</p> 
        </div>
      ))}
    </div>
    ) : (
    <p>Não há drinks disponíveis para este pacote.</p>
    )}
     </div>
   </article>
         </section>
         </section>
     
     </>
  );
};

export default Orçamento;





