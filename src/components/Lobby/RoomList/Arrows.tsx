import styled from 'styled-components';

import ArrowLeft from '/icon/lobby/arrowLeft.png';
import ArrowRight from '/icon/lobby/arrowRight.png';

const Arrows = ({
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
      <Button onClick={handleLeftClick}>
        <img src={ArrowLeft} alt='' />
      </Button>
      <Button onClick={handleRightClick}>
        <img src={ArrowRight} alt='' />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 150px;
  margin: 20px;
  padding-left: 20px;
`;

const Button = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color.MainKeyLightColor};
  cursor: pointer;
  img {
    filter: grayscale(100%);
  }
`;

export default Arrows;
