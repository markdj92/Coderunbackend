import { styled } from 'styled-components';

import { BadgeStatus, UserInfo } from '@/types/room';

const User = ({ user }: { user: UserInfo | BadgeStatus }) => {
  if (user === 'EMPTY' || user === 'LOCK') return;
  const isReview: boolean = user.review;
  return <UserCard status={isReview ? 'true' : 'false'}>{user.nickname}</UserCard>;
};
const UserCard = styled.div<{ status: string }>`
  color: ${(props) => (props.status === 'false' ? '#eee' : '#9e9e9e')};
  font-weight: 600;
`;
export default User;
