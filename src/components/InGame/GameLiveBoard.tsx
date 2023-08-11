import styled from 'styled-components';

import { UserInfo, BadgeStatus } from '@/types/room';

const GameLiveBoard = ({
  userInGame = [],
  handleSetViewer,
}: {
  userInGame: (UserInfo | BadgeStatus)[];
  handleSetViewer?: (nickname: string) => void;
}) => {
  return (
    <Container>
      <UserListSection>
        {userInGame &&
          userInGame.map((user, index) => {
            if (user === 'EMPTY' || user === 'LOCK') return;
            return (
              <UserCard
                key={index}
                // style={{ cursor: handleSetViewer ? 'pointer' : 'default' }}
                onClick={handleSetViewer ? () => handleSetViewer(user.nickname) : () => {}}
              >
                {user.nickname}
              </UserCard>
            );
          })}
      </UserListSection>
    </Container>
  );
};

const Container = styled.div`
  margin: 1rem 0;
`;

const UserListSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UserCard = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #1a213a;
  margin: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default GameLiveBoard;
