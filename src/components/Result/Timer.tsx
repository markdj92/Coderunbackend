import styled from 'styled-components';

const Timer = ({ seconds }: { seconds: number }) => {
  return <Time>{seconds < 10 ? `0${seconds}` : seconds}</Time>;
};
const Time = styled.div`
  font-size: 5rem;
  font-weight: 800;
  font-style: italic;
  text-align: center;
`;
export default Timer;
