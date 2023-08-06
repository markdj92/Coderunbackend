import { useCallback, useState, useEffect } from 'react';
import { BsFillMicMuteFill, BsFillMicFill } from 'react-icons/bs';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';

import { postResult } from '@/apis/roomApi';
import { socket } from '@/apis/socketApi';
import Header from '@/components/Result/Header';
import Timer from '@/components/Result/Timer';
import User from '@/components/Result/User';
import useSocketConnect from '@/hooks/useSocketConnect';
import { BadgeStatus, RoomStatus, UserInfo } from '@/types/room';

const Result = () => {
  useSocketConnect();
  const location = useLocation();
  const navigate = useNavigate();
  const { title, nickname } = location.state;

  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);

  const [roomName, setRoomName] = useState('');
  const [userInfos, setUserInfos] = useState<UserInfo[]>();
  const [solvedUsers, setSolvedUsers] = useState<UserInfo[]>();
  const [unsolvedUsers, setUnsolvedUsers] = useState<UserInfo[]>();

  const [review, setReview] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    socket.emit('timer', { title });
    onResultPage();
  }, []);

  const onResultPage = useCallback(async () => {
    try {
      const response = await postResult(title);

      setRoomName(response.data.title);
      setUserInfos(response.data.user_info);
    } catch (error) {
      console.error(error);
    }
  }, [userInfos]);

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
            state: { ...response.roomInfo, nickname, reviewer: response.reviewer },
          });
        } else {
          navigate(`/room/${title}`, { state: { ...response.roomInfo, nickname } });
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

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };
  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

  const handleLeaveRoom = () => {
    const answer = confirm('정말 나가시겠습니까?');
    if (answer) {
      onLeaveRoom();
    }
  };

  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', { title: roomName }, () => {
      navigate('/lobby');
    });
  }, [navigate, roomName]);

  const onReview = () => {
    socket.emit('reviewUser', { title: roomName });
    setReview(!review);
  };

  return (
    <MainContainer>
      <Header onLeaveRoom={handleLeaveRoom} />
      <MainFrame>
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
        <SolvedResult>
          <SolvedSection>
            {solvedUsers &&
              solvedUsers.map((_, index) => <User key={index} user={solvedUsers[index]} />)}
          </SolvedSection>
          <UnSolvedSection>
            {unsolvedUsers &&
              unsolvedUsers.map((_, index) => <User key={index} user={unsolvedUsers[index]} />)}
          </UnSolvedSection>
        </SolvedResult>
        <Review>
          <Timer seconds={seconds} />
          <ReviewButton onClick={onReview} status={review ? 'true' : 'false'}>
            review
          </ReviewButton>
        </Review>
      </MainFrame>
    </MainContainer>
  );
};
const ReviewButton = styled.div<{ status: string }>`
  border: ${(props) => (props.status === 'false' ? '3px solid #eee' : '3px solid #ababab')};
  color: ${(props) => (props.status === 'false' ? '#eee' : '#ababab')};
  text-align: center;
  padding: 2px;
  width: fit-content;
  margin: 10px;
`;
const SolvedResult = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const UnSolvedSection = styled.div`
  height: 30%;
  width: 100%;
`;
const SolvedSection = styled.div`
  box-shadow: 0 8px 32px 0 #898ecd;
  height: 60%;
  width: 100%;
  background: linear-gradient(to top, rgba(210, 210, 210, 0.8) 2%, rgba(255, 255, 255, 0) 100%);
`;
const Review = styled.div`
  width: 20%;
  height: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;
const OptionSection = styled.div`
  width: 15%;
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
  height: 80%;
  display: flex;
  flex-direction: row;

  justify-content: space-between;

  border: 1px solid #fff;
  border-top: 0px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  min-width: 900px;

  overflow: auto;
`;
export default Result;
