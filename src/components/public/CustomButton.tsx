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
        <TitleBox disabled={true}>{title}</TitleBox>
      </DisableContainer>
    );
  return (
    <Container onClick={onClick}>
      <TitleBox disabled={false}>{title}</TitleBox>
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
  border: 1px solid ${(props) => props.theme.color.DarkGray};
  background: rgba(70, 70, 70, 0.2);
  cursor: default;
`;

const Container = styled.button`
  display: flex;
  padding: 23px 43px;
  justify-content: center;
  align-items: center;

  transition: all ease 0.3s;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.color.MainKeyColor};
  background: rgba(70, 70, 70, 0.2);

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    box-shadow: 0px 4px 2px 0px #101010 inset;
    backdrop-filter: blur(12px);
  }
`;

const TitleBox = styled.div<{ disabled: boolean }>`
  width: 266px;
  color: ${(props) =>
    props.disabled ? props.theme.color.DarkGray : props.theme.color.MainKeyColor};
  text-align: center;
  font-family: ${(props) => props.theme.font.Content};
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
`;

export default CustomButton;
