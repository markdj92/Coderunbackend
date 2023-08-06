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
  color: ${(props) => props.theme.color.LightGray};
  text-align: center;
  font-family: ${(props) => props.theme.font.Content};
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
  background: rgba(70, 70, 70, 0.2);
  border: 2.4px solid ${(props) => props.theme.color.MainKeyColor};
  box-shadow: 0px 4px 2px 0px rgba(16, 16, 16, 1) inset;
  backdrop-filter: blur(12px);
  cursor: pointer;
  &:hover {
    border: 2.4px solid #538a6f;
    background: rgba(0, 0, 0, 0.12);
    box-shadow: 0px 4px 2px 0px #101010 inset;
    backdrop-filter: blur(12px);
    color: ${(props) => props.theme.color.DarkGray};
  }
`;
export default Alert;
