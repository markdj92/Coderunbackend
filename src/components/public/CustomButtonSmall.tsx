import styled from 'styled-components';

type CustomButtonProps = {
  title: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

const CustomButtonSmall = ({ title, isDisabled = false, onClick }: CustomButtonProps) => {
  if (isDisabled) {
    return (
      <DisabledContainer disabled={true}>
        <TitleBox style={{ color: '#797AA6', fontWeight: '400' }}>{title}</TitleBox>
      </DisabledContainer>
    );
  }
  return (
    <Container onClick={onClick}>
      <TitleBox>{title}</TitleBox>
    </Container>
  );
};
const DisabledContainer = styled.button`
  display: inline-flex;
  border: 1px solid rgba(53, 53, 98, 1);
  cursor: default;

  margin-top: 32px;
  border-radius: 12px;
  background: linear-gradient(
      90deg,
      rgba(43, 43, 87, 0) 0%,
      rgba(53, 53, 99, 0.19) 31.07%,
      rgba(53, 53, 99, 0.19) 72.03%,
      rgba(43, 43, 87, 0.24) 100%
    ),
    rgba(73, 58, 91, 0.2);
  backdrop-filter: blur(12px);
  width: 180px;
  padding: 20px 44px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const Container = styled.button`
  width: 180px;
  gap: 10px;
  display: flex;
  padding: 20px 44px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: 1px solid #4640c6;
  margin-top: 32px;
  border: 2.4px solid rgba(70, 64, 198, 1);
  border-radius: 12px;
  background: linear-gradient(
      90deg,
      rgba(70, 64, 198, 0) 0%,
      rgba(70, 64, 198, 0.4) 31.07%,
      rgba(70, 64, 198, 0.4) 72.03%,
      rgba(70, 64, 198, 0.13) 100%
    ),
    rgba(112, 0, 255, 0.2);
  backdrop-filter: blur(12px);
  &:hover {
    border: 2.4px solid rgba(53, 53, 98, 1);
    background: linear-gradient(
        90deg,
        rgba(43, 43, 87, 0) 0%,
        rgba(53, 53, 99, 0.4) 31.07%,
        rgba(53, 53, 99, 0.4) 72.03%,
        rgba(43, 43, 87, 0.5) 100%
      ),
      rgba(112, 0, 255, 0.2);
  }
`;

const TitleBox = styled.div`
  width: 92px;
  color: #8883ff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 100% */
`;

export default CustomButtonSmall;
