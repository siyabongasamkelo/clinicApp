import styled from "styled-components";

export const Input = styled.input`
  height: 50px;
  width: 400px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.paragraph};
  color: ${(props) => props.theme.colors.paragraph};
  padding-left: ${(props) => props.theme.spacing.md};

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;
const FormInput = (props) => {
  return <Input placeholder={props.placeholder}></Input>;
};

export default FormInput;
