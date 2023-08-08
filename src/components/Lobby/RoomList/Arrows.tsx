import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
import styled from 'styled-components';

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
        <BiSolidLeftArrow size={20} />
      </Button>
      <Button onClick={handleRightClick}>
        <BiSolidRightArrow size={20} />
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
  background-color: ${(props) => props.theme.color.NonFocused};

  transition: all 0.5s ease;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.color.MainKeyDarkColor};
    box-shadow: 0 0 10px 0 ${(props) => props.theme.color.FocusShadow};
  }
  &:active {
    box-shadow:
      inset -0.3rem -0.1rem 1.4rem #838393,
      inset 0.3rem 0.4rem 0.8rem #92dab8;
    cursor: pointer;
  }
`;

export default Arrows;
