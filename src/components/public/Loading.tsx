import { RotatingLines } from 'react-loader-spinner';
import { styled } from 'styled-components';
export const Loading = () => {
  return (
    <LoadingSpinner>
      <RotatingLines
        strokeColor='grey'
        strokeWidth='5'
        animationDuration='0.75'
        width='96'
        visible={true}
      />
    </LoadingSpinner>
  );
};
const LoadingSpinner = styled.div`
  position: absolute;
  z-index: 100;
`;
