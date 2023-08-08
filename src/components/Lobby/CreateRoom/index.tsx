import { useState, useRef, useEffect } from 'react';
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
  const titleRef = useRef<HTMLInputElement>(null);

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
  useEffect(() => {
    titleRef.current?.focus();
  }, []);
  const onSecretRoom = () => {
    setIsSecret(!isSecret);
  };
  return (
    <Modal handleHideModal={handleShowCreateRoom}>
      <CreateRoomForm onSubmit={onCreateRoom}>
        <TitleText>Make a new room</TitleText>
        <InputContainer>
          <CustomInputSmall
            setRef={titleRef}
            title='Room Title'
            inputName='title'
            handleChange={handleChange}
            inputValue={roomInfo.title}
          />
          <SettingContainer>
            <InputSet>
              <TitleBox>
                <SettingTitle>Setting</SettingTitle>
                <SecretCheck onClick={onSecretRoom}>
                  {isSecret ? (
                    <BiCheckboxChecked size='22px' style={{ fill: '#76cea3' }} />
                  ) : (
                    <BiCheckbox size='22px' style={{ fill: '#76cea3' }} />
                  )}
                  Private Room
                </SecretCheck>
              </TitleBox>
              {isSecret && (
                <PWInput
                  type='password'
                  name='password'
                  onChange={handleChange}
                  value={roomInfo.password}
                />
              )}
            </InputSet>
            <InputSet>
              <InputTitle>Mode</InputTitle>
              <ValueSet>
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
                  Study
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
                  Co-op
                </RadioSelect>
              </ValueSet>
            </InputSet>
            <InputSet>
              <InputTitle>Members</InputTitle>
              <Members>{roomInfo.max_members}</Members>
              <RangeInput
                min={1}
                max={10}
                type='range'
                name='max_members'
                onChange={handleChange}
                value={roomInfo.max_members}
              />
            </InputSet>
            <InputSet>
              <InputTitle>Level</InputTitle>
              <ValueSet>
                <input
                  style={{ margin: '0px', width: '0px', opacity: '0' }}
                  type='radio'
                  id='lv1'
                  name='level'
                  onChange={handleChange}
                  value='1'
                />
                <LevelSelect isselected={roomInfo.level === '1' ? 'true' : 'false'} htmlFor='lv1'>
                  1
                </LevelSelect>
                <input
                  style={{ margin: '0px', width: '8px', opacity: '0' }}
                  type='radio'
                  id='lv2'
                  name='level'
                  onChange={handleChange}
                  value='2'
                />
                <LevelSelect isselected={roomInfo.level === '2' ? 'true' : 'false'} htmlFor='lv2'>
                  2
                </LevelSelect>
                <input
                  style={{ margin: '0px', width: '8px', opacity: '0' }}
                  type='radio'
                  id='lv3'
                  name='level'
                  onChange={handleChange}
                  value='3'
                />
                <LevelSelect isselected={roomInfo.level === '3' ? 'true' : 'false'} htmlFor='lv3'>
                  3
                </LevelSelect>
                <input
                  style={{ margin: '0px', width: '8px', opacity: '0' }}
                  type='radio'
                  id='lv4'
                  name='level'
                  onChange={handleChange}
                  value='4'
                />
                <LevelSelect isselected={roomInfo.level === '4' ? 'true' : 'false'} htmlFor='lv4'>
                  4
                </LevelSelect>
                <input
                  style={{ margin: '0px', width: '8px', opacity: '0' }}
                  type='radio'
                  id='lv5'
                  name='level'
                  onChange={handleChange}
                  value='5'
                />
                <LevelSelect isselected={roomInfo.level === '5' ? 'true' : 'false'} htmlFor='lv5'>
                  5
                </LevelSelect>
              </ValueSet>
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
const ValueSet = styled.div`
  width: 197px;
  display: flex;
  flex-direction: row;
  height: 32px;
  /* justify-content: space-between; */
`;
const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const Members = styled.div`
  width: 26px;
  height: 28px;
  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: ${(props) => props.theme.font.Content};
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: right;
`;
const PWInput = styled.input`
  margin-bottom: 10px;
  width: 197px;
  height: 60px;
  left: 222px;
  padding: 16px 20px 16px 20px;
  border-radius: 8px;
  border: 1.4px;
  gap: 18px;
  background-color: transparent;
  border: 1.4px solid ${(props) => props.theme.color.MainKeyColor};

  box-shadow:
    0px 0px 24px 0px #222222,
    0px 4px 2px 0px #15124952 inset;
`;
const RangeInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background: ${(props) => props.theme.color.DarkGray};

  width: 197px;
  height: 2px;
  border-radius: 50px;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 15px;
    outline: 0;
    border: 0;
    background: ${(props) => props.theme.color.MainKeyColor};
  }
`;

const RadioSelect = styled.label<{ isselected: string }>`
  color: ${(props) =>
    props.isselected === 'true' ? props.theme.color.MainKeyColor : props.theme.color.DarkGray};
  font-weight: 500;
  font-size: 22px;
  line-height: 28px;
  /* cursor: pointer; */
`;
const LevelSelect = styled.label<{ isselected: string }>`
  color: ${(props) =>
    props.isselected === 'true' ? props.theme.color.MainKeyColor : props.theme.color.NonFocused};
  line-height: 32px;
  font-weight: 700;
  font-size: 14px;
  padding: 0px 11px;

  border-radius: 8px;
  text-align: center;
  border: 1.4px solid
    ${(props) =>
      props.isselected === 'true' ? props.theme.color.MainKeyColor : props.theme.color.Black};
  /* cursor: pointer; */
`;
const InputTitle = styled.label`
  font-family: ${(props) => props.theme.font.Title};
  color: ${(props) => props.theme.color.LightGray};
  font-size: 22px;
  margin-left: 95px;
  font-weight: 500;
  width: 130px;
`;
const InputSet = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  line-height: 60px;
`;
const CreateRoomForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: left;
`;
const TitleText = styled.h1`
  color: ${(props) => props.theme.color.LightGray};
  font-size: 32px;
  font-family: ${(props) => props.theme.font.Title};
  font-style: normal;
  font-weight: 700;
  line-height: 32px; /* 100% */
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-top: 32px;
`;

const SettingTitle = styled.div`
  width: fit-content;
  color: ${(props) => props.theme.color.LightGray};
  font-family: ${(props) => props.theme.font.Title};
  font-size: 28px;
  font-weight: 700;
  height: 60px;
  margin-bottom: 10px;
  margin-right: 20px;
`;
const SettingContainer = styled.div`
  font-family: ${(props) => props.theme.font.Content};
  color: ${(props) => props.theme.color.MainKeyColor};
  display: flex;
  flex-direction: column;
  align-items: left;
  margin: 32px 0;
`;
const ButtonContainer = styled.div`
  width: 100%;
`;
const SecretCheck = styled.div`
  /* width: 10px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: ${(props) => props.theme.font.Content};
  color: ${(props) => props.theme.color.LightGray};
  font-weight: 500;
  height: 60px;
  margin-bottom: 10px;
  font-size: 22px;
  /* cursor: pointer; */
`;

export default CreateRoom;
