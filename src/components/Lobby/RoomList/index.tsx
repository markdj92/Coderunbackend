import { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { TbRefresh } from 'react-icons/tb';
import styled from 'styled-components';

import RoomCard from '../RoomCard';

import Arrows from './Arrows';

import { getRoomList } from '@/apis/roomApi';
import { RoomInformation } from '@/types/room';

const RoomList = () => {
  const [roomList, setRoomList] = useState<RoomInformation[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    handleRefresh();
  }, [setRoomList, page]);

  const handleRefresh = async () => {
    try {
      const response = await getRoomList();
      const total = Math.ceil(response.data.length / 8);
      setTotalPage(total);
      if (total < page) setPage(total);
      setRoomList(response.data.slice(page * 8 - 8, page * 8));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <HeaderFrame>
        <HeaderLeftBox>
          <FaFilter size={'1.5rem'} style={{ marginRight: '0.5rem' }} />
          <div>난이도 설정</div>
        </HeaderLeftBox>
        <Arrows size={'2rem'} totalPage={totalPage} page={page} setPage={setPage} />
        <HeaderRightBox>
          <button onClick={handleRefresh}>
            <TbRefresh size={'2rem'} />
          </button>
        </HeaderRightBox>
      </HeaderFrame>
      <ContentFrame>
        {roomList.length > 0 &&
          roomList.map((info, index) => <RoomCard key={index} roomInfo={info} />)}
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
  button {
    transition: all 0.3s ease;
    &:hover {
      rotate: 90deg;
    }
  }
`;

const ContentFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default RoomList;
