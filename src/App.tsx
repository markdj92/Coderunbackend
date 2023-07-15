import { Suspense } from 'react';

import PageRouter from '@/routes';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageRouter />
    </Suspense>
  );
}

export default App;
