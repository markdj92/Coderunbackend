import { useState } from 'react';
import styled from 'styled-components';

import ErrorIcon from '/icon/login/sm_error.png';

interface InputAnimationProps {
  type?: string;
  title: string;
  setRef?: React.MutableRefObject<HTMLInputElement | null>;
  inputName: string;
  inputValue: string;
  isDuplicate?: boolean;
  handleBlur?: () => void;
  handleChange: (e: { target: { name: string; value: string } }) => void;
  warningMessage?: string;
  errorMessage?: string;
  isValid?: boolean;
}

const CustomInputSmall: React.FC<InputAnimationProps> = ({
  type = 'text',
  title = '',
  inputName = '',
  inputValue = '',
  handleBlur,
  handleChange,
  setRef,
  errorMessage = '',
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const onReset: React.MouseEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();
    inputValue = '';
    handleChange({ target: { name: inputName, value: inputValue } });
    if (setRef && setRef.current) setRef.current.value = '';
  };

  const onFocused = () => {
    setIsFocus(true);
  };
  const onBlurred = () => {
    if (handleBlur) handleBlur();
    setIsFocus(false);
  };
  return (
    <Container>
      <InputFrame
        isfocus={isFocus ? 'true' : 'false'}
        isvalid={errorMessage === '' ? 'true' : 'false'}
      >
        <NameSection>
          <TitleBox
            isfocus={isFocus || inputValue ? 'true' : 'false'}
            isvalid={errorMessage === '' ? 'true' : 'false'}
          >
            {title}
          </TitleBox>
        </NameSection>
        <InputBox
          isvalid={errorMessage === '' ? 'true' : 'false'}
          onFocus={onFocused}
          onBlur={onBlurred}
          type={type}
          ref={setRef}
          name={inputName}
          onChange={handleChange}
          value={inputValue}
          autoComplete='off'
          required
        />
        {errorMessage && (
          <ResetButton>
            <img src={ErrorIcon} alt='error' onClick={onReset} />
          </ResetButton>
        )}
      </InputFrame>
      {errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 514px;
`;

const InputFrame = styled.div<{ isfocus: string; isvalid: string }>`
  position: relative;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  background: ${(props) =>
    props.isvalid === 'true'
      ? props.isfocus === 'true'
        ? 'linear-gradient(270deg, rgba(189, 0, 255, 0.20) 0%, rgba(189, 0, 255, 0.00) 100%), #1F1E4D;'
        : '#1F1E4D'
      : 'linear-gradient(0deg, rgba(255, 0, 0, 0.20) 0%, rgba(255, 0, 0, 0.20) 100%), #1F1E4D'};

  border: ${(props) => (props.isvalid === 'true' ? '1.4px solid #4541a4' : '1.4px solid #ff5c5c')};
  animation: ${(props) => props.isvalid !== 'true' && 'vibration 0.1s 5'};
  box-shadow:
    0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset,
    0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;

  * {
    color: ${(props) => (props.isvalid === 'true' ? '#8883ff' : '#ff5c5c')};
  }

  input {
    color: ${(props) => (props.isvalid === 'true' ? '#fff' : '#ff5c5c')};
  }
  display: flex;
  flex-direction: row;
  padding: 0 20px 0 18px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
`;

const NameSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
`;
const TitleBox = styled.div<{ isvalid: string; isfocus: string }>`
  color: ${(props) =>
    props.isvalid === 'true' ? (props.isfocus === 'true' ? '#8883FF' : '#4541A4;') : '#F00'};
  text-align: center;
  font-family: 'Noto Sans KR';
  font-size: 22px;
  font-style: normal;
  font-weight: 900;
  line-height: 28px; /* 127.273% */
`;

const InputBox = styled.input<{ isvalid: string }>`
  display: flex;
  flex: 1;
  font-family: 'Noto Sans KR', sans-serif;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  background: transparent;
  border: none;
  outline: none;
  height: 28px;
  margin: 16px 0 16px 0;
  padding-left: 18px;
  border-left: 2px solid ${(props) => (props.isvalid === 'true' ? '#302e75' : '#FF5C5C;')};
`;

const ResetButton = styled.div`
  position: absolute;
  right: 20px;
  top: 16px;
  animation: fadein ease 0.2s;
  -webkit-animation: fadein 0.2s;
  cursor: pointer;
  * {
    color: '#ff5c5c';
  }
`;

const ErrorMsg = styled.div`
  color: #ff5c5c;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 100% */
  letter-spacing: -0.16px;
  margin-left: 20px;
`;

export default CustomInputSmall;
