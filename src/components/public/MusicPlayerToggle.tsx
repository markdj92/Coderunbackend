import { useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';

import bgm from '/sounds/bgm.mp3';

import styled from 'styled-components';

import SpeakerIcon from '/icon/room/speaker.svg';
import SpeakerActiveIcon from '/icon/room/speaker_active.svg';
import SpeakerMuteIcon from '/icon/room/speakerMute.svg';
import SpeakerMuteActiveIcon from '/icon/room/speakerMute_active.svg';

import IconButton from '../Room/IconButton';

import { useMusic, useMusicChange } from '@/contexts/MusicContext';

const MusicPlayerToggle = () => {
  const { isMusic } = useMusic();
  const { toggleMusic } = useMusicChange();

  const player = useRef<AudioPlayer>(null);

  const playerPlay = () => {
    player.current?.audio?.current?.play();
  };
  const playerPause = () => {
    player.current?.audio?.current?.pause();
  };

  useEffect(isMusic ? playerPlay : playerPause, [isMusic]);

  return (
    <Container>
      {isMusic ? (
        <IconButton
          icon={SpeakerIcon}
          hoverIcon={SpeakerActiveIcon}
          alt='speaker'
          onClick={toggleMusic}
        />
      ) : (
        <IconButton
          icon={SpeakerMuteIcon}
          hoverIcon={SpeakerMuteActiveIcon}
          alt='speaker'
          onClick={toggleMusic}
        />
      )}
      <AudioPlayer
        autoPlay={true}
        showSkipControls
        showJumpControls={false}
        style={{ display: 'none' }}
        customProgressBarSection={[]}
        ref={player}
        loop={true}
        volume={0.5}
        src={bgm}
      />
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 100;
`;

export default MusicPlayerToggle;
