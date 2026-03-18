import styled from "styled-components";

export const Button = styled.button`
  height: 60px;
  width: 100%;
  color: white;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.primary};
`;
