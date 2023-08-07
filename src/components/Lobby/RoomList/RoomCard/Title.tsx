import styled from 'styled-components';

import PrivateIconImage from '/icon/lobby/lock.svg';

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
  width: 270px;
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
  width: 100%;
`;

const PrivateIcon = styled.div`
  width: 28px;
  height: 28px;
  margin-right: 6px;
`;

const TitleText = styled.div`
  color: ${(props) => props.theme.color.MainKeyLightColor};
  font-family: ${(props) => props.theme.font.Title};
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 100% */
  letter-spacing: -0.56px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoomHostBox = styled.div`
  color: #6bd9a480;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px; /* 100% */
  letter-spacing: -0.36px;
`;

export default Title;
