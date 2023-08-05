import styled from 'styled-components';

type ModalProps = {
  children: React.ReactNode | string;
  handleHideModal: () => void;
  backDropOpacity?: number;
};

const Modal = ({ children, handleHideModal, backDropOpacity }: ModalProps) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleHideModal();
    }
  };
  window.addEventListener('keyup', (e: KeyboardEvent) => handleKeyPress(e));

  return (
    <>
      <Backdrop
        backdropopacity={`${backDropOpacity ? backDropOpacity.toString() : ''}`}
        onClick={() => {}}
      />
      <ModalOverlay>
        <CloseButton onClick={handleHideModal}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
          >
            <path
              d='M20.0356 23.1226L27.7961 30.929L31 27.8064L23.1683 20L31 12.1935L27.7961 9.07097L20.0356 16.8065L12.1327 9L9 12.1935L16.8317 20L9 27.8064L12.1327 31L20.0356 23.1226Z'
              fill='#8883FF'
            />
          </svg>
        </CloseButton>
        {children}
      </ModalOverlay>
    </>
  );
};
const CloseButton = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  position: fixed;
  right: 2.5rem;
  top: 2.5rem;
  cursor: pointer;
`;
const ModalOverlay = styled.div`
  display: inline-flex;
  flex-direction: column;

  position: relative;

  padding: 60px 100px 50px 100px;
  justify-content: center;
  align-items: center;
  gap: 2.3125rem;
  flex-shrink: 0;

  position: absolute;
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);

  box-shadow: 0 5px 10px rgba(211, 211, 211, 0.25);

  z-index: 30;
  animation: slide-up 300ms ease-out forwards;

  border: 2.4px solid #8883ff;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(70, 64, 198, 0.32) 0%, rgba(70, 64, 198, 0) 100%),
    linear-gradient(0deg, rgba(70, 64, 198, 0.2) 0%, rgba(70, 64, 198, 0.2) 100%),
    rgba(15, 18, 31, 0.24);

  box-shadow:
    0px 4px 32px 0px rgba(18, 17, 39, 0.5),
    0px 4px 2px 0px rgba(21, 18, 73, 0.32) inset;
  backdrop-filter: blur(9px);

  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Backdrop = styled.div<{ backdropopacity: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  opacity: ${(props) => props.backdropopacity};
  background-color: rgba(5, 4, 31, 0.8);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
`;

export default Modal;
