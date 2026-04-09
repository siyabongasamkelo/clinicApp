import styled from "styled-components";
import { Flex } from "../../components/atoms/Flex";
import { Input } from "../../components/atoms/Input";
import {
  FormLabel,
  FormErrorLabel,
  MediumText,
} from "../../components/ui/typography/Typography";
import { Stack } from "../../components/atoms/Stack";
import { Button } from "../../components/atoms/Button";
import { useUpdatePasswordForm } from "../../hooks/useUpdatePasswordForm";
import { Spacer } from "../../components/atoms/Spacer";
import { useTheme } from "styled-components";
import ErrorBox from "../../components/atoms/ErrorBox";

export const LoginFormStyles = styled.div`
  height: 100vh;
  width: 55%;
  background-color: ${(props) => props.theme.colors.tertiary};

  svg {
    cursor: pointer;
    transition: 0.5s ease-in-out;
    fill: ${(props) => props.theme.colors.primary};
  }
`;

export const Form = styled.form``;

const UpdatePasswordForm = () => {
  const theme = useTheme(); // Access the global theme
  const { formik, serverError } = useUpdatePasswordForm();

  const shouldShowPasswordError =
    (formik.touched.password || formik.submitCount > 0) &&
    Boolean(formik.errors.password);

  return (
    <LoginFormStyles>
      <Flex
        direction="column"
        align="center"
        gap="0rem"
        justify="center"
        height="100%"
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault(); // Extra insurance
            formik.handleSubmit(e);
          }}
        >
          <Stack $align={"flex-start"} $direction="column" $gap={"md"}>
            <Spacer $mb={theme.spacing.md} $p="0rem">
              <MediumText>UPDATE PASSWORD</MediumText>
            </Spacer>

            {serverError && (
              <ErrorBox width="100%" color="error" text={serverError} />
            )}

            <FormLabel>Password</FormLabel>
            <Input
              {...formik.getFieldProps("password")}
              placeholder="Password"
              type="password"
            />
            {shouldShowPasswordError && (
              <FormErrorLabel>{formik.errors.password}</FormErrorLabel>
            )}

            {serverError && <FormErrorLabel>{serverError}</FormErrorLabel>}
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              $isLoading={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Reseting  Password..." : "Reset Password"}
            </Button>
          </Stack>
        </Form>
      </Flex>
    </LoginFormStyles>
  );
};

export default UpdatePasswordForm;
