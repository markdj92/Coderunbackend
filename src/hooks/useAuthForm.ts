import React, { useRef } from 'react';

import { validateUserInfo } from '@/utils';

import { useInput } from '@/hooks/useInput';

export const useAuthForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rePasswordRef = useRef<HTMLInputElement>(null);
  const { value: userAccount, setValue: setUserAccount } = useInput({ email: '', password: '' });

  const isValidAccount = () => {
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const isValid = validateUserInfo.checkAccount(email, password);
    return isValid;
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserAccount({ ...userAccount, [name]: value });
  };

  return {
    emailRef,
    passwordRef,
    rePasswordRef,
    userAccount,
    handleAccountChange,
    isValidAccount,
  };
};
