import styled from 'styled-components';

import StarBox from '@/components/Lobby/StarBox';

interface props {
  level: number;
}

const LevelForm = ({ level }: props) => {
  return (
    <Container>
      <StarBox level={level} />
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
