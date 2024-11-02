import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importa a biblioteca js-cookie
import classes from './CookieConsent.module.css';

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Você pode definir algumas preferências padrão
    analytics: false,
    marketing: false,
  });
  useEffect(() => {
    const consentGiven = Cookies.get('cookieConsent'); // Verifica se o cookie existe
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365 });
    handleSaveSettings(); // Salve as configurações ao aceitar
    setShowBanner(false);
  };

  const handleCookieSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    // Salvar as preferências no cookie
    Cookies.set('cookiePreferences', JSON.stringify(preferences), { expires: 365 });
    alert("Preferências de cookies salvas.");
    handleCloseSettings();
  };
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  if (!showBanner) return null;

  return (
    <div className={classes.banner}>
      <p className={classes.text}>
        Usamos cookies para melhorar sua experiência de navegação, analisar o tráfego e personalizar o conteúdo. Leia nossa 
        <Link to="/Politica-Privacidade/" className={classes.link}> Política de Privacidade </Link> para saber mais.
      </p>
      <div className={classes.buttonContainer}>
        <button onClick={handleAcceptCookies} className={classes.acceptButton}>
          Aceitar Todos
        </button>
        <button onClick={handleCookieSettings} className={classes.settingsButton}>
          Configurações de Cookies
        </button>
      </div>
      {showSettings && (
        <div className={classes.settingsModal}>
          <h3>Configurações de Cookies</h3>
          <div className={classes.inputCheck}>
          <label>
            <input
              type="checkbox"
              name="essential"
              checked={preferences.essential}
              disabled
            />
            Cookies Essenciais (necessários para o funcionamento do site)
          </label>
          <label>
            <input
              type="checkbox"
              name="analytics"
              checked={preferences.analytics}
              onChange={handlePreferenceChange}
            />
            Cookies de Análise
          </label>
          <label>
            <input
              type="checkbox"
              name="marketing"
              checked={preferences.marketing}
              onChange={handlePreferenceChange}
            />
            Cookies de Marketing
          </label>
          </div>
          <div className={classes.buttonContainer}>
            <button onClick={handleSaveSettings} className={classes.saveButton}>
              Salvar Preferências
            </button>
            <button onClick={handleCloseSettings} className={classes.closeButton}>
              Fechar
            </button>
          </div>
        </div>
      )}
 
    </div>
  );
}

export default CookieConsent;
