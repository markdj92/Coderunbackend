import styled from 'styled-components';

const GameLiveBoard = ({ handleSetViewer }: { handleSetViewer: (nickname: string) => void }) => {
  return (
    <Container>
      <UserListSection>
        <UserCard onClick={() => handleSetViewer('현오')}>현오</UserCard>
        <UserCard onClick={() => handleSetViewer('MINJI')}>MINJI</UserCard>
        <UserCard onClick={() => handleSetViewer('user3')}>user3</UserCard>
        <UserCard onClick={() => handleSetViewer('user4')}>user4</UserCard>
      </UserListSection>
    </Container>
  );
};

const Container = styled.div``;

const UserListSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const UserCard = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #1f1e4d;
  margin: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export default GameLiveBoard;
