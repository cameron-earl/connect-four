import React, { PropsWithChildren } from 'react';

import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
}

const Button = ({ children, onClick }: PropsWithChildren<ButtonProps>) => {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
