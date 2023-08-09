import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';

import { TITLE_COMMENT } from '@/constants';

import { postResult } from '@/apis/roomApi';
import { socket } from '@/apis/socketApi';
import Alert from '@/components/public/Alert';
import TimerBar from '@/components/public/TimerBar';
import ResultFrame from '@/components/Result/ResultFrame';
import User from '@/components/Result/User';
import ToolButtonBox from '@/components/Room/ToolButtonBox';
import useSocketConnect from '@/hooks/useSocketConnect';
import { BadgeStatus, UserInfo } from '@/types/room';

const CoopResult = () => {
  useSocketConnect();
  const location = useLocation();
  const navigate = useNavigate();
  const { title, nickname } = location.state;

  const [isLeaveRoom, setIsLeaveRoom] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);

  const [roomName, setRoomName] = useState('');
  const [roomLevel, setRoomLevel] = useState<number>(0);

  const [winTeam, setWinTeam] = useState<UserInfo[]>();
  const [loseTeam, setLoseTeam] = useState<UserInfo[]>();
  const [winner, setWinner] = useState<string>('');

  const [seconds, setSeconds] = useState<number>(0);

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', { title: roomName }, () => {
      navigate('/lobby', { state: { nickname } });
    });
  }, [navigate, roomName]);

  const onResultPage = async () => {
    try {
      const response = await postResult(title);
      const { winner } = response.data;
      const { user_info } = response.data.result;

      setRoomName(response.data.result.title);
      setRoomLevel(response.data.result.level);
      setWinner(winner);

      setWinTeam(
        user_info?.filter(
          (user: UserInfo | BadgeStatus) =>
            user !== undefined &&
            user !== 'EMPTY' &&
            user !== 'LOCK' &&
            user.team === (winner === 'DRAW' ? 'BLUE' : winner),
        ),
      );
      setLoseTeam(
        user_info?.filter(
          (user: UserInfo | BadgeStatus) =>
            user !== undefined &&
            user !== 'EMPTY' &&
            user !== 'LOCK' &&
            user.team !== (winner === 'DRAW' ? 'BLUE' : winner),
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.emit('timer', { title });
    onResultPage();
  }, []);

  useEffect(() => {
    socket.on('timer', (response) => {
      setSeconds(response);
    });

    socket.on('timeout', (response) => {
      if (response.success) {
        navigate(`/cooproom/${title}`, {
          state: { ...response.roomInfo, nickname },
        });
      } else {
        navigate('/lobby', { state: { nickname } });
      }
    });
    return () => {
      socket.off('room-status-changed');
      socket.off('timer');
      socket.off('timeout');
    };
  }, []);

  return (
    <MainContainer>
      {isLeaveRoom && (
        <Alert
          title={TITLE_COMMENT.leave}
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
          <DetailBox>Lv.{roomLevel}</DetailBox>
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
          <TimerBox>
            <TimerBar seconds={seconds} />
          </TimerBox>
          <UserListSection height={winner === 'DRAW' ? '350' : '450'}>
            <ResultFrame
              title={winner === 'DRAW' ? `DRAW` : `SOLVED ${winner === 'RED' ? 'RED' : 'BLUE'}`}
              color={winner === 'DRAW' ? '#fcff5c' : winner === 'RED' ? '#FF5C5C' : '#39A0FF'}
            >
              {winTeam &&
                winTeam.map((_, index) => (
                  <User
                    key={index}
                    user={winTeam[index]}
                    widthSize={winner === 'DRAW' ? 180 : 250}
                  />
                ))}
            </ResultFrame>
          </UserListSection>
          <UserListSection height={'350'}>
            <ResultFrame
              title={winner === 'DRAW' ? `DRAW` : `LOSE TEAM. ${winner === 'RED' ? 'BLUE' : 'RED'}`}
              color={winner === 'DRAW' ? '#fcff5c' : winner === 'RED' ? '#39A0FF' : '#FF5C5C'}
              isFilter={winner !== 'DRAW'}
              isBlur={winner === 'DRAW'}
            >
              {loseTeam && loseTeam.map((_, index) => <User key={index} user={loseTeam[index]} />)}
            </ResultFrame>
          </UserListSection>
        </MainContentBox>
      </MainFrame>
      <RightFrame>
        <HeaderSection></HeaderSection>
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

const UserListSection = styled.div<{ height: string }>`
  width: 100%;
  height: ${(props) => props.height};
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const TimerBox = styled.div`
  width: 100%;
  height: 100px;
  flex-shrink: 0;
`;

const RightFrame = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export default CoopResult;
