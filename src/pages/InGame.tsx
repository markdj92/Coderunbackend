//@ts-nocheck
import { useEffect, useState } from 'react';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { UserInfo, BadgeStatus } from '../types/room';

import { postExecuteResult, postQuizInfo } from '@/apis/gameApi';
import { socket } from '@/apis/socketApi';
import EditorCodeMirror from '@/components/InGame/EditorCodeMirror';
import GameBottom from '@/components/InGame/GameBottom';
import GameLiveBoard from '@/components/InGame/GameLiveBoard';
import GameNavbar from '@/components/InGame/GameNavbar';
import QuizFrame from '@/components/InGame/QuizFrame';
import QuizHeader from '@/components/InGame/QuizHeader';
import RunFrame from '@/components/InGame/RunFrame';
import Alert from '@/components/public/Alert';
import { useToast } from '@/components/public/Toast';
import { ExecuteResult, QuizInfo } from '@/types/inGame';

const InGame = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { title, nickname }: { title: string; nickname: string } = location.state;
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertContent, setAlertContent] = useState<string>('');
  const [alertHandle, setAlertHandle] = useState<() => void>(() => {});
  const [viewer, setViewer] = useState<string>(`ROOMNAME${title}${nickname}`);
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(undefined);
  const [ytext, setYtext] = useState<Y.Text>('');

  const [userInGame, setUserInGame] = useState<string[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<number>(0);
  const [quizList, setQuizList] = useState<QuizInfo[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<ExecuteResult>({
    memory: '0',
    cpuTime: '0',
    output: '',
  });
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);

  const handleProvider = (pro: WebsocketProvider) => {
    setProvider(pro);
  };

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

  const notifySuccessMessage = (message: string) =>
    toast.success({
      position: 'topCenter',
      message,
    });

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

  const getQuizList = async () => {
    return await postQuizInfo(title);
  };

  const handleGetUserInGame = async (response) => {
    if (response.success) {
      const {
        result,
        quiz_result,
        user_info,
      }: { result: ExecuteResult; user_info: UserInfo | BadgeStatus; quiz_result: boolean } =
        response.payload;
      const { memory, cpuTime, output } = result;
      setIsSuccess(quiz_result);
      setRunResult({ memory, cpuTime, output });
      setUserInGame(user_info);
      setIsSubmit(true);
      notifySuccessMessage('제출에 성공했습니다.');
      socket.on('room-status-changed', (response) => {
        setUserInGame(response.payload.user_info);
      });
    } else if (response.payload.message) {
      alert(response.payload.message);
    } else {
      notifyErrorMessage('제출에 실패했습니다.');
    }
  };

  const submitCode = () => {
    const code = ytext.toString();

    const executeData = {
      title: title,
      problemNumber: quizList[selectedQuiz].number,
      script: code,
      language: 'python3',
      versionIndex: '0',
    };
    socket.emit('submitCode', { ...executeData }, handleGetUserInGame);
    setIsAlert(false);
  };

  const handleSubmit = () => {
    setAlertHandle(() => submitCode);
    setAlertTitle('제출하시겠습니까?');
    setAlertContent('');
    setIsAlert(true);
  };

  const handleSetViewer = (viewer: string) => {
    setViewer(`ROOMNAME${title}${viewer}`);
  };

  const handleFinishGame = () => {
    setTimeout(goToResult, 10000);
    notifyInfoMessage('10초 뒤 결과 페이지로 이동합니다.', 10000);
  };

  const goToResult = () => {
    navigate('/result', { state: { title, nickname } });
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

    socket.on('finishedGame', () => handleFinishGame());

    return () => {
      socket.off('finishedGame');
      socket.off('room-status-changed');
    };
  }, []);

  if (quizList.length <= 0) return <></>;
  return (
    <Container>
      {isAlert && (
        <AlertFrame>
          <Alert
            title={alertTitle}
            handleCloseAlert={() => setIsAlert(false)}
            handleAlert={alertHandle}
            backDropOpacity={0}
          >
            {alertContent}
          </Alert>
        </AlertFrame>
      )}
      <GameNavbar />
      <MainFrame>
        {isSubmit && <GameLiveBoard userInGame={userInGame} handleSetViewer={handleSetViewer} />}
        <GameFrame>
          <OptionSection>
            <QuizListGroup>
              {quizList.map((quiz, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedQuiz(index);
                    setIsSubmit(false);
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
              <QuizHeader
                roomName={title}
                title={quizList[selectedQuiz]?.title}
                timer={{ mm: 20, ss: 22 }}
              />
              <QuizMain>
                <QuizLeft>
                  <QuizFrame quizInfo={quizList[selectedQuiz]} />
                </QuizLeft>
                <QuizRight>
                  <EditorFrame>
                    <EditorCodeMirror
                      provider={provider}
                      ableToEdit={isSubmit}
                      viewer={viewer}
                      nickname={nickname}
                      ytext={ytext}
                      setYtext={setYtext}
                      handleProvider={handleProvider}
                    />
                  </EditorFrame>
                  <RunFrame isSuccess={isSuccess} runResult={runResult} />
                </QuizRight>
              </QuizMain>
            </QuizSection>
          </MainSection>
        </GameFrame>
        {!isSubmit && <GameBottom handleRun={executeCode} handleSubmit={handleSubmit} />}
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

const AlertFrame = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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

export default InGame;
