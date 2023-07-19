import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PATH_ROUTE } from '@/constants';

import { postLogout } from '@/apis/authApi';
import RoomList from '@/components/Lobby/RoomList';

const Lobby = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm('정말 떠나실건가요?'))
      try {
        await postLogout();
        navigate(PATH_ROUTE.login);
        alert('로그아웃 되었습니다.');
      } catch (error) {
        console.error(error);
      }
  };

  return (
    <MainContainer>
      <HeaderFrame>
        <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
        <HeaderLeftBox>
          <button>내 정보 수정</button>
          <button onClick={handleLogout}>게임 나가기</button>
        </HeaderLeftBox>
      </HeaderFrame>
      <MainFrame>
        <LeftBox></LeftBox>
        <ContentsBox>
          <TopContentsBox>
            <button>방 만들기</button>
            <button>빠른 시작</button>
          </TopContentsBox>
          <RoomList />
        </ContentsBox>
        <RightBox></RightBox>
      </MainFrame>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const HeaderFrame = styled.div`
  display: flex;
  font-size: 1.5rem;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 10%;
  padding: 0 2rem;
  border-radius: 20px;
  border: 1px solid #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);
`;

const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2rem;
  font-weight: 500;
  cursor: pointer;
`;

const HeaderLeftBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-left: 1rem;
    transition: all 0.3s ease;
    &:hover {
      text-shadow:
        0 0 5px #bebebe,
        0 0 10px #bebebe,
        0 0 15px #bebebe,
        0 0 20px #bebebe,
        0 0 35px #bebebe;
    }
  }
`;

const MainFrame = styled.div`
  width: 90%;
  height: 80%;
  display: flex;
  justify-content: space-between;

  border: 1px solid #fff;
  border-top: 0px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);
`;

const LeftBox = styled.div`
  width: 15%;
`;

const RightBox = styled.div`
  width: 15%;
`;

const ContentsBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 70%;
`;

const TopContentsBox = styled.div`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 2rem;
  button {
    margin: 1rem 0 1rem 3rem;
    padding-left: 1rem;
    height: 2rem;
    border-left: 5px solid #fff;
    transition: all 0.3s ease;
    &:hover {
      text-shadow:
        0 0 5px #bebebe,
        0 0 10px #bebebe,
        0 0 15px #bebebe,
        0 0 20px #bebebe,
        0 0 35px #bebebe;
    }
  }
`;

export default Lobby;
