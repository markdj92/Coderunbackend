import React from 'react';

import { validateUserInfo } from '@/utils';

import Modal from '../public/Modal';

import { postSignUp } from '@/apis/authApi';
import { useAuthForm } from '@/hooks/useAuthForm';

const Signup = ({ handleShowSignup }: { handleShowSignup: () => void }) => {
  const { emailRef, passwordRef, rePasswordRef, userAccount, handleAccountChange, isValidAccount } =
    useAuthForm();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (userAccount.password !== userAccount.rePassword) {
        alert('비밀번호가 일치하지 않습니다');
        return;
      }
      delete userAccount.rePassword;
      const response = await postSignUp(userAccount);
      if (response) {
        alert('가입 완료!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal handleHideModal={handleShowSignup}>
      <button style={{ float: 'right' }} onClick={handleShowSignup}>
        x
      </button>
      <form onSubmit={handleSignup}>
        <h1>회원가입</h1>
        <div>
          <label>e-mail</label>
          <input name='email' type='email' ref={emailRef} onChange={handleAccountChange} />
          <button>중복확인</button>
          {userAccount.email && !validateUserInfo.checkEmail(userAccount.email) && (
            <p>주소형식을 확인해주세요</p>
          )}
        </div>
        <div>
          <label>password</label>
          <input name='password' type='password' ref={passwordRef} onChange={handleAccountChange} />
          {userAccount.password && !validateUserInfo.checkPassword(userAccount.password) && (
            <p>조건 : 8자 이상 , 영숫자 only</p>
          )}
        </div>
        <div>
          <label>check password</label>
          <input
            name='rePassword'
            type='password'
            ref={rePasswordRef}
            onChange={handleAccountChange}
          />
          {userAccount.rePassword &&
            !validateUserInfo.checkPasswordDiff(userAccount.password, userAccount.rePassword) && (
              <p>비밀번호가 일치하지 않습니다</p>
            )}
        </div>
        <button
          type='submit'
          disabled={
            !isValidAccount() ||
            !validateUserInfo.checkPasswordDiff(userAccount.password, userAccount.rePassword)
          }
        >
          가입하기
        </button>
      </form>
    </Modal>
  );
};

export default Signup;
