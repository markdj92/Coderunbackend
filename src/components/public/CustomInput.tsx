import { useState, useRef } from 'react';
import styled from 'styled-components';

import ErrorIcon from '/icon/login/error.png';
import LockIcon from '/icon/login/lock.png';
import UnLockIcon from '/icon/login/unlock.png';

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
  const [isFocus, setIsFocus] = useState(false);

  const onReset: React.MouseEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();
    inputValue = '';
    handleChange({ target: { name: inputName, value: inputValue } });
    if (setRef && setRef.current) setRef.current.value = '';
  };
  const handleShowPassword = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  const onFocused = () => {
    setIsFocus(true);
  };
  const onBlurred = () => {
    setIsFocus(false);
  };

  return (
    <Container>
      <InputFrame
        isfocus={isFocus ? 'true' : 'false'}
        isvalid={errorMessage === '' ? 'true' : 'false'}
        isInputValue={!!inputValue ? 'true' : 'false'}
      >
        <NameSection isvalid={errorMessage === '' ? 'true' : 'false'}>
          <TitleBox>{title}</TitleBox>
        </NameSection>
        <InputBox
          type={inputType}
          ref={setRef}
          name={inputName}
          onChange={handleChange}
          value={inputValue}
          disabled={inputAvailable}
          onFocus={onFocused}
          onBlur={onBlurred}
          autoComplete='off'
          required
        />
        {errorMessage === '' && isPassword.current && inputValue && (
          <ShowButton>
            {inputType === 'password' ? (
              <img src={LockIcon} alt='lock' onClick={handleShowPassword} />
            ) : (
              <img src={UnLockIcon} alt='unlock' onClick={handleShowPassword} />
            )}
          </ShowButton>
        )}
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
`;

const InputFrame = styled.div<{ isfocus: string; isvalid: string; isInputValue: string }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all 0.3s ease-in-out;
  border: ${(props) =>
    props.isvalid === 'true'
      ? props.isfocus === 'true' || props.isInputValue === 'true'
        ? props.theme.size.ThickBorder + props.theme.color.MainKeyColor
        : props.theme.size.ThickBorder + props.theme.color.MainKeyDarkColor
      : props.theme.size.ThickBorder + props.theme.color.Error};
  border-radius: 16px;
  * {
    transition: all 0.3s ease-in-out;
    color: ${(props) =>
      props.isvalid === 'true'
        ? props.isfocus === 'true' || props.isInputValue === 'true'
          ? props.theme.color.MainKeyColor
          : props.theme.color.NonFocused
        : props.theme.color.Error};
  }
  input {
    color: ${(props) => (props.isvalid === 'true' ? '#fff' : '#ff5c5c')};
  }
  animation: ${(props) => props.isvalid !== 'true' && 'vibration 0.1s 5'};

  box-shadow:
    ${(props) =>
      props.isvalid === 'true'
        ? props.isfocus === 'true'
          ? props.theme.size.boxShadow + props.theme.color.FocusShadow
          : props.theme.size.boxShadow + props.theme.color.Black
        : props.theme.size.boxShadow + props.theme.color.ErrorShadow},
    0px 4px 2px 0px #15124952 inset;
`;

const NameSection = styled.div<{ isvalid: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0 30px 44px;
  padding-right: 24px;
  border-right: 1px solid
    ${(props) => (props.isvalid === 'true' ? props.theme.color.Divider : props.theme.color.Error)};
`;

const ShowButton = styled.div`
  position: absolute;
  right: 40px;
  top: 32px;
  animation: fadein ease 0.2s;
  -webkit-animation: fadein 0.2s;
  cursor: pointer;
`;

const ResetButton = styled.div`
  position: absolute;
  right: 40px;
  top: 32px;
  animation: fadein ease 0.2s;
  -webkit-animation: fadein 0.2s;
  cursor: pointer;
  * {
    color: ${(props) => props.theme.color.Error};
  }
`;

const TitleBox = styled.div`
  text-align: center;
  font-style: normal;
  font-weight: 800;
  width: 53px;
  font-size: 28px;
  line-height: 32px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const InputBox = styled.input`
  display: flex;
  font-family: 'Noto Sans KR', sans-serif;
  justify-content: center;
  align-items: center;
  gap: 24px;
  font-size: 28px;
  background: transparent;
  border: none;
  outline: none;
  width: 421px;
  margin: 25px 72px 25px 0;
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
