import React from 'react';

import styles from './Select.module.css';

interface SelectProps {
  options: { value: any; label: string; disabled?: boolean; hidden?: boolean }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: any;
  value?: any;
  label?: string;
  active?: boolean;
}

const Select = ({ options, onChange, value, label, active }: SelectProps) => {
  const optionEls = options.map((opt) => (
    <option value={opt.value} disabled={opt.disabled} hidden={opt.hidden} key={opt.label}>
      {opt.label}
    </option>
  ));

  return (
    <div>
      {/* {label && <label htmlFor={label}>{label}</label>} */}
      <select
        name={label}
        className={`${styles.select} ${label ? styles[label] : ''} ${active ? styles.active : ''}`}
        onChange={onChange}
        value={value}
      >
        {optionEls}
      </select>
    </div>
  );
};

export default Select;
