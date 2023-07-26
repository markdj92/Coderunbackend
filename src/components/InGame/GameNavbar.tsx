import styled from 'styled-components';

const GameNavbar = () => {
  return (
    <Container>
      <LogoFrame>CODE LEARN</LogoFrame>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 0.375rem 1rem;
  background-color: #172334;
`;

const LogoFrame = styled.div`
  transition: all 0.5s ease;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem;
`;

export default GameNavbar;
