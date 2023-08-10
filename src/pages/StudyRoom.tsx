//@ts-nocheck
import { useCallback, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { socket } from '@/apis/socketApi';
import { webRtcSocketIo } from '@/apis/socketApi';
import Alert from '@/components/public/Alert';
import { HeaderLogo } from '@/components/public/HeaderLogo';
import Badge from '@/components/Room/Badge';
import ToolButtonBox from '@/components/Room/ToolButtonBox';
import useSocketConnect from '@/hooks/useSocketConnect';
import useVoice from '@/hooks/useVoice';
import { BadgeStatus, RoomStatus, UserInfo } from '@/types/room';

interface PeerInfo {
  peerConnection: RTCPeerConnection;
}

const StudyRoom = () => {
  useSocketConnect();
  const { localVideoRef, localStream } = useVoice();

  const location = useLocation();
  const { title, member_count, max_members, user_info, nickname, level } = location.state;

  const [isLeaveRoom, setIsLeaveRoom] = useState(false);
  const [ableStart, setAbleStart] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);
  const [roomName, setRoomName] = useState<string>(title);
  const [people, setPeople] = useState<number>(member_count);
  const [myIndex, setMyIndex] = useState<number>(0);
  const [ownerIndex, setOwnerIndex] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(max_members);
  const [userInfos, setUserInfos] = useState<(UserInfo | BadgeStatus)[]>(user_info);
  const [roomlevel, setRoomLevel] = useState<number>(1);

  const peerControl = useRef<{ [key: string]: PeerInfo }>({});
  const shareRef = useRef(false);
  const peerInfo = peerControl.current;

  useEffect(() => {
    const share = async () => {
      if (!shareRef.current) {
        webRtcSocketIo.emit('join', title);
        shareRef.current = true;
      }
    };

    const makePeerConnect = async (userId: string) => {
      peerInfo[userId] = {
        peerConnection: new RTCPeerConnection({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302',
            },
          ],
        }),
      };
      peerInfo[userId].peerConnection.addEventListener('icecandidate', icecandidate);
      peerInfo[userId].peerConnection.addEventListener('addstream', addStream);

      for (let track of localStream.getTracks()) {
        await peerInfo[userId].peerConnection.addTrack(track, localStream);
      }
    };

    // 연결 후보 교환
    const icecandidate = async (data) => {
      try {
        if (data.candidate) {
          webRtcSocketIo.emit('icecandidate', {
            candidate: data.candidate,
            title,
          });
        }
      } catch (error) {
        console.error('send candidate error : ', error);
      }
    };

    // 상대 영상 & 비디오 추가
    const addStream = (data) => {
      let videoArea = document.createElement('video');
      videoArea.autoplay = true;
      videoArea.srcObject = data.stream;
      let container = document.getElementById('root');
      if (container) {
        container.appendChild(videoArea);
      } else {
        console.error('Container element not found.');
      }
    };

    // RTC socket

    // 타 유저 보이스 채널 입장 확인
    const handleEnter = async ({ userId }) => {
      try {
        if (peerInfo[userId] === undefined) {
          await makePeerConnect(userId);
          console.error(peerInfo[userId].peerConnection.connectionState);
          const offer = await peerInfo[userId].peerConnection.createOffer();
          await peerInfo[userId].peerConnection.setLocalDescription(offer);
          webRtcSocketIo.emit('offer', { offer, title });
        }
      } catch (error) {
        console.error('send offer error : ', error);
      }
    };

    // 기존 유저로부터 보이스 연결 수신을 받음
    const handleOffer = async ({ userId, offer }) => {
      try {
        if (peerInfo[userId] === undefined) {
          await makePeerConnect(userId);
          await peerInfo[userId].peerConnection.setRemoteDescription(offer);

          const answer = await peerInfo[userId].peerConnection.createAnswer(offer);

          await peerInfo[userId].peerConnection.setLocalDescription(answer);
          webRtcSocketIo.emit('answer', {
            answer,
            toUserId: userId,
            title,
          });
        }
      } catch (error) {
        console.error('receive offer and send answer error : ', error);
      }
    };

    // 신규 유저로부터 응답을 받음
    const handleAnswer = async ({ userId, answer, toUserId }) => {
      try {
        if (peerInfo[toUserId] === undefined) {
          await peerInfo[userId].peerConnection.setRemoteDescription(answer);
        }
      } catch (error) {
        console.error('receive and set answer error : ', error);
      }
    };

    // 연결 후보를 수신 받음
    const handleIceCandidate = async ({ userId, candidate }) => {
      try {
        // if (selectedCandidate[candidate.candidate] === undefined) {
        //     selectedCandidate[candidate.candidate] = true;
        await peerInfo[userId].peerConnection.addIceCandidate(candidate);
        // };
      } catch (error) {
        console.error('set candidate error : ', error);
      }
    };

    // 연결 해제 - 타인
    const handleSomeoneLeaveRoom = async ({ userId }) => {
      if (peerInfo[userId]) {
        peerInfo[userId].peerConnection.close();
        delete peerInfo[userId];
      }
    };

    // 연결 해제 - 본인
    const handleYouLeaveRoom = async ({ userId }) => {
      for (let user in peerInfo) {
        console.error(user);
        peerInfo[userId].peerConnection.close();
        delete peerInfo[userId];
      }
      webRtcSocketIo.emit('exit', title);
    };

    webRtcSocketIo.on('enter', handleEnter);
    webRtcSocketIo.on('offer', handleOffer);
    webRtcSocketIo.on('answer', handleAnswer);
    webRtcSocketIo.on('icecandidate', handleIceCandidate);
    webRtcSocketIo.on('someoneLeaveRoom', handleSomeoneLeaveRoom);
    webRtcSocketIo.on('youLeaveRoom', handleYouLeaveRoom);

    share();

    return () => {
      webRtcSocketIo.emit('leaveRoom', title);
      webRtcSocketIo.off('enter', handleEnter);
      webRtcSocketIo.off('offer', handleOffer);
      webRtcSocketIo.off('answer', handleAnswer);
      webRtcSocketIo.off('icecandidate', handleIceCandidate);
      webRtcSocketIo.off('someoneLeaveRoom', handleSomeoneLeaveRoom);
      webRtcSocketIo.off('youLeaveRoom', handleYouLeaveRoom);
    };
  }, []);

  const navigate = useNavigate();

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

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
    const bgm = document.getElementById('bgm');
    if (bgm instanceof HTMLAudioElement) {
      bgm.pause();
    }
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
          navigate('/lobby', { state: { nickname, kicked: true } });
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
      navigate('/lobby', { state: { nickname } });
    });
  }, [navigate, roomName]);

  const onReady = () => {
    socket.emit('ready', { title: roomName });
  };

  const onGameRoom = () => {
    socket.emit('start', { title: roomName });
  };

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
          <DetailBox>Lv.{roomlevel}</DetailBox>
        </RoomInfoSection>
        <ToolButtonBox
          isSpeaker={isSpeaker}
          isMicrophone={isMicrophone}
          handleSpeaker={handleSpeaker}
          handleMicrophone={handleMicrophone}
          handleLeaveRoom={() => setIsLeaveRoom(true)}
        />
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

      <video style={{ display: 'none' }} autoPlay ref={localVideoRef}></video>
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
