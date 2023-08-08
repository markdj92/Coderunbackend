import { useState } from 'react';
import styled from 'styled-components';

interface Props {
  icon: string;
  alt?: string;
  onClick?: () => void;
}

const IconButton = ({ icon, alt = '', onClick }: Props) => {
  const [active, setActive] = useState('false');
  return (
    <Container>
      <ButtonBox
        onMouseOver={() => setActive('true')}
        onMouseOut={() => setActive('false')}
        onClick={onClick}
        active={active}
      >
        <IconBox active={active}>
          <img src={icon} alt={alt} />
        </IconBox>
      </ButtonBox>
    </Container>
  );
};

const Container = styled.div`
  width: 60px;
  height: 60px;
  * {
    /* cursor: pointer; */
    transition: 0.3s ease-in-out;
  }
`;

const ButtonBox = styled.div<{ active: string }>`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid rgba(131, 131, 147, 0.2);
  background: ${(props) =>
    props.active === 'true' ? 'rgba(107, 217, 164, 0.20)' : 'rgba(131, 131, 147, 0.20)'};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    box-shadow:
      0px 0px 12px 0px rgba(89, 255, 245, 0.8),
      0px 4px 2px 0px rgba(21, 18, 73, 0.32) inset;
  }

  &:active {
    box-shadow: 0px 0px 12px 0px rgba(89, 255, 245, 0.8) inset;
  }
`;

const IconBox = styled.div<{ active: string }>`
  width: 40px;
  height: 40px;
  object-fit: contain;
  img {
    width: 100%;
    -webkit-filter: ${(props) => props.active === 'false' && 'grayscale(100%)'};
    filter: ${(props) => props.active === 'false' && 'grayscale(100%)'};
  }
`;

export default IconButton;
