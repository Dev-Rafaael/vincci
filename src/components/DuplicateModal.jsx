import React from 'react';
import classes from './DuplicateModal.module.css'
const DuplicateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Item já adicionado</h2>
        <p>Este item já foi adicionado ao carrinho.</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default DuplicateModal;