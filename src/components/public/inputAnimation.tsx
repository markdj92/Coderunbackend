import React from 'react';
import { BsCheckSquareFill } from 'react-icons/bs';
import { RiCloseCircleFill } from 'react-icons/ri';
import styled, { css } from 'styled-components';

interface InputAnimationProps {
  type?: string;
  width?: string;
  Ref?: React.MutableRefObject<HTMLInputElement | null>;
  inputName: string;
  inputValue: string;
  inputAvailable?: boolean;
  handleChange: (e: { target: { name: string; value: string } }) => void;
  warningMessage?: string;
  isValid: boolean;
}

const InputAnimation: React.FC<InputAnimationProps> = ({
  type = 'text',
  width = '700px',
  Ref,
  inputName = '',
  inputValue = '',
  inputAvailable = false,
  handleChange,
  warningMessage = '',
  isValid = false,
}) => {
  const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputValue = '';
    handleChange({ target: { name: inputName, value: inputValue } });
    if (Ref && Ref.current) Ref.current.value = '';
  };

  return (
    <Container width={width}>
      <InputFrame isvalid={isValid ? 'true' : 'false'}>
        <input
          type={type}
          ref={Ref}
          name={inputName}
          value={inputValue}
          onChange={handleChange}
          required
          disabled={inputAvailable}
          autoComplete='off'
        />
        <label className='label-wrapper'>
          <span className='label-text'>{inputName}</span>
        </label>
        {!inputAvailable && inputValue && (
          <InputBtn>
            {isValid ? (
              <BsCheckSquareFill size={18} color='#4fff00' />
            ) : (
              <RiCloseCircleFill
                className='delIcon'
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => onReset(e)}
                size={19}
                color='#a8a8a8'
              />
            )}
          </InputBtn>
        )}
      </InputFrame>
      {warningMessage && (
        <CommentAlert isvalid={isValid ? 'true' : 'false'}>{warningMessage}</CommentAlert>
      )}
    </Container>
  );
};

const Container = styled.div<{ width: string }>`
  ${({ width }) => {
    return css`
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: ${width};
    `;
  }}
`;

const CommentAlert = styled.div<{ isvalid: string }>`
  ${({ isvalid }) => {
    return css`
      display: ${isvalid === 'true' ? 'block' : 'none'};
      font-weight: 400;
      font-size: 10px;
      line-height: 150%;
      color: '#ca2323';
      margin-top: 5px;
    `;
  }}
`;

const InputFrame = styled.div<{
  isvalid: string;
}>`
  ${({ isvalid }) => {
    return css`
      position: relative;
      height: 50px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      input {
        width: 100%;
        height: 24px;
        order: 0;
        outline: 0;
        font-size: 15px;
        font-weight: bold;
        border: none;
        margin-bottom: 3px;
        color: #fff;
        background-color: transparent;
      }

      svg {
        position: absolute;
      }

      .label-wrapper {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        pointer-events: none;
        border-bottom: ${isvalid === 'true' ? '1px solid #03217b' : '1px solid #fff'};
      }

      .label-wrapper::after {
        content: '';
        position: absolute;
        height: 100%;
        width: 100%;
        border-bottom: 2px solid ${isvalid === 'true' ? '#03217b' : '#fff'};
        left: 0;
        bottom: -1px;
        transform: translateX(-100%);
        transition: transform 0.1s ease;
      }

      .label-text {
        font-size: 15px;
        font-weight: bold;
        color: #fff;
        position: absolute;
        bottom: 10px;
        left: 0px;
        transition: all 0.2s ease;
        line-height: 150%;
      }

      input:disabled + .label-wrapper .label-text {
        color: #a8a8a8;
        font-size: 15px;
        transform: translateY(-35px);
      }

      input:focus + .label-wrapper .label-text,
      input:valid + .label-wrapper .label-text {
        font-size: 10px;
        transform: translateY(-18px);
      }

      input:focus + .label-wrapper::after {
        transform: translateX(0%);
      }

      input:blur + .label-wrapper .label-text {
        color: #a8a8a8;
      }

      input:blur + .label-wrapper::after {
        transform: translateX(100%);
      }
    `;
  }}
`;

const InputBtn = styled.div`
  display: flex;
  position: absolute;
  width: 24px;
  height: 24px;
  right: 0;
  bottom: 2px;
  .delIcon {
    cursor: pointer;
  }
`;

export default InputAnimation;
