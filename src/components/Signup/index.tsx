import React, { useState } from 'react';
import styled from 'styled-components';

import { validateUserInfo } from '@/utils';

import CustomButtonSmall from '../public/CustomButtonSmall';
import CustomInputSmall from '../public/CustomInputSmall';
import Modal from '../public/Modal';

import { postSignUp } from '@/apis/authApi';
import { useAuthForm } from '@/hooks/useAuthForm';

const Signup = ({ handleShowSignup }: { handleShowSignup: () => void }) => {
  const {
    emailRef,
    passwordRef,
    rePasswordRef,
    userAccount,
    validateState,
    handleAccountChange,
    // isDuplicate,
    // setIsDuplicate,
  } = useAuthForm();
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
  // const handleCheckEmail = async () => {
  //   if (!validateState.email) return;
  //   try {
  //     const response = await postCheckEmail({ email: userAccount.email });
  //     if (response) {
  //       alert('사용할 수 있는 이메일입니다.');
  //       setIsDuplicate(true);
  //       passwordRef.current?.focus();
  //     }
  //   } catch (error) {
  //     alert('이미 존재하는 이메일입니다.');
  //     emailRef.current?.focus();
  //   }
  // };
  const handleChanged = (e: { target: { name: string; value: string } }) => {
    setconfirmPassword(e.target.value);
  };

  return (
    <Modal handleHideModal={handleShowSignup}>
      <SignupForm onSubmit={handleSignup}>
        <Title>
          <Logo />
          <SignupText>
            <WelcomeText>Welcome to Code Learn</WelcomeText>
            <SignUpTitle>SIGN UP</SignUpTitle>
          </SignupText>
        </Title>
        <InputContainer>
          <InputSet>
            <EmailBox>
              <CustomInputSmall
                setRef={emailRef}
                title='ID'
                inputName={'email'}
                handleChange={handleAccountChange}
                inputValue={userAccount.email}
                isValid={validateState.email}
                warningMessage={
                  userAccount.email && !validateUserInfo.checkEmail(userAccount.email)
                    ? '주소형식을 확인해주세요'
                    : ''
                }
              />
              {/* <EmailButton
                isvalid={validateState.email ? 'true' : 'false'}
                onClick={handleCheckEmail}
                >
                중복확인
              </EmailButton> */}
            </EmailBox>
          </InputSet>
          <InputSet>
            <CustomInputSmall
              type='password'
              title='PW'
              inputName={'password'}
              setRef={passwordRef}
              handleChange={handleAccountChange}
              inputValue={userAccount.password}
              isValid={validateState.password}
              warningMessage={
                userAccount.password && !validateUserInfo.checkPassword(userAccount.password)
                  ? '조건 : 8자 이상 , 영숫자 only'
                  : ''
              }
            />
          </InputSet>
          <InputSet>
            <CustomInputSmall
              type='password'
              title={'PW Confirm'}
              inputName={'password'}
              handleChange={handleChanged}
              setRef={rePasswordRef}
              inputValue={confirmPassword}
              warningMessage={
                confirmPassword &&
                !validateUserInfo.checkPasswordDiff(userAccount.password, confirmPassword)
                  ? '비밀번호가 일치하지 않습니다'
                  : ''
              }
            />
          </InputSet>
          <CustomButtonSmall title={'Join'} isBorder={false} />
        </InputContainer>
      </SignupForm>
    </Modal>
  );
};

const Title = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;
const Logo = styled.div`
  width: 74px;
  height: 74px;
  background: #1f1e4d;
`;
const SignupText = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 24px;
`;
const WelcomeText = styled.div`
  color: #8883ff;
  text-align: center;
  font-family: 'Noto Sans KR';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
  letter-spacing: -0.32px;
  margin-bottom: 10px;
`;
const SignUpTitle = styled.p`
  color: #8883ff;
  text-align: center;
  font-size: 44px;
  font-family: 'IBM Plex Sans KR';
  font-style: normal;
  font-weight: 700;
  line-height: 44px; /* 100% */
`;
const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: left;
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
// const EmailButton = styled.div<{ isvalid: string }>`
//   ${({ isvalid }) => {
//     return css`
//       cursor: ${isvalid === 'true' ? 'pointer' : 'auto'};
//       letter-spacing: 0.2rem;
//       margin-bottom: 0.5rem;
//       text-align: end;

//       width: 10rem;
//       transition: all 0.5s ease;
//       color: ${isvalid === 'true' ? '#fff' : '#6a6d94'};
//       &:hover {
//         text-shadow: ${isvalid === 'true'
//           ? '0 0 5px #bebebe,0 0 10px #bebebe,0 0 15px #bebebe,0 0 20px #bebebe,0 0 35px #bebebe'
//           : ''};
//       }
//     `;
//   }}
// `;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
`;

export default Signup;
