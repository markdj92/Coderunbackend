import { useState } from 'react';
import { BiCheckbox, BiCheckboxChecked } from 'react-icons/bi';
import { styled } from 'styled-components';

import Modal from '../../public/Modal';

import CustomButtonTiny from '@/components/public/CustomButtonTiny';
import CustomInputSmall from '@/components/public/CustomInputSmall';

type RoomProps = {
  roomInfo: any;
  handleShowCreateRoom: () => void;
  handleChange: (e: any) => void;
  onCreateRoom: (e: any) => void;
};
const CreateRoom = ({ roomInfo, handleShowCreateRoom, handleChange, onCreateRoom }: RoomProps) => {
  const [isSecret, setIsSecret] = useState(false);

  const onSecretRoom = () => {
    setIsSecret(!isSecret);
  };
  return (
    <Modal handleHideModal={handleShowCreateRoom}>
      <CreateRoomForm onSubmit={onCreateRoom}>
        <Title>
          <Logo />
          <TitleText>Create Room</TitleText>
        </Title>
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
                  <BiCheckboxChecked size='3rem' style={{ fill: '#9190db' }} />
                ) : (
                  <BiCheckbox size='3rem' style={{ fill: '#9190db' }} />
                )}{' '}
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
              <label>
                <input type='radio' name='mode' value='STUDY' onChange={handleChange} checked />
                STUDY
              </label>
              <label>
                <input type='radio' name='mode' value='COOPERATIVE' onChange={handleChange} />
                COOPERATIVE
              </label>
            </InputSet>
            <InputSet>
              <InputTitle>Max People</InputTitle>
              <input
                min={1}
                max={10}
                value={2}
                type='range'
                name='max_members'
                onChange={handleChange}
              />
              <label>{roomInfo.max_members}</label>
            </InputSet>
            <InputSet>
              <InputTitle>Level</InputTitle>
              <label>
                <input
                  type='radio'
                  id='lv1'
                  name='level'
                  value={1}
                  onChange={handleChange}
                  checked
                />
                1
              </label>
              <label>
                <input type='radio' id='lv2' name='level' value={2} onChange={handleChange} />2
              </label>
              <label>
                <input type='radio' id='lv3' name='level' value={3} onChange={handleChange} />3
              </label>
              <label>
                <input type='radio' id='lv4' name='level' value={4} onChange={handleChange} />4
              </label>
              <label>
                <input type='radio' id='lv5' name='level' value={5} onChange={handleChange} />5
              </label>
            </InputSet>
          </SettingContainer>
        </InputContainer>
        <CustomButtonTiny title={'Enter'} isDisabled={!roomInfo.title} />
      </CreateRoomForm>
    </Modal>
  );
};
const InputTitle = styled.label`
  font-family: 'IBM Plex Sans KR';
  color: #9190db;
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
const Title = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;
const Logo = styled.div`
  width: 44px;
  height: 44px;
  background: #1f1e4d;
`;
const TitleText = styled.p`
  color: #8883ff;
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
  color: #8883ff;
  font-size: 28px;
  font-weight: 700;
  line-height: 35px;
`;
const SettingContainer = styled.div`
  color: #9190db;
  display: flex;
  flex-direction: column;
  align-items: left;
`;
const SecretCheck = styled.div`
  /* width: 10px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'IBM Plex Sans KR';
  color: #9190db;
  font-size: 25px;
  font-weight: 700;
`;

export default CreateRoom;
