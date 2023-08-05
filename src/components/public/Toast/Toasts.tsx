import * as Icon from './icons';
import * as Style from './styles';

import { MessageType, ToastProps } from '@/types/toast';

export default function Toasts({ position, messages, closeMessage }: ToastProps) {
  function getIcon(type: MessageType) {
    if (type === 'success') return <Icon.Success />;
    if (type === 'warning') return <Icon.Warning />;
    if (type === 'error') return <Icon.Error />;
    return <Icon.Info />;
  }

  return (
    <Style.ToastContainer position={position}>
      {messages.map(({ id, message, type, duration }) => (
        <Style.Toast
          key={id}
          messageType={type}
          duration={duration}
          aria-label={toastAriaLabel(type)}
        >
          {getIcon(type)}
          <Style.Message messageType={type}>{message}</Style.Message>
          <Style.CloseButton
            aria-label='Close toast message'
            type='button'
            messageType={type}
            onClick={() => closeMessage(id, position)}
          >
            <Icon.Close />
          </Style.CloseButton>
          <Style.ProgressBar messageType={type} duration={duration} />
        </Style.Toast>
      ))}
    </Style.ToastContainer>
  );
}

function toastAriaLabel(type: MessageType) {
  if (type === 'success') return 'Toast success message';
  if (type === 'info') return 'Toast info message';
  if (type === 'warning') return 'Toast warning message';
  return 'Toast error message';
}
