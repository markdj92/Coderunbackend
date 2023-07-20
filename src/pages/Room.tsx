import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ImExit } from 'react-icons/im';
import { LuSettings2 } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

// import { PATH_ROUTE } from '@/constants';

import { socket } from '@/apis/socketApi';
import Badge from '@/components/Room/Badge';
import { IChat, userInfos } from '@/types/room';

const Room = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [message, setMessage] = useState<string>('');
  const chatContainerEl = useRef<HTMLDivElement>(null);

  const { roomName } = useParams<'roomName'>();
  const navigate = useNavigate();

  // 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
  useEffect(() => {
    if (!chatContainerEl.current) return;

    const chatContainer = chatContainerEl.current;
    const { scrollHeight, clientHeight } = chatContainer;

    if (scrollHeight > clientHeight) {
      chatContainer.scrollTop = scrollHeight - clientHeight;
    }
  }, [chats.length]);

  // message event listener
  useEffect(() => {
    const messageHandler = (chat: IChat) => setChats((prevChats) => [...prevChats, chat]);

    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
    };
  }, []);

  const inputChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const onSendMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!message) return alert('메시지를 입력해 주세요.');

      socket.emit('message', { roomName, message }, (chat: IChat) => {
        setChats((prevChats) => [...prevChats, chat]);
        setMessage('');
      });
    },
    [message, roomName],
  );

  // const onLeaveRoom = useCallback(() => {
  //   socket.emit('leave-room', roomName, () => {
  //     navigate(PATH_ROUTE.lobby);
  //   });
  // }, [navigate, roomName]);

  const onLeaveRoom = () => {
    const answer = confirm('정말 나가시겠습니까?');
    if (answer) {
      navigate('/lobby');
    }
  };

  const onCustomRoom = () => {};

  const userList: userInfos = {
    0: { nickname: 'nickname0', level: '1', imageSource: '', isLock: '', isUser: '1', isHost: '' },
    1: { nickname: 'nickname1', level: '2', imageSource: '', isLock: '1', isUser: '1', isHost: '' },
    2: { nickname: 'nickname2', level: '3', imageSource: '', isLock: '', isUser: '1', isHost: '' },
    3: { nickname: '', level: '', imageSource: '', isLock: '', isUser: '', isHost: '' },
    4: { nickname: '', level: '', imageSource: '', isLock: '', isUser: '', isHost: '' },
    5: { nickname: '', level: '', imageSource: '', isLock: '', isUser: '', isHost: '' },
    6: { nickname: '', level: '', imageSource: '', isLock: '', isUser: '', isHost: '' },
    7: { nickname: '', level: '', imageSource: '', isLock: '', isUser: '', isHost: '' },
    8: { nickname: '', level: '', imageSource: '', isLock: '1', isUser: '', isHost: '' },
    9: { nickname: '', level: '', imageSource: '', isLock: '1', isUser: '', isHost: '' },
  };

  let ready = 0;
  let people = 10;
  for (let i = 0; i < 10; i++) {
    if (userList[i].isLock && userList[i].isUser) {
      ready += 1;
    }
    if (userList[i].isLock && !userList[i].isUser) {
      people -= 1;
    }
  }
  return (
    <MainContainer>
      <MainFrame>
        <div className='part1'>
          <div>
            <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
            <RoomName>{roomName}</RoomName>
          </div>
          <div>
            <div ref={chatContainerEl} style={{ height: '300px', overflowY: 'scroll' }}>
              {chats.map((chat, index) => (
                <div key={index}>
                  <span>{chat.username}</span>
                  <span>{chat.message}</span>
                </div>
              ))}
            </div>
            <form onSubmit={onSendMessage}>
              <Sending>
                <input type='text' value={message} onChange={inputChangeHandler} />
                <button type='submit'>전송</button>
              </Sending>
            </form>
          </div>
        </div>
        <div className='part2'>
          {Array.from({ length: 10 }).map((_, index) => {
            return <Badge user={userList[index]} />;
          })}
        </div>
        <div className='part3'>
          <RoomButtons>
            <button onClick={onLeaveRoom}>
              <ImExit size={'2rem'} />
            </button>
            <button onClick={onCustomRoom}>
              <LuSettings2 size={'2rem'} />
            </button>
          </RoomButtons>
          <People>
            <label className='countReady'>{ready}</label>
            <label className='countPeople'>/ {people}</label>
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

const Sending = styled.div`
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  input {
    width: 80%;
    height: 30px;
    margin: 20px 20px 20px 20px;
  }
  button {
    padding-right: 10px;
    font-weight: bold;
  }
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

  border: 1px solid #fff;
  border-top: 0px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);

  .part1 {
    height: 100%;
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .part2 {
    height: 100%;
    width: 50%;
    display: flex;
    flex-wrap: wrap;
    padding: 2rem 0 1rem;
  }
  .part3 {
    height: 100%;
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

export default Room;
