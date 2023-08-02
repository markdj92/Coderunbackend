import { ImExit } from 'react-icons/im';
import styled from 'styled-components';

const Header = ({ onLeaveRoom }: { onLeaveRoom: () => void }) => {
  return (
    <HeaderFrame>
      <Logo onClick={onLeaveRoom}>CODE LEARN</Logo>
      <Button>
        <ImExit onClick={onLeaveRoom} size={'2rem'} />
      </Button>
    </HeaderFrame>
  );
};
const HeaderFrame = styled.div`
  display: flex;
  font-size: 1.5rem;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 10%;
  padding: 0 2rem;
  border-radius: 20px;
  border: 1px solid #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  min-width: 900px;
`;
const Logo = styled.div`
  transition: all 0.5s ease;
  font-size: 2rem;
  font-weight: 500;
  cursor: pointer;
`;
const Button = styled.div`
  transition: all 0.3s ease;
  margin: 2rem;
  width: fit-content;
  &:hover {
    filter: drop-shadow(0 0 10px #e0e0e0);
  }
`;
export default Header;
