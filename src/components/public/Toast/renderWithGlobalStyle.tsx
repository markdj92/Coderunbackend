import { ReactNode } from 'react';
import { Container, render } from 'react-dom';

import GlobalStyle from './GlobalStyle';

export default function boundRenderWithGlobalStyle(children: ReactNode, container: Container) {
  render(
    <>
      <GlobalStyle />
      {children}
    </>,
    container,
  );
}
