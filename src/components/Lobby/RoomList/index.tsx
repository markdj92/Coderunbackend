import { useState, useEffect } from 'react';
import { TbRefresh } from 'react-icons/tb';
import styled from 'styled-components';

import Arrows from './Arrows';
import RoomCard from './RoomCard';

import { getRoomList } from '@/apis/roomApi';
import { RoomInformation } from '@/types/room';

const RoomList = ({
  nickname,
  handlePrivate,
  onClickRoom,
  level,
}: {
  nickname: string;
  handlePrivate: () => void;
  onClickRoom: (title: string) => void;
  level: number;
}) => {
  const [roomList, setRoomList] = useState<RoomInformation[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    handleRefresh();
  }, [level, page]);

  const handleRefresh = async () => {
    try {
      const response = await getRoomList({ page, level });
      setRoomList(response.data.rooms);
      setTotalPage(response.data.totalPage);
      if (page > response.data.totalPage) setPage(response.data.totalPage);
      else setPage(page);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <HeaderFrame>
        <Arrows size={'2rem'} totalPage={totalPage} page={page} setPage={setPage} />
        <HeaderRightBox>
          <button onClick={handleRefresh}>
            <TbRefresh size={'2rem'} />
          </button>
        </HeaderRightBox>
      </HeaderFrame>
      <ContentFrame>
        {Array.from({ length: 6 }).map((_, index) => (
          <RoomCard
            key={index}
            nickname={nickname}
            roomInfo={roomList[index]}
            handleClickRoom={onClickRoom}
            handlePrivate={handlePrivate}
          />
        ))}
      </ContentFrame>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
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

const HeaderRightBox = styled.div`
  display: flex;
  position: absolute;
  right: 1rem;
  button {
    transition: all 0.3s ease;
    &:hover {
      rotate: 90deg;
    }
    &:active {
      transform: translate(2px, 2px);
    }
  }
`;

const ContentFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 56px 20px;
  justify-content: center;
`;

export default RoomList;
