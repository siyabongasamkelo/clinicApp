import styled from "styled-components";

export const Select = styled.select`
  height: 50px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.paragraph};
  width: 100%;

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;
