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
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UserCard = styled.div`
  font-family: ${(props) => props.theme.font.Content};
  width: 80px;
  padding: 10px 0;
  color: ${(props) => props.theme.color.LightGray};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  :hover {
    color: ${(props) => props.theme.color.DarkGray};
  }
`;

export default GameLiveBoard;
