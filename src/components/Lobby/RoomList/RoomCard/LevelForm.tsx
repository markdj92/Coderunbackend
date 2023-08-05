import styled from 'styled-components';

import StarBox from '@/components/Lobby/StarBox';

interface props {
  level: number;
}

const LevelForm = ({ level }: props) => {
  return (
    <Container>
      {Array.from({ length: level }).map((_, idx) => (
        <StarBox key={idx} opacity={(idx + 1) / 5} />
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

export default LevelForm;
