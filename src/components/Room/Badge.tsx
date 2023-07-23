import styled from 'styled-components';

import { userInfo } from '@/types/room';

const Badge = ({ user }: { user: userInfo; index?: number }) => {
  const handleClickCard = () => {};

  const handleLockCard = () => {};

  if (typeof user !== 'string' && user.nickname === null) user.nickname = 'nowonjoo';
  if (user === undefined || user === 'LOCK' || user === 'EMPTY')
    return (
      <Container>
        <NonUserCard
          onClick={handleLockCard}
          islock={user === 'LOCK' || user === undefined ? 'true' : 'false'}
        >
          {user === 'LOCK' || user === undefined ? (
            <NonTitle>lock</NonTitle>
          ) : (
            <NonTitle style={{ color: '#3f3d4d' }}>empty</NonTitle>
          )}
        </NonUserCard>
      </Container>
    );
  return (
    <Container>
      <UserImg>
        {user.ready_status && <p className='ready'>READY</p>}
        <img id='profile-image' src={'/images/anonymous.jpg'} />
      </UserImg>
      <UserCard islock={user.ready_status ? 'true' : 'false'} onClick={handleClickCard}>
        <DropButton>x</DropButton>

        <InfoFrame>
          <p className='nickname'>{user.nickname}</p>
          <p className='level'>LV {user.level}</p>
        </InfoFrame>
      </UserCard>
    </Container>
  );
};

const Container = styled.div`
  width: 50%;
  height: 20%;
  position: relative;
  transition: all 0.1s ease;
  &:hover {
    transform: scale(1.03);
  }
`;

const NonUserCard = styled.div<{ islock: string }>`
  border: 1px solid white;
  border-radius: 20px;
  margin: 1.5em;
  min-height: 99.66px;
  max-height: 99.66px;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.islock !== 'true' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
`;

const NonTitle = styled.div`
  text-transform: uppercase;
  font-weight: bolder;
  font-style: italic;
  font-size: 2em;
`;

const UserCard = styled.div<{ islock: string }>`
  position: relative;
  overflow: hidden;
  border: 1px solid white;
  border-radius: 20px;
  margin: 1.5em;
  min-height: 99.66px;
  max-height: 99.66px;
  background-color: ${(props) =>
    props.islock !== 'true' ? 'rgba(255,255,255,0.4)' : 'rgba(100,100,100,0.4)'};

  box-shadow: 0 2px 8px rgba(31, 38, 135, 1);
`;

const InfoFrame = styled.div`
  transform: translate(35%, 0%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  top: 1.4rem;
  left: 1.2rem;
  p {
    padding: 0.2rem;
  }
  .nickname {
    text-shadow: #3f3d4d 2px 0 3px;
    text-transform: uppercase;
    font-weight: bolder;
    font-size: 1.5em;
    white-space: nowrap;
  }
`;

const DropButton = styled.button`
  position: absolute;
  top: 0;
  right: 0.5rem;
  font-size: 1.3rem;
  padding: 0.5rem;
`;

const UserImg = styled.div`
  transform: translate(-40%, -40%);
  position: absolute;
  width: 6em;
  height: 6em;
  top: 2.7em;
  left: 2.3em;
  z-index: 1;
  img {
    border: 1px solid white;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  & > .ready {
    position: absolute;
    padding: 10%;
    margin-top: 20%;
    border: 2px solid rgb(0, 0, 0);
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    font-size: larger;
    font-weight: bold;
    transform: skew(-25deg) rotate(-30deg);
  }
`;
export default Badge;
