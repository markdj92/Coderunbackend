export type MessageType = 'success' | 'warning' | 'error' | 'info';
export type ToastPosition =
  | 'topLeft'
  | 'topRight'
  | 'topCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'bottomCenter';
export type Theme = 'light' | 'dark';

export interface ToastProps {
  position: ToastPosition;
  messages: Message[];
  closeMessage: (id: string, position: ToastPosition) => void;
}

export interface ToastArgs {
  message: string;
  position?: ToastPosition;
  duration?: number;
  maxNumOfMessages?: number;
}

interface ToastStyle {
  bgColor: string;
  progressBarColor: string;
  color: string;
}

export interface ToastStyles {
  success: ToastStyle;
  warning: ToastStyle;
  error: ToastStyle;
  info: ToastStyle;
}

export interface Message {
  id: string;
  message: string;
  type: MessageType;
  duration: number;
}

interface ToastPositionValues {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  translateX?: string;
}

export type ToastPositions = {
  [key in ToastPosition]: ToastPositionValues;
};

export interface MessageStyleProps {
  messageType: MessageType;
}

export interface ProgressBarStyleProps extends MessageStyleProps {
  duration: number;
}

export interface ToastContainerStyleProps {
  position: ToastPosition;
}
