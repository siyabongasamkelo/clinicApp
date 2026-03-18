import styled from "styled-components";

export const Input = styled.input`
  height: 50px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary};
`;
const FormInput = () => {
  return <Input></Input>;
};

export default FormInput;
