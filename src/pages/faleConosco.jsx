import { useState } from 'react';
import { Link } from 'react-router-dom'

import classes from './faleConosco.module.css'

function faleConosco() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado para controlar a visibilidade do modal
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar o envio
  const handleSubmit = async (e) => {
   e.preventDefault()

    const dados = {
      nome,
      email,
      telefone,
      mensagem };

    // Envia os dados para o backend (PHP)
    try {
      setIsSubmitting(true); // Marca como enviando para evitar cliques múltiplos
      const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/contato.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (response.ok) {
        const result = await response.json();
     

        // Exibir o modal de sucesso
        setShowModal(true);

        // Esconder o modal após 3 segundos
        setTimeout(() => {
          setShowModal(false);
        }, 3000);

        // Limpar os campos do formulário
        setNome('');
        setEmail('');
        setTelefone('');
        setMensagem('');
      } else {
        throw new Error('Erro ao enviar os dados');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    } finally {
      setIsSubmitting(false); // Libera o envio novamente após o término
    }
  };
  
  return (
    <div className={classes.faleConosco}>
      <div className={classes.imgFale}>
       <h1>FALE CONOSCO</h1>
       <p>
        Ficamos felizes em aprender e ouvir de você. Entre em contato conosco para nos informar como podemos ajudá-lo.</p>
        </div>
        <div className={classes.mb-5} data-aos="fade-up" data-aos-delay="200" id="iframeMapa">
        <iframe 
          style={{ border: 0, width: '100%', height: '400px' }} 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.585487275542!2d-46.81652719999999!3d-23.8312325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce4be862dec7bd%3A0xa09e91eff2d3f456!2sVincci%20Pub!5e0!3m2!1sen!2sbr!4v1694099052354!5m2!1sen!2sbr" 
          frameBorder="0" 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
        <section className={classes.formFaleConosco}>
          <div className={classes.formContainer}>
          <aside className={classes.sidebar}>
          <div className={classes.textContainer}>
            <h2>SAC</h2>
          </div>
        </aside>
            <div className={classes.formText}>
          <h2>Fale Conosco</h2>
          <p>Envie-nos uma Mensagem.</p>         
          </div>
          <form  className={classes.form} onSubmit={handleSubmit} > 
            <div className={classes.block}>
              <label htmlFor="nome" >
              <input
          type="text"
          placeholder="NOME"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required     />
              </label>
              <label htmlFor="email" >
              <input
          type="email"
          placeholder="SEU EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
              </label>
            </div>
            <div className={classes.inline}>
            <label htmlFor="telefone" >
               <input
          type="text"
          placeholder="TELEFONE"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        required/>
            </label>

            <label htmlFor="textarea" >
            <input
          type="textarea"
          placeholder="MENSAGEM"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          required />
            </label>
            <input type="submit" value="ENVIAR MENSAGEM" disabled={isSubmitting}  />
          </div>
          
          </form>
          {/* Modal de sucesso */}
      {showModal && (
        <div className={classes.modalStyle}>
          <p>Mensagem enviada com sucesso. Entraremos em contato em Breve!</p>
        </div>
      )}
    </div>
           <div className={classes.contatos}>
           <div className={classes.container}  data-aos-delay="100">
        <div className={classes.rowGy4}>
          <div className={classes.colLg4}>
            <div className={`${classes.infoItem} `}  data-aos-delay="300">
            <i class="bi bi-geo-alt-fill"></i>
              <div>
                <h3>Localização</h3>
                <p>R. Sete de Setembro, 163 - Centro, Embu-Guaçu - SP, 06900-135</p>
              </div>
            </div>
            {/* End Info Item */}

            <div className={`${classes.infoItem} `}  data-aos-delay="400">
            <i class="bi bi-alarm"></i>
              <div>
                <h3>Open Hours</h3>
                <p>Monday-Saturday:<br />11:00 AM - 2300 PM</p>
              </div>
            </div>
            {/* End Info Item */}

            <div className={`${classes.infoItem} `}  data-aos-delay="400">
             <i class="bi bi-telephone-fill"></i>
              <div>
                <h3>Contato</h3>
                <p>(11) 97216-0912</p>
              </div>
            </div>
            {/* End Info Item */}

            <div className={`${classes.infoItem} ${classes.dFlex}`}  data-aos-delay="500">
            <i class="bi bi-envelope"></i>
              <div>
                <h3>Email Us</h3>
                <p>vincciPub@gmail.com</p>
              </div>
            </div>
            {/* End Info Item */}
          </div>

         </div>
         </div>
         
          </div> 
    </section>
    </div>
    
  )
}

export default faleConosco