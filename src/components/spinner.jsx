// Spinner.js
import React from 'react';
import classes from'./spinner.module.css'; // Vamos criar um arquivo CSS para estilizar o spinner

const Spinner = () => {
  return (
    <div className={classes.spinnerContainer}>
      <div className={classes.spinner}></div>
    </div>
  );
};

export default Spinner;
