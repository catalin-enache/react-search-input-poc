import { ChangeEvent } from 'react';

interface InputSearchProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputSearch = ({ value, onChange }: InputSearchProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search..."
    />
  );
};

export default InputSearch;
