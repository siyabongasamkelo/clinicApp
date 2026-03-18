import styled from "styled-components";

// Define the interface for your Flex props
interface FlexProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  align?: "stretch" | "center" | "flex-start" | "flex-end";
  gap?: string;
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
}

// Create the styled component with default values
export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  justify-content: ${({ justify }) => justify || "flex-start"};
  align-items: ${({ align }) => align || "stretch"};
  flex-wrap: ${({ wrap }) => wrap || "nowrap"};
  gap: ${({ gap }) => gap || "0"};
`;
