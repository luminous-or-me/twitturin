import styled from "styled-components";
import RouterLink from "./core/RouterLink";
import HorizontalContainer from "./containers/HorizontalContainer";
import Button from "./core/Button";
import lightTheme from "../themes/lightTheme";

const AuthButton = styled(Button)`
  &:hover {
    background-color: ${(props) => props.$fg};
    color: slategray;
  }
`;

const AuthLinks = styled(HorizontalContainer)`
  position: absolute;
  right: 1em;
`;

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #40e0d0bb, #008080bb, #708090bb);
  padding: 1em;
  margin-bottom: 0.5em;
`;

const LogoText = styled.div`
  color: ${(props) => props.theme.colors.background};
  transition: 0.3s;
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSizes.large};

  &:hover {
    text-shadow: 5px 5px 10px ${(props) => props.theme.colors.secondary};
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <RouterLink to="/">
        <LogoText>Twittur</LogoText>
      </RouterLink>

      <AuthLinks gap="1em">
        <RouterLink to="/login">
          <AuthButton $fg={lightTheme.colors.background} $bg="transparent">
            Sign in
          </AuthButton>
        </RouterLink>
        <RouterLink to="sign-up/">
          <AuthButton $fg={lightTheme.colors.background} $bg="transparent">
            Sign up
          </AuthButton>
        </RouterLink>
      </AuthLinks>
    </HeaderContainer>
  );
};

export default Header;
