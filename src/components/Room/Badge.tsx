import styled from 'styled-components';

import { userInfo } from '@/types/room';

const Badge = ({ user }: { user: userInfo }) => {
  return (
    <Container>
      <UserCard isUser={user.isUser} isLock={user.isLock}>
        {user.isUser && <button>x</button>}
        <UserImg>
          {user.isUser && user.isLock && <p className='ready'>READY</p>}
          <img
            id='profile-image'
            src={user.imageSource ? user.imageSource : '/images/anonymous.jpg'}
          />
        </UserImg>
        {user.isUser ? (
          <div id='userinfo'>
            <p className='nickname'>{user.nickname}</p>
            <p className='level'>LV {user.level}</p>
          </div>
        ) : user.isLock ? (
          <div id='userinfo'>
            <p className='noneuser'>lock</p>
          </div>
        ) : (
          <div id='userinfo'>
            <p className='noneuser' style={{ color: '#3f3d4d' }}>
              empty
            </p>
          </div>
        )}
      </UserCard>
    </Container>
  );
};

const Container = styled.div`
  width: 50%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const UserCard = styled.div<{ isUser: string; isLock: string }>`
  float: left;
  width: 80%;
  min-width: 20rem;
  height: 60%;
  min-height: 5rem;
  background-color: ${(props) =>
    !props.isLock
      ? 'rgba(255,255,255,0.4)'
      : props.isUser
      ? 'rgba(100,100,100,0.4)'
      : 'rgba(0,0,0,0.4)'};
  padding: 1rem;
  border-radius: 20px;
  border: 1px solid white;
  border-top: 0px;
  box-shadow: 0 2px 8px rgba(31, 38, 135, 1);
  margin: 2.3em;
  button {
    float: right;
  }
  & > #userinfo {
    transform: translate(35%, 0%);
    text-align: left;
    width: fit-content;
  }
  div > .noneuser {
    text-align: center;
    padding-top: 10px;
    text-transform: uppercase;
    font-weight: bolder;
    font-style: italic;
    font-size: xx-large;
    width: 5em;
  }
  div > .nickname {
    text-shadow: #3f3d4d 2px 0 3px;
    position: relative;
    text-transform: uppercase;
    font-weight: bolder;
    font-size: 30px;
    width: fit-content;
  }
  div > .level {
    position: relative;
    width: fit-content;
  }
`;

const UserImg = styled.div`
  transform: translate(-40%, -40%);
  position: absolute;
  width: 5em;
  height: 5em;
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
