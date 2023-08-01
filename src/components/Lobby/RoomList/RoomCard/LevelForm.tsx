import styled from 'styled-components';

import StarIcon from '/icon/lobby/star.png';

interface props {
  level: number;
}

const LevelForm = ({ level }: props) => {
  return (
    <Container>
      {Array.from({ length: level }).map((_, idx) => (
        <StarBox opacity={((idx + 1) / 5).toString()}>
          <img key={idx} src={StarIcon} alt='' />
        </StarBox>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 76px;
  height: 18px;
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const StarBox = styled.div<{ opacity: string }>`
  width: 12px;
  height: 12px;
  object-fit: cover;
  opacity: ${(props) => props.opacity};
  img {
    width: 100%;
  }
`;

export default LevelForm;
