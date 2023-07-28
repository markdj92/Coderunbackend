import styled from 'styled-components';

import { ExecuteResult } from '@/types/inGame';

const RunFrame = ({ isSuccess, runResult }: { isSuccess: boolean; runResult: ExecuteResult }) => {
  return (
    <Container>
      <Title>실행 결과</Title>
      {runResult.output === '' ? (
        <ContentBox>실행 결과가 여기에 표시됩니다.</ContentBox>
      ) : (
        <ContentBox>
          <ResultBox>
            {isSuccess ? <p className='blue'>'성공'</p> : <p className='red'>'실패'</p>}
          </ResultBox>
          <OutputBox>메모리 사용량: {runResult.memory} KB</OutputBox>
          <OutputBox>실행 시간: {runResult.cpuTime} ms</OutputBox>
          <OutputBox>
            출력 결과: <p>{`${runResult.output}`}</p>
          </OutputBox>
        </ContentBox>
      )}
    </Container>
  );
};

const Container = styled.div`
  word-break: keep-all;
  word-wrap: break-word;
  border-top: 1px solid #172334;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  overflow: hidden;
  * {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
`;

const Title = styled.div`
  padding: 1rem;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #172334;
  color: #98a8b9;
`;

const ContentBox = styled.div`
  position: relative;
  padding-left: 1rem;
  padding-bottom: 5rem;
  overflow-y: auto;
  height: 100%;
  color: #b2c0cc;
  font-weight: 100;
  .red {
    color: #ff6b6b;
  }
  .blue {
    color: #82cfff;
  }
`;

const ResultBox = styled.div`
  padding: 0.5rem 0 0.5rem 0;
  color: #98a8b9;
`;

const OutputBox = styled.div`
  padding: 0.2rem;
  color: #98a8b9;
  p {
    color: #b2c0cc;
    padding-top: 0.2rem;
  }
`;

export default RunFrame;
