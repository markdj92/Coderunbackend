import { createContext, useCallback, useContext, useState } from 'react';

interface VoiceChatContextType {
  isSpeaker: boolean;
  isMic: boolean;
}

interface VoiceChangeContextType {
  toggleMic: () => void;
  toggleSpeaker: () => void;
}

export const VoiceChatContext = createContext<VoiceChatContextType | null>(null);
export const VoiceChangeContext = createContext<VoiceChangeContextType | null>(null);

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

const VoiceChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isSettingSpeaker, setIsSettingSpeaker] = useState<boolean>(true);
  const [isMic, setIsMic] = useState<boolean>(true);
  const [isSettingMic, setIsSettingMic] = useState<boolean>(true);

  // const myPeerConnection = useRef({}); //피어 연결 객체
  // const roomName = useRef(); //참관코드 - RTC 연결에 사용되는 변수
  // const [joinUser, setJoinUser] = useState([]); //접속한 유저 정보

  const toggleSpeaker = useCallback(() => {
    setIsSettingSpeaker((prev) => !prev);
    setIsSpeaker(!isSettingSpeaker);
  }, [isSettingSpeaker, setIsSpeaker]);

  const toggleMic = useCallback(() => {
    setIsSettingMic((prev) => !prev);
    setIsMic(!isSettingMic);
  }, [isSettingMic, setIsMic]);

  const voiceChatContextValue = { isSpeaker, isMic };
  const voiceChangeContextValue = { toggleSpeaker, toggleMic };

  return (
    <VoiceChatContext.Provider value={voiceChatContextValue}>
      <VoiceChangeContext.Provider value={voiceChangeContextValue}>
        {children}
      </VoiceChangeContext.Provider>
    </VoiceChatContext.Provider>
  );
};

export default VoiceChatProvider;
