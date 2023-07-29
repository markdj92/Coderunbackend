import { useState } from 'react';
import styled from 'styled-components';

interface InputAnimationProps {
  type?: string;
  title: string;
  setRef?: React.MutableRefObject<HTMLInputElement | null>;
  inputName: string;
  inputValue: string;
  handleChange: (e: { target: { name: string; value: string } }) => void;
  warningMessage?: string;
  isValid?: boolean;
}

const CustomInputSmall: React.FC<InputAnimationProps> = ({
  type = 'text',
  title = '',
  inputName = '',
  inputValue = '',
  handleChange,
  setRef,
  warningMessage = '',
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const onFocused = () => {
    setIsFocus(true);
  };
  const onBlurred = () => {
    setIsFocus(false);
  };
  return (
    <Container>
      <SignupFrame isvalid={warningMessage === '' ? 'true' : 'false'}>
        <NameSection isvalid={warningMessage === '' ? 'true' : 'false'}>
          <TitleBox
            isfocus={isFocus ? 'true' : 'false'}
            isvalid={warningMessage === '' ? 'true' : 'false'}
          >
            {title}
          </TitleBox>
        </NameSection>
        <InputBox
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
        {warningMessage && (
          <ErrorIcon>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
            >
              <path
                d='M0 28V0H28V28H0ZM2.93944 25.312H25.0606V2.688H2.93944V25.312ZM17.9381 20.0107L13.8304 15.904L9.64738 20.048L7.98923 18.368L12.1346 14.2613L7.98923 10.1547L9.64738 8.47467L13.8304 12.5813L17.9381 8.512L19.6339 10.1547L15.4886 14.2613L19.6339 18.368L17.9381 20.0107Z'
                fill='#FF5C5C'
              />
            </svg>
          </ErrorIcon>
        )}
      </SignupFrame>
      {warningMessage && <ErrorMsg>{warningMessage}</ErrorMsg>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 514px;
`;

const SignupFrame = styled.div<{ isvalid: string }>`
  transition: all 0.3s ease-in-out;

  border-radius: 8px;
  background: ${(props) =>
    props.isvalid === 'true'
      ? '#1F1E4D'
      : 'linear-gradient(0deg, rgba(255, 0, 0, 0.20) 0%, rgba(255, 0, 0, 0.20) 100%), #1F1E4D'};

  border: 1.4px solid ${(props) => (props.isvalid === 'true' ? '#4541a4' : '#FF5C5C;')};

  display: flex;
  padding: 0 20px 0 18px;
  align-items: flex-end;
  gap: 18px;

  &:focus-within {
    background: linear-gradient(270deg, rgba(189, 0, 255, 0.2) 0%, rgb(31, 30, 77) 40%);
  }
`;

const NameSection = styled.div<{ isvalid: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  padding-right: 18px;
  border-right: 2px solid ${(props) => (props.isvalid === 'true' ? '#4541a4' : '#FF5C5C;')};
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

const InputBox = styled.input`
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
`;
const ErrorIcon = styled.div`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  margin: 16px 0;
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
