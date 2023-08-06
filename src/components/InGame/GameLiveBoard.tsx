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
