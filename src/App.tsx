import React from 'react';
import { ThemeProvider } from 'styled-components';

import PageRouter from '@/routes';

import MusicPlayerToggle from './components/public/MusicPlayerToggle';
import { ToastProvider, Toast } from './components/public/Toast';
import MusicProvider from './contexts/MusicContext';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';

const toastInstance = new Toast(document.getElementById('toast-root'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <MusicProvider>
        <ThemeProvider theme={theme}>
          <ToastProvider toastInstance={toastInstance}>
            <MusicPlayerToggle />
            <GlobalStyle />
            <PageRouter />
          </ToastProvider>
        </ThemeProvider>
      </MusicProvider>
    </React.Suspense>
  );
}

export default App;
