import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useVoiceHandle } from '@/contexts/VoiceChatContext';

const Root = () => {
  const { localVideoRef, localStream, setLocalStream } = useVoiceHandle();
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (localStream === undefined) {
          setLocalStream(stream);
        }

        if (localVideoRef.current) {
          localVideoRef.current.muted = true;
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
      }
    };
    getMedia();
  }, [localStream]);
  return (
    <>
      <Outlet />
      <video autoPlay style={{ display: 'block' }} ref={localVideoRef}></video>
    </>
  );
};

export default Root;
