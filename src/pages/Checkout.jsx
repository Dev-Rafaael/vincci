import React, { useEffect, useState,lazy } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import classes from './Checkout.module.css';
const Checkout = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    // Inicializar MercadoPago com a chave de teste e configuração de idioma
    initMercadoPago('TEST-78e590e6-4748-41df-8b03-3999fcf918dc', { locale: 'pt-BR' });

    const fetchPreferenceId = async () => {
      try {
        const response = await fetch('http://localhost/ECOMMERCE-PUB/my-ecommerce-backend/api/checkout.php');
        const data = await response.json(); // Certifique-se de que o retorno seja JSON

        if (data.error) {
          console.error('Erro do servidor:', data.message);
        } else {
          setPreferenceId(data.preferenceId);
        }
      } catch (error) {
        console.error('Erro ao buscar preferenceId:', error);
      }
    };

    fetchPreferenceId();
  }, []);

  return (
    <>
     <main>
      <section className={classes.carrinho}>
        <header className={classes.navCarrinho}>
          <h1>CARRINHO</h1>
        </header>
        <section className={classes.itemSection}>
          <div className={classes.carrinhoTitle} >
            <h1>Meu Carrinho <span>________</span></h1>
          </div>
          </section>
    <div className={classes.pagamentoContent}>
      {preferenceId ? (
        <Wallet initialization={{ preferenceId }} />
      ) : (
        <p>Carregando...</p>
      )}
    </div>
      </section>
    </main>
    </>
  );
};

export default Checkout;
