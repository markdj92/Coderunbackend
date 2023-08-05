import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html {
    --white: hsla(0, 0%, 100%);
    --toastSuccessBase: 143, 88%;
    --toastWarningBase: 43, 86%;
    --toastInfoBase: 207, 90%;
    --toastErrorBase: 9, 83%;
    --toastSuccessBgColor: hsla(var(--toastSuccessBase), 33%);
    --toastSuccessProgressBarColor: hsla(var(--toastSuccessBase), 63%);
    --toastWarningBgColor: hsla(var(--toastWarningBase), 48%);
    --toastWarningProgressBarColor: hsla(var(--toastWarningBase), 78%);
    --toastWarningTextColor: hsla(var(--toastWarningBase), 10%);
    --toastInfoBgColor: hsla(var(--toastInfoBase), 46%);
    --toastInfoProgressBarColor: hsla(var(--toastInfoBase), 82%);
    --toastErrorBgColor: hsla(var(--toastErrorBase), 52%);
    --toastErrorProgressBarColor: hsla(var(--toastErrorBase), 76%);
  }
`;
