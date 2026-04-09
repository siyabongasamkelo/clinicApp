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
import { useForgotPasswordForm } from "../../hooks/useForgotPasswordForm";
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

const ResetPasswordForm = () => {
  const theme = useTheme(); // Access the global theme
  const { formik, serverError } = useForgotPasswordForm();

  const shouldShowEmailError =
    (formik.touched.email || formik.submitCount > 0) &&
    Boolean(formik.errors.email);

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
              <MediumText>FORGOT PASSWORD</MediumText>
            </Spacer>

            {serverError && (
              <ErrorBox width="100%" color="error" text={serverError} />
            )}

            <FormLabel>Email</FormLabel>
            <Input
              {...formik.getFieldProps("email")}
              placeholder="example@anymail.com"
            />
            {shouldShowEmailError && (
              <FormErrorLabel>{formik.errors.email}</FormErrorLabel>
            )}

            {serverError && <FormErrorLabel>{serverError}</FormErrorLabel>}
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              $isLoading={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? "Sending Reset Password Link..."
                : "Send Reset Password Link..."}
            </Button>
          </Stack>
        </Form>
      </Flex>
    </LoginFormStyles>
  );
};

export default ResetPasswordForm;
