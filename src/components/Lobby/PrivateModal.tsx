import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';

import Alert from '../public/Alert';

import { socket } from '@/apis/socketApi';
import CustomInputSmall from '@/components/public/CustomInputSmall';
import { RoomResponse } from '@/types/lobby';

type ModalProps = {
  handleShowModal: () => void;
  roomName: string;
  nickname: string;
};
const PrivateModal = ({ handleShowModal, roomName, nickname }: ModalProps) => {
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: { target: { value: string } }) => {
    setErrorMsg('');
    setPrivateKey(e.target.value);
  };

  const onClickRoom = useCallback(
    (roomName: string, password: string) => {
      setIsLoading(true);
      socket.emit(
        'join-room',
        { title: roomName, password: password },
        (response: RoomResponse) => {
          setIsLoading(false);
          if (response.payload?.message) return setErrorMsg(response.payload.message);
          if (!response.payload?.roomInfo) return alert('방 입장 실패!');
          if (response.payload?.roomInfo.mode === 'COOPERATIVE') {
            navigate(`/cooproom/${roomName}`, {
              state: { ...response.payload.roomInfo, nickname },
            });
          } else {
            navigate(`/room/${roomName}`, {
              state: { ...response.payload.roomInfo, nickname },
            });
          }
        },
      );
    },
    [navigate],
  );
  return (
    <Alert
      isLoading={isLoading}
      title={'비밀키를 입력하세요'}
      handleAlert={() => {
        if (privateKey) onClickRoom(roomName, privateKey);
      }}
      handleCloseAlert={handleShowModal}
    >
      <CustomInputSmall
        type='password'
        title='Private Key'
        inputName='password'
        handleChange={handleChange}
        inputValue={privateKey}
        errorMessage={errorMsg}
      />
      <EnterRoom>[ {roomName} ] 방에 입장하시겠습니까?</EnterRoom>
    </Alert>
  );
};
const EnterRoom = styled.label`
  color: #b4b0ff;
  font-family: IBM Plex Sans KR;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 100% */
  letter-spacing: -0.36px;
`;
export default PrivateModal;
