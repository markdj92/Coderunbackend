import { useState } from 'react';
import styled from 'styled-components';

import ArrowIcon from '/icon/lobby/dropArrow.png';
import ArrowUpperIcon from '/icon/lobby/upperArrow.png';

import StarBox from './StarBox';

interface Props {
  options: string[];
  selected: number;
  setSelected: (obtion: number) => void;
}

const DropBox = ({ options, selected, setSelected }: Props) => {
  const [active, setActive] = useState('false');
  const [isShown, setIsShown] = useState(false);

  const handleOnClick = () => {
    setIsShown(!isShown);
    setActive('false');
  };

  const handleSelect = (option: number) => {
    setIsShown(!isShown);
    setSelected(option);
    setActive('false');
  };

  return (
    <Container>
      <ShowDropbox isshown={isShown.toString()}>
        {isShown && <Backdrop onClick={handleOnClick} />}
        <DropOpenBox>
          <DropSelectedOption onClick={() => setIsShown(!isShown)}>
            <DropBoxText>
              {selected === 0 ? '' : 'Lv.'}
              {options[selected]}
            </DropBoxText>
            <DropBoxIcon>
              <img src={ArrowUpperIcon} alt='dropbox_upper_icon' />
            </DropBoxIcon>
          </DropSelectedOption>
          {isShown &&
            Array.from({ length: 6 }).map((_, index) => (
              <DropOption
                key={index}
                onClick={() => handleSelect(index)}
                onMouseOver={() => setActive('true')}
                onMouseOut={() => setActive('false')}
              >
                <DropBoxInSection opacity={selected === index ? '1' : '0.3'}>
                  {index === 0 ? (
                    <DropBoxText>ALL</DropBoxText>
                  ) : (
                    <StarBox level={index} isOpacity={false} />
                  )}
                </DropBoxInSection>
              </DropOption>
            ))}
        </DropOpenBox>
      </ShowDropbox>
      <DropButtonBox
        onMouseOver={() => setActive('true')}
        onMouseOut={() => setActive('false')}
        onClick={handleOnClick}
        active={active}
      >
        <DropBoxText>
          {selected === 0 ? '' : 'Lv.'}
          {options[selected]}
        </DropBoxText>
        <DropBoxIcon>
          <img src={ArrowIcon} alt='dropbox_icon' />
        </DropBoxIcon>
      </DropButtonBox>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 144px;
  height: 60px;
  * {
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
`;

const DropOpenBox = styled.div`
  width: 144px;
  border-radius: 8px;
  border: 2px solid rgba(107, 217, 164, 0.2);
  background: ${(props) => props.theme.color.Black};
  box-shadow: 2px 4px 12px 0px rgba(0, 0, 0, 0.25);
  padding-bottom: 10px;
`;

const ShowDropbox = styled.div<{ isshown: string }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 15;
  opacity: ${(props) => (props.isshown === 'true' ? '1' : '0')};
`;

const DropBoxInSection = styled.div<{ opacity: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: absolute;
  opacity: ${(props) => props.opacity};
`;

const DropSelectedOption = styled.div`
  width: 100%;
  height: 56px;
  gap: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropOption = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0 10px 24px;
  &:hover div {
    opacity: 1;
  }
`;

const DropButtonBox = styled.div<{ active?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 2px solid rgba(107, 217, 164, 0.2);
  background: ${(props) => props.theme.color.Black};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const DropBoxText = styled.div`
  color: ${(props) => props.theme.color.MainKeyColor};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.44px;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: transparent;
`;

const DropBoxIcon = styled.div`
  img {
    filter: opacity(0.5) drop-shadow(0px 0px 0px white);
  }
`;

export default DropBox;
