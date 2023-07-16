import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';

import { postLogout } from '@/apis/authApi';
import { socket } from '@/apis/socketApi';
import { CreateRoomResponse } from '@/types/lobby';

const Lobby = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const roomListHandler = (rooms: string[]) => {
      setRooms(rooms);
    };
    const createRoomHandler = (newRoom: string) => {
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    };
    const deleteRoomHandler = (roomName: string) => {
      setRooms((prevRooms) => prevRooms.filter((room) => room !== roomName));
    };

    socket.emit('room-list', roomListHandler);
    socket.on('create-room', createRoomHandler);
    socket.on('delete-room', deleteRoomHandler);

    return () => {
      socket.off('room-list', roomListHandler);
      socket.off('create-room', createRoomHandler);
      socket.off('delete-room', deleteRoomHandler);
    };
  }, []);

  const onCreateRoom = useCallback(() => {
    const roomName = prompt('방 이름을 입력해 주세요.');
    if (!roomName) return alert('방 이름은 반드시 입력해야 합니다.');

    socket.emit('create-room', roomName, (response: CreateRoomResponse) => {
      if (!response.success) return alert(response.payload);

      navigate(`/room/${response.payload}`);
    });
  }, [navigate]);

  const onJoinRoom = useCallback(
    (roomName: string) => () => {
      socket.emit('join-room', roomName, () => {
        navigate(`/room/${roomName}`);
      });
    },
    [navigate],
  );

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
      <h1>로비</h1>
      <button onClick={onCreateRoom}>방 만들기</button>
      <button onClick={handleLogout}>로그아웃</button>
      <table>
        <thead>
          <tr>
            <th>방번호</th>
            <th>방이름</th>
            <th>입장</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{room}</td>
              <td>
                <button onClick={onJoinRoom(room)}>입장하기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Lobby;
