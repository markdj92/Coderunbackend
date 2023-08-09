import React from 'react';
import styled from 'styled-components';

interface ResultFrameProps {
  title: string;
  color: string;
  children: React.ReactNode;
  isFilter?: boolean;
  isBlur?: boolean;
}

const ResultFrame = ({
  title,
  color,
  children,
  isFilter = false,
  isBlur = true,
}: ResultFrameProps) => {
  return (
    <Container color={color}>
      <TitleBox>
        <Title color={color}>{title}</Title>
      </TitleBox>
      <TotalGradation style={{ display: isFilter ? 'block' : 'none' }} />
      <Gradation />
      <ResultBox>{children}</ResultBox>
      {isBlur && <BlurBackground color={color} />}
    </Container>
  );
};

const Container = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  border-radius: 32px;
  border: 8px solid ${(props) => props.color};
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: flex-start;
  align-items: center;
`;

const TotalGradation = styled.div`
  width: 100%;
  height: 100%;
  z-index: 2;
  border-radius: 32px;
  background: #26262d;
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
`;

const Gradation = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 32px;
  background: linear-gradient(to right, #26262d, transparent 10% 90%, #26262d);
  position: absolute;
  top: 0;
  left: 0;
`;

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  z-index: 3;
  flex-direction: row;
  justify-content: space-between;
`;

const BlurBackground = styled.div<{ color: string }>`
  border-radius: 109px;
  opacity: 0.5;
  background: ${(props) => props.color};
  filter: blur(100px);
  width: 724px;
  height: 218px;
  flex-shrink: 0;
  width: 724px;
  height: 218px;
`;

const Title = styled.div<{ color: string }>`
  display: inline-flex;
  padding: 18px 34px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 18px 0px 28px 0px;
  background: ${(props) => props.color};
  color: #26262d;
  font-family: ${(props) => props.theme.font.content};
  font-size: 40px;
  font-weight: 900;
  line-height: 24px;
  letter-spacing: -0.48px;
`;

const ResultBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

export default ResultFrame;
