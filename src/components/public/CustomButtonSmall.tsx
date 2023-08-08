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
        <TitleBox disabled={true}>{title}</TitleBox>
      </DisabledContainer>
    );
  }
  return (
    <Container onClick={onClick}>
      <TitleBox disabled={false}>{title}</TitleBox>
    </Container>
  );
};
const DisabledContainer = styled.button`
  display: inline-flex;
  /* cursor: default; */

  margin-top: 32px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.color.DarkGray};
  background: rgba(70, 70, 70, 0.2);
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
  margin-top: 32px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.color.MainKeyColor};
  background: rgba(70, 70, 70, 0.2);
  backdrop-filter: blur(12px);
  &:hover {
    background: rgba(0, 0, 0, 0.12);
    box-shadow: 0px 4px 2px 0px #101010 inset;
  }
`;

const TitleBox = styled.div<{ disabled: boolean }>`
  width: 92px;
  text-align: center;
  font-family: ${(props) => props.theme.font.Content};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 100% */
  color: ${(props) =>
    props.disabled ? props.theme.color.DarkGray : props.theme.color.MainKeyColor};
`;

export default CustomButtonSmall;
