import React, { PropsWithChildren } from 'react';

import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ children, onClick, disabled }: PropsWithChildren<ButtonProps>) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
