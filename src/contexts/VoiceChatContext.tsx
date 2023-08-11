//@ts-nocheck
import { createContext, useCallback, useContext, useRef, useState } from 'react';

import { webRtcSocketIo } from '@/apis/socketApi';

interface VoiceChatContextType {
  isSpeaker: boolean;
  isMic: boolean;
}

interface VoiceChangeContextType {
  toggleMic: () => void;
  toggleSpeaker: () => void;
}

interface VoiceHandleContextType {
  joinUser: string[];
  handleJoinUser: (data: string[]) => void;
  myPeerConnection: any;
  peerFaceRef: React.MutableRefObject<{}>;
  makeConnection: (userId: string) => void;
}

export const VoiceChatContext = createContext<VoiceChatContextType | null>(null);
export const VoiceChangeContext = createContext<VoiceChangeContextType | null>(null);
export const VoiceHandleContext = createContext<VoiceHandleContextType | null>(null);

export const useVoiceChat = () => {
  const voiceContext = useContext(VoiceChatContext) as VoiceChatContextType;

  if (!voiceContext) {
    throw new Error('useVoice must be used within a voiceContextProvider');
  }

  return voiceContext;
};

export const useVoiceChange = () => {
  const voiceChangeContext = useContext(VoiceChangeContext) as VoiceChangeContextType;

  if (!voiceChangeContext) {
    throw new Error('useVoiceChange must be used within a VoiceChangeContextProvider');
  }

  return voiceChangeContext;
};

export const useVoiceHandle = () => {
  const voiceHandleContext = useContext(VoiceHandleContext) as VoiceHandleContextType;

  if (!voiceHandleContext) {
    throw new Error('useVoiceHandle must be used within a VoiceHandleContextProvider');
  }

  return voiceHandleContext;
};

const VoiceChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isSettingSpeaker, setIsSettingSpeaker] = useState<boolean>(true);
  const [isMic, setIsMic] = useState<boolean>(true);
  const [isSettingMic, setIsSettingMic] = useState<boolean>(true);

  const [joinUser, setJoinUser] = useState([]);

  const myFaceRef = useRef(); //내 비디오 요소
  const peerFaceRef = useRef<Record<string, HTMLVideoElement>>({}); //상대방 비디오 요소
  const myStream = useRef(null);
  const myPeerConnection = useRef<any>({}); //피어 연결 객체

  const handleJoinUser = (data) => {
    setJoinUser(data);
  };

  const toggleSpeaker = useCallback(() => {
    setIsSettingSpeaker((prev) => !prev);
    setIsSpeaker(!isSettingSpeaker);
  }, [isSettingSpeaker, setIsSpeaker]);

  const toggleMic = useCallback(() => {
    setIsSettingMic((prev) => !prev);
    setIsMic(!isSettingMic);
  }, [isSettingMic, setIsMic]);

  const handleIce = (data, title, id) => {
    webRtcSocketIo.emit('ice', {
      title,
      icecandidate: data.candidate,
      to: id,
    });
  };

  const makeConnection = (id, title) => {
    myPeerConnection.current[id] = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
      iceTransportPolicy: 'all',
      bundlePolicy: 'balanced',
      rtcpMuxPolicy: 'require',
      iceCandidatePoolSize: 0,
    });

    myPeerConnection.current[id].addEventListener('icecandidate', (data) =>
      handleIce(data, title, id),
    );

    myPeerConnection.current[id].oniceconnectionstatechange = () => {
      if (myPeerConnection.current[id].iceConnectionState === 'disconnected') {
        myPeerConnection.current[id].close();
        delete myPeerConnection.current[id];
      }
    };

    myPeerConnection.current[id].ontrack = (event) => {
      let videoElement = peerFaceRef.current[id];
      if (!videoElement) {
        // Create a new video element if it doesn't exist
        const newVideoElement = document.createElement('video');
        newVideoElement.autoplay = true;
        newVideoElement.style.display = 'block';
        newVideoElement.ref = (el) => {
          peerFaceRef.current[id] = el;
        };
        document.body.appendChild(newVideoElement);
        videoElement = newVideoElement;
      }
      videoElement.srcObject = event.streams[0];
    };

    if (myStream.current) {
      myStream.current
        .getTracks()
        .forEach((track) => myPeerConnection.current[id].addTrack(track, myStream.current));
    }
  };

  const voiceChatContextValue = { isSpeaker, isMic };
  const voiceHandleContextValue = {
    myStream,
    myFaceRef,
    joinUser,
    handleJoinUser,
    myPeerConnection,
    peerFaceRef,
    makeConnection,
  };
  const voiceChangeContextValue = { toggleSpeaker, toggleMic };

  return (
    <VoiceChatContext.Provider value={voiceChatContextValue}>
      <VoiceHandleContext.Provider value={voiceHandleContextValue}>
        <VoiceChangeContext.Provider value={voiceChangeContextValue}>
          {children}
        </VoiceChangeContext.Provider>
      </VoiceHandleContext.Provider>
    </VoiceChatContext.Provider>
  );
};

export default VoiceChatProvider;
