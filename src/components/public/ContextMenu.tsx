//@ts-nocheck
import React, { useState, useCallback, useEffect, ReactNode, MouseEvent } from 'react';
import styled from 'styled-components';

const useContextMenu = (outerRef: React.MutableRefObject<HTMLDivElement>) => {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [menu, showMenu] = useState(false);

  const handleContextMenu = useCallback(
    (event) => {
      setXPos(`${event.pageX - 25}px`);
      setYPos(`${event.pageY - 40}px`);
      if (
        outerRef.current.getBoundingClientRect().top <= event.pageY &&
        outerRef.current.getBoundingClientRect().bottom >= event.pageY &&
        outerRef.current.getBoundingClientRect().left <= event.pageX &&
        outerRef.current.getBoundingClientRect().right >= event.pageX
      ) {
        event.preventDefault();
        showMenu(true);
      } else {
        showMenu(false);
      }
    },
    [showMenu, outerRef, setXPos, setYPos],
  );

  const handleClick = useCallback(() => {
    showMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.addEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  return { xPos, yPos, menu, showMenu };
};

export const Menu = ({
  outerRef,
  menuOnClick,
  children,
}: {
  outerRef: React.MutableRefObject<HTMLDivElement>;
  menuOnClick: (
    event: React.MouseEvent<HTMLUListElement, MouseEvent> | React.KeyboardEvent<HTMLUListElement>,
  ) => void;
  children: ReactNode;
}) => {
  const { xPos, yPos, menu, showMenu } = useContextMenu(outerRef);

  const menuOnClickHandler = (
    e: React.MouseEvent<HTMLUListElement, MouseEvent> | React.KeyboardEvent<HTMLUListElement>,
  ) => {
    e.stopPropagation();
    menuOnClick(e);
    showMenu(false);
  };

  if (menu) {
    return (
      <MenuList
        top={yPos}
        left={xPos}
        onClick={(e) => menuOnClickHandler(e)}
        onKeyDown={(e) => menuOnClickHandler(e)}
        role='menu'
      >
        {children}
      </MenuList>
    );
  }
  return null;
};

const MenuList = styled.ul<{ top: string; left: string }>`
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  position: absolute;
  z-index: 100;

  padding-left: 0;
  margin: 0;

  border-radius: 2px;
  list-style: none;

  box-shadow: 1px 1px 1px gray;
  background-color: #fff;

  li {
    padding: 0.3em 1em;

    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border-top: 1px solid #edf2f7;

    color: #000;
    background-color: #fff;
  }

  li:hover {
    background-color: #f7fafc;
  }
`;
