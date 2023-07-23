import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { validateUserInfo } from '@/utils';

import InputAnimation from '../public/inputAnimation';
import Modal from '../public/Modal';

import { postSignUp, postCheckEmail } from '@/apis/authApi';
import { useAuthForm } from '@/hooks/useAuthForm';

const Signup = ({ handleShowSignup }: { handleShowSignup: () => void }) => {
  const { emailRef, passwordRef, rePasswordRef, userAccount, validateState, handleAccountChange } =
    useAuthForm();
  const [confirmPassword, setconfirmPassword] = useState('');

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleShowSignup();
    }
  };
  window.addEventListener('keyup', (e: KeyboardEvent) => handleKeyPress(e));

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postSignUp(userAccount);
      if (response) {
        alert('가입 완료!');
        handleShowSignup();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCheckEmail = async () => {
    if (!validateState.email) return;
    try {
      const response = await postCheckEmail({ email: userAccount.email });
      if (response) {
        alert('사용할 수 있는 이메일입니다.');
        passwordRef.current?.focus();
      }
    } catch (error) {
      alert('이미 존재하는 이메일입니다.');
      emailRef.current?.focus();
    }
  };
  const handleChangedConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setconfirmPassword(e.currentTarget.value);
  };
  return (
    <Modal handleHideModal={() => {}}>
      <CloseButton onClick={handleShowSignup}>x</CloseButton>
      <SignupForm onSubmit={handleSignup}>
        <Title>SIGNUP</Title>
        <InputContainer>
          <InputSet>
            <EmailBox>
              <InputAnimation
                inputName='email'
                Ref={emailRef}
                handleChange={handleAccountChange}
                inputValue={userAccount.email}
                isValid={validateState.email}
              />
              <EmailButton
                isvalid={validateState.email ? 'true' : 'false'}
                onClick={handleCheckEmail}
              >
                중복확인
              </EmailButton>
            </EmailBox>
            {userAccount.email && !validateUserInfo.checkEmail(userAccount.email) && (
              <Alert>주소형식을 확인해주세요</Alert>
            )}
          </InputSet>
          <InputSet>
            <InputAnimation
              width='100%'
              type='password'
              inputName='password'
              Ref={passwordRef}
              handleChange={handleAccountChange}
              inputValue={userAccount.password}
              isValid={validateState.password}
            />
            {userAccount.password && !validateUserInfo.checkPassword(userAccount.password) && (
              <Alert>조건 : 8자 이상 , 영숫자 only</Alert>
            )}
          </InputSet>
          <InputSet>
            <InputAnimation
              width='100%'
              type='password'
              inputName='confirm password'
              handleChange={handleChangedConfirmPassword}
              Ref={rePasswordRef}
              inputValue={confirmPassword}
              isValid={
                confirmPassword !== '' &&
                validateUserInfo.checkPasswordDiff(userAccount.password, confirmPassword)
              }
            />

            {confirmPassword &&
              !validateUserInfo.checkPasswordDiff(userAccount.password, confirmPassword) && (
                <Alert>비밀번호가 일치하지 않습니다</Alert>
              )}
          </InputSet>
        </InputContainer>
        <ButtonContainer>
          <StyledButton
            type='submit'
            isvalid={
              !validateState.email ||
              !validateState.password ||
              !validateUserInfo.checkPasswordDiff(userAccount.password, confirmPassword)
                ? 'true'
                : 'false'
            }
            disabled={!validateState.email || !validateState.password}
          >
            가입하기
          </StyledButton>
        </ButtonContainer>
      </SignupForm>
    </Modal>
  );
};
const CloseButton = styled.button`
  position: absolute;
  font-size: 2rem;
  padding-left: 10px;
`;
const Title = styled.h2`
  letter-spacing: 01rem;
  text-align: center;
  margin: 5rem 0 1rem 0;
  font-size: 1.2rem;
`;
const SignupForm = styled.form`
  text-transform: uppercase;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const InputSet = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const EmailBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
`;
const EmailButton = styled.div<{ isvalid: string }>`
  ${({ isvalid }) => {
    return css`
      cursor: ${isvalid === 'true' ? 'pointer' : 'auto'};
      letter-spacing: 0.2rem;
      margin-bottom: 0.5rem;
      text-align: end;

      width: 10rem;
      transition: all 0.5s ease;
      color: ${isvalid === 'true' ? '#fff' : '#6a6d94'};
      &:hover {
        text-shadow: ${isvalid === 'true'
          ? '0 0 5px #bebebe,0 0 10px #bebebe,0 0 15px #bebebe,0 0 20px #bebebe,0 0 35px #bebebe'
          : ''};
      }
    `;
  }}
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 40%;
  width: 100%;
  margin: 3rem 0 3rem 0;
`;
const Alert = styled.label`
  margin: 5px;
  font-size: small;
`;

const ButtonContainer = styled.div`
  margin: 3rem 0 0 0;

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button<{ isvalid: string }>`
  ${({ isvalid }) => {
    return css`
      /* position: relative; */
      background: ${isvalid === 'true'
        ? 'rgba(209, 209, 209, 0.2)'
        : 'linear-gradient(to right, #d6d6d6 0%, #68769e 79%)'};
      letter-spacing: 0.7rem;
      width: 65%;
      height: 3rem;

      /* border: none; */
      color: ${isvalid === 'true' ? '#969696' : 'black'};
      border-radius: 2rem;
      transition: all 0.5s ease;
      cursor: ${isvalid === 'true' ? 'default' : 'pointer'};

      &:hover {
        transform: ${isvalid === 'true' ? 'none' : 'scale(1.03)'};
      }

      &:focus {
        border-width: 10rem;
        border-color: #4fff00;
      }

      &:active {
        position: ${isvalid === 'true' ? 'static' : 'relative'};
        top: 1px;
        right: 1px;
      }
    `;
  }}
`;
export default Signup;
