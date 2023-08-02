import styled from 'styled-components';

const GameLiveBoard = ({
  userInGame = [],
  handleSetViewer,
}: {
  userInGame: string[];
  handleSetViewer: (nickname: string) => void;
}) => {
  return (
    <Container>
      <UserListSection>
        {userInGame &&
          userInGame.map((user, index) => (
            <UserCard key={index} onClick={() => handleSetViewer(user)}>
              {user}
            </UserCard>
          ))}
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
