import { useCallback, useEffect, useState } from 'react';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { ImExit } from 'react-icons/im';
import { LuSettings2 } from 'react-icons/lu';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { socket } from '@/apis/socketApi';
import Alert from '@/components/public/Alert';
import Badge from '@/components/Room/Badge';
import useSocketConnect from '@/hooks/useSocketConnect';
import { RoomStatus, UserInfo, BadgeStatus } from '@/types/room';

const CoopRoom = () => {
  useSocketConnect();

  const [isLeaveRoom, setIsLeaveRoom] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { title, member_count, max_members, user_info, nickname } = location.state;

  const [ableStart, setAbleStart] = useState<boolean>(false);

  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);

  const [roomName, setRoomName] = useState<string>(title);
  const [people, setPeople] = useState<number>(member_count);
  const [myIndex, setMyIndex] = useState<number>(0);
  const [ownerIndex, setOwnerIndex] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(max_members);
  const [userInfos, setUserInfos] = useState<(UserInfo | BadgeStatus)[]>(user_info);

  useEffect(() => {
    const roomHandler = (response: RoomStatus) => {
      const { title, member_count, max_members, user_info } = response;
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
      setAbleStart(member_count === countReady + 1 && countReady % 2 === 1);
      setMaxPeople(max_members);
      setUserInfos(user_info);
    };
    const bgm = document.getElementById('bgm');
    if (bgm instanceof HTMLAudioElement) {
      bgm.pause();
    }

    let countReady = 0;
    setRoomName(title);
    setPeople(member_count);
    user_info.forEach((user: UserInfo | BadgeStatus, index: number) => {
      if (user === undefined || user === 'LOCK' || user === 'EMPTY') return;
      if (user.nickname === nickname) {
        setMyIndex(index);
      }
      if (user.owner) {
        setOwnerIndex(index);
      }
    });
    setAbleStart(member_count === countReady + 1 && member_count % 2 === 0);
    setMaxPeople(max_members);
    setUserInfos(user_info);

    socket.on('room-status-changed', roomHandler);
    socket.on('start', (response) => {
      navigate('/coopgame', { state: { nickname: nickname, user_info, title: response.title } });
    });
    return () => {
      socket.off('start');
      socket.off('room-status-changed', roomHandler);
    };
  }, []);

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

  const onReady = () => {
    socket.emit('ready', { title: roomName });
  };

  const onGameRoom = () => {
    socket.emit('start', { title: roomName });
  };

  const leaveRoomTitle = '정말 나가시겠습니까?';
  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', { title: roomName }, () => {
      navigate('/lobby', { state: { nickname } });
    });
  }, [navigate, roomName]);
  return (
    <MainContainer>
      {isLeaveRoom && (
        <Alert
          title={leaveRoomTitle}
          handleCloseAlert={() => setIsLeaveRoom(false)}
          handleAlert={onLeaveRoom}
        />
      )}
      <MainFrame>
        <LeftSide>
          <HeaderLogo onClick={() => navigate('/lobby', { state: { nickname } })}>
            CODE LEARN
          </HeaderLogo>
          <RoomName>{title}</RoomName>

          <OptionSection>
            <button onClick={handleSpeaker}>
              {isSpeaker ? (
                <PiSpeakerSimpleHighFill size={'2rem'} />
              ) : (
                <PiSpeakerSimpleSlashFill size={'2rem'} />
              )}
            </button>
            <button onClick={handleMicrophone}>
              {isMicrophone ? <BsFillMicFill size={'2rem'} /> : <BsFillMicMuteFill size={'2rem'} />}
            </button>
          </OptionSection>
        </LeftSide>
        <MainSide>
          <TeamChangeButtons>
            <TeamButton team='blue'>BLUE</TeamButton>
            <TeamButton team='red'>RED</TeamButton>
          </TeamChangeButtons>
          <RedTeam />
          <BlueTeam />
          <Users>
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
          </Users>
        </MainSide>
        <RightSide>
          <RoomButtons>
            <button onClick={() => setIsLeaveRoom(true)}>
              <ImExit size={'2rem'} />
            </button>
            <button>
              <LuSettings2 size={'2rem'} />
            </button>
          </RoomButtons>
          <People>
            <label className='countReady'>{people}</label>
            <label className='countPeople'>/ {maxPeople}</label>
          </People>
          {myIndex === ownerIndex ? (
            ableStart ? (
              <ButtonState onClick={onGameRoom}>시작</ButtonState>
            ) : (
              <ButtonStartLock>시작</ButtonStartLock>
            )
          ) : (
            <ButtonState onClick={onReady}>준비</ButtonState>
          )}
        </RightSide>
      </MainFrame>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const MainFrame = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: space-between;

  min-width: 900px;

  border: 1px solid #fff;
  border-top: 0px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
`;
const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2rem;
  padding: 2rem;
  font-weight: 500;
  /* cursor: pointer; */
`;
const TeamChangeButtons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 4rem;
`;
const TeamButton = styled.button<{ team: string }>`
  transition: all 0.3s ease;

  background-color: rgba(0, 0, 0, 0.4);
  height: 3rem;
  transform: sKewX(-30deg);
  font-size: 30px;
  padding: 10px;
  &:hover {
    filter: drop-shadow(0px 2px 8px ${(props) => (props.team === 'red' ? '#ff8484' : '#8497ff')});
  }
`;
const Users = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 90%;
  width: 100%;
  flex-direction: column;
`;
const RedTeam = styled.div`
  background: radial-gradient(rgba(228, 100, 100, 0.8), rgba(255, 255, 255, 0) 70%);
  width: 50%;
  height: 100%;
  position: absolute;
  right: 0;
`;
const BlueTeam = styled.div`
  background: radial-gradient(rgba(106, 100, 228, 0.8), rgba(255, 255, 255, 0) 70%);
  width: 50%;
  height: 100%;
  position: absolute;
`;
const RoomName = styled.div`
  font-family: 'Black Han Sans', sans-serif;
  font-size: 2.5rem;
  padding: 2rem 1rem 1rem 1rem;
  margin: 0 1rem 0 1rem;
  border-bottom: 3px solid #fff;
  text-align: center;
  letter-spacing: 10px;
  font-style: italic;
  width: fit-content;
`;
const OptionSection = styled.div`
  height: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  button {
    transition: all 0.3s ease;
    padding: 1rem;
    width: fit-content;
    &:hover {
      filter: drop-shadow(0 0 10px #e0e0e0);
    }
  }
`;
const RoomButtons = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 0 0 4rem;
  button {
    transition: all 0.3s ease;
    margin: 2rem;
    width: fit-content;
    &:hover {
      filter: drop-shadow(0 0 10px #e0e0e0);
    }
  }
`;
const People = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Black Han Sans', sans-serif;
  font-size: 60px;
  text-shadow: #3f3d4d 5px 6px 3px;

  .countPeople {
    color: #789;
    padding: 0 0 0 1rem;
  }
  .countReady {
    padding: 3rem 0 0 0;
    font-size: 10rem;
  }
`;

const ButtonStartLock = styled.button`
  margin-left: 1rem;
  transition: all 0.3s ease;
  font-size: xx-large;
  font-weight: bolder;
  width: fit-content;
  text-align: center;
  height: 3rem;
  margin-bottom: 30%;
  padding: 0 1rem 0;
  color: #bebebe;
  border-left: 5px solid #bebebe;
  /* cursor: default; */
`;

const ButtonState = styled.button`
  margin-left: 1rem;
  transition: all 0.3s ease;
  font-size: xx-large;
  font-weight: bolder;
  width: fit-content;
  text-align: center;
  height: 3rem;
  margin-bottom: 30%;
  padding: 0 1rem 0;
  border-left: 5px solid #fff;
  &:hover {
    text-shadow:
      0 0 5px #bebebe,
      0 0 10px #bebebe,
      0 0 15px #bebebe,
      0 0 20px #bebebe,
      0 0 35px #bebebe;
  }
`;
const LeftSide = styled.div`
  height: 100%;
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  word-break: break-word;
`;
const MainSide = styled.div`
  position: relative;

  padding-top: 1rem;
  height: 100%;
  width: 60%;
  display: flex;
  flex-wrap: wrap;
`;
const RightSide = styled.div`
  height: 100%;
  width: 20%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
export default CoopRoom;
