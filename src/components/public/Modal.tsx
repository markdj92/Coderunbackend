import styled from 'styled-components';

import { Loading } from './Loading';

type ModalProps = {
  children: React.ReactNode | string;
  handleHideModal: () => void;
  backDropOpacity?: number;
  isBlurEffect?: boolean;
  isLoading?: boolean;
};

const Modal = ({
  children,
  handleHideModal,
  backDropOpacity = 0.8,
  isBlurEffect = true,
  isLoading = false,
}: ModalProps) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleHideModal();
    }
  };
  window.addEventListener('keyup', (e: KeyboardEvent) => handleKeyPress(e));

  return (
    <>
      <Backdrop
        backdropopacity={backDropOpacity}
        isblur={isBlurEffect.toString()}
        onClick={() => {}}
      />
      <ModalOverlay>
        {isLoading && (
          <SpinnerFrame onClick={() => {}}>
            <Loading />
          </SpinnerFrame>
        )}
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
              fill='#838393'
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
  /* cursor: pointer; */
`;
const SpinnerFrame = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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

  /* box-shadow:
    0px 4px 32px 0px #12112780,
    0px 4px 2px 0px #15124952 inset; */

  box-shadow:
    0px 4px 58px 0px #59fff580,
    0px 4px 2px 0px #15124952 inset;

  z-index: 30;
  animation: slide-up 300ms ease-out forwards;
  border-radius: 1rem;
  background: ${(props) => props.theme.color.Black};

  border: 2.4px solid ${(props) => props.theme.color.MainKeyColor};

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

const Backdrop = styled.div<{ backdropopacity: number; isblur: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  background-color: ${(props) => `rgba(7, 7, 0.8, ${props.backdropopacity})`};
  -webkit-backdrop-filter: ${(props) => props.isblur === 'true' && 'blur(4px)'};
  backdrop-filter: ${(props) => props.isblur === 'true' && 'blur(4px)'};
`;

export default Modal;
