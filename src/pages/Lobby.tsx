import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ErrorPage from './Error';

import IconLogout from '/images/lobby/button_logout.png';
import IconSetting from '/images/lobby/button_setting.png';

import { postLogout } from '@/apis/authApi';
import { socket } from '@/apis/socketApi';
import Button from '@/components/Lobby/Button';

import { PATH_ROUTE, USER_TOKEN_KEY, LEVEL_OPTIONS, TITLE_COMMENT } from '@/constants';

import CreateRoom from '@/components/Lobby/CreateRoom';
import DropBox from '@/components/Lobby/DropBox';
import IconButton from '@/components/Lobby/IconButton';
import PrivateModal from '@/components/Lobby/PrivateModal';
import RoomList from '@/components/Lobby/RoomList';
import Alert from '@/components/public/Alert';
import { useInput } from '@/hooks/useInput';
import useSocketConnect from '@/hooks/useSocketConnect';
import { RoomResponse } from '@/types/lobby';

const Lobby = () => {
  useSocketConnect();
  const { value: roomInfo, setValue: setRoomInfo } = useInput({
    title: '',
    password: '',
    status: 'PUBLIC',
    max_members: 2,
    level: 1,
    mode: 'STUDY',
  });
  const navigate = useNavigate();
  const location = useLocation();
  if (!location.state) {
    return <ErrorPage />;
  }
  const { nickname, kicked } = location.state;

  const [isShownCreateRoom, setShownCreateRoom] = useState(false);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [privateRoomName, setPrivateRoomName] = useState('');
  const [isLogout, setIsLogout] = useState(false);

  const [isKicked, setIsKicked] = useState(kicked ? true : false);

  const [selectedLevel, setLevel] = useState(0);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    if (e.target.name === 'password') {
      const publicState = e.target.value === '' ? 'PUBLIC' : 'PRIVATE';
      setRoomInfo({ ...roomInfo, [e.target.name]: e.target.value, ['status']: publicState });
    } else {
      setRoomInfo({ ...roomInfo, [e.target.name]: e.target.value });
    }
  };
  const onCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit('create-room', roomInfo, (response: RoomResponse) => {
      if (!response.success) {
        return alert(response.payload.message);
      }
      if (!response.payload.roomInfo) {
        return alert('서버 문제가 발생했습니다.');
      }
      if (roomInfo.mode === 'STUDY') {
        navigate(`/room/${roomInfo.title}`, {
          state: { ...response.payload.roomInfo, nickname },
        });
      } else {
        navigate(`/cooproom/${roomInfo.title}`, {
          state: { ...response.payload.roomInfo, nickname },
        });
      }
    });
  };

  const handleShowCreateRoom = () => {
    setShownCreateRoom(!isShownCreateRoom);
  };

  const handleLogout = () => {
    try {
      postLogout();
      localStorage.removeItem(USER_TOKEN_KEY);
      navigate(PATH_ROUTE.login);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetting = () => {};

  const handleQuickStart = () => {
    socket.emit('quick-join', (response: RoomResponse) => {
      if (!response.success) return alert(response.payload.roomInfo);
      socket.emit('join-room', { title: response.payload.roomInfo }, (response: RoomResponse) => {
        if (!response.payload?.roomInfo) return alert('방 입장 실패!');
        navigate(`/room/${response.payload.roomInfo}`, {
          state: { ...response.payload.roomInfo, nickname },
        });
      });
    });
  };

  const handlePrivateRoom = () => {
    setIsPrivateRoom(!isPrivateRoom);
  };

  return (
    <MainContainer>
      {isShownCreateRoom && (
        <CreateRoom
          roomInfo={roomInfo}
          handleChange={handleChange}
          onCreateRoom={onCreateRoom}
          handleShowCreateRoom={handleShowCreateRoom}
        />
      )}
      {isLogout && (
        <Alert
          title={TITLE_COMMENT.logout}
          handleAlert={handleLogout}
          handleCloseAlert={() => setIsLogout(false)}
        />
      )}
      {isKicked && (
        <Alert title={TITLE_COMMENT.kicked} handleCloseAlert={() => setIsKicked(false)} />
      )}
      {isPrivateRoom && (
        <PrivateModal
          nickname={nickname}
          handleShowModal={handlePrivateRoom}
          roomName={privateRoomName}
        />
      )}
      <LeftFrame>
        <HeaderSection>
          <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
        </HeaderSection>
      </LeftFrame>
      <MainFrame>
        <HeaderSection>
          <RoomButtonBox>
            <Button onClick={handleShowCreateRoom} title='방 만들기' />
            <Button title='빠른 시작' onClick={handleQuickStart} />
            <DropBox
              options={LEVEL_OPTIONS}
              selected={selectedLevel}
              setSelected={(value) => setLevel(value)}
            />
          </RoomButtonBox>
          <RoomButtonBox>
            {nickname} 님 반갑습니다!
            <IconButton icon={IconSetting} alt='setting' onClick={handleSetting} />
            <IconButton icon={IconLogout} alt='setting' onClick={() => setIsLogout(true)} />
          </RoomButtonBox>
        </HeaderSection>
        <RoomList
          nickname={nickname}
          onClickRoom={(title: string) => setPrivateRoomName(title)}
          handlePrivate={handlePrivateRoom}
          level={+selectedLevel}
        />
      </MainFrame>
      <RightFrame>
        <HeaderSection></HeaderSection>
      </RightFrame>
    </MainContainer>
  );
};

const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2.5rem;
  font-weight: 500;
  margin-top: 25px;
  margin-left: 80px;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  color: #8883ff;
`;

const MainContainer = styled.div`
  background: url('/background_lobby.png');
  background-size: contain;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const LeftFrame = styled.div`
  width: 25%;
  height: 100%;
`;

const MainFrame = styled.div`
  min-width: 988px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const RightFrame = styled.div`
  width: 25%;
  height: 100%;
`;

const HeaderSection = styled.div`
  padding-top: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  font-size: 20px;
  font-weight: 800;
`;

const RoomButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 78px;
  gap: 24px;
`;

export default Lobby;
