import styled from "styled-components";
import { Flex } from "../../components/atoms/Flex";
import { Input } from "../../components/atoms/Input";
import {
  FormLabel,
  FormErrorLabel,
} from "../../components/ui/typography/Typography";
import { Stack } from "../../components/atoms/Stack";
import { Button } from "../../components/atoms/Button";
import { useLoginForm } from "../../hooks/useLoginForm";
import { Select } from "./DropDownBox";

export const LoginFormStyles = styled.div`
  height: 100vh;
  width: 55%;
  background-color: ${(props) => props.theme.colors.tertiary};
`;

export const Form = styled.form`
  width: 50%;
  margin-top: 200px;
`;

const LoginForm = () => {
  const { formik, serverError } = useLoginForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit(e);
  };

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
      <Flex direction="row" align="flex-start" gap="0rem" justify="center">
        <Form>
          <Stack align={"flex-start"}>
            <FormLabel>Staff Id</FormLabel>
            <Input required {...formik.getFieldProps("staffId")} />
            {shouldShowStaffIdError && (
              <FormErrorLabel>{formik.errors.staffId}</FormErrorLabel>
            )}

            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              required
              {...formik.getFieldProps("password")}
            />
            {shouldShowPasswordError && (
              <FormErrorLabel>{formik.errors.password}</FormErrorLabel>
            )}

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
              disabled={formik.isSubmitting}
              type="button"
              onClick={() => formik.handleSubmit()}
            >
              Login
            </Button>
          </Stack>
        </Form>
      </Flex>
    </LoginFormStyles>
  );
};

export default LoginForm;
