import { ReactNode } from 'react';
import styled from 'styled-components';

interface props {
  title: string;
  contents: string | ReactNode;
}

const DetailForm = ({ title, contents }: props) => {
  return (
    <Container>
      <Divider />
      <DetailBox>
        <Contents>{contents}</Contents>
        <Title>{title}</Title>
      </DetailBox>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 110px;
  height: 84px;
  z-index: 0;
  overflow: hidden;
`;

const DetailBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const Contents = styled.div`
  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: IBM Plex Sans KR;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

const Title = styled.div`
  color: ${(props) => props.theme.color.LightGray};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px; /* 100% */
  letter-spacing: -0.28px;
`;

const Divider = styled.div`
  position: absolute;
  top: 0px;
  left: -12px;
  width: 90%;
  height: 90%;
  transform: sKewX(-15deg);
  background:
    linear-gradient(#26262d, #26262d) padding-box,
    linear-gradient(to bottom, #6bd9a4, transparent) border-box,
    border-box;
  border-right: 2px solid transparent;
  z-index: -1;
`;

export default DetailForm;
