//@ts-nocheck
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Background from './Background';
import BackgroundEmpty from './BackgroundEmpty';
import DetailForm from './DetailForm';
import LevelForm from './LevelForm';
import MembersFrom from './MembersFrom';
import Title from './Title';

import { socket, webRtcSocketIo } from '@/apis/socketApi';
import { useVoiceHandle } from '@/contexts/VoiceChatContext';
import { RoomResponse } from '@/types/lobby';
import { RoomInformation } from '@/types/room';

interface Props {
  nickname: string;
  roomInfo: RoomInformation;
  handleClickRoom: (title: string) => void;
  handlePrivate: () => void;
  handleIssue: () => void;
}

const RoomCard = ({ nickname, roomInfo, handleClickRoom, handlePrivate, handleIssue }: Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { myPeerConnection, makeConnection, setJoinUser } = useVoiceHandle();

  const onClickRoom = useCallback(
    (roomName: string) => {
      setIsLoading(true);
      socket.emit('join-room', { title: roomName }, (response: RoomResponse) => {
        setIsLoading(false);
        if (!response.payload?.roomInfo) return handleIssue();

        webRtcSocketIo.emit('joinRoom', { title: roomName }, async ({ success, payload }) => {
          if (!success) return handleIssue();
          try {
            for (const id in payload.userlist) {
              if (payload.userlist[id] !== webRtcSocketIo.id) {
                if (!myPeerConnection.current[payload.userlist[id]]) {
                  makeConnection(payload.userlist[id], payload.title);

                  const offer = await myPeerConnection.current[payload.userlist[id]].createOffer();
                  myPeerConnection.current[payload.userlist[id]].setLocalDescription(offer);
                  webRtcSocketIo.emit('offer', {
                    title: roomName,
                    offer: offer,
                    to: payload.userlist[id],
                  });
                }
              }
            }
            console.error(
              'localStream: ',
              payload.userlist.filter((id) => id !== webRtcSocketIo.id),
            );
            setJoinUser(payload.userlist.filter((id) => id !== webRtcSocketIo.id));
            if (response.payload?.roomInfo.mode === 'COOPERATIVE') {
              navigate(`/cooproom/${roomName}`, {
                state: { ...response.payload.roomInfo, nickname },
              });
            } else {
              navigate(`/room/${roomName}`, {
                state: { ...response.payload.roomInfo, nickname },
              });
            }
          } catch (error) {
            console.error(error);
          }
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
        if (isLoading) {
          return;
        }
        if (roomInfo.status === 'PRIVATE') {
          handlePrivate();
          return handleClickRoom(roomInfo.title);
        }
        return onClickRoom(roomInfo.title);
      }}
    >
      <Background
        title={<Title title={roomInfo.title} status={roomInfo.status} host={roomInfo.master} />}
        mode={
          <DetailForm title='Mode' contents={roomInfo.mode === 'COOPERATIVE' ? 'CO-OP' : 'STUDY'} />
        }
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
        loading={isLoading}
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
