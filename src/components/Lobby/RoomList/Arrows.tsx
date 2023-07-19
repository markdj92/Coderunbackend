import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from 'react-icons/io';
import styled from 'styled-components';

const Arrows = ({ size }: { size: string }) => {
  return (
    <Container>
      <button>
        <IoMdArrowDropleftCircle size={size} />
      </button>
      <button>
        <IoMdArrowDroprightCircle size={size} />
      </button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 80px;
`;

export default Arrows;
