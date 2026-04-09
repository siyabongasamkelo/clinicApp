import { Flex } from "../components/atoms/Flex";
import Container from "../components/Container";
// import LoginForm from "../features/login/LoginForm";
import LoginMedia from "../features/login/LoginMedia";
import { LoginWrapper } from "../features/login/LoginWrapper";

const AuthShell = ({ children }) => {
  return (
    <Container padding={"0"}>
      <LoginWrapper>
        <Flex
          direction="row"
          align="flex-start"
          gap="0rem"
          justify="space-between"
        >
          <LoginMedia></LoginMedia>
          {/* <LoginForm /> */}
          {children}
        </Flex>
      </LoginWrapper>
    </Container>
  );
};

export default AuthShell;
