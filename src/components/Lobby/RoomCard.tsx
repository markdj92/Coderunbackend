import { FaKey } from 'react-icons/fa';
import styled from 'styled-components';

const RoomCard = () => {
  return (
    <Container>
      <CardFrame>
        <CardTop>
          <RoomTitle>방 타이틀</RoomTitle>
          <RoomLimit> 5 / 10</RoomLimit>
        </CardTop>
        <RoomInfo> 방장 닉네임 / 난이도 / 모드</RoomInfo>
        <CardBottom>
          <FaKey size={'1.5rem'} />
        </CardBottom>
      </CardFrame>
    </Container>
  );
};

const Container = styled.div`
  width: 50%;
  height: 25%;
`;

const CardFrame = styled.div`
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 1rem;
  margin: 0.5rem 1rem;
  background: rgba(69, 94, 209, 0.3);
  transition: all 0.1s ease;

  &:hover {
    box-shadow: 0 0 10px 0 #9c9c9c;
    transform: scale(1.03);
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const RoomTitle = styled.div`
  font-family: 'Black Han Sans', sans-serif;
`;

const RoomLimit = styled.div`
  font-size: 0.8rem;
`;

const RoomInfo = styled.div`
  font-size: 1rem;
`;

export default RoomCard;
