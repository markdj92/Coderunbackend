import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PATH_ROUTE } from '@/constants';

import { postLogout } from '@/apis/authApi';

const Header = () => {
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
    <>
      <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
      <HeaderLeftBox>
        <button>내 정보 수정</button>
        <button onClick={handleLogout}>게임 나가기</button>
      </HeaderLeftBox>
    </>
  );
};

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

export default Header;
