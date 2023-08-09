import styled from 'styled-components';

import IconButton from '@/components/Room/IconButton';

import MicIcon from '/icon/room/mic.svg';
import SpeakerIcon from '/icon/room/speaker.svg';
import SettingIcon from '/icon/room/setting.svg';
import RoomOutIcon from '/icon/room/logout.svg';
import MicActiveIcon from '/icon/room/mic_active.svg';
import SpeakerActiveIcon from '/icon/room/speaker_active.svg';
import SettingActiveIcon from '/icon/room/setting_active.svg';
import RoomOutActiveIcon from '/icon/room/logout_active.svg';
import MicMuteIcon from '/icon/room/micMute.svg';
import SpeakerMuteIcon from '/icon/room/speakerMute.svg';
import MicMuteActiveIcon from '/icon/room/micMute_active.svg';
import SpeakerMuteActiveIcon from '/icon/room/speakerMute_active.svg';

interface Props {
  isSpeaker: boolean;
  isMicrophone: boolean;
  handleLeaveRoom: () => void;
  handleMicrophone: () => void;
  handleSpeaker: () => void;
}

const ToolButtonBox = ({
  isSpeaker,
  isMicrophone,
  handleLeaveRoom,
  handleMicrophone,
  handleSpeaker,
}: Props) => {
  return (
    <IconButtonsBox>
      {isMicrophone ? (
        <IconButton icon={MicIcon} hoverIcon={MicActiveIcon} alt='mic' onClick={handleMicrophone} />
      ) : (
        <IconButton
          icon={MicMuteIcon}
          hoverIcon={MicMuteActiveIcon}
          alt='mic'
          onClick={handleMicrophone}
        />
      )}
      {isSpeaker ? (
        <IconButton
          icon={SpeakerIcon}
          hoverIcon={SpeakerActiveIcon}
          alt='speaker'
          onClick={handleSpeaker}
        />
      ) : (
        <IconButton
          icon={SpeakerMuteIcon}
          hoverIcon={SpeakerMuteActiveIcon}
          alt='speaker'
          onClick={handleSpeaker}
        />
      )}
      <IconButton icon={SettingIcon} hoverIcon={SettingActiveIcon} alt='setting' />
      <IconButton
        icon={RoomOutIcon}
        hoverIcon={RoomOutActiveIcon}
        alt='roomOut'
        onClick={handleLeaveRoom}
      />
    </IconButtonsBox>
  );
};

const IconButtonsBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 5rem;
  left: 5rem;
  gap: 24px;
`;

export default ToolButtonBox;
