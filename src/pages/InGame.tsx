import { useEffect, useState } from 'react';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { postExecuteResult, postQuizInfo } from '@/apis/gameApi';
import { socket } from '@/apis/socketApi';
import EditorMulti from '@/components/InGame/EditorMulti';
import GameBottom from '@/components/InGame/GameBottom';
import GameNavbar from '@/components/InGame/GameNavbar';
import QuizFrame from '@/components/InGame/QuizFrame';
import QuizHeader from '@/components/InGame/QuizHeader';
import RunFrame from '@/components/InGame/RunFrame';
import { ExecuteResult, QuizInfo } from '@/types/inGame';

const InGame = () => {
  const location = useLocation();
  const { title, nickname }: { title: string; nickname: string } = location.state;

  const [quizNumber, setQuizNumber] = useState<number>(1);
  const [quizInfo, setQuizInfo] = useState<QuizInfo>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<ExecuteResult>({
    memory: '0',
    cpuTime: '0',
    output: '',
  });
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

  const handleRun = async () => {
    // if (code === '') return alert('코드를 작성해주세요.');
    const executeData = {
      title: title,
      problemNumber: quizNumber,
      // script: code,
      script: '',
      language: 'python3',
      versionIndex: '0',
    };
    const response = await postExecuteResult(executeData);
    const { data } = response;
    setIsSuccess(data.success);
    setRunResult(data.payload.result);
  };

  const getQuizInfo = async () => {
    return await postQuizInfo(title);
  };

  useEffect(() => {
    getQuizInfo()
      .then((response) => {
        if (response.data === null) {
          alert('퀴즈 정보를 불러오는데 실패했습니다.');
          return;
        }
        setQuizInfo(response.data);
      })
      .catch((err) => {
        setQuizNumber(1);
        console.error(err);
      });
  }, []);

  if (quizInfo === null) return <></>;
  return (
    <Container>
      <GameNavbar />
      <MainFrame>
        <GameFrame>
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
          <MainSection>
            <QuizSection>
              <QuizHeader title={quizInfo.title} timer={{ mm: 1, ss: 22 }} />
              <QuizMain>
                <QuizLeft>
                  <QuizFrame quizInfo={quizInfo} />
                </QuizLeft>
                <QuizRight>
                  <EditorFrame>
                    <EditorMulti socket={socket} nickname={nickname} title={title} />
                  </EditorFrame>
                  <RunFrame isSuccess={isSuccess} runResult={runResult} />
                </QuizRight>
              </QuizMain>
            </QuizSection>
          </MainSection>
        </GameFrame>
        <GameBottom handleRun={handleRun} />
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
  height: 93%;
`;

const OptionSection = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: inset -0.0625rem 0 #172334;
  button {
    padding: 0.5rem;
  }
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
