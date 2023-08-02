import styled from 'styled-components';

interface LobbyButtonProps {
  onClick: () => void;
  title: string;
}

const Button = ({ onClick, title }: LobbyButtonProps) => {
  return (
    <Container onClick={onClick}>
      <ButtonBox>
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

const ButtonBox = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 133px;
  height: 60px;
  border-radius: 8px;
  border: 1px solid rgba(136, 131, 255, 0.2);
  background: linear-gradient(90deg, rgba(70, 64, 198, 0.12) 0%, rgba(70, 64, 198, 0) 100%),
    rgba(70, 64, 198, 0.12);
  cursor: pointer;
  &:hover {
    border: 1px solid #8883ff;
    background: linear-gradient(90deg, rgba(70, 64, 198, 0.12) 0%, rgba(70, 64, 198, 0) 100%),
      rgba(70, 64, 198, 0.12);
    box-shadow: 0px 0px 10px 0px #8984ff;
  }
`;

const TitleFrame = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8883ff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 90.909% */
  letter-spacing: -0.44px;
`;

export default Button;
