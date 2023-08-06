import React, { useEffect } from 'react';
import styled from 'styled-components';

import { validateUserInfo } from '@/utils';

import CustomButtonSmall from '../public/CustomButtonSmall';
import CustomInputSmall from '../public/CustomInputSmall';
import Modal from '../public/Modal';

import { postCheckEmail, postSignUp } from '@/apis/authApi';
import { useAuthForm } from '@/hooks/useAuthForm';

const Signup = ({ handleShowSignup }: { handleShowSignup: () => void }) => {
  const {
    emailRef,
    passwordRef,
    rePasswordRef,
    userAccount,
    validateState,
    handleAccountChange,
    isDuplicate,
    setIsDuplicate,
    errorMessage,
    setErrorMessage,
  } = useAuthForm();

  const handleCheckRePassword = () => {
    if (!validateUserInfo.checkPasswordDiff(userAccount.password, userAccount.rePassword)) {
      setErrorMessage({ ...errorMessage, rePassword: '비밀번호가 일치하지 않습니다.' });
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!handleCheckRePassword()) return;
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
    if (!userAccount.email) return;
    if (!validateState.email) {
      return setErrorMessage({ ...errorMessage, email: '이메일 형식이 올바르지 않습니다.' });
    }
    try {
      const response = await postCheckEmail({ email: userAccount.email });
      if (response) {
        setIsDuplicate(true);
        passwordRef.current?.focus();
      }
    } catch (error: any) {
      if (error.response?.data.message)
        setErrorMessage({ ...errorMessage, email: error.response.data.message });
      else if (error.response?.status === 401)
        setErrorMessage({ ...errorMessage, email: '이미 존재하는 이메일입니다.' });
      else
        setErrorMessage({
          ...errorMessage,
          email: '서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
        });
    }
  };

  const handleCheckPassword = () => {
    if (userAccount.password && !validateState.password) {
      setErrorMessage({
        ...errorMessage,
        password: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
      });
    }
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <Modal handleHideModal={handleShowSignup}>
      <SignupForm onSubmit={handleSignup}>
        <SignupText>
          <WelcomeText>Welcome to Code Learn</WelcomeText>
          <SignUpTitle>SIGN UP</SignUpTitle>
        </SignupText>
        <InputContainer>
          <InputSet>
            <EmailBox>
              <CustomInputSmall
                setRef={emailRef}
                title='ID'
                inputName='email'
                isDuplicate={isDuplicate}
                handleChange={handleAccountChange}
                handleBlur={handleCheckEmail}
                inputValue={userAccount.email}
                errorMessage={errorMessage.email}
              />
            </EmailBox>
          </InputSet>
          <InputSet>
            <CustomInputSmall
              type='password'
              title='PASSWORD'
              inputName='password'
              setRef={passwordRef}
              handleChange={handleAccountChange}
              handleBlur={handleCheckPassword}
              inputValue={userAccount.password}
              errorMessage={errorMessage.password}
            />
          </InputSet>
          <InputSet>
            <CustomInputSmall
              type='password'
              title='PW Confirm'
              inputName='rePassword'
              setRef={rePasswordRef}
              handleChange={handleAccountChange}
              inputValue={userAccount.rePassword}
              errorMessage={errorMessage.rePassword}
            />
          </InputSet>
          <CustomButtonSmall
            title={'Join'}
            isDisabled={!validateState.password || !validateState.email || !userAccount.rePassword}
          />
        </InputContainer>
      </SignupForm>
    </Modal>
  );
};

const SignupText = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const WelcomeText = styled.div`
  text-align: center;
  font-family: ${(props) => props.theme.font.Content};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
  letter-spacing: -2%;
  margin-bottom: 10px;
  color: ${(props) => props.theme.color.DarkGray};
`;
const SignUpTitle = styled.p`
  text-align: center;
  font-size: 44px;
  font-family: ${(props) => props.theme.font.Title};
  font-style: normal;
  font-weight: 700;
  line-height: 44px; /* 100% */
  font-family: ${(props) => props.theme.font.Title};
  color: ${(props) => props.theme.color.LightGray};
`;
const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InputSet = styled.div`
  margin-top: 20px;
  width: 100%;
`;
const EmailBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
`;

export default Signup;
