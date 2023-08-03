import styled from 'styled-components';

import BGButton from '/images/lobby/bg_button.png';
import BGButtonActive from '/images/lobby/bg_button_active.png';

const Button = () => {
  return (
    <Container>
      <ButtonBox>
        <TitleFrame>START</TitleFrame>
        <img src={BGButton} alt='' />
      </ButtonBox>
      <ButtonBox className='active'>
        <TitleFrame className='active'>START</TitleFrame>
        <img src={BGButtonActive} alt='' />
      </ButtonBox>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  .active {
    font-weight: 900;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 107px;
  height: 86px;
  position: absolute;
  top: 0px;
  right: 50px;
`;

const TitleFrame = styled.div`
  position: absolute;
  color: #8883ff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 100% */
  letter-spacing: -0.32px;
`;

export default Button;
