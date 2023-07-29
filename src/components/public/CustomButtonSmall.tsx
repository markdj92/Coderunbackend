import styled from 'styled-components';

type CustomButtonProps = {
  title: string;
  isBorder?: boolean;
  onClick?: () => void;
};

const CustomButtonSmall = ({ title, isBorder = true, onClick }: CustomButtonProps) => {
  return (
    <Container onClick={onClick} isborder={isBorder ? 'true' : 'false'}>
      <TitleBox>{title}</TitleBox>
    </Container>
  );
};

const Container = styled.button<{ isborder: string }>`
  display: flex;
  padding: 20px 44px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: ${(props) => (props.isborder === 'true' ? '1px solid #4640c6' : 'none')};
  margin-top: 32px;
  border: 2.4px solid rgba(75, 76, 119, 1);
  border-radius: 12px;
  background: linear-gradient(90deg, rgb(53, 53, 99), rgb(43, 43, 87), rgba(112, 0, 255, 0.2));
  backdrop-filter: blur(12px);
`;

const TitleBox = styled.div`
  width: 92px;
  color: #8883ff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
`;

export default CustomButtonSmall;
