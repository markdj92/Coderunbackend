import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ErrorPage from './Error';

import IconLogout from '/icon/lobby/logout.svg';
import IconSetting from '/icon/lobby/setting.svg';

import { postLogout } from '@/apis/authApi';
import { socket } from '@/apis/socketApi';

import { PATH_ROUTE, USER_TOKEN_KEY, LEVEL_OPTIONS, TITLE_COMMENT } from '@/constants';

import Button from '@/components/Lobby/Button';
import CreateRoom from '@/components/Lobby/CreateRoom';
import DropBox from '@/components/Lobby/DropBox';
import IconButton from '@/components/Lobby/IconButton';
import PrivateModal from '@/components/Lobby/PrivateModal';
import RoomList from '@/components/Lobby/RoomList';
import Alert from '@/components/public/Alert';
import { HeaderLogo } from '@/components/public/HeaderLogo';
import useSocketConnect from '@/hooks/useSocketConnect';
import { RoomResponse } from '@/types/lobby';

const Lobby = () => {
  useSocketConnect();
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
        <CreateRoom nickname={nickname} handleShowCreateRoom={handleShowCreateRoom} />
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
          <HeaderLogo />
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

const MainContainer = styled.div`
  background: url('/background_lobby.png');
  background-blend-mode: luminosity;
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
