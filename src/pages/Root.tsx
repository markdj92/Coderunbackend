//@ts-nocheck
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

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
      {joinUser.map((user, index) => (
        <video
          key={index}
          ref={(el) => {
            peerFaceRef.current[user] = el;
          }}
          autoPlay
        ></video>
      ))}
      <video autoPlay style={{ display: 'block' }} ref={myFaceRef}></video>
    </>
  );
};

export default Root;
