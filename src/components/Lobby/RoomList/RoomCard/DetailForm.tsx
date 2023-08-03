import { ReactNode } from 'react';
import styled from 'styled-components';

interface props {
  title: string;
  contents: string | ReactNode;
}

const DetailForm = ({ title, contents }: props) => {
  return (
    <Container>
      <Contents>{contents}</Contents>
      <Title>{title}</Title>
    </Container>
  );
};

const Container = styled.div`
  width: 110px;
  height: 84px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Contents = styled.div`
  color: #8883ff;
  font-family: IBM Plex Sans KR;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

const Title = styled.div`
  color: rgba(136, 131, 255, 0.5);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px; /* 100% */
  letter-spacing: -0.28px;
`;

export default DetailForm;
