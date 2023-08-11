import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { TITLE_COMMENT } from '@/constants';

import { postResult } from '@/apis/roomApi';
import { socket, webRtcSocketIo } from '@/apis/socketApi';
import Alert from '@/components/public/Alert';
import TimerBar from '@/components/public/TimerBar';
import ToggleButton from '@/components/public/ToggleButton';
import ResultFrame from '@/components/Result/ResultFrame';
import User from '@/components/Result/User';
import ToolButtonBox from '@/components/Room/ToolButtonBox';
import useSocketConnect from '@/hooks/useSocketConnect';
import { BadgeStatus, RoomStatus, UserInfo } from '@/types/room';

const StudyResult = () => {
  useSocketConnect();
  const location = useLocation();
  const navigate = useNavigate();
  const { title, nickname } = location.state;

  const [isLeaveRoom, setIsLeaveRoom] = useState(false);

  const [roomName, setRoomName] = useState(title);
  const [roomLevel, setRoomLevel] = useState<number>(0);
  const [userInfos, setUserInfos] = useState<UserInfo[]>();
  const [solvedUsers, setSolvedUsers] = useState<UserInfo[]>();
  const [unsolvedUsers, setUnsolvedUsers] = useState<UserInfo[]>();

  const [review, setReview] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  const onResultPage = useCallback(async () => {
    try {
      const response = await postResult(title);
      setRoomLevel(response.data.result.level);
      setRoomName(response.data.result.title);
      setUserInfos(response.data.result.user_info);
    } catch (error) {
      console.error(error);
    }
  }, [userInfos]);

  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', { title: roomName }, () => {
      webRtcSocketIo.emit('leaveRoom', { title }, () => {
        navigate('/lobby', { state: { nickname } });
      });
    });
  }, [navigate, roomName]);

  const onReview = (isReview: boolean) => {
    socket.emit('reviewUser', { title: roomName, review: isReview });
    setReview(isReview);
  };

  useEffect(() => {
    socket.emit('timer', { title });
    onResultPage();
  }, []);

  useEffect(() => {
    const resultHandler = (response: RoomStatus) => {
      const { title, user_info } = response;
      setUserInfos(user_info);
      setRoomName(title);

      setSolvedUsers(
        user_info.filter(
          (user: UserInfo | BadgeStatus) =>
            user !== undefined && user !== 'EMPTY' && user !== 'LOCK' && user.solved,
        ),
      );
      setUnsolvedUsers(
        user_info.filter(
          (user: UserInfo | BadgeStatus) =>
            user !== undefined && user !== 'EMPTY' && user !== 'LOCK' && !user.solved,
        ),
      );
    };

    setSolvedUsers(
      userInfos &&
        userInfos.filter(
          (user: UserInfo | BadgeStatus) =>
            user !== undefined && user !== 'EMPTY' && user !== 'LOCK' && user.solved,
        ),
    );
    setUnsolvedUsers(
      userInfos &&
        userInfos.filter(
          (user: UserInfo | BadgeStatus) =>
            user !== undefined && user !== 'EMPTY' && user !== 'LOCK' && !user.solved,
        ),
    );
    let reviewMembers = 0;

    userInfos &&
      userInfos.forEach((user: UserInfo | BadgeStatus) => {
        if (user === 'EMPTY' || user === 'LOCK') return;
        if (user.review) return (reviewMembers += 1);
      });

    socket.on('room-status-changed', resultHandler);
    socket.on('timer', (response) => {
      setSeconds(response);
    });

    socket.on('timeout', (response) => {
      if (response.success) {
        if (response.review) {
          navigate('/review', {
            state: {
              ...response.roomInfo,
              problems: response.problems,
              reviewer: response.reviewer,
              nickname,
            },
          });
        } else {
          navigate(`/room/${title}`, {
            state: { ...response.roomInfo, nickname },
          });
        }
      } else {
        navigate('/lobby', { state: { nickname } });
      }
    });
    return () => {
      socket.off('room-status-changed');
      socket.off('timer');
      socket.off('timeout');
    };
  }, [userInfos]);

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
        <ToolButtonBox handleLeaveRoom={() => setIsLeaveRoom(true)} />
      </LeftFrame>
      <MainFrame>
        <MainContentBox>
          <TimerBox>
            <TimerBar seconds={seconds} />
          </TimerBox>
          <SolvedSection>
            <ResultFrame title={`SOLVED ${solvedUsers ? solvedUsers.length : ''}`} color='#6bd9a4'>
              {solvedUsers &&
                solvedUsers.map((_, index) => (
                  <User key={index} user={solvedUsers[index]} widthSize={250} />
                ))}
            </ResultFrame>
          </SolvedSection>
          <UnSolvedSection>
            <ResultFrame
              title={`Cheer Up ${unsolvedUsers ? unsolvedUsers.length : ''}`}
              color='#838393'
              isFilter={true}
            >
              {unsolvedUsers &&
                unsolvedUsers.map((_, index) => <User key={index} user={unsolvedUsers[index]} />)}
            </ResultFrame>
          </UnSolvedSection>
          <ResultButtonSection>
            <ToggleButton title={'관전하기'} onClick={() => onReview(false)} isSelected={!review} />
            <ToggleButton title={'리뷰하기'} onClick={() => onReview(true)} isSelected={review} />
          </ResultButtonSection>
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

const SolvedSection = styled.div`
  width: 100%;
  height: 450px;
`;

const UnSolvedSection = styled.div`
  width: 100%;
  height: 350px;
`;

const ResultButtonSection = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 30px;
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

export default StudyResult;
