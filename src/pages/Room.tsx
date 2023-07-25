import { useCallback, useEffect, useState } from 'react';
import { ImExit } from 'react-icons/im';
import { LuSettings2 } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { socket } from '@/apis/socketApi';
import Badge from '@/components/Room/Badge';
import useSocketConnect from '@/hooks/useSocketConnect';
import { RoomStatus, userInfo } from '@/types/room';

const Room = () => {
  useSocketConnect();
  const location = useLocation();
  const { title, member_count, user_info } = location.state;

  const [roomName, setRoomName] = useState<string | undefined>(title);
  const [people, setPeople] = useState<number>(member_count);
  const [maxPeople, setMaxPeople] = useState<number>(
    user_info.reduce((count: number, user: userInfo) => {
      if (user !== 'LOCK') return count + 1;
      return count;
    }, 0),
  );
  const [userInfos, setUserInfos] = useState<userInfo[]>(user_info);

  const navigate = useNavigate();

  useEffect(() => {
    const roomHandler = (response: RoomStatus) => {
      const { title, member_count, user_info } = response;
      setRoomName(title);
      setPeople(member_count);
      setMaxPeople(
        user_info.reduce((count: number, user: userInfo) => {
          if (user !== 'LOCK') return count + 1;
          return count;
        }, 0),
      );
      setUserInfos(user_info);
    };

    socket.on('room-status-changed', roomHandler);
    return () => {
      socket.off('room-status-changed', roomHandler);
    };
  }, []);

  const handleLeaveRoom = () => {
    const answer = confirm('정말 나가시겠습니까?');
    if (answer) {
      onLeaveRoom();
    }
  };

  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', { title: roomName }, () => {
      navigate('/lobby');
    });
  }, [navigate, roomName]);

  const onCustomRoom = () => {};

  return (
    <MainContainer>
      <MainFrame>
        <div className='part1'>
          <div>
            <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
            <RoomName>{title}</RoomName>
          </div>
        </div>
        <div className='part2'>
          {userInfos &&
            Array.from({ length: 10 }).map((_, index) => {
              return <Badge key={index} user={userInfos[index]} index={index} />;
            })}
        </div>
        <div className='part3'>
          <RoomButtons>
            <button onClick={handleLeaveRoom}>
              <ImExit size={'2rem'} />
            </button>
            <button onClick={onCustomRoom}>
              <LuSettings2 size={'2rem'} />
            </button>
          </RoomButtons>
          <People>
            <label className='countReady'>{people}</label>
            <label className='countPeople'>/ {maxPeople}</label>
          </People>
          <Ready>시작</Ready>
        </div>
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

const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2rem;
  padding: 2rem;
  font-weight: 500;
  cursor: pointer;
`;

const RoomName = styled.div`
  font-family: 'Black Han Sans', sans-serif;
  font-size: 2.5rem;
  padding: 2rem 1rem 1rem 1rem;
  margin: 0 1rem 0 1rem;
  border-bottom: 3px solid #fff;
  text-align: center;
  letter-spacing: 10px;
  font-style: italic;
  width: fit-content;
`;

const RoomButtons = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 0 0 4rem;
  button {
    margin: 2rem;
    width: fit-content;
    &:hover {
      filter: drop-shadow(0 0 10px #e0e0e0);
    }
  }
`;
const People = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Black Han Sans', sans-serif;
  font-size: 60px;
  text-shadow: #3f3d4d 5px 6px 3px;

  .countPeople {
    color: #789;
    padding: 0 0 0 1rem;
  }
  .countReady {
    padding: 3rem 0 0 0;
    font-size: 10rem;
  }
`;
const Ready = styled.button`
  margin-left: 1rem;
  transition: all 0.3s ease;
  font-size: xx-large;
  font-weight: bolder;
  width: fit-content;
  text-align: center;
  height: 3rem;
  margin-bottom: 30%;
  padding: 0 1rem 0;
  border-left: 5px solid #fff;
  &:hover {
    text-shadow:
      0 0 5px #bebebe,
      0 0 10px #bebebe,
      0 0 15px #bebebe,
      0 0 20px #bebebe,
      0 0 35px #bebebe;
  }
`;

const MainFrame = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: space-between;

  min-width: 900px;

  border: 1px solid #fff;
  border-top: 0px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);

  .part1 {
    height: 100%;
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    word-break: break-word;
  }
  .part2 {
    height: 100%;
    width: 55%;
    display: flex;
    flex-wrap: wrap;
  }
  .part3 {
    height: 100%;
    width: 20%;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

export default Room;
