import styled from 'styled-components';

import PrivateIconImage from '/icon/lobby/lock.png';

interface props {
  title: string;
  status: 'PUBLIC' | 'PRIVATE';
  host?: string;
}

const Title = ({ title, status, host = 'Room Host' }: props) => {
  return (
    <Container>
      <TitleBox>
        {status === 'PRIVATE' && (
          <PrivateIcon>
            <img src={PrivateIconImage} alt='' />
          </PrivateIcon>
        )}
        <TitleText>{title}</TitleText>
      </TitleBox>
      <RoomHostBox>{host}</RoomHostBox>
    </Container>
  );
};

const Container = styled.div`
  width: 251px;
  height: 54px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 28px;
`;

const PrivateIcon = styled.div`
  width: 28px;
  height: 28px;
  margin-right: 6px;
`;

const TitleText = styled.div`
  color: #b4b0ff;
  font-family: 'IBM Plex Sans KR';
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 100% */
  letter-spacing: -0.56px;
`;

const RoomHostBox = styled.div`
  color: #7f74d8;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

export default Title;
