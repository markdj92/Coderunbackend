//@ts-nocheck
import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface VoiceChatContextType {
  isSpeaker: boolean;
  isMic: boolean;
}

interface VoiceChangeContextType {
  toggleMic: () => void;
  toggleSpeaker: () => void;
}

interface VoiceHandleContextType {
  localVideoRef: React.MutableRefObject<HTMLVideoElement>;
  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  myPeerConnection: Record<string, RTCPeerConnection>;
  peerFaceRef: Record<string, HTMLVideoElement>;
  myStream: MediaStream | undefined;
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

  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState();
  const myPeerConnection = useRef({});
  const peerFaceRef = useRef({});
  const myStream = useRef(undefined);

  const toggleSpeaker = useCallback(() => {
    setIsSettingSpeaker((prev) => !prev);
    setIsSpeaker(!isSettingSpeaker);
  }, [isSettingSpeaker, setIsSpeaker]);

  const toggleMic = useCallback(() => {
    setIsSettingMic((prev) => !prev);
    setIsMic(!isSettingMic);
  }, [isSettingMic, setIsMic]);

  const voiceChatContextValue = { isSpeaker, isMic };
  const voiceHandleContextValue = {
    localVideoRef,
    localStream,
    setLocalStream,
    myPeerConnection,
    peerFaceRef,
    myStream,
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
