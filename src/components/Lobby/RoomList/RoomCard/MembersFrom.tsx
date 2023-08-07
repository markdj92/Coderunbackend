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
  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: IBM Plex Sans KR;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

const MaxMemberCount = styled.div`
  color: ${(props) => props.theme.color.MainKeyDarkColor};
  font-family: IBM Plex Sans KR;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

export default MembersFrom;
