import React, { useRef, MouseEvent } from 'react';
import { FaCrown } from 'react-icons/fa';
import styled from 'styled-components';

import LockIcon from '/icon/public/lock.svg';
import QuestionIcon from '/icon/public/question.svg';
import StarIcon from '/icon/public/star.svg';

import { socket } from '@/apis/socketApi';
import { Menu } from '@/components/public/ContextMenu';
import { UserInfo, BadgeStatus } from '@/types/room';

const Badge = ({
  user,
  isOwner,
  isMine,
  isRoomAuth,
  badgeNumber,
  title,
}: {
  user: UserInfo | BadgeStatus;
  isOwner: boolean;
  isMine: boolean;
  badgeNumber: number;
  isRoomAuth: boolean;
  title: string;
}) => {
  const outerRef = useRef<HTMLDivElement>(null);

  const menuOnClickHandler = (
    e: React.MouseEvent<HTMLUListElement, MouseEvent> | React.KeyboardEvent<HTMLUListElement>,
  ) => {
    const eventTarget = e.target as HTMLUListElement;
    if (eventTarget) {
      switch (eventTarget.dataset.option) {
        case 'profile':
          openProfile();
          break;
        case 'add-friend':
          requestFriend();
          break;
        case 'register-admin':
          registerAdmin();
          break;
        case 'kick-user':
          handleKick();
          break;
        default:
          break;
      }
    }
  };

  const openProfile = () => {};

  const requestFriend = () => {};

  const registerAdmin = () => {
    if (!isRoomAuth) return;
    socket.emit('change-owner', { title, index: badgeNumber });
  };

  const handleKick = () => {
    if (!isRoomAuth) return;
    socket.emit('forceLeave', { title, index: badgeNumber });
  };

  const handleLockCard = () => {
    if (!isRoomAuth) return;
    socket.emit('lockunlock', { title, index: badgeNumber });
  };

  if (user === 'EMPTY' || user === 'LOCK')
    return (
      <Container>
        <NonUserCard
          onClick={handleLockCard}
          islock={user === 'LOCK' || user === undefined ? 'true' : 'false'}
        >
          <InfoBox>
            <UserImg>
              <img className={user === 'LOCK' ? 'active' : 'disable'} src={LockIcon} />
              <img className={user === 'LOCK' ? 'disable' : 'active'} src={QuestionIcon} />
            </UserImg>
            <InfoFrame>
              <p>Here's</p>
              {user === 'LOCK' || user === undefined ? (
                <NonTitle style={{ color: '#54a980' }}>lock</NonTitle>
              ) : (
                <NonTitle style={{ color: '#838393' }}>empty</NonTitle>
              )}
            </InfoFrame>
          </InfoBox>
          <StatusButton className={user === 'LOCK' ? 'disable status' : 'active status'}>
            Waiting
          </StatusButton>
        </NonUserCard>
      </Container>
    );

  if (isMine)
    return (
      <Container>
        <UserCard islock={user.status ? 'true' : 'false'}>
          <InfoBox>
            <UserImg ismine={isMine ? 'true' : 'false'}>
              <img id='profile-image' src={'/images/anonymous.jpg'} />
            </UserImg>
            <InfoFrame>
              <p>User</p>
              <p className='nickname'>
                {isMine && <img src={StarIcon} />} {user.nickname}
              </p>
              <p className='level'>LV {user.level}</p>
            </InfoFrame>
          </InfoBox>

          {isOwner ? (
            <StatusButton className='ready'>
              <FaCrown size={'30px'} />
            </StatusButton>
          ) : (
            <StatusButton className={user.status ? 'ready' : ''}>READY</StatusButton>
          )}
        </UserCard>
      </Container>
    );
  return (
    <>
      {isRoomAuth ? (
        <Menu
          outerRef={outerRef as React.MutableRefObject<HTMLDivElement>}
          menuOnClick={(e) => menuOnClickHandler(e)}
        >
          <li data-option='kick-user'>강퇴하기</li>
          <li data-option='profile'>프로필 보기</li>
          <li data-option='add-friend'>친구추가 요청</li>
          <li data-option='register-admin'>방장 위임</li>
        </Menu>
      ) : (
        <Menu
          outerRef={outerRef as React.MutableRefObject<HTMLDivElement>}
          menuOnClick={(e) => menuOnClickHandler(e)}
        >
          <li data-option='profile'>프로필 보기</li>
          <li data-option='add-friend'>친구추가 요청</li>
        </Menu>
      )}
      <Container>
        <UserCard ref={outerRef} islock={user.status ? 'true' : 'false'}>
          <InfoBox>
            <UserImg ismine={isMine ? 'true' : 'false'}>
              <img id='profile-image' src={'/images/anonymous.jpg'} />
            </UserImg>
            <InfoFrame>
              <p>User</p>
              <p className='nickname'>
                {isMine && <img src={StarIcon} />}
                {user.nickname}
              </p>
              <p className='level'>LV {user.level}</p>
            </InfoFrame>
          </InfoBox>

          {isOwner ? (
            <StatusButton className='ready'>
              <FaCrown size={'30px'} />
            </StatusButton>
          ) : (
            <StatusButton className={user.status ? 'ready' : ''}>READY</StatusButton>
          )}
        </UserCard>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 50%;
  height: 20%;
  position: relative;
  transition: all 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  * {
    transition: all 0.1s ease;
    .disable {
      display: none;
    }
    .active {
      display: block;
    }
  }
  padding: 1.5rem;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 65%;
`;

const UserImg = styled.div<{ ismine?: string }>`
  min-width: 104px;
  min-height: 104px;
  border-radius: 50%;
  border: 5px solid ${(props) => (props.ismine === 'true' ? '#92dab870' : '#35353f')};
  background-color: #26262d;

  * {
    color: #838393;
  }

  object-fit: cover;
  overflow: hidden;

  #profile-image {
    width: 100%;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: 16px;
`;

const NonUserCard = styled.div<{ islock: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 32px;
  background:
    linear-gradient(#26262d, #26262d) padding-box,
    linear-gradient(
        to bottom right,
        ${(props) => (props.islock === 'true' ? '#92dab870' : '#838393')},
        transparent
      )
      border-box,
    border-box;
  border: 2.4px solid transparent;

  min-width: 450px;
  height: 80%;
  width: 100%;
  min-height: 160px;

  border-radius: 80px;

  box-shadow: '0px 0px 24px 0px #222';

  .disable.status {
    display: block;
    color: #26262d;
    background-color: #26262d;
  }

  &:hover {
    border-color: #6bd9a480;
  }
`;

const UserCard = styled.div<{ islock: string; ismine?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 32px;
  background:
    linear-gradient(#26262d, #26262d) padding-box,
    linear-gradient(
        to bottom right,
        ${(props) => (props.islock === 'true' ? '#59fff5' : '#838393')},
        transparent
      )
      border-box,
    border-box;
  border: 2.4px solid transparent;

  min-width: 450px;
  height: 80%;
  width: 100%;
  min-height: 160px;

  border-radius: 80px;

  box-shadow: ${(props) =>
    props.islock === 'true' ? '0px 0px 24px 0px #59fff5' : '0px 0px 10px 0px #59fff5'};

  .ready {
    border: 2.4px solid #6bd9a4;
    box-shadow: 0px 0px 5px 0px #59fff5;
    color: #eee;
    font-family: ${(props) => props.theme.font.title};
    font-size: 16px;
    font-style: normal;
    font-weight: 900;
    line-height: 16px; /* 100% */
    letter-spacing: -0.32px;
  }

  &:hover {
    border-color: #6bd9a4;
  }
`;

const StatusButton = styled.div`
  width: 108px;
  height: 46px;
  display: inline-flex;
  padding: 15px 23px 15px 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 48px;
  background: rgba(131, 131, 147, 0.2);

  color: rgba(131, 131, 147, 0.5);
  font-family: ${(props) => props.theme.font.content};
  font-size: 16px;
  font-style: normal;
  font-weight: 900;
  line-height: 16px; /* 100% */
  letter-spacing: -0.32px;
`;

const NonTitle = styled.div`
  text-transform: uppercase;
  font-weight: bolder;
  font-style: italic;
  font-size: 2em;

  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: ${(props) => props.theme.font.title};
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px; /* 100% */
  letter-spacing: -0.64px;
`;

const InfoFrame = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 176px;
  width: 100%;

  img {
    width: 24px;
  }
  p {
    color: ${(props) => props.theme.color.MainKeyColor};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.2rem;
    color: #838393;
  }
  .nickname {
    width: 100%;
    color: ${(props) => props.theme.color.MainKeyColor};
    font-family: ${(props) => props.theme.font.title};
    text-shadow: #3f3d4d 2px 0 3px;
    text-transform: uppercase;
    font-weight: bolder;
    font-size: 32px;
    white-space: nowrap;

    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 100% */
    letter-spacing: -0.64px;
  }
  .level {
    width: 100%;
    color: #c3c3d6;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: -0.36px;
  }
`;

export default Badge;
