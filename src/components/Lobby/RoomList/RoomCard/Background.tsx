import { ReactNode } from 'react';
import styled from 'styled-components';

import Button from './Button';

interface props {
  title: ReactNode;
  mode: ReactNode;
  level: ReactNode;
  members: ReactNode;
  ready?: boolean;
}

const Background = ({ title, mode, level, members }: props) => {
  return (
    <Container>
      <RoomCardShape className='card-shape' />
      <TitleFrame>{title}</TitleFrame>
      <DetailFrame>
        {mode}
        {level}
        {members}
      </DetailFrame>
      <Button />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 484px;
  height: 184px;

  display: flex;
  justify-content: center;
  align-items: center;
  &:hover .card-shape {
    box-shadow: 4px 4px 30px 0px #5f27ff;
  }
`;

const RoomCardShape = styled.div`
  width: 430px;
  height: 184px;

  transform: sKewX(-15deg);
  border-radius: 30px;
  background: linear-gradient(140deg, rgba(109, 72, 255, 0.5) 0%, rgba(70, 64, 198, 0) 66.91%),
    rgba(0, 0, 0, 0.6);
  filter: drop-shadow(0px 2px 8px #8984ff);
  border: 1px solid #6761de;
  transition: 0.3s ease-in-out;
`;

const TitleFrame = styled.div`
  position: absolute;
  left: 66px;
  top: 34px;
`;

const DetailFrame = styled.div`
  display: flex;
  flex-direction: row;

  position: absolute;
  left: 66px;
  bottom: 0px;
`;

export default Background;
