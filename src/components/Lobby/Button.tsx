import styled from 'styled-components';

interface LobbyButtonProps {
  onClick: () => void;
  title: string;
}

const Button = ({ onClick, title }: LobbyButtonProps) => {
  return (
    <Container onClick={onClick}>
      <ButtonBox>
        <ButtonBackground />
        <TitleFrame>{title}</TitleFrame>
      </ButtonBox>
      <ButtonBox className='active'>
        <TitleFrame className='active'>{title}</TitleFrame>
      </ButtonBox>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 133px;
  height: 60px;
  * {
    transition: 0.3s ease-in-out;
  }
  .active {
    opacity: 0;
    font-weight: 900;
  }
  &:hover .active {
    opacity: 1;
  }
`;

const ButtonBackground = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url('/images/lobby/bg_button_pattern.svg'), #26262d;
  background-position-x: -45px;
  opacity: 0.32;
  mix-blend-mode: overlay;
`;

const ButtonBox = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 133px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid rgba(107, 217, 164, 0.2);
  /* cursor: pointer; */
  &:hover {
    border: 1px solid ${(props) => props.theme.color.MainKeyColor};
    box-shadow:
      0px 0px 12px 0px rgba(89, 255, 245, 0.8),
      0px 4px 2px 0px rgba(21, 18, 73, 0.32) inset;
  }
  &:active {
    box-shadow: 0px 0px 12px 0px rgba(89, 255, 245, 0.8) inset;
  }
`;

const TitleFrame = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 90.909% */
  letter-spacing: -0.44px;
`;

export default Button;
