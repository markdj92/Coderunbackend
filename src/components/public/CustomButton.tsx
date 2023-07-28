import styled from 'styled-components';

type CustomButtonProps = {
  title: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

const CustomButton = ({ title, isDisabled = false, onClick }: CustomButtonProps) => {
  if (isDisabled)
    return (
      <DisableContainer disabled={true}>
        <TitleBox>{title}</TitleBox>
      </DisableContainer>
    );
  return (
    <Container onClick={onClick}>
      <TitleBox>{title}</TitleBox>
    </Container>
  );
};

const DisableContainer = styled.button`
  display: inline-flex;
  padding: 23px 43px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid rgba(70, 64, 198, 0.2);
  background: rgba(70, 64, 198, 0.2);
  cursor: default;
`;

const Container = styled.button`
  display: flex;
  padding: 23px 43px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: 1px solid #4640c6;
  background: rgba(70, 64, 198, 0.2);

  &:hover {
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
  }
`;

const TitleBox = styled.div`
  width: 266px;
  color: #8883ff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
`;

export default CustomButton;
