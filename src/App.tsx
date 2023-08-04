import { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import PageRouter from '@/routes';

import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <PageRouter />
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
