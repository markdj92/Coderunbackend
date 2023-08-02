import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  icon: React.ReactNode;
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
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
`;

const ButtonBox = styled.div<{ active: string }>`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid rgba(136, 131, 255, 0.2);
  background: ${(props) => (props.active === 'true' ? '#4640C6' : 'rgba(70, 64, 198, 0.2)')};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconBox = styled.div<{ active: string }>`
  width: 40px;
  height: 40px;
  object-fit: contain;
  img {
    width: 100%;
    -webkit-filter: ${(props) =>
      props.active === 'true' && 'opacity(0.5) drop-shadow(0 0 0 white)'};
    filter: ${(props) => props.active === 'true' && 'opacity(0.5) drop-shadow(0 0 0 white)'};
  }
`;

export default IconButton;
