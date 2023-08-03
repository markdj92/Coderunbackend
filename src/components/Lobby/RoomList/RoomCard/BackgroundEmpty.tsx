import styled from 'styled-components';

const BackgroundEmpty = () => {
  return (
    <Container>
      <RoomCardShape className='card-shape' />
      <TitleFrame>EMPTY</TitleFrame>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 484px;
  height: 184px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoomCardShape = styled.div`
  width: 430px;
  height: 184px;

  transform: sKewX(-15deg);
  border-radius: 30px;
  background: linear-gradient(140deg, rgba(109, 72, 255, 0.5) 0%, rgba(70, 64, 198, 0) 66.91%),
    rgba(0, 0, 0, 0.6);
  filter: drop-shadow(0px 2px 8px #aaa7ff);
  border: 1px solid #6761de;
  opacity: 0.5;
`;

const TitleFrame = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  font-family: 'IBM Plex Sans KR';
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7f74d8;
  font-size: 3rem;
  opacity: 0.3;
`;

export default BackgroundEmpty;
