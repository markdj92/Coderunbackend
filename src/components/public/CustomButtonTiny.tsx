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
        <TitleBox style={{ color: '#26262d', fontWeight: '400' }}>{title}</TitleBox>
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
  /* cursor: default; */

  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.color.Black};
  background: #83839333;
  backdrop-filter: blur(12px);
  width: 77px;
  padding: 16px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  float: right;
`;
const Container = styled.button`
  width: 78px;
  gap: 10px;
  display: flex;
  padding: 16px 20px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.color.Black};
  margin-top: 16px;
  background: rgba(70, 70, 70, 0.2);
  box-shadow:
    0px 0px 12px 0px #59fff5cc,
    0px 4px 2px 0px #15124951 inset;

  backdrop-filter: blur(12px);
  float: right;
  &:hover {
    border: 1px solid ${(props) => props.theme.color.Black};
    background: rgba(0, 0, 0, 0.12);
    box-shadow: 0px 4px 2px 0px #101010 inset;
  }
`;

const TitleBox = styled.div`
  width: 92px;

  text-align: center;
  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: ${(props) => props.theme.font.Content};
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
`;

export default CustomButtonTiny;
