import { Suspense } from 'react';

import PageRouter from '@/routes';

import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalStyle />
      <PageRouter />
    </Suspense>
  );
}

export default App;
