import styled from "styled-components";
import { Flex } from "../../components/atoms/Flex";
import { Input } from "../../components/atoms/Input";
import {
  FormLabel,
  FormErrorLabel,
  FormForgotPasswordLink,
  FormRegisterLink,
  Span,
  MediumText,
} from "../../components/ui/typography/Typography";
import { Stack } from "../../components/atoms/Stack";
import { Button } from "../../components/atoms/Button";
import { useLoginForm } from "../../hooks/useLoginForm";
import { Select } from "./DropDownBox";
import { Link } from "react-router-dom";
import { Spacer } from "../../components/atoms/Spacer";
import { useTheme } from "styled-components";
import ErrorBox from "../../components/atoms/ErrorBox";
import { useAuth } from "../../context/AuthContext";

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

const LoginForm = () => {
  const theme = useTheme(); // Access the global theme
  const { formik, serverError } = useLoginForm();
  const { loginErrors } = useAuth();

  console.log("loginErrors on Page:", loginErrors);

  const shouldShowStaffIdError =
    (formik.touched.staffId || formik.submitCount > 0) &&
    Boolean(formik.errors.staffId);

  const shouldShowPasswordError =
    (formik.touched.password || formik.submitCount > 0) &&
    Boolean(formik.errors.password);

  const shouldShowRoleError =
    (formik.touched.role || formik.submitCount > 0) &&
    Boolean(formik.errors.role);

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
              <MediumText>LOGIN PAGE</MediumText>
            </Spacer>

            {serverError && (
              <ErrorBox width="100%" color="error" text={serverError} />
            )}

            <FormLabel>Staff Id</FormLabel>
            <Input {...formik.getFieldProps("staffId")} placeholder="000 000" />
            {shouldShowStaffIdError && (
              <FormErrorLabel>{formik.errors.staffId}</FormErrorLabel>
            )}

            <FormLabel>Password</FormLabel>

            <Input type="password" {...formik.getFieldProps("password")} />
            {shouldShowPasswordError && (
              <FormErrorLabel>{formik.errors.password}</FormErrorLabel>
            )}

            <Flex justify="flex-end" direction="row" width="100%">
              <FormForgotPasswordLink>
                <Link to="/">Forgot password ?</Link>
              </FormForgotPasswordLink>
            </Flex>

            <FormLabel>Role</FormLabel>
            <Select {...formik.getFieldProps("role")}>
              <option value="">--Please choose an option--</option>
              <option value="DOCTOR">Doctor</option>
              <option value="NURSE">Nurse</option>
            </Select>
            {shouldShowRoleError && (
              <FormErrorLabel>{formik.errors.role}</FormErrorLabel>
            )}

            {serverError && <FormErrorLabel>{serverError}</FormErrorLabel>}
            <Button
              disabled={formik.isSubmitting} // Disable while loading
              type="submit"
              $isLoading={formik.isSubmitting} // Pass the loading state as a transient prop
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <FormRegisterLink>
              <Span color="#1E1E1E">Don't have an account ? </Span>{" "}
              <Link to="/">register now</Link>
            </FormRegisterLink>
          </Stack>
        </Form>
      </Flex>
    </LoginFormStyles>
  );
};

export default LoginForm;
