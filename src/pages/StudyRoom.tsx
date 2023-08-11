//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { socket, webRtcSocketIo } from '@/apis/socketApi';
import Alert from '@/components/public/Alert';
import { HeaderLogo } from '@/components/public/HeaderLogo';
import Badge from '@/components/Room/Badge';
import ToolButtonBox from '@/components/Room/ToolButtonBox';
import { useMusic } from '@/contexts/MusicContext';
import { useVoiceHandle } from '@/contexts/VoiceChatContext';
import useSocketConnect from '@/hooks/useSocketConnect';
import { BadgeStatus, RoomStatus, UserInfo } from '@/types/room';

const StudyRoom = () => {
  useSocketConnect();
  const location = useLocation();
  const { setIsMusic } = useMusic();

  const { myPeerConnection, makeConnection } = useVoiceHandle();

  const { title, member_count, max_members, user_info, nickname, level } = location.state;

  const [isLeaveRoom, setIsLeaveRoom] = useState(false);
  const [ableStart, setAbleStart] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>(title);
  const [people, setPeople] = useState<number>(member_count);
  const [myIndex, setMyIndex] = useState<number>(0);
  const [ownerIndex, setOwnerIndex] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(max_members);
  const [userInfos, setUserInfos] = useState<(UserInfo | BadgeStatus)[]>(user_info);
  const [roomLevel, setRoomLevel] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
    setIsMusic(false);
  }, []);

  useEffect(() => {
    const roomHandler = ({ title, member_count, max_members, user_info }: RoomStatus) => {
      setRoomName(title);
      setPeople(member_count);
      let countReady = 0;

      user_info.forEach((user: UserInfo | BadgeStatus, index: number) => {
        if (user === 'LOCK' || user === 'EMPTY') return;
        if (user.nickname === nickname) {
          setMyIndex(index);
        }
        if (user.owner) {
          setOwnerIndex(index);
        }
        if (user.status) {
          countReady += 1;
        }
      });
      setAbleStart(member_count === countReady + 1);
      setMaxPeople(max_members);
      setUserInfos(user_info);
    };

    let countReady = 0;
    setRoomName(title);
    setRoomLevel(level);
    setPeople(member_count);
    user_info.forEach((user: UserInfo | BadgeStatus, index: number) => {
      if (user === 'LOCK' || user === 'EMPTY') return;
      if (user.nickname === nickname) {
        setMyIndex(index);
      }
      if (user.owner) {
        setOwnerIndex(index);
      }
    });
    setAbleStart(member_count === countReady + 1);
    setMaxPeople(max_members);
    setUserInfos(user_info);

    socket.on('room-status-changed', roomHandler);
    socket.on('kicked', (title) => {
      if (title === roomName) {
        socket.emit('leave-room', { title: roomName }, () => {
          webRtcSocketIo.emit('leaveRoom', { title: roomName }, () => {
            navigate('/lobby', { state: { nickname } });
          });
        });
      }
    });
    socket.on('start', (response) => {
      navigate('/game', { state: { nickname: nickname, title: response.title } });
    });

    return () => {
      socket.off('kicked');
      socket.off('start');
      socket.off('room-status-changed', roomHandler);
    };
  }, []);

  const leaveRoomTitle = '정말 나가시겠습니까?';

  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', { title: roomName }, () => {
      webRtcSocketIo.emit('leaveRoom', { title: roomName }, () => {
        navigate('/lobby', { state: { nickname } });
      });
    });
  }, [navigate, roomName]);

  const onReady = () => {
    socket.emit('ready', { title: roomName });
  };

  const onGameRoom = () => {
    socket.emit('start', { title: roomName });
  };

  useEffect(() => {
    //참관자 입장
    webRtcSocketIo.on('entry', async (data) => {
      setJoinUser(data.filter((id) => id !== socket.current.id));
    });

    //offer를 받는 쪽
    webRtcSocketIo.on('offer', async (data) => {
      if (!myPeerConnection.current[data.from]) {
        makeConnection(data.from, title);
      }

      if (myPeerConnection.current[data.from].connectionState === 'stable') {
        return;
      }

      myPeerConnection.current[data.from].setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );
      const answer = await myPeerConnection.current[data.from].createAnswer(data.offer);
      await myPeerConnection.current[data.from].setLocalDescription(answer);

      //answer를 보내는 쪽
      webRtcSocketIo.emit('answer', {
        title: title,
        answer: answer,
        to: data.from,
      });
    });

    //answer 받기
    webRtcSocketIo.on('answer', async (data) => {
      await myPeerConnection.current[data.from].setRemoteDescription(data.answer);
    });

    //ice를 받는 쪽
    webRtcSocketIo.on('ice', async (data) => {
      if (myPeerConnection.current[data.from]) {
        await myPeerConnection.current[data.from].addIceCandidate(data.icecandidate);
      }
    });

    // 연결 해제 - 타인
    webRtcSocketIo.on('someoneLeaveRoom', ({ userId }) => {
      if (myPeerConnection.current[userId]) {
        myPeerConnection.current[userId].close();
        delete myPeerConnection.current[userId];
      }
    });

    return () => {
      webRtcSocketIo.off('entry');
      webRtcSocketIo.off('offer');
      webRtcSocketIo.off('answer');
      webRtcSocketIo.off('ice');
      webRtcSocketIo.off('someoneLeaveRoom');
    };
  }, [roomName]);

  return (
    <MainContainer>
      {isLeaveRoom && (
        <Alert
          title={leaveRoomTitle}
          handleCloseAlert={() => setIsLeaveRoom(false)}
          handleAlert={onLeaveRoom}
        />
      )}
      <LeftFrame>
        <HeaderSection>
          <HeaderLogo />
        </HeaderSection>
        <RoomInfoSection>
          <ModeBox>STUDY MODE.</ModeBox>
          <TitleBox>{title}</TitleBox>
          <DetailBox>Lv.{roomLevel}</DetailBox>
        </RoomInfoSection>
        <ToolButtonBox handleLeaveRoom={() => setIsLeaveRoom(true)} />
      </LeftFrame>
      <MainFrame>
        <MainContentBox>
          {userInfos &&
            Array.from({ length: 10 }).map((_, index) => {
              return (
                <Badge
                  key={index}
                  isMine={index === myIndex}
                  isOwner={index === ownerIndex}
                  isRoomAuth={myIndex === ownerIndex}
                  user={userInfos[index]}
                  title={roomName}
                  badgeNumber={index}
                />
              );
            })}
        </MainContentBox>
      </MainFrame>
      <RightFrame>
        <HeaderSection></HeaderSection>
        <StartButtonSection>
          <People>
            <label className='countReady'>{people}</label>
            <label className='countPeople'>/ {maxPeople}</label>
          </People>
          {myIndex === ownerIndex ? (
            ableStart ? (
              <ButtonStart onClick={onGameRoom}>START</ButtonStart>
            ) : (
              <ButtonStartLock>START</ButtonStartLock>
            )
          ) : (
            <ReadyBox onClick={onReady}>READY</ReadyBox>
          )}
          <ButtonStartArrow ablestart={ableStart ? 'true' : 'false'} />
        </StartButtonSection>
      </RightFrame>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  background: url('/background_lobby.png');
  background-blend-mode: luminosity;
  background-size: cover;
  background-position: center;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const LeftFrame = styled.div`
  width: 25%;
  height: 100%;
  position: relative;
`;

const RoomInfoSection = styled.div`
  margin: 46px 120px 10px 100px;
  border-bottom: 4px solid #838393;
`;

const ModeBox = styled.div`
  display: inline-flex;
  padding: 1.2rem 3rem;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  background: #838393;

  color: #26262d;
  font-family: ${(props) => props.theme.font.title};
  font-size: 30px;
  font-style: normal;
  font-weight: 900;
  line-height: 24px; /* 100% */
  letter-spacing: -0.48px;
`;

const TitleBox = styled.div`
  color: #fff;
  font-family: ${(props) => props.theme.font.title};
  font-size: 60px;
  font-style: normal;
  font-weight: 900;
  line-height: 80px;
  letter-spacing: -0.8px;
  padding: 10px;
  width: 20rem;
`;

const DetailBox = styled.div`
  padding: 14px;
  font-family: ${(props) => props.theme.font.content};
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.48px;
  color: #838393;
`;

const MainFrame = styled.div`
  min-width: 988px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const MainContentBox = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 97px 0 103px;
`;

const RightFrame = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StartButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 200px;
  margin-bottom: 200px;
  margin-left: 20%;
`;

const HeaderSection = styled.div`
  padding-top: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  font-size: 20px;
  font-weight: 800;
`;

const People = styled.div`
  display: inline-flex;
  padding: 2rem 4rem;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
  border-radius: 50px;
  background: #6bd9a480;

  .countPeople {
    color: ${(props) => props.theme.color.MainKeyColor};
    font-family: ${(props) => props.theme.font.content};
    font-size: 50px;
    font-style: normal;
    font-weight: 900;
    line-height: 28px; /* 100% */
    letter-spacing: -0.56px;
  }
  .countReady {
    color: #fff;
    font-family: ${(props) => props.theme.font.content};
    font-size: 50px;
    font-style: normal;
    font-weight: 900;
    line-height: 28px; /* 100% */
    letter-spacing: -0.56px;
  }
`;

const ButtonStartLock = styled.button`
  transition: all 0.3s ease;
  font-weight: bolder;
  width: fit-content;
  text-align: center;

  color: #bebebe;
  font-size: 58px;
  font-style: normal;
  font-weight: 900;
  line-height: 58px;
  letter-spacing: -1.16px;
  margin-left: 1rem;
  cursor: default;
`;

const ButtonStart = styled.button`
  transition: all 0.3s ease;
  font-weight: bolder;
  width: fit-content;
  text-align: center;

  color: #fff;
  font-size: 58px;
  font-style: normal;
  font-weight: 900;
  line-height: 58px;
  letter-spacing: -1.16px;
  margin-left: 1rem;

  &:hover {
    text-shadow:
      0 0 5px #bebebe,
      0 0 10px #bebebe,
      0 0 15px #bebebe,
      0 0 20px #bebebe,
      0 0 35px #bebebe;
  }
`;

const ReadyBox = styled.div`
  transition: all 0.3s ease;
  font-weight: bolder;
  width: fit-content;
  text-align: center;

  color: #fff;
  font-size: 58px;
  font-style: normal;
  font-weight: 900;
  line-height: 58px;
  letter-spacing: -1.16px;
  margin-left: 1rem;

  &:hover {
    text-shadow:
      0 0 5px #bebebe,
      0 0 10px #bebebe,
      0 0 15px #bebebe,
      0 0 20px #bebebe,
      0 0 35px #bebebe;
  }
`;

const ButtonStartArrow = styled.div<{ ablestart: string }>`
  width: 250px;
  height: 17px;
  transform: sKewX(55deg);
  transition: all 0.3s ease;
  border-bottom: 3px solid ${(props) => (props.ablestart === 'true' ? '#6BD9A4' : '#eee')};
  border-right: 8px solid ${(props) => (props.ablestart === 'true' ? '#6BD9A4' : '#eee')};
`;

export default StudyRoom;
