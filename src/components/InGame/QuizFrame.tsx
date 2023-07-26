import styled from 'styled-components';

import QuizContext from './QuizContext';
import QuizInputOutputTable from './QuizInputOutputTable';

import { QuizInfo } from '@/types/inGame';

const QuizFrame = ({ quizInfo }: { quizInfo: QuizInfo }) => {
  if (quizInfo === null) return <></>;
  return (
    <Container>
      <Title>문제 설명</Title>
      <QuizContext content={quizInfo.contents} />
      <QuizContext title={'입력'} content={quizInfo.input_contents} />
      <QuizContext title={'출력'} content={quizInfo.output_contents} />
      <QuizInputOutputTable inputData={quizInfo.ex_input} outputData={quizInfo.ex_output} />
    </Container>
  );
};

const Container = styled.div`
  margin: 1rem;
  word-wrap: break-word;
  padding-bottom: 2rem;
  * {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 1rem;
`;

export default QuizFrame;
