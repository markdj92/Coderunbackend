import { useNavigate } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';

import { postLogout } from '@/apis/authApi';

const Lobby = () => {
  const navigator = useNavigate();
  const handleLogout = async () => {
    if (confirm('정말 떠나실건가요?'))
      try {
        await postLogout();
        navigator(PATH_ROUTE.login);
        alert('로그아웃 되었습니다.');
      } catch (error) {
        console.error(error);
      }
  };

  return (
    <>
      <button onClick={handleLogout}>로그아웃</button>
    </>
  );
};
export default Lobby;
