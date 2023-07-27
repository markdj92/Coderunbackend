import styled from 'styled-components';

interface InputAnimationProps {
  type?: string;
  setRef?: React.MutableRefObject<HTMLInputElement | null>;
  inputName: string;
  inputValue: string;
  inputAvailable?: boolean;
  handleChange: (e: { target: { name: string; value: string } }) => void;
  warningMessage?: string;
  isValid: boolean;
}

const CustomInput: React.FC<InputAnimationProps> = ({
  type = 'text',
  inputName = '',
  inputValue = '',
  handleChange,
  setRef,
  warningMessage = '* 아이디를 확인해주세요',
  inputAvailable = false,
  isValid = false,
}) => {
  return (
    <Container>
      <LoginFrame isvalid={isValid ? 'true' : 'false'}>
        <NameSection>
          <TitleBox>{inputName}</TitleBox>
        </NameSection>
        <InputBox
          type={type}
          ref={setRef}
          name={inputName}
          onChange={handleChange}
          value={inputValue}
          disabled={inputAvailable}
          autoComplete='off'
          required
        />
      </LoginFrame>
      {warningMessage && <ErrorMsg>{warningMessage}</ErrorMsg>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoginFrame = styled.div<{ isvalid: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 16px;
  border: 2.4px solid #8883ff;
  background: linear-gradient(90deg, rgba(70, 64, 198, 0.5) 0%, rgba(70, 64, 198, 0) 100%),
    rgba(70, 64, 198, 0.2);
  box-shadow:
    0px 4px 12px 0px rgba(18, 17, 39, 0.24),
    0px 4px 2px 0px rgba(21, 18, 73, 0.32) inset;
`;

const NameSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 38px 0 38px 44px;
  padding-right: 24px;
  border-right: 2px solid #5b56bd;
`;

const TitleBox = styled.div`
  color: #8883ff;
  text-align: center;
  font-style: normal;
  font-weight: 800;
  width: 53px;
  font-size: 32px;
  line-height: 32px; /* 100% */
  font-family: 'Noto Sans KR', sans-serif;
`;

const InputBox = styled.input`
  display: flex;
  font-family: 'Noto Sans KR', sans-serif;
  justify-content: center;
  align-items: center;
  gap: 24px;
  font-size: 32px;
  background: transparent;
  border: none;
  outline: none;
  width: 541px;
  margin: 31px 44px 31px 0;
  padding-left: 24px;
`;

const ErrorMsg = styled.div`
  color: #ff5c5c;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
  letter-spacing: -0.2px;
  margin-left: 44px;
`;

export default CustomInput;
