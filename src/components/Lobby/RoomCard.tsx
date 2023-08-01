import { useCallback } from 'react';
import { BsFillBookFill } from 'react-icons/bs';
import { FaKey } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { socket } from '@/apis/socketApi';
import { RoomResponse } from '@/types/lobby';
import { RoomInformation } from '@/types/room';

const RoomCard = ({ nickname, roomInfo }: { nickname: string; roomInfo: RoomInformation }) => {
  const navigate = useNavigate();

  const onClickRoom = useCallback(
    (roomName: string, mode: string) => {
      socket.emit('join-room', { title: roomName }, (response: RoomResponse) => {
        if (!response.payload?.roomInfo) return alert('방 입장 실패!');
        if (mode === 'STUDY') {
          navigate(`/room/${roomName}`, {
            state: { ...response.payload.roomInfo, nickname },
          });
        } else {
          navigate(`/cooproom/${roomName}`, {
            state: { ...response.payload.roomInfo, nickname },
          });
        }
      });
    },
    [navigate],
  );

  if (!roomInfo)
    return (
      <Container>
        <CardFrame>
          <EmptyCard>empty</EmptyCard>
        </CardFrame>
      </Container>
    );

  return (
    <Container>
      <CardFrame
        onClick={() => onClickRoom(roomInfo.title, roomInfo.mode)}
        ready={roomInfo.ready ? 'true' : 'false'}
      >
        <CardTop>
          <RoomTitle>{roomInfo.title}</RoomTitle>
          <RoomLimit>
            {roomInfo.member_count + ''} / {roomInfo.max_members + ''}
          </RoomLimit>
        </CardTop>
        <RoomInfo>
          {roomInfo.master} / Level {roomInfo.level + ''} / {roomInfo.mode}
        </RoomInfo>
        <CardBottom>
          {roomInfo.status === 'PRIVATE' ? (
            <FaKey size={'1.5rem'} style={{ fill: '#ece800' }} />
          ) : roomInfo.mode === 'COOPERATIVE' ? (
            <RiTeamFill size={'1.5rem'} />
          ) : (
            <BsFillBookFill size={'1.5rem'} />
          )}
        </CardBottom>
      </CardFrame>
    </Container>
  );
};

const Container = styled.div`
  width: 50%;
  height: 25%;
`;

const CardFrame = styled.div<{ ready?: string }>`
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 1rem;

  min-height: 99.66px;
  max-height: 99.66px;
  margin: 0.5rem 1rem;
  background: ${({ ready }) =>
    ready === 'true' ? 'rgba(69, 94, 209, 0.3)' : 'rgba(181, 181, 181, 0.3)'};
  transition: all 0.1s ease;
  * {
    color: ${({ ready }) => (ready === 'true' ? '#fff' : 'rgba(181, 181, 181, 0.8)')};
  }

  &:hover {
    box-shadow: 0 0 10px 0 #9c9c9c;
    transform: ${({ ready }) => (ready === 'true' ? 'scale(1.03)' : 'scale(1.0)')};
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const EmptyCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  height: 100%;
  font-weight: 500;
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
