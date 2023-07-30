import { styled } from 'styled-components';

import CustomButtonSmall from '../public/CustomButtonSmall';
import CustomInputSmall from '../public/CustomInputSmall';
import Modal from '../public/Modal';
type nameProps = {
  handleShowSetting: () => void;
  handleChange: (e: { target: { value: string } }) => void;
  nickname: string;
  checkNickname: (e: React.FormEvent<HTMLFormElement>) => void;
};
const SetNickname = ({
  nickname = '',
  handleChange,
  handleShowSetting,
  checkNickname,
}: nameProps) => {
  const handleSetNickname = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkNickname(e);
  };
  return (
    <Modal handleHideModal={handleShowSetting}>
      <SettingForm onSubmit={handleSetNickname}>
        <Title>
          <Logo />
          <TextContainer>
            <WelcomeText>Welcome to Code Learn</WelcomeText>
            <TitleText>Set your Nickname</TitleText>
          </TextContainer>
        </Title>
        <InputContainer>
          <CustomInputSmall
            title='Nickname'
            inputName='nickname'
            handleChange={handleChange}
            inputValue={nickname}
            warningMessage=''
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
  align-items: left;
`;
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
const TextContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
const TitleText = styled.p`
  color: #8883ff;
  text-align: center;
  font-size: 44px;
  font-family: 'IBM Plex Sans KR';
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
