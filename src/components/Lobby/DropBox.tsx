import { useState } from 'react';
import styled from 'styled-components';

import ArrowIcon from '/icon/lobby/dropArrow.png';

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
      {isShown === true ? (
        <>
          <DropOpenBox>
            <DropSelectedOption>
              <DropBoxText>
                {selected === 0 ? '' : 'Lv.'}
                {options[selected]}
              </DropBoxText>
              <DropBoxIcon>
                <img src={ArrowIcon} alt='dropbox_icon' />
              </DropBoxIcon>
            </DropSelectedOption>
            {options.map((option, index) => (
              <DropOption
                key={index}
                onClick={() => handleSelect(index)}
                onMouseOver={() => setActive('true')}
                onMouseOut={() => setActive('false')}
              >
                <DropBoxInSection>
                  <DropBoxText>{option}</DropBoxText>
                </DropBoxInSection>
              </DropOption>
            ))}
          </DropOpenBox>
          <Backdrop onClick={handleOnClick} />
        </>
      ) : (
        <DropButtonBox
          onMouseOver={() => setActive('true')}
          onMouseOut={() => setActive('false')}
          onClick={handleOnClick}
          active={active}
        >
          <DropBoxInSection>
            <DropBoxText>
              {selected === 0 ? '' : 'Lv.'}
              {options[selected]}
            </DropBoxText>
            <DropBoxIcon>
              <img src={ArrowIcon} alt='dropbox_icon' />
            </DropBoxIcon>
          </DropBoxInSection>
        </DropButtonBox>
      )}
    </Container>
  );
};

const Container = styled.div`
  z-index: 1;
  width: 144px;
  height: 60px;
  * {
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
`;

const DropOpenBox = styled.div`
  position: relative;
  z-index: 15;
  width: 144px;
  border-radius: 8px;
  border: 2px solid rgba(180, 176, 255, 0.2);
  background: #4640c6;
  box-shadow: 2px 4px 12px 0px rgba(0, 0, 0, 0.25);
`;

const DropBoxInSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: center;
  gap: 10px;
`;

const DropSelectedOption = styled.div`
  width: 100%;
  height: 55px;
  gap: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropOption = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropButtonBox = styled.div<{ active?: string }>`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid rgba(136, 131, 255, 0.2);
  background: ${(props) => (props.active === 'true' ? '#4640C6' : 'rgba(70, 64, 198, 0.2)')};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropBoxText = styled.div`
  color: #8883ff;
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
  z-index: 3;
  background-color: transparent;
`;

const DropBoxIcon = styled.div``;

export default DropBox;
