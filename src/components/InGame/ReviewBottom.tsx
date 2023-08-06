import styled from 'styled-components';

const ReviewBottom = ({
  handleRun,
  handleSubmit,
}: {
  handleRun: () => void;
  handleSubmit: () => void;
}) => {
  return (
    <Container>
      <RunButton onClick={handleRun}>코드 실행</RunButton>
      <SubmitButton onClick={handleSubmit}>리뷰 넘기기</SubmitButton>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0.5rem;
  border-top: 1px solid #172334;
  background-color: #263747;
  button {
    margin: 0.5rem;
  }
`;

const RunButton = styled.button`
  font-size: 1rem;
  font-weight: 600;
  padding: 0.7rem 1rem;
  border-radius: 0.2rem;
  background-color: #44576c;
  &:hover {
    background-color: #37485d;
  }
`;

const SubmitButton = styled.button`
  font-size: 1rem;
  font-weight: 600;
  padding: 0.4375rem 0.8125rem;
  border-radius: 0.2rem;
  background-color: #0078ff;
  &:hover {
    background-color: #0069d9;
  }
`;

export default ReviewBottom;