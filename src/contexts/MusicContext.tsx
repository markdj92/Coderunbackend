import { createContext, useCallback, useContext, useState } from 'react';

interface MusicContextType {
  isMusic: boolean;
  isSettingMusic: boolean;
  setIsMusic: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MusicChangeContextType {
  toggleMusic: () => void;
}

export const MusicContext = createContext<MusicContextType | null>(null);
export const MusicChangeContext = createContext<MusicChangeContextType | null>(null);

export const useMusic = () => {
  const musicContext = useContext(MusicContext) as MusicContextType;

  if (!musicContext) {
    throw new Error('useMusic must be used within a MusicContextProvider');
  }

  return musicContext;
};

export const useMusicChange = () => {
  const musicChangeContext = useContext(MusicChangeContext) as MusicChangeContextType;

  if (!musicChangeContext) {
    throw new Error('useMusic must be used within a MusicContextProvider');
  }

  return musicChangeContext;
};

const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMusic, setIsMusic] = useState<boolean>(false);
  const [isSettingMusic, setIsSettingMusic] = useState<boolean>(false);

  const toggleMusic = useCallback(() => {
    setIsSettingMusic((prev) => !prev);
    setIsMusic(!isSettingMusic);
  }, [isSettingMusic, setIsMusic]);

  const musicContextValue = { isMusic, isSettingMusic, setIsMusic };
  const musicChangeContextValue = { toggleMusic };

  return (
    <MusicContext.Provider value={musicContextValue}>
      <MusicChangeContext.Provider value={musicChangeContextValue}>
        {children}
      </MusicChangeContext.Provider>
    </MusicContext.Provider>
  );
};

export default MusicProvider;
