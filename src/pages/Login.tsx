import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { PATH_ROUTE, USER_NICKNAME_KEY, USER_TOKEN_KEY } from '@/constants';

import { postLogin, setInitName } from '@/apis/authApi';
import { socket } from '@/apis/socketApi';
import InputAnimation from '@/components/public/inputAnimation';
import Signup from '@/components/Signup';
import { useAuthForm } from '@/hooks/useAuthForm';

const Login = () => {
  const [isShownSignup, setShownSignup] = useState(false);

  const {
    emailRef,
    passwordRef,
    userAccount,
    validateState,
    setValidateState,
    handleAccountChange,
  } = useAuthForm();

  const navigate = useNavigate();

  const checkNickname = async (accessToken: string) => {
    let nickname: string | null = prompt('닉네임을 설정해 주세요.');
    if (nickname?.trim()) {
      nickname = nickname.replace(/(\s*)/g, '');
      await setInitName(nickname, accessToken);
      return nickname;
    } else return null;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postLogin(userAccount);
      const { access_token: accessToken, nickname: name } = response.data;
      if (accessToken) {
        let nickname = name;
        if (!nickname) nickname = await checkNickname(accessToken);
        if (nickname) {
          localStorage.setItem(USER_TOKEN_KEY, accessToken);
          localStorage.setItem(USER_NICKNAME_KEY, name);
          socket.io.opts.extraHeaders = {
            Authorization: 'Bearer ' + accessToken,
          };
          socket.connect();
          navigate(PATH_ROUTE.lobby, { state: { nickname } });
        } else {
          alert('닉네임이 있어야 입장이 가능합니다.');
        }
      }
    } catch (error: any) {
      if (error.response.data)
        setValidateState({ ...validateState, errorMessage: error.response.data.message });
      console.error(error.response.data);
    }
  };

  const handleShowSignup = () => {
    setShownSignup(!isShownSignup);
  };

  useEffect(() => {
    socket.disconnect();
  }, []);

  return (
    <MainFrame>
      {isShownSignup && <Signup handleShowSignup={handleShowSignup} />}
      <LoginContainer onSubmit={handleLogin}>
        <WelcomeText>CODE LEARN</WelcomeText>
        <InputContainer>
          <InputAnimation
            width='60%'
            Ref={emailRef}
            inputName='email'
            handleChange={handleAccountChange}
            inputValue={userAccount.email}
            isValid={validateState.email}
          />
          <InputAnimation
            type='password'
            width='60%'
            Ref={passwordRef}
            inputName='password'
            handleChange={handleAccountChange}
            inputValue={userAccount.password}
            isValid={validateState.password}
          />
        </InputContainer>
        {validateState.errorMessage && <ErrorMsg>{validateState.errorMessage}</ErrorMsg>}
        <ButtonContainer>
          <StyledButton
            type='submit'
            isvalid={!validateState.email || !validateState.password ? 'true' : 'false'}
            disabled={!validateState.email || !validateState.password}
          >
            LOGIN
          </StyledButton>
        </ButtonContainer>
        <LoginWith onClick={handleShowSignup}>SIGNUP</LoginWith>
      </LoginContainer>
    </MainFrame>
  );
};

const ErrorMsg = styled.div`
  color: white;
  font-size: 0.5rem;
  margin-top: 1rem;
`;

const MainFrame = styled.div`
  font-family: 'Raleway', sans-serif;
  background-image: url('/background.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const LoginContainer = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 500px;
  height: 50vh;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.4rem;
`;

const WelcomeText = styled.h2`
  margin: 0rem 0 2rem 0;
  font-size: 1.2rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  margin: 1rem 0 1rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginWith = styled.h5`
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledButton = styled.button<{ isvalid: string }>`
  ${({ isvalid }) => {
    return css`
      background: ${isvalid === 'true'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'linear-gradient(to right, #14163c 0%, #03217b 79%)'};
      text-transform: uppercase;
      letter-spacing: 0.2rem;
      width: 65%;
      height: 3rem;
      border: none;
      color: ${isvalid === 'true' ? '#333333' : 'white'};
      border-radius: 2rem;
      transition: all 0.5s ease;
      cursor: ${isvalid === 'true' ? 'default' : 'pointer'};

      &:hover {
        color: ${isvalid === 'true' ? '#333333' : 'white'};
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

export default Login;
