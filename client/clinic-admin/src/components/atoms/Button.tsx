import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Button = styled.button<{ $isLoading?: boolean }>`
  height: 60px;
  width: 100%;
  color: white;
  font-size: ${(props) => props.theme.fontSizes.base};
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  transition: 0.5s ease-in-out;
  &:hover {
    box-shadow: 0 5px 15px ${(props) => props.theme.colors.primary};
  }
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: ${(props) => (props.$isLoading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$isLoading ? 0.7 : 1)};

  // If you want a CSS spinner to appear:
  &::after {
    content: "";
    display: ${(props) => (props.$isLoading ? "inline-block" : "none")};
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: ${rotate} 0.6s linear infinite;
  }
`;
