import { useCallback, useState, useEffect } from 'react';
import { BsFillMicMuteFill, BsFillMicFill } from 'react-icons/bs';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';

import { postResult } from '@/apis/roomApi';
import { socket } from '@/apis/socketApi';
import Header from '@/components/Result/Header';
import Timer from '@/components/Result/Timer';
import useSocketConnect from '@/hooks/useSocketConnect';
import { UserInfo } from '@/types/room';

const CoopResult = () => {
  useSocketConnect();

  const location = useLocation();
  const { title } = location.state;

  const [userInfos, setUserInfos] = useState<UserInfo[]>();
  const [winTeam, setWinTeam] = useState<UserInfo[]>();
  const [loseTeam, setLoseTeam] = useState<UserInfo[]>();
  const [winner, setWinner] = useState<string>('');
  useEffect(() => {
    socket.emit('timer', { title });
    onResultPage();
  }, []);

  const onResultPage = async () => {
    const response = await postResult(title);

    setUserInfos(response.data.result.user_info);
    setWinner(response.data.winner);

    setWinTeam(
      userInfos?.filter(
        (user: UserInfo) =>
          user !== undefined &&
          user !== 'EMPTY' &&
          user !== 'LOCK' &&
          user.team === (winner === 'DRAW' ? 'BLUE' : winner),
      ),
    );
    setLoseTeam(
      userInfos?.filter(
        (user: UserInfo) =>
          user !== undefined &&
          user !== 'EMPTY' &&
          user !== 'LOCK' &&
          user.team !== (winner === 'DRAW' ? 'BLUE' : winner),
      ),
    );
  };

  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);

  const navigate = useNavigate();

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
    socket.emit('leave-room', { title: title }, () => {
      navigate('/lobby');
    });
  }, [navigate, title]);

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
          <WinnerSection>
            {winTeam && winTeam.map((_, index) => <div>{winTeam[index].nickname}</div>)}
            <WinnerTeam>{winner}</WinnerTeam>
            <WinnerTag>{winner === 'DRAW' ? 'BLUE/RED' : 'WINNER'}</WinnerTag>
          </WinnerSection>
          <div />
          <div />
          <LoserSection>
            {loseTeam && loseTeam.map((_, index) => <div>{loseTeam[index].nickname}</div>)}
            <LoserTeam>{winner === 'DRAW' ? '' : winner === 'BLUE' ? 'RED' : 'BLUE'}</LoserTeam>
          </LoserSection>
        </SolvedResult>
        <Review>
          <Timer seconds={15} />
        </Review>
      </MainFrame>
    </MainContainer>
  );
};

const Review = styled.div`
  position: absolute;

  top: 3rem;
  right: 2.5rem;
`;
const SolvedResult = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  margin-top: 3rem;

  width: 100%;
  justify-items: center;
  align-items: center;

  height: 80%;
`;
const WinnerTeam = styled.div`
  width: fit-content;
  height: 5rem;
  flex-direction: column;

  color: #4a455f;
  font-weight: 1000;
  font-size: 7rem;
  position: absolute;
  text-transform: uppercase;
  left: 7rem;
  top: -1.5rem;
`;
const WinnerTag = styled.div`
  width: fit-content;
  height: 6rem;
  color: #4a455f;
  font-weight: 1000;
  font-size: 7rem;
  position: absolute;
  right: 1rem;
  bottom: -0.1rem;
`;
const WinnerSection = styled.div`
  padding: 10rem;
  position: relative;
  display: flex;
  flex-direction: row;

  justify-content: center;
  transform: skewX(-45deg);

  height: 100%;
  width: 210%;
  background-color: rgba(255, 255, 255, 0.5);
  div {
    margin: 10px;
    transform: skewX(45deg);
  }
`;
const LoserTeam = styled.div`
  width: fit-content;
  height: 5rem;
  flex-direction: column;

  color: rgba(255, 255, 255, 0.4);
  font-weight: 1000;
  font-size: 7rem;
  position: absolute;
  text-transform: uppercase;
  left: 7rem;
  top: -1.5rem;
`;
const LoserSection = styled.div`
  transform: skewX(-45deg);

  height: 80%;
  width: 200%;
  background-color: rgba(146, 146, 146, 0.3);

  padding: 10rem 18rem 10rem 10rem;
  position: relative;
  display: flex;
  flex-direction: row;

  justify-content: center;

  div {
    margin: 10px;
    transform: skewX(45deg);
  }
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
const MainContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
export default CoopResult;
