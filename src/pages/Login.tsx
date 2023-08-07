import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PATH_ROUTE, USER_TOKEN_KEY } from '@/constants';
import { validateUserInfo } from '@/utils';

import { postLogin, setInitName } from '@/apis/authApi';
import { socket } from '@/apis/socketApi';
import CustomButton from '@/components/public/CustomButton';
import CustomInput from '@/components/public/CustomInput';
import SetNickname from '@/components/SetNickname';
import Signup from '@/components/Signup';
import { useAuthForm } from '@/hooks/useAuthForm';

const Login = () => {
  const [isShownSignup, setShownSignup] = useState(false);
  const [isShownSetNickname, setShownSetNickname] = useState(false);

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postLogin(userAccount);
      const { access_token: accessToken, nickname: name } = response.data;
      if (accessToken) {
        localStorage.setItem(USER_TOKEN_KEY, accessToken);
        socket.io.opts.extraHeaders = {
          Authorization: 'Bearer ' + accessToken,
        };
        let nickname = name;

        if (!!nickname) {
          socket.connect();
          navigate(PATH_ROUTE.lobby, { state: { nickname } });
        } else {
          setShownSetNickname(true);
        }
      }
    } catch (error: any) {
      if (error.response?.data) {
        if (error.response.data.message.includes('이메일')) {
          setErrorMessage({ ...errorMessage, email: error.response.data.message });
          emailRef.current?.focus();
        } else {
          setErrorMessage({ ...errorMessage, password: error.response.data.message });
          passwordRef.current?.focus();
        }
      }
      setErrorMessage({
        ...errorMessage,
        password: '서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  const [errorNickname, setErrorNickname] = useState<string>('');

  const handleSetNickname = async (e: React.FormEvent<HTMLFormElement>, name: string) => {
    e.preventDefault();
    const nickname = name.trim();
    if (nickname.includes(' ')) {
      setErrorNickname('닉네임에 공백이 포함되어있습니다.');
      return;
    } else if (!validateUserInfo.checkNickname(nickname)) {
      setErrorNickname('닉네임은 2~10자의 한글, 영문, 숫자로 이루어져야 합니다.');
      return;
    }

    try {
      await setInitName(nickname);
      socket.connect();
      navigate(PATH_ROUTE.lobby, { state: { nickname } });
    } catch (error: any) {
      console.error(error.response.data);
      if (error.response.data.message) setErrorNickname(error.response.data.message);
      else setErrorNickname('닉네임 설정에 실패했습니다. 다시 시도해주세요!');
    }
  };

  const handleShowSignup = () => {
    setShownSignup(!isShownSignup);
  };

  const handleShowSetNickname = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
    setShownSetNickname(!isShownSetNickname);
  };

  useEffect(() => {
    socket.disconnect();
  }, []);

  return (
    <MainFrame>
      {isShownSignup && <Signup handleShowSignup={handleShowSignup} />}
      {isShownSetNickname && (
        <SetNickname
          handleSetNickname={handleSetNickname}
          handleShowSetNickname={handleShowSetNickname}
          errorNickname={errorNickname}
          setErrorNickname={setErrorNickname}
        />
      )}
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
  border-top: 2px solid ${(props) => props.theme.color.DarkGray};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const SignInTitle = styled.div`
  color: ${(props) => props.theme.color.DarkGray};
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
  color: ${(props) => props.theme.color.DarkGray};
`;

const MainText = styled.h1`
  font-family: ${(props) => props.theme.font.Title};
  color: ${(props) => props.theme.color.LightGray};
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
