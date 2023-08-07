import styled from 'styled-components';

import BGButton from '/images/lobby/bg_button.svg';
import BGButtonIcon from '/images/lobby/bg_button_icon.svg';

const Button = () => {
  return (
    <Container>
      <ButtonBox>
        <ButtonBackground>
          <img src={BGButton} alt='' />
          <img className='icon' src={BGButtonIcon} alt='' />
        </ButtonBackground>
        <TitleFrame>START</TitleFrame>
      </ButtonBox>
      <ButtonBox className='active'>
        <ButtonBackground className='active'>
          <img src={BGButton} alt='' />
        </ButtonBackground>
        <TitleFrame className='active'>START</TitleFrame>
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
  right: 35px;
`;

const ButtonBackground = styled.div`
  position: relative;
  img {
    position: absolute;
    top: -20px;
    right: -50px;
  }
  .icon {
    padding-right: 1px;
  }
`;

const TitleFrame = styled.div`
  position: absolute;
  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.32px;
`;

export default Button;
