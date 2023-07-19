import { FaFilter } from 'react-icons/fa';
import { TbRefresh } from 'react-icons/tb';
import styled from 'styled-components';

import RoomCard from '../RoomCard';

import Arrows from './Arrows';

const RoomList = () => {
  const roomInfo = Array.from({ length: 8 });
  return (
    <Container>
      <HeaderFrame>
        <HeaderLeftBox>
          <FaFilter size={'1.5rem'} style={{ marginRight: '0.5rem' }} />
          <div>난이도 설정</div>
        </HeaderLeftBox>
        <Arrows size={'2rem'} />
        <HeaderRightBox>
          <button>
            <TbRefresh size={'2rem'} />
          </button>
        </HeaderRightBox>
      </HeaderFrame>
      <ContentFrame>
        {roomInfo.map((_, index) => (
          <RoomCard key={index} />
        ))}
      </ContentFrame>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
`;

const HeaderFrame = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
  position: relative;
`;

const HeaderLeftBox = styled.div`
  display: flex;
  position: absolute;
  left: 1rem;
`;

const HeaderRightBox = styled.div`
  display: flex;
  position: absolute;
  right: 1rem;
`;

const ContentFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default RoomList;
