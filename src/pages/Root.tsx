//@ts-nocheck
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { useVoiceHandle } from '@/contexts/VoiceChatContext';

const Root = () => {
  const { myFaceRef, myStream, peerFaceRef, joinUser } = useVoiceHandle();
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        myStream.current = stream;
        myFaceRef.current.muted = true;
        myFaceRef.current.srcObject = myStream.current;
      } catch (error) {
        console.error(error);
      }
    };
    getMedia();
  }, [joinUser]);

  return (
    <>
      <Outlet />
      <RtcContainer>
        {joinUser.map((user, index) => (
          <video
            key={index}
            ref={(el) => {
              peerFaceRef.current[user] = el;
            }}
            autoPlay
          ></video>
        ))}
        <video autoPlay ref={myFaceRef}></video>
      </RtcContainer>
    </>
  );
};

const RtcContainer = styled.div`
  display: none;
  width: 0;
  height: 0;
`;

export default Root;
