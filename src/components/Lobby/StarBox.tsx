import styled from 'styled-components';

import StarIcon from '/icon/lobby/star.png';

interface Props {
  opacity: number;
}

const StarBox = ({ opacity }: Props) => {
  return (
    <Container opacity={opacity.toString()}>
      <img src={StarIcon} alt='' />
    </Container>
  );
};

const Container = styled.div<{ opacity: string }>`
  width: 12px;
  height: 12px;
  object-fit: cover;
  opacity: ${(props) => props.opacity};
  img {
    width: 100%;
  }
`;

export default StarBox;
