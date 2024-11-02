import React, { useEffect, useState,lazy  } from 'react';
import classes from './Pacotes.module.css';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import imageMap from '../utils/imageMap'; // Ajuste o caminho conforme necessário

function Pacotes() {
  const [menuItems, setMenuItems] = useState([]);

  
  // Função para buscar pacotes do backend
  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/getPacotes.php'); // URL do seu arquivo PHP
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Erro ao buscar pacotes:', error);
      }
    };

    fetchPacotes();
  }, []);

  const formatTitleForURL = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  console.log(menuItems);
  const breadcrumbs = [
    { label: 'HOME', url: `/` }, 
    { label:'PACOTES', url: '/Pacotes' },
    { label: 'ORÇAMENTO', url: '#' }
  ];
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
  return (
    <>
      <div className={classes.navPacotes}>
        <h1>PACOTES</h1>
        <Breadcrumbs paths={breadcrumbs} />
      </div>
      <section className={classes.section}>
  <h1>ENCONTRE AQUI O <span>PACOTE</span> IDEAL PARA A SUA <span>FESTA</span></h1>
  
  <div className={classes.sectionContainer}>
    <aside className={classes.sidebar} >
          <div className={classes.textContainer}>
            <h2>PACOTES</h2>
          </div>
        </aside>
   
    {menuItems.map(item => (
  <div className={classes.orcamentoType} key={item.id} data-aos="fade-up" data-aos-delay="200">
    <img src={imageMap[item.img]} alt={item.title} loading="lazy" />
    <h2>{item.title}</h2>
    <p>{item.description}</p>
    <div className={classes.orcamentoPreco}>
      <p>{item.price}</p>
    </div>
    <Link 
      to={`/Orçamento/${formatTitleForURL(item.title)}`} 
      state={{ item }} 
    >
      SAIBA MAIS
    </Link>
  </div>
))}

        </div>
      </section>
    </>
  );
}

export default Pacotes;


