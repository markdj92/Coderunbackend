import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const QuizHeader = ({
  roomName,
  title,
  timer,
}: {
  roomName: string;
  title?: string;
  timer?: { mm: number; ss: number };
}) => {
  const [minutes, setMinutes] = useState<number>(timer ? timer.mm : 0);
  const [seconds, setSeconds] = useState<number>(timer ? timer.ss : 0);
  const navigate = useNavigate();
  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countdown);
          navigate('/result', { state: { title: roomName } });
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return (
    <Container>
      <Title>{title}</Title>
      <TimerBox>
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </TimerBox>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid #172334;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-weight: 400;
  padding: 0.5rem;
  font-size: 1.2rem;
`;

const TimerBox = styled.div`
  font-size: 1.2rem;
  background-color: #172334;
  color: #fff;
  letter-spacing: 2px;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
`;

export default QuizHeader;
