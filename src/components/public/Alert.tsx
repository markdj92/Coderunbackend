import { styled } from 'styled-components';

import Modal from '../public/Modal';

const Alert = ({
  title,
  children,
  handleCloseAlert,
  handleAlert,
  backDropOpacity,
}: {
  title: string;
  children?: React.ReactNode;
  handleCloseAlert: () => void;
  handleAlert?: () => void;
  backDropOpacity?: number;
}) => {
  return (
    <Modal handleHideModal={handleCloseAlert} backDropOpacity={backDropOpacity}>
      <MSG>{title}</MSG>
      {children}
      <Buttons>
        {handleAlert && <Button onClick={handleAlert}>YES</Button>}
        {handleAlert ? (
          <Button onClick={handleCloseAlert}>NO</Button>
        ) : (
          <Button onClick={handleCloseAlert}>Close</Button>
        )}
      </Buttons>
    </Modal>
  );
};
const MSG = styled.div`
  color: #8883ff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 44px; /* 137.5% */
  letter-spacing: -0.64px;
`;
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 514px;
  margin-top: 7px;
  gap: 10px;
`;
const Button = styled.div`
  color: #e2e0ff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px; /* 100% */

  display: flex;
  width: 50%;
  padding: 16px 20px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: linear-gradient(
      90deg,
      rgba(70, 64, 198, 0) 0%,
      rgba(70, 64, 198, 0.4) 31.07%,
      rgba(70, 64, 198, 0.4) 72.03%,
      rgba(70, 64, 198, 0.13) 100%
    ),
    rgba(112, 0, 255, 0.2);
  border: 2.4px solid rgba(70, 64, 198, 1);
  box-shadow: 0px 0px 12px 0px rgba(78, 0, 244, 0.4);
  backdrop-filter: blur(12px);
  cursor: pointer;
  &:hover {
    border: 2.4px solid rgba(53, 53, 98, 1);
    background: linear-gradient(
        90deg,
        rgba(43, 43, 87, 0) 0%,
        rgba(53, 53, 99, 0.4) 31.07%,
        rgba(53, 53, 99, 0.4) 72.03%,
        rgba(43, 43, 87, 0.5) 100%
      ),
      rgba(112, 0, 255, 0.2);
  }
`;
export default Alert;
