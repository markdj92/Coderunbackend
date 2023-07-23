import styled from 'styled-components';

type ModalProps = {
  children: React.ReactNode;
  handleHideModal: () => void;
};

const Modal = ({ children, handleHideModal }: ModalProps) => {
  return (
    <>
      <Backdrop onClick={handleHideModal} />
      <ModalOverlay>{children}</ModalOverlay>
    </>
  );
};

const ModalOverlay = styled.div`
  letter-spacing: 0.4rem;

  position: absolute;
  height: 70vh;
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);

  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 5px 10px rgba(211, 211, 211, 0.25);

  z-index: 30;
  animation: slide-up 300ms ease-out forwards;

  @media (min-width: 768px) {
    width: 40rem;
    left: calc(50% - 20rem);
  }

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

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.3);
`;

export default Modal;
