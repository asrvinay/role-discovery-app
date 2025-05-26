
import { useState } from 'react';
import { InputType } from '@/types/profile';

export const useProfileInput = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [inputType, setInputType] = useState<InputType>(null);

  return {
    currentInput,
    setCurrentInput,
    inputType,
    setInputType,
  };
};
