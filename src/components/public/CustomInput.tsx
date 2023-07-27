import { useState, useRef } from 'react';
import { AiOutlineCloseSquare, AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import styled from 'styled-components';

interface InputAnimationProps {
  type?: string;
  setRef?: React.MutableRefObject<HTMLInputElement | null>;
  title: string;
  inputName: string;
  inputValue: string;
  inputAvailable?: boolean;
  handleChange: (e: { target: { name: string; value: string } }) => void;
  errorMessage?: string;
}

const CustomInput: React.FC<InputAnimationProps> = ({
  type = 'text',
  inputName = '',
  inputValue = '',
  title = '',
  handleChange,
  setRef,
  inputAvailable = false,
  errorMessage = '',
}) => {
  const isPassword = useRef(type === 'password');
  const [inputType, setInputType] = useState(type);

  const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputValue = '';
    handleChange({ target: { name: inputName, value: inputValue } });
    if (setRef && setRef.current) setRef.current.value = '';
  };
  const handleShowPassword = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <Container>
      <LoginFrame isvalid={errorMessage === '' ? 'true' : 'false'}>
        <NameSection>
          <TitleBox>{title}</TitleBox>
        </NameSection>
        <InputBox
          type={inputType}
          ref={setRef}
          name={inputName}
          onChange={handleChange}
          value={inputValue}
          disabled={inputAvailable}
          autoComplete='off'
          required
        />
        {errorMessage === '' && isPassword.current && inputValue && (
          <ShowButton>
            {inputType === 'password' ? (
              <AiOutlineLock size={32} onClick={handleShowPassword} />
            ) : (
              <AiOutlineUnlock size={32} onClick={handleShowPassword} />
            )}
          </ShowButton>
        )}
        {errorMessage && (
          <ResetButton>
            <AiOutlineCloseSquare
              size={32}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => onReset(e)}
            />
          </ResetButton>
        )}
      </LoginFrame>
      {errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoginFrame = styled.div<{ isvalid: string }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 16px;
  border: ${(props) => (props.isvalid === 'true' ? '2.4px solid #8883ff' : '2.4px solid #ff5c5c')};
  * {
    color: ${(props) => (props.isvalid === 'true' ? '#8883ff' : '#ff5c5c')};
  }
  input {
    color: ${(props) => (props.isvalid === 'true' ? '#fff' : '#ff5c5c')};
  }

  background: ${(props) =>
    props.isvalid === 'true'
      ? 'linear-gradient(90deg, rgba(70, 64, 198, 0.5) 0%, rgba(70, 64, 198, 0) 100%), rgba(70, 64, 198, 0.2)'
      : 'linear-gradient(90deg, rgba(255, 92, 92, 0.50) 0%, rgba(255, 92, 92, 0.00) 100%), rgba(255, 0, 0, 0.20)'};
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

const ShowButton = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
  cursor: pointer;
  * {
    color: '#8883FF';
  }
`;

const ResetButton = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
  cursor: pointer;
  * {
    color: '#ff5c5c';
  }
`;

const TitleBox = styled.div`
  text-align: center;
  font-style: normal;
  font-weight: 800;
  width: 53px;
  font-size: 32px;
  line-height: 32px;
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
