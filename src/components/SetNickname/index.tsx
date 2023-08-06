import { useState, useEffect, useRef } from 'react';
import { styled } from 'styled-components';

import CustomButtonSmall from '../public/CustomButtonSmall';
import CustomInputSmall from '../public/CustomInputSmall';
import Modal from '../public/Modal';

type nameProps = {
  handleSetNickname: (e: React.FormEvent<HTMLFormElement>, nickname: string) => void;
  handleShowSetNickname: () => void;
  errorNickname: string;
  setErrorNickname: (errorNickname: string) => void;
};

const SetNickname = ({
  handleSetNickname,
  handleShowSetNickname,
  errorNickname,
  setErrorNickname,
}: nameProps) => {
  const [nickname, setNickname] = useState<string>('');
  const nicknameRef = useRef<HTMLInputElement>(null);

  const handleChangeNickname = (e: { target: { name: string; value: string } }) => {
    setNickname(e.target.value);
    setErrorNickname('');
  };

  useEffect(() => {
    nicknameRef.current?.focus();
  }, []);

  return (
    <Modal handleHideModal={handleShowSetNickname}>
      <SettingForm onSubmit={(e) => handleSetNickname(e, nickname)}>
        <TextContainer>
          <WelcomeText>Welcome to Code Learn</WelcomeText>
          <TitleText>Set your Nickname</TitleText>
        </TextContainer>
        <InputContainer>
          <CustomInputSmall
            setRef={nicknameRef}
            title='Nickname'
            inputName='nickname'
            handleChange={handleChangeNickname}
            inputValue={nickname}
            errorMessage={errorNickname}
          />
          <CustomButtonSmall title={'Join'} isDisabled={nickname === ''} />
        </InputContainer>
      </SettingForm>
    </Modal>
  );
};
const SettingForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TextContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 24px;
`;
const WelcomeText = styled.div`
  color: ${(props) => props.theme.color.DarkGray};
  text-align: center;
  font-family: 'Noto Sans KR';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
  letter-spacing: -0.32px;
  margin-bottom: 10px;
`;
const TitleText = styled.p`
  text-align: center;
  font-size: 44px;
  font-family: ${(props) => props.theme.font.Title};
  color: ${(props) => props.theme.color.LightGray};
  font-style: normal;
  font-weight: 700;
  line-height: 44px; /* 100% */
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
`;
export default SetNickname;
