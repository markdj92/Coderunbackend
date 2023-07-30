import styled from 'styled-components';

type CustomButtonProps = {
  title: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

const CustomButtonTiny = ({ title, isDisabled = false, onClick }: CustomButtonProps) => {
  if (isDisabled) {
    return (
      <DisabledContainer disabled={true}>
        <TitleBox style={{ color: 'rgba(70, 64, 198, 0.4)', fontWeight: '400' }}>{title}</TitleBox>
      </DisabledContainer>
    );
  }
  return (
    <Container onClick={onClick}>
      <TitleBox style={{ color: '#8883ff' }}>{title}</TitleBox>
    </Container>
  );
};
const DisabledContainer = styled.button`
  display: inline-flex;
  cursor: default;

  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid rgba(70, 64, 198, 0.2);
  background: rgba(70, 64, 198, 0.2);
  backdrop-filter: blur(12px);
  width: 77px;
  padding: 16px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const Container = styled.button`
  width: 78px;
  gap: 10px;
  display: flex;
  padding: 16px 20px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #4640c6;
  margin-top: 16px;
  border: 2.4px solid rgba(70, 64, 198, 1);
  border-radius: 8px;
  background: linear-gradient(
      90deg,
      rgba(70, 64, 198, 0) 0%,
      rgba(70, 64, 198, 0.4) 31.07%,
      rgba(70, 64, 198, 0.4) 72.03%,
      rgba(70, 64, 198, 0.13) 100%
    ),
    rgba(112, 0, 255, 0.2);
  box-shadow: 0px 0px 12px 0px rgba(78, 0, 244, 0.4);
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

  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px; /* 100% */
`;

export default CustomButtonTiny;
