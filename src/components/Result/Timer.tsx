import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Timer = ({ reviewStatus, roomName }: { reviewStatus: boolean; roomName: string }) => {
  const [seconds, setSeconds] = useState<number>(60);
  const navigate = useNavigate();
  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      if (seconds === 0) {
        // 시간이 끝나면 리뷰 선택한 사람들 수 세기 -> 리뷰페이지로 이동
        if (reviewStatus) {
          navigate('/review');
        } else {
          navigate(`/room/${roomName}`);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [seconds]);
  return <Time>{seconds < 10 ? `0${seconds}` : seconds}</Time>;
};
const Time = styled.div`
  font-size: 5rem;
  font-weight: 800;
  font-style: italic;
  text-align: center;
`;
export default Timer;
