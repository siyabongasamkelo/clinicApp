// Container.tsx
import styled from "styled-components";

interface ContainerProps {
  children: React.ReactNode;
  padding?: string; // Optional prop to add custom spacing
}

// This is our styled "base"
const StyledContainer = styled.div`
  box-sizing: border-box;
  /* background-color: red; */
`;

const Container = ({ children, padding }: ContainerProps) => {
  return (
    <StyledContainer style={{ padding: padding || "0" }}>
      {children}
    </StyledContainer>
  );
};

export default Container;
