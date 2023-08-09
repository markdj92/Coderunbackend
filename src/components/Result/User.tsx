import { styled } from 'styled-components';

import { BadgeStatus, UserInfo } from '@/types/room';

const User = ({ user, widthSize = 180 }: { user: UserInfo | BadgeStatus; widthSize?: number }) => {
  if (user === 'EMPTY' || user === 'LOCK') return;
  const isReview: boolean = user.review;
  return (
    <UserCard status={isReview ? 'true' : 'false'} widthSize={`${widthSize}px`}>
      <UserImage status={isReview ? 'true' : 'false'} widthSize={`${widthSize * 0.8}px`}>
        <img src={user.profile ? user.profile : '/images/anonymous.jpg'} alt='user' />
      </UserImage>
      <UserName status={isReview ? 'true' : 'false'}>{user.nickname}</UserName>
    </UserCard>
  );
};

const UserCard = styled.div<{ status: string; widthSize: string }>`
  display: flex;
  width: ${(props) => props.widthSize};
  padding: 28px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const UserImage = styled.div<{ status: string; widthSize: string }>`
  width: ${(props) => props.widthSize};
  height: ${(props) => props.widthSize};
  flex-shrink: 0;
  border-radius: 142px;
  border: ${(props) => (props.status === 'true' ? '6px solid #6BD9A4' : '6px solid #838393')};
  object-fit: cover;
  overflow: hidden;
  box-shadow: ${(props) => (props.status === 'true' ? '0px 0px 20px #A1F4FF' : 'none')};
  img {
    width: 100%;
  }
`;

const UserName = styled.div<{ status: string }>`
  overflow: hidden;
  color: #fff;
  text-align: center;
  text-overflow: ellipsis;
  font-family: ${(props) => props.theme.font.Content};
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px; /* 100% */
  letter-spacing: -0.64px;
`;

export default User;
