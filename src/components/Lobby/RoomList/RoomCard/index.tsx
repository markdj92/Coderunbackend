import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Background from './Background';
import BackgroundEmpty from './BackgroundEmpty';
import DetailForm from './DetailForm';
import LevelForm from './LevelForm';
import MembersFrom from './MembersFrom';
import Title from './Title';

import { socket } from '@/apis/socketApi';
import { RoomResponse } from '@/types/lobby';
import { RoomInformation } from '@/types/room';

interface Props {
  nickname: string;
  roomInfo: RoomInformation;
  handleClickRoom: (title: string) => void;
  handlePrivate: () => void;
}

const RoomCard = ({ nickname, roomInfo, handleClickRoom, handlePrivate }: Props) => {
  const navigate = useNavigate();

  const onClickRoom = useCallback(
    (roomName: string) => {
      socket.emit('join-room', { title: roomName }, (response: RoomResponse) => {
        if (!response.payload?.roomInfo) return alert('방 입장 실패!');
        navigate(`/room/${roomName}`, {
          state: { ...response.payload.roomInfo, nickname },
        });
      });
    },
    [navigate],
  );

  if (!roomInfo)
    return (
      <Container>
        <BackgroundEmpty />
      </Container>
    );

  return (
    <Container
      onClick={() => {
        if (roomInfo.status === 'PRIVATE') {
          handlePrivate();
          return handleClickRoom(roomInfo.title);
        }
        return onClickRoom(roomInfo.title);
      }}
    >
      <Background
        title={<Title title={roomInfo.title} status={roomInfo.status} host={roomInfo.master} />}
        mode={<DetailForm title='Mode' contents={roomInfo.mode} />}
        level={<DetailForm title='Level' contents={<LevelForm level={roomInfo.level} />} />}
        members={
          <DetailForm
            title='Members'
            contents={
              <MembersFrom
                member_count={roomInfo.member_count}
                max_members={roomInfo.max_members}
              />
            }
          />
        }
        ready={roomInfo.ready}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 484px;
  height: 184px;
  * {
    transition: 0.3s ease-in-out;
  }
  .active {
    opacity: 0;
  }
  &:hover .active {
    opacity: 1;
  }
`;

export default RoomCard;
