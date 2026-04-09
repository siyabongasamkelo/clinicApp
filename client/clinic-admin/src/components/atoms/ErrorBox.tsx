import styled from "styled-components";
import { appTheme } from "../../styles/Theme"; // Point this to your theme file
import { Flex } from "./Flex";
import { FormErrorLabel, ServerErrors } from "../ui/typography/Typography";
import { XLg } from "react-bootstrap-icons";
import { Spacer } from "./Spacer";
import { useTheme } from "styled-components";
import { Stack } from "./Stack";
import { useAuth } from "../../context/AuthContext";

// Define the interface for your Flex props
interface ErrorBoxProps {
  color: keyof typeof appTheme.colors;
  gap?: keyof typeof appTheme.spacing;
  bg?: string;
  height?: string;
  width?: string;
  text?: string;
}

// Create the styled component with default values
export const ErrorBoxSyles = styled.div<ErrorBoxProps>`
  gap: ${(props) =>
    props.gap ? props.theme.spacing[props.gap] : props.theme.spacing.md};
  background-color: ${({ bg }) => bg || "transparent"};
  height: ${({ height }) => height || "auto"};
  width: ${({ width }) => width || "auto"};
  border: 1px solid
    ${(props) =>
      props.color ? props.theme.colors[props.color] : props.theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  label {
    text-align: left;
  }
`;

const ErrorBox = (props: ErrorBoxProps) => {
  const { setLoadingError } = useAuth();

  const removeErrors = () => {
    setLoadingError(null);
  };
  const theme = useTheme(); // Access the global theme

  return (
    <ErrorBoxSyles {...props}>
      <Spacer $mb={theme.spacing.md} $mt={theme.spacing.md} $p="0rem">
        <Flex width="90%" justify="space-between" direction="row">
          <ServerErrors>Server Errors</ServerErrors>
          <XLg onClick={removeErrors} />
        </Flex>
      </Spacer>
      <Stack $align={"flex-start"} $direction="column" $gap={"xxs"}>
        <Spacer $m={` 0 0 ${theme.spacing.sm} 5%`}>
          <FormErrorLabel>{props.text}</FormErrorLabel>
        </Spacer>
      </Stack>
    </ErrorBoxSyles>
  );
};

export default ErrorBox;
