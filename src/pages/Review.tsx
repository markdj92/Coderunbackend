//@ts-nocheck
import { useEffect, useState } from 'react';
import { BsFillMicMuteFill, BsFillMicFill } from 'react-icons/bs';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { postExecuteResult, postQuizInfo } from '@/apis/gameApi';
import { socket } from '@/apis/socketApi';
import EditorCodeMirror from '@/components/InGame/EditorCodeMirror';
import GameLiveBoard from '@/components/InGame/GameLiveBoard';
import GameNavbar from '@/components/InGame/GameNavbar';
import QuizFrame from '@/components/InGame/QuizFrame';
import QuizHeader from '@/components/InGame/QuizHeader';
import ReviewBottom from '@/components/InGame/ReviewBottom';
import RunFrame from '@/components/InGame/RunFrame';
import { useToast } from '@/components/public/Toast';
import useSocketConnect from '@/hooks/useSocketConnect';
import { ExecuteResult, QuizInfo } from '@/types/inGame';
import { UserInfo } from '@/types/room';

const Review = () => {
  useSocketConnect();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    title,
    nickname,
    reviewer,
    problems,
    user_info,
  }: {
    title: string;
    nickname: string;
    problems: QuizInfo[];
    reviewer: string;
    user_info: UserInfo[];
  } = location.state;

  const [userInGame, setUserInGame] = useState<UserInfo[]>(user_info);
  const [viewer, setViewer] = useState<string>(`ROOMNAME${title}${reviewer}`);
  const [isReviewer, setIsReviewer] = useState<boolean>(reviewer === nickname);

  const [provider, setProvider] = useState<WebsocketProvider | undefined>(undefined);
  const [ytext, setYtext] = useState<Y.Text>('');

  const [selectedQuiz, setSelectedQuiz] = useState<number>(0);
  const [quizList, setQuizList] = useState<QuizInfo[]>(problems);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<ExecuteResult>({
    memory: '0',
    cpuTime: '0',
    output: '',
  });

  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);

  // const notifySuccessMessage = (message: string) =>
  //   toast.success({
  //     position: 'topCenter',
  //     message,
  //   });

  const notifyErrorMessage = (message: string) =>
    toast.error({
      position: 'topCenter',
      message,
    });

  const notifyInfoMessage = (message: string, duration = 3000) =>
    toast.info({
      position: 'topCenter',
      message,
      duration,
    });

  const handleProvider = (pro: WebsocketProvider) => {
    setProvider(pro);
  };

  const executeCode = async () => {
    const code = ytext.toString();

    if (code === '') return notifyErrorMessage('코드를 작성해주세요.');
    const executeData = {
      title: title,
      problemNumber: quizList[selectedQuiz].number,
      script: code,
      language: 'python3',
      versionIndex: '0',
    };
    const response = await postExecuteResult(executeData);
    const { data } = response;
    setIsSuccess(data.success);
    setRunResult(data.payload.result);
  };

  const handleDoneReviewer = () => {
    socket.emit('reviewPass', { title: title });
  };

  const handleReviewMode = (response) => {
    setUserInGame(response.user_info);
    setIsReviewer(response.reviewer === nickname);
    setViewer(`ROOMNAME${title}${response.reviewer}`);

    if (response.reviewer === nickname) {
      notifyInfoMessage('당신은 리뷰어입니다.');
    } else {
      notifyInfoMessage(`${response.reviewer}님이 리뷰어가 되었습니다.`);
    }
  };

  const getQuizList = async () => {
    return await postQuizInfo(title);
  };

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };
  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

  const goToRoom = (response) => {
    navigate(`/room/${title}`, {
      state: { ...response.roomInfo, nickname },
    });
  };

  useEffect(() => {
    getQuizList()
      .then((response) => {
        if (response.data === null) {
          alert('퀴즈 정보를 불러오는데 실패했습니다.');
          return;
        }
        setQuizList(response.data);
      })
      .catch((err) => {
        console.error(err);
      });

    socket.on('reviewFinished', goToRoom);
    socket.on('room-status-changed', handleReviewMode);

    return () => {
      socket.off('reviewFinished');
      socket.off('room-status-changed');
    };
  }, []);

  if (quizList.length <= 0) return <></>;
  return (
    <Container>
      <GameNavbar />
      <MainFrame>
        <GameLiveBoard userInGame={userInGame} />
        <GameFrame>
          <OptionSection>
            <QuizListGroup>
              {quizList.map((quiz, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedQuiz(index);
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </QuizListGroup>
            <MediaGroupButton>
              <button onClick={handleSpeaker}>
                {isSpeaker ? (
                  <PiSpeakerSimpleHighFill size={'2rem'} />
                ) : (
                  <PiSpeakerSimpleSlashFill size={'2rem'} />
                )}
              </button>
              <button onClick={handleMicrophone}>
                {isMicrophone ? (
                  <BsFillMicFill size={'2rem'} />
                ) : (
                  <BsFillMicMuteFill size={'2rem'} />
                )}
              </button>
            </MediaGroupButton>
          </OptionSection>
          <MainSection>
            <QuizSection>
              <QuizHeader roomName={title} title={quizList[selectedQuiz]?.title} />
              <QuizMain>
                <QuizLeft>
                  <QuizFrame quizInfo={quizList[selectedQuiz]} />
                </QuizLeft>
                <QuizRight>
                  <EditorFrame>
                    <EditorCodeMirror
                      provider={provider}
                      viewer={viewer}
                      nickname={nickname}
                      ytext={ytext}
                      setYtext={setYtext}
                      handleProvider={handleProvider}
                      ableToEdit={!isReviewer}
                    />
                  </EditorFrame>
                  <RunFrame isSuccess={isSuccess} runResult={runResult} />
                </QuizRight>
              </QuizMain>
            </QuizSection>
          </MainSection>
        </GameFrame>
        {isReviewer && <ReviewBottom handleRun={executeCode} handleSubmit={handleDoneReviewer} />}
      </MainFrame>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  margin: 0;
  background-color: #263747;
  overflow: hidden;
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #36495d;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: 172334;
  }
`;

const MainFrame = styled.div`
  display: flex;
  height: calc(100vh - 3.5rem);
  flex-direction: column;
  justify-content: space-between;
`;

const GameFrame = styled.div`
  display: flex;
  height: 100%;
`;

const QuizListGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    font-size: 20px;
    font-weight: 700;
    border: white 3px solid;
    border-radius: 50%;
  }
`;

const OptionSection = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: inset -0.0625rem 0 #172334;
  button {
    padding: 0.5rem;
  }
`;

const MediaGroupButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const MainSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const QuizSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const QuizMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const QuizLeft = styled.div`
  width: 50%;
  height: 100%;
  overflow-y: scroll;
  box-shadow: inset -0.0625rem 0 #172334;
  padding-bottom: 2.5rem;
`;

const QuizRight = styled.div`
  position: relative;
  width: 100%;
`;

const EditorFrame = styled.div`
  position: absolute;
  width: 100%;
  height: 70%;
  overflow-y: scroll;
  .cm-lineNumbers {
    width: 2rem;
  }
`;

export default Review;
