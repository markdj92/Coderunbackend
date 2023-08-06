import { useState } from 'react';
import { BiCheckbox, BiCheckboxChecked } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import Modal from '../../public/Modal';

import { socket } from '@/apis/socketApi';
import CustomButtonTiny from '@/components/public/CustomButtonTiny';
import CustomInputSmall from '@/components/public/CustomInputSmall';
import { useInput } from '@/hooks/useInput';
import { RoomResponse } from '@/types/lobby';

type RoomProps = {
  nickname: string;
  handleShowCreateRoom: () => void;
};
const CreateRoom = ({ nickname, handleShowCreateRoom }: RoomProps) => {
  const [isSecret, setIsSecret] = useState(false);
  const navigate = useNavigate();

  const { value: roomInfo, setValue: setRoomInfo } = useInput({
    title: '',
    password: '',
    status: 'PUBLIC',
    max_members: 2,
    level: '1',
    mode: 'STUDY',
  });
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

  const onSecretRoom = () => {
    setIsSecret(!isSecret);
  };
  return (
    <Modal handleHideModal={handleShowCreateRoom}>
      <CreateRoomForm onSubmit={onCreateRoom}>
        <TitleText>Create Room</TitleText>
        <InputContainer>
          <CustomInputSmall
            title='Room Title'
            inputName='title'
            handleChange={handleChange}
            inputValue={roomInfo.title}
          />
          <SettingTitle>Setting</SettingTitle>
          <SettingContainer>
            <InputSet>
              <SecretCheck onClick={onSecretRoom}>
                {isSecret ? (
                  <BiCheckboxChecked size='3rem' style={{ fill: '#76cea3' }} />
                ) : (
                  <BiCheckbox size='3rem' style={{ fill: '#76cea3' }} />
                )}
                Private Room
              </SecretCheck>
            </InputSet>
            {isSecret && (
              <CustomInputSmall
                title='PRIVATE KEY'
                type='password'
                inputName='password'
                handleChange={handleChange}
                inputValue={roomInfo.password}
              />
            )}
            <InputSet>
              <InputTitle>Mode</InputTitle>
              <input
                style={{ opacity: '0' }}
                type='radio'
                name='mode'
                value='STUDY'
                onChange={handleChange}
                id='study-mode'
              />
              <RadioSelect
                isselected={roomInfo.mode === 'STUDY' ? 'true' : 'false'}
                htmlFor='study-mode'
              >
                STUDY
              </RadioSelect>
              <input
                style={{ opacity: '0' }}
                type='radio'
                name='mode'
                value='COOPERATIVE'
                onChange={handleChange}
                id='coop-mode'
              />
              <RadioSelect
                isselected={roomInfo.mode === 'COOPERATIVE' ? 'true' : 'false'}
                htmlFor='coop-mode'
              >
                CO-OP
              </RadioSelect>
            </InputSet>
            <InputSet>
              <InputTitle>Max People</InputTitle>
              <input
                min={1}
                max={10}
                type='range'
                name='max_members'
                onChange={handleChange}
                value={roomInfo.max_members}
              />
              <label>{roomInfo.max_members}</label>
            </InputSet>
            <InputSet>
              <InputTitle>Level</InputTitle>
              <input
                style={{ opacity: '0' }}
                type='radio'
                id='lv1'
                name='level'
                onChange={handleChange}
                value='1'
              />
              <RadioSelect isselected={roomInfo.level === '1' ? 'true' : 'false'} htmlFor='lv1'>
                1
              </RadioSelect>
              <input
                style={{ opacity: '0' }}
                type='radio'
                id='lv2'
                name='level'
                onChange={handleChange}
                value='2'
              />
              <RadioSelect isselected={roomInfo.level === '2' ? 'true' : 'false'} htmlFor='lv2'>
                2
              </RadioSelect>
              <input
                style={{ opacity: '0' }}
                type='radio'
                id='lv3'
                name='level'
                onChange={handleChange}
                value='3'
              />
              <RadioSelect isselected={roomInfo.level === '3' ? 'true' : 'false'} htmlFor='lv3'>
                3
              </RadioSelect>
              <input
                style={{ opacity: '0' }}
                type='radio'
                id='lv4'
                name='level'
                onChange={handleChange}
                value='4'
              />
              <RadioSelect isselected={roomInfo.level === '4' ? 'true' : 'false'} htmlFor='lv4'>
                4
              </RadioSelect>
              <input
                style={{ opacity: '0' }}
                type='radio'
                id='lv5'
                name='level'
                onChange={handleChange}
                value='5'
              />
              <RadioSelect isselected={roomInfo.level === '5' ? 'true' : 'false'} htmlFor='lv5'>
                5
              </RadioSelect>
            </InputSet>
          </SettingContainer>
        </InputContainer>
        <ButtonContainer>
          <CustomButtonTiny title={'Enter'} isDisabled={!roomInfo.title} />
        </ButtonContainer>
      </CreateRoomForm>
    </Modal>
  );
};

const RadioSelect = styled.label<{ isselected: string }>`
  color: ${(props) =>
    props.isselected === 'true' ? props.theme.color.LightGray : props.theme.color.DarkGray};
  font-weight: 700;
  font-style: italic;
  font-size: 20px;
  cursor: pointer;
`;
const InputTitle = styled.label`
  font-family: 'IBM Plex Sans KR';
  color: ${(props) => props.theme.color.MainKeyColor};
  font-size: 25px;
  font-weight: 700;
  width: 300px;
`;
const InputSet = styled.div`
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  /* justify-content: space-around; */
  margin-top: 10px;
  line-height: 35px;
`;
const CreateRoomForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: left;
`;
const TitleText = styled.p`
  color: ${(props) => props.theme.color.LightGray};
  text-align: center;
  font-size: 32px;
  font-family: 'IBM Plex Sans KR';
  font-style: normal;
  font-weight: 700;
  line-height: 44px; /* 100% */
  margin-left: 24px;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-top: 32px;
`;

const SettingTitle = styled.div`
  margin-top: 22px;
  width: fit-content;
  color: ${(props) => props.theme.color.LightGray};
  font-size: 28px;
  font-weight: 700;
  line-height: 35px;
`;
const SettingContainer = styled.div`
  color: ${(props) => props.theme.color.MainKeyColor};
  display: flex;
  flex-direction: column;
  align-items: left;
`;
const ButtonContainer = styled.div`
  width: 100%;
`;
const SecretCheck = styled.div`
  /* width: 10px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'IBM Plex Sans KR';
  color: #76cea3;
  font-size: 25px;
  font-weight: 700;
`;

export default CreateRoom;
