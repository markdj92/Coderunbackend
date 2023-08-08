import { useRef, useEffect, useState } from 'react';
import { CirclePicker } from 'react-color';
import { AiFillDelete } from 'react-icons/ai';
import { IoColorPaletteSharp } from 'react-icons/io5';
import io, { Socket } from 'socket.io-client';
import styled from 'styled-components';

type CanvasBoardType = {
  roomKey: string;
  handleSocket?: (soc: Socket) => void;
};

const CanvasBoard = (props: CanvasBoardType) => {
  const { handleSocket } = props;
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const socketRef = useRef<Socket>();
  const [isChecked, setIsChecked] = useState(true);

  const handleBoard = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');
    const colors = document.getElementsByClassName('color');
    const current = {
      color: '#eeeeee',
      x: 0,
      y: 0,
    };

    const removeCanvas = () => {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    const removeBtn = document.getElementsByClassName('removeBtn')[0];
    removeBtn.addEventListener('click', removeCanvas, false);

    const onColorUpdate = (e: any) => {
      let arr = e.target.style.MozBoxShadow.split(' ');
      current.color = arr[arr.length - 1];
    };

    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }
    let drawing = false;

    const drawLine = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      color: string,
      emit: boolean,
    ) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }
      const w = canvas.width;
      const h = canvas.height;

      if (!socketRef.current) return;
      socketRef.current.emit('drawing', {
        roomKey: props.roomKey,
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
      });
    };

    const onMouseDown = (e: any) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseMove = (e: any) => {
      if (!drawing) {
        return;
      }
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true,
      );
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e: any) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true,
      );
    };

    const throttle = (callback: any, delay: number) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize, false);
    onResize();

    const onDrawingEvent = (data: any) => {
      const w = canvas.width;
      const h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, false);
    };

    // socketRef.current = io('http://localhost:3004', {
    socketRef.current = io('http://52.69.242.42:3100', {
      path: '/canvas/',
    });
    if (!!handleSocket) {
      handleSocket(socketRef.current);
    }
    socketRef.current.emit('joinRoom', props.roomKey);
    socketRef.current.on('drawing', onDrawingEvent);
  }, []);

  let [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
    '#eeeeee',
  ];
  const circleSize = 35;
  const circleSpacing = 10;

  return (
    <Container>
      <Whiteboard isChecked={isChecked}>
        <ColorWrapper ref={colorsRef} className='colors'>
          <CanvasBox ref={canvasRef} />
        </ColorWrapper>
      </Whiteboard>

      <PalletWrapper>
        <button onClick={handleBoard}>{isChecked ? '그림판 끄기' : '그림판 켜기'}</button>
        <InvisibleWrapper isChecked={isChecked}>
          <AiFillDelete className='palleteBtn removeBtn' sx={{ fontSize: 40 }} />
          <IoColorPaletteSharp
            onClick={handleToggle}
            className='palleteBtn'
            sx={{ fontSize: 40 }}
          />
          <CircleWrapper toggle={toggle} circleSize={circleSize}>
            <CirclePicker
              width='auto'
              colors={colors}
              circleSpacing={circleSpacing}
              circleSize={circleSize}
              className='color'
            />
          </CircleWrapper>
        </InvisibleWrapper>
      </PalletWrapper>
    </Container>
  );
};

const Container = styled.div`
  * {
    box-sizing: border-box;
  }
`;

const ColorWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  bottom: calc(0%);
`;

const PalletWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: fixed;
  left: calc(75px + 1%);
  bottom: 2%;
  max-width: calc(100vw - 100px);
`;

const CanvasBox = styled.canvas`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  cursor: url('data:image/x-icon;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrWUD/a1lA/xYWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8vLy/2tZQP9rWUD/a1lA/xALBwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD5T8f8+U/H/9fX1/2tZP/9rWUD/a1lA/zonIA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+U/H/PlPx/z5T8f9YcP//7u7u/2tZQP9rWUD/a1lA/11LKxUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPlPx/z5T8f8+U/H/WHD//1hw//9YcP//7u7u/2xaQv9rWUD/a1lA/1NBLzwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD5T8f8+U/H/PlPx/1hw//9YcP//WHD//1hw//9YcP//8fHx/21bRP9rWUD/a1lA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+U/H/PlPx/z5T8f9YcP//WHD//1hw//9YcP//WHD//1hw//8+U/H/7Ozs/2tYQP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPlPx/z5T8f8+U/H/WHD//1hw//9YcP//WHD//1hw//9YcP//PlPx/z5T8f8+U/H/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD5T8f8+U/H/PlPx/1hw//9YcP//WHD//1hw//9YcP//WHD//z5T8f8+U/H/PlPx/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+U/H/PlPx/z5T8f9YcP//WHD//1hw//9YcP//WHD//1hw//8+U/H/PlPx/z5T8f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPlPx/z5T8f9Zsf3/WHD//1hw//9YcP//WHD//1hw//9YcP//PlPx/z5T8f8+U/H/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFzS//9c0v//XNL//1zS//9YcP//WHD//1hw//9YcP//WHD//z5T8f8+U/H/PlPx/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXNL//1zS//9c0v//XNL//1hw//9YcP//WHD//1hw//8+U/H/PlPx/z5T8f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABc0v//XNL//1zS//9c2f//WHD//1hx//9c2P//PlPx/z5T8f8+U/H/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXNL//1zS//9c0v//XNL//1zS//9c0v//XNL//1zS//8+U/H/PlPx/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADx3z7/XNL//1zS//9c0v//XNL//1zS//9c0v//XNL//z5T8f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPHfPv/x3z7/XNL//1zS//9c0v//XNL//1zS//9d1///AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8d8+//HfPv/x3z7/XdX//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////5////8P///+B////AP///gB///wAP//4AH//8AD//+AB///AA///gAf//wAP//8AH///AD///gB///4A///+Af///h////////////////////////////////////////8='),
    auto;
`;

const CircleWrapper = styled.div<{
  toggle: boolean;
  circleSize: number;
}>`
  display: flex;
  height: ${(props) => `${props.circleSize}px`};
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  transform: ${(props) => (props.toggle ? 'translateY(0)' : 'translateY(100px)')};
  .color {
    display: flex;
    width: fit-content;
  }
`;

const Whiteboard = styled.div<{ isChecked: boolean }>`
  display: ${(props) => (props.isChecked ? 'fixed' : 'none')};
  overflow: ${(props) => (props.isChecked ? 'hidden' : 'visible')};
  width: 100%;
  height: 100%;
`;

const InvisibleWrapper = styled.div<{ isChecked: boolean }>`
  display: ${(props) => (props.isChecked ? 'flex' : 'none')};
  align-items: center;
  gap: 10px;

  .palleteBtn {
    display: flex;
    position: relative;
    color: aliceblue;
    bottom: 0;
    margin-bottom: 7px;
    cursor: pointer;
  }

  .palleteBtn:hover {
    scale: 1.2;
    transition: all 0.2s;
  }
`;

export default CanvasBoard;
