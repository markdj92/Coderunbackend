import styled from 'styled-components';

interface props {
  member_count: number;
  max_members: number;
}

const MembersFrom = ({ member_count, max_members }: props) => {
  return (
    <Container>
      <MemberCount>{member_count}</MemberCount>
      <MaxMemberCount>/{max_members}</MaxMemberCount>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const MemberCount = styled.div`
  color: #8883ff;
  font-family: IBM Plex Sans KR;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

const MaxMemberCount = styled.div`
  color: rgba(136, 131, 255, 0.5);
  font-family: IBM Plex Sans KR;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

export default MembersFrom;
