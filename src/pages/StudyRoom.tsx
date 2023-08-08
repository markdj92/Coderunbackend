import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { socket } from '@/apis/socketApi';
import Alert from '@/components/public/Alert';
import Badge from '@/components/Room/Badge';
import IconButton from '@/components/Room/IconButton';
import useSocketConnect from '@/hooks/useSocketConnect';
import { BadgeStatus, RoomStatus, UserInfo } from '@/types/room';

import MicIcon from '/icon/room/mic.svg';
import SpeakerIcon from '/icon/room/speaker.svg';
import SettingIcon from '/icon/room/setting.svg';
import RoomOutIcon from '/icon/room/logout.svg';
import MicActiveIcon from '/icon/room/mic_active.svg';
import SpeakerActiveIcon from '/icon/room/speaker_active.svg';
import SettingActiveIcon from '/icon/room/setting_active.svg';
import RoomOutActiveIcon from '/icon/room/logout_active.svg';
import MicMuteIcon from '/icon/room/micMute.svg';
import SpeakerMuteIcon from '/icon/room/speakerMute.svg';
import MicMuteActiveIcon from '/icon/room/micMute_active.svg';
import SpeakerMuteActiveIcon from '/icon/room/speakerMute_active.svg';

const StudyRoom = () => {
  useSocketConnect();
  const location = useLocation();
  const { title, member_count, max_members, user_info, nickname } = location.state;

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

    let countReady = 0;
    setRoomName(title);
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
          <HeaderLogo onClick={() => window.location.reload()} />
        </HeaderSection>
        <RoomInfoSection>
          <ModeBox>STUDY MODE.</ModeBox>
          <TitleBox>{title}</TitleBox>
          <DetailBox>Lv.4</DetailBox>
        </RoomInfoSection>
        <IconButtonsBox>
          {isMicrophone ? (
            <IconButton
              icon={MicIcon}
              hoverIcon={MicActiveIcon}
              alt='mic'
              onClick={handleMicrophone}
            />
          ) : (
            <IconButton
              icon={MicMuteIcon}
              hoverIcon={MicMuteActiveIcon}
              alt='mic'
              onClick={handleMicrophone}
            />
          )}
          {isSpeaker ? (
            <IconButton
              icon={SpeakerIcon}
              hoverIcon={SpeakerActiveIcon}
              alt='speaker'
              onClick={handleSpeaker}
            />
          ) : (
            <IconButton
              icon={SpeakerMuteIcon}
              hoverIcon={SpeakerMuteActiveIcon}
              alt='speaker'
              onClick={handleSpeaker}
            />
          )}
          <IconButton icon={SettingIcon} hoverIcon={SettingActiveIcon} alt='setting' />
          <IconButton
            icon={RoomOutIcon}
            hoverIcon={RoomOutActiveIcon}
            alt='roomOut'
            onClick={() => setIsLeaveRoom(true)}
          />
        </IconButtonsBox>
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

const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2.5rem;
  font-weight: 500;
  margin-top: 25px;
  margin-left: 80px;
  /* cursor: pointer; */
  font-family: 'Noto Sans KR', sans-serif;
  color: #8883ff;
  background: url('/images/LogoGray.svg') no-repeat;
  background-size: contain;
  width: 100%;
  height: 80px;
  margin-right: 50px;
  &:hover {
    background: url('/images/LogoActive.svg') no-repeat;
    background-size: contain;
  }
`;

const MainContainer = styled.div`
  background: url('/background_lobby.png');
  background-blend-mode: luminosity;
  background-size: contain;
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

const IconButtonsBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 5rem;
  left: 5rem;
  gap: 24px;
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
