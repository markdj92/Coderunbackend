import styled from 'styled-components';

const QuizContext = ({ title, content }: { title?: string; content?: string }) => {
  return (
    <Container>
      {!!title && <Title>{title}</Title>}
      <Content dangerouslySetInnerHTML={{ __html: content || '' }}></Content>
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 1rem;
  border-bottom: 1px solid #172334;
  width: 100%;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  margin-top: 24px;
`;

const Content = styled.span`
  font-size: 2rem;
  word-wrap: break-word;
  font-weight: 400;
  line-height: 1.8;
  color: #b2c0cc;
  letter-spacing: -0.1px;

  * {
    color: #b2c0cc;
  }

  code {
    background-color: #202b3d;
    color: #cdd7e0;
    font-size: 0.8rem;
    padding: 2px 6px;
    border: 1px solid #172334;
    margin: 0 2px 0 0;
    border-radius: 0.25rem;
  }

  ul {
    padding-left: 1rem;
  }

  li {
    list-style: disc;
    margin-bottom: 0.5rem;
  }

  ::marker {
    unicode-bidi: isolate;
    font-variant-numeric: tabular-nums;
    text-transform: none;
    text-indent: 0px !important;
    text-align: start !important;
    text-align-last: start !important;
  }
`;

export default QuizContext;
