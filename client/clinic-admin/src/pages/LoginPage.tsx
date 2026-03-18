import { Flex } from "../components/atoms/Flex";
import { Stack } from "../components/atoms/Stack";
import Container from "../components/Container";
import LoginForm from "../features/login/LoginForm";
import LoginMedia from "../features/login/LoginMedia";
import { LoginWrapper } from "../features/login/LoginWrapper";

const LoginPage = () => {
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
          <LoginForm>
            <Stack></Stack>
          </LoginForm>
        </Flex>
      </LoginWrapper>
    </Container>
  );
};

export default LoginPage;
