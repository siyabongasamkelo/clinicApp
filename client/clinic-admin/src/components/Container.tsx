// Container.tsx
import styled from "styled-components";
import { Flex } from "./atoms/Flex";

interface ContainerProps {
  children: React.ReactNode;
  padding?: string; // Optional prop to add custom spacing
}

// This is our styled "base"
const StyledContainer = styled.div``;

const Container = ({ children, padding }: ContainerProps) => {
  return (
    <StyledContainer style={{ padding: padding || "0" }}>
      <Flex direction="row" align="center" gap="0rem" justify="center">
        {children}
      </Flex>
    </StyledContainer>
  );
};

export default Container;
