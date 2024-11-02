
import React, { useState,useEffect, lazy } from 'react';

import classes from './Sobre.module.css'

import drink from '../assets/drink11.jpg'
import drink1 from '../assets/drink10.jpg'
import drink2 from '../assets/drink3.jpeg'
import drink3 from '../assets/drink9.jpg'
import 'aos/dist/aos.css';
import AOS from 'aos';


function Sobre() {
  
  useEffect(() => {
  AOS.init({
    duration: 1000, 
    easing: 'ease-in-out', 
  });
}, []);
  return (
    <> 
   <section className={classes.navSobre}>
  <h1>SOBRE NÓS</h1>
  <p>A cada passo que damos em direção à mudança, descobrimos 
    novas oportunidades para crescer e evoluir.</p>
</section>

<section className={classes.sobre}>
  <article className={classes.contentSobre}>
    <div className={classes.SobreInfo} data-aos="fade-up" data-aos-delay="200">
    <aside className={classes.sidebar}>
          <div className={classes.textContainer}>
            <h2>SOBRE NÓS</h2>
          </div>
        </aside>
    <h3>TOP 10 MELHORES PUBS DO <span>BRASIL</span></h3>
      <p>
       <span> A Rede Vincci Pub</span>, fundada em 2023, oferece uma experiência incomparável em hospitalidade, 
        combinando ambientes sofisticados com serviços de bartender de alta qualidade. 
        Reconhecida pelos seus drinks artesanais, a Vincci oferece espaços modernos e
        bartenders altamente qualificados para garantir que cada visita seja inesquecível.
        Com horários flexíveis e menus adaptados às suas preferências, aproveite momentos 
        de lazer com o melhor que a vida tem a oferecer.
      </p>
      <p>
       <span> Aqui na Vincci Pub</span>, acreditamos que cada drink conta uma história. Nossa missão é 
        proporcionar momentos especiais para nossos clientes, seja em uma noite casual ou 
        em eventos exclusivos. Cada visita aos nossos pubs é uma oportunidade de desfrutar 
        de coquetéis inovadores e clássicos, preparados com perfeição.
      </p>
      <p>
        Ao longo dos últimos anos, temos nos dedicado a criar experiências únicas para 
        nossos clientes, sempre focados na excelência e na satisfação. Acreditamos que 
        a inovação contínua no universo da coquetelaria é essencial para oferecer momentos 
        inesquecíveis. <span> A Vincci Pub</span> celebra a arte de servir, proporcionando um ambiente 
        acolhedor e sofisticado para todos.
       </p>
    </div>

    <article className={classes.imgSobre}>
      <img loading={lazy} src={drink1} data-aos="fade-up" data-aos-delay="300"/> 
      <img  loading={lazy} src={drink1} data-aos="fade-up" data-aos-delay="300"/> 
    </article>
  </article>
</section>



    </>
   
  )
}

export default Sobre