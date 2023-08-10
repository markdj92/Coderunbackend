import { useRef, useState, useEffect } from 'react';

const useVoice = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          // video: true,
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

  return { localVideoRef, localStream };
};

export default useVoice;
