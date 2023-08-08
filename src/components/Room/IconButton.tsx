import { useState } from 'react';
import styled from 'styled-components';

const IconButton = ({
  icon,
  hoverIcon,
  alt,
  onClick,
}: {
  icon: string;
  hoverIcon: string;
  alt: string;
  onClick?: () => void;
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Container
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick ? onClick : () => {}}
    >
      <IconBox ishover={isHover ? 'true' : 'false'}>
        {isHover ? (
          <img className='hover' src={hoverIcon} alt={alt} />
        ) : (
          <img className='default' src={icon} alt={alt} />
        )}
      </IconBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
`;

const IconBox = styled.div<{ ishover?: string }>`
  width: 70px;
  height: 70px;
  padding: 10px;
  border-radius: 50px;
  border: 2px solid rgba(131, 131, 147, 0.2);
  background: rgba(131, 131, 147, 0.2);
  object-fit: contain;
  display: flex;
  justify-content: center;
  align-items: center;

  .hover {
    display: ${(props) => (props.ishover === 'true' ? 'block' : 'none')};
  }

  &:hover {
    border: 2px solid #6bd9a4;
    background: rgba(107, 217, 164, 0.2);

    box-shadow:
      0px 0px 12px 0px rgba(89, 255, 245, 0.8),
      0px 4px 2px 0px rgba(21, 18, 73, 0.32) inset;

    .default {
      display: none;
    }
  }

  img {
    width: 90%;
  }
`;

export default IconButton;
