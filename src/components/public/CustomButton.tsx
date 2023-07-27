import styled from 'styled-components';

type CustomButtonProps = {
  title: string;
  isBorder?: boolean;
  onClick?: () => void;
};

const CustomButton = ({ title, isBorder = true, onClick }: CustomButtonProps) => {
  return (
    <Container onClick={onClick} isborder={isBorder ? 'true' : 'false'}>
      <TitleBox>{title}</TitleBox>
    </Container>
  );
};

const Container = styled.button<{ isborder: string }>`
  display: flex;
  padding: 24px 44px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: ${(props) => (props.isborder === 'true' ? '1px solid #4640c6' : 'none')};
  background: rgba(70, 64, 198, 0.2);
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
