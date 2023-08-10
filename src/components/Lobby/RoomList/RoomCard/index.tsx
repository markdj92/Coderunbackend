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
}

const RoomCard = ({ nickname, roomInfo, handleClickRoom, handlePrivate }: Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { localStream, myPeerConnection } = useVoiceHandle();
  const peerInfo = myPeerConnection.current;

  const handleIce = (data, id) => {
    webRtcSocketIo.emit('ice', {
      title: roomName,
      icecandidate: data.candidate,
      to: id,
    });
  };

  const makeConnection = async (userId) => {
    peerInfo[userId] = new Object();
    peerInfo[userId].peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    });
    peerInfo[userId].peerConnection.addEventListener('icecandidate', (data) => handleIce(data, id));

    peerInfo[userId].peerConnection.oniceconnectionstatechange = () => {
      if (peerInfo[userId].peerConnection.iceConnectionState === 'disconnected') {
        peerInfo[userId].peerConnection.close();
        delete peerInfo[userId].peerConnection;
      }
    };

    peerInfo[userId].peerConnection.ontrack = (event) => {
      peerInfo[userId].peerConnection.srcObject = event.streams[0];
    };

    for (let track of localStream.getTracks()) {
      await peerInfo[userId].peerConnection.addTrack(track, localStream);
    }
  };

  const onClickRoom = useCallback(
    (roomName: string) => {
      setIsLoading(true);
      socket.emit('join-room', { title: roomName }, (response: RoomResponse) => {
        setIsLoading(false);
        if (!response.payload?.roomInfo) return alert('방 입장 실패!');

        webRtcSocketIo.emit('joinRoom', { title: roomName }, async ({ success, payload }) => {
          if (!success) return alert('방 입장 실패!');
          try {
            for (const id in payload.userlist) {
              if (payload.userlist[id] !== webRtcSocketIo.id) {
                if (!peerInfo[payload.userlist[id]]) {
                  makeConnection(payload.userlist[id]);

                  const offer = await peerInfo[payload.userlist[id]].peerConnection.createOffer();
                  peerInfo[payload.userlist[id]].peerConnection.setLocalDescription(offer);
                  webRtcSocketIo.emit('offer', {
                    title: roomName,
                    offer: offer,
                    to: payload.userlist[id],
                  });
                }
              }
            }
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
            console.error('Error creating offer!', error);
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
