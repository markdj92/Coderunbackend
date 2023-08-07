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

  background:
    linear-gradient(#26262d, #26262d) padding-box,
    linear-gradient(to bottom right, #6bd9a4, transparent) border-box,
    border-box;
  border: 3px solid transparent;

  transform: sKewX(-15deg);
  border-radius: 30px;

  filter: drop-shadow(0px 2px 8px #59fff5);
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
  color: #59fff5;
  font-size: 3rem;
  opacity: 0.3;
`;

export default BackgroundEmpty;
