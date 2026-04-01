import styled from "styled-components";
import { appTheme } from "../../styles/Theme"; // Point this to your theme file

interface StackProps {
  $gap?: keyof typeof appTheme.spacing; // Pulls directly from your theme
  $direction?: "column" | "row";
  $align?: "flex-start" | "center" | "flex-end" | "stretch";
  $justify?: "flex-start" | "center" | "space-between";
  $fullWidth?: boolean;
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${(props) => props.$direction || "column"};
  align-items: ${(props) => props.$align || "stretch"};
  justify-content: ${(props) => props.$justify || "flex-start"};

  gap: ${(props) =>
    props.$gap ? props.theme.spacing[props.$gap] : props.theme.spacing.md};

  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
`;
