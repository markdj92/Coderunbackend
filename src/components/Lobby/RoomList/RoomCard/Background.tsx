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
  min-width: 484px;
  min-height: 184px;
  width: 40%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  &:hover .card-shape {
    box-shadow: 0px 0px 24px 0px #59fff5;
  }
`;

const RoomCardShape = styled.div`
  background:
    linear-gradient(#26262d, #26262d) padding-box,
    linear-gradient(to bottom right, #6bd9a4, transparent) border-box,
    border-box;
  border: 3px solid transparent;

  min-width: 430px;
  min-height: 184px;
  width: 80%;
  height: 100%;

  transform: sKewX(-15deg);
  border-radius: 30px;
  filter: drop-shadow(0px 2px 8px ${(props) => props.theme.color.NonFocused});
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
