import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from 'react-icons/io';
import styled from 'styled-components';

const Arrows = ({
  size,
  totalPage,
  page,
  setPage,
}: {
  size: string;
  totalPage: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleLeftClick = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const handleRightClick = () => {
    if (page === totalPage) return setPage(totalPage);
    setPage(page + 1);
  };
  return (
    <Container>
      <button onClick={handleLeftClick}>
        <IoMdArrowDropleftCircle size={size} />
      </button>
      <button onClick={handleRightClick}>
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
