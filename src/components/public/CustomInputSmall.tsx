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
        isinputvalue={!!inputValue ? 'true' : 'false'}
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

const InputFrame = styled.div<{ isfocus: string; isvalid: string; isinputvalue: string }>`
  position: relative;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  background: ${(props) => props.theme.color.Black};

  border: ${(props) =>
    props.isvalid === 'true'
      ? props.isfocus === 'true' || props.isinputvalue === 'true'
        ? props.theme.size.ThinBorder + props.theme.color.MainKeyColor
        : props.theme.size.ThinBorder + props.theme.color.MainKeyDarkColor
      : props.theme.size.ThinBorder + props.theme.color.Error};
  animation: ${(props) => props.isvalid !== 'true' && 'vibration 0.1s 5'};

  * {
    transition: all 0.3s ease-in-out;
    color: ${(props) =>
      props.isvalid === 'true' ? props.theme.color.MainKeyColor : props.theme.color.Error};
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

  box-shadow:
    0px 0px 12px 0px
      ${(props) =>
        props.isvalid === 'true'
          ? props.isfocus === 'true'
            ? props.theme.color.FocusShadow
            : props.theme.color.Black
          : props.theme.color.ErrorShadow},
    0px 4px 2px 0px #15124952 inset;
`;

const NameSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 13px 0;
`;

const TitleBox = styled.div<{ isvalid: string; isfocus: string }>`
  color: ${(props) =>
    props.isvalid === 'true'
      ? props.isfocus === 'true'
        ? props.theme.color.MainKeyColor
        : props.theme.color.NonFocused
      : props.theme.color.Error};
  text-align: center;
  font-family: 'Noto Sans KR';
  font-size: 22px;
  font-style: normal;
  font-weight: 900;
  line-height: 28px; /* 127.273% */
  width: max-content;
`;

const InputBox = styled.input<{ isvalid: string }>`
  display: flex;
  flex: 1;
  font-family: ${(props) => props.theme.font.Content};
  justify-content: center;
  align-items: center;
  font-size: 22px;
  text-align: start;
  background: transparent;
  border: none;
  outline: none;
  height: fit-content;
  padding-left: 18px;
  border-left: 2px solid
    ${(props) => (props.isvalid === 'true' ? props.theme.color.Divider : props.theme.color.Error)};
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
