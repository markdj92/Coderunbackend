import styled from 'styled-components';

interface ToggleButtonProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

const ToggleButton = ({ title, isSelected, onClick }: ToggleButtonProps) => {
  return (
    <Container onClick={onClick}>
      <Button isSelected={isSelected ? 'true' : 'false'}>{title}</Button>
    </Container>
  );
};

const Container = styled.div``;

const Button = styled.div<{ isSelected: string }>`
  border: 4px solid ${(props) => (props.isSelected === 'true' ? '#6bd9a4' : '#838393')};
  padding: 24px 44px;
  border-radius: 12px;
  background: #26262d;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  color: ${(props) => (props.isSelected === 'true' ? '#6bd9a4' : '#838393')};
  text-align: center;
  font-family: ${(props) => props.theme.font.Title};
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
`;

export default ToggleButton;
