import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PATH_ROUTE, USER_NICKNAME_KEY, USER_TOKEN_KEY } from '@/constants';

import { postLogin, setInitName } from '@/apis/authApi';
import { socket } from '@/apis/socketApi';
import CustomButton from '@/components/public/CustomButton';
import CustomInput from '@/components/public/CustomInput';
import Signup from '@/components/Signup';
import { useAuthForm } from '@/hooks/useAuthForm';

const Login = () => {
  const [isShownSignup, setShownSignup] = useState(false);

  const {
    emailRef,
    passwordRef,
    userAccount,
    validateState,
    handleAccountChange,
    errorMessage,
    setErrorMessage,
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
      if (error.response.data) {
        if (error.response.data.message.includes('이메일')) {
          setErrorMessage({ ...errorMessage, email: error.response.data.message });
          emailRef.current?.focus();
        } else {
          setErrorMessage({ ...errorMessage, password: error.response.data.message });
          passwordRef.current?.focus();
        }
      }
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
      <LoginContainer>
        <TitleFrame>
          <WelcomeText>Code Run? Code Learn!</WelcomeText>
          <MainText>SIGN IN</MainText>
        </TitleFrame>
        <FormFrame onSubmit={handleLogin}>
          <InputContainer>
            <CustomInput
              setRef={emailRef}
              title={'ID'}
              inputName={'email'}
              handleChange={handleAccountChange}
              inputValue={userAccount.email}
              errorMessage={errorMessage.email}
            />
            <CustomInput
              type='password'
              title={'PW'}
              inputName={'password'}
              setRef={passwordRef}
              handleChange={handleAccountChange}
              inputValue={userAccount.password}
              errorMessage={errorMessage.password}
            />
          </InputContainer>
          <CustomButton
            title={'Log in'}
            isDisabled={!validateState.email || !validateState.password}
          />
        </FormFrame>
        <SignInFrame>
          <SignInTitle>코드런이 처음이신가요?</SignInTitle>
          <CustomButton title={'Sign up'} onClick={handleShowSignup} />
        </SignInFrame>
      </LoginContainer>
    </MainFrame>
  );
};

const MainFrame = styled.div`
  background: url('./background.png');
  mix-blend-mode: screen;
  background-size: cover;
  font-family: 'Raleway', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const FormFrame = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 44px;
`;

const SignInFrame = styled.div`
  width: 732px;
  height: 144px;
  border-top: 2px solid #3c325f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const SignInTitle = styled.div`
  color: #8883ff;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.4px;
  margin-bottom: 16px;
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: transparent;
  gap: 64px;
`;

const WelcomeText = styled.h2`
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.01em;
  text-align: center;
`;

const MainText = styled.h1`
  font-family: 'IBM Plex Sans KR', sans-serif;
  color: #e2e0ff;
  font-size: 88px;
  font-style: normal;
  font-weight: 700;
  line-height: 80px;
`;

const TitleFrame = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  gap: 28px;
`;

export default Login;
