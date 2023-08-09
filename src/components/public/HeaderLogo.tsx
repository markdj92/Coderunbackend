import { styled } from 'styled-components';
export const HeaderLogo = () => {
  return (
    <Logo onClick={() => window.location.reload()}>
      <img className='logo' src='/images/LogoGray.svg' />
      <img className='activelogo' src='/images/LogoActive.svg' />
    </Logo>
  );
};
const Logo = styled.div`
  margin-top: 25px;
  margin-left: 80px;
  margin-right: auto;
  height: fit-content;
  .logo {
    height: 80px;
    opacity: 1;
    transition: opacity 0.5s;
    position: absolute;
  }
  .activelogo {
    opacity: 0;
    height: 80px;
    position: relative;
    transition: opacity 0.5s;
  }
  &:hover {
    .logo {
      transition: opacity 0.5s;
      opacity: 0;
    }
    .activelogo {
      height: 80px;
      transition: opacity 0.5s;
      opacity: 1;
    }
  }
`;
