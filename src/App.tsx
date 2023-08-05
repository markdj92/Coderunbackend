import { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import PageRouter from '@/routes';

import { ToastProvider, Toast } from './components/public/Toast';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

const toastInstance = new Toast(document.getElementById('toast-root'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <ToastProvider toastInstance={toastInstance}>
          <GlobalStyle />
          <PageRouter />
        </ToastProvider>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
