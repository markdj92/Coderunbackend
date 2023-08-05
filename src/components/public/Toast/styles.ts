import styled from 'styled-components';

import {
  ToastContainerStyleProps,
  ProgressBarStyleProps,
  ToastStyles,
  MessageStyleProps,
  ToastPositions,
} from '@/types/toast';

const progressBarHeight = '5px';

const ToastTheme: ToastStyles = {
  success: {
    bgColor: 'var(--toastSuccessBgColor)',
    progressBarColor: 'var(--toastSuccessProgressBarColor)',
    color: 'var(--white)',
  },
  warning: {
    bgColor: 'var(--toastWarningBgColor)',
    progressBarColor: 'var(--toastWarningProgressBarColor)',
    color: 'var(--toastWarningTextColor)',
  },
  error: {
    bgColor: 'var(--toastErrorBgColor)',
    progressBarColor: 'var(--toastErrorProgressBarColor)',
    color: 'var(--white)',
  },
  info: {
    bgColor: 'var(--toastInfoBgColor)',
    progressBarColor: 'var(--toastInfoProgressBarColor)',
    color: 'var(--white)',
  },
};

const positions: ToastPositions = {
  topLeft: {
    top: '12px',
    left: '12px',
  },
  topRight: {
    top: '12px',
    right: '12px',
  },
  topCenter: {
    top: '12px',
    left: '50%',
    translateX: '-50%',
  },
  bottomLeft: {
    bottom: '12px',
    left: '12px',
  },
  bottomRight: {
    bottom: '12px',
    right: '12px',
  },
  bottomCenter: {
    bottom: '12px',
    left: '50%',
    translateX: '-50%',
  },
};

export const ToastContainer = styled.div<ToastContainerStyleProps>`
  position: fixed;
  z-index: 99;
  top: ${({ position }) => positions[position].top};
  bottom: ${({ position }) => positions[position].bottom};
  left: ${({ position }) => positions[position].left};
  right: ${({ position }) => positions[position].right};
  transform: translateX(${({ position }) => positions[position].translateX});
`;

export const Toast = styled.div<ProgressBarStyleProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  min-height: 30px;
  border-radius: 5px 5px 0px 0px;
  margin-bottom: 1em;
  padding: 0.7em 0.7em calc(0.7em + ${progressBarHeight});
  background-color: ${({ messageType }) => ToastTheme[messageType].bgColor};
  animation: flipIn ${({ duration }) => Math.min(400, duration / 1.5)}ms;

  & > svg {
    fill: ${({ messageType }) => ToastTheme[messageType].color};
    margin-right: 0.5em;
  }

  @keyframes flipIn {
    from {
      transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      animation-timing-function: ease-in;
      opacity: 0;
    }
    40% {
      transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      animation-timing-function: ease-in;
    }
    60% {
      transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      opacity: 1;
    }
    80% {
      transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }
    to {
      transform: perspective(400px);
    }
  }
`;

export const Message = styled.p<MessageStyleProps>`
  width: 300px;
  max-height: 60px;
  margin: 0;
  word-break: break-all;
  color: ${({ messageType }) => ToastTheme[messageType].color};
  overflow: hidden;
`;

export const CloseButton = styled.button<MessageStyleProps>`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  & > svg {
    fill: ${({ messageType }) => ToastTheme[messageType].color};
  }
`;

export const ProgressBar = styled.div<ProgressBarStyleProps>`
  position: absolute;
  left: 0;
  bottom: 0;
  height: ${progressBarHeight};
  background-color: ${({ messageType }) => ToastTheme[messageType].progressBarColor};
  animation: progressBar ${({ duration }) => duration}ms linear;

  @keyframes progressBar {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
`;
