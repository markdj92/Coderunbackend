import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';

import { socket } from '@/apis/socketApi';
import { IChat } from '@/types/room';

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

  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', roomName, () => {
      navigate(PATH_ROUTE.lobby);
    });
  }, [navigate, roomName]);

  return (
    <>
      <h1>채팅방</h1>
      <div ref={chatContainerEl} style={{ height: '300px', overflowY: 'scroll' }}>
        {chats.map((chat, index) => (
          <div key={index}>
            <span>{chat.username}</span>
            <span>{chat.message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={onSendMessage}>
        <input type='text' value={message} onChange={inputChangeHandler} />
        <button type='submit'>전송</button>
      </form>

      <button onClick={onLeaveRoom}>방 나가기</button>
    </>
  );
};

export default Room;
