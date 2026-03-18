import styled from "styled-components";
import { BigText } from "../../components/ui/typography/Typography";
import hero from "../login/assets/hero.png";

export const LoginMediaStyles = styled.div`
  min-height: 100vh;
  width: 45%;
  background-color: ${(props) => props.theme.colors.primary};
`;

export const LoginImage = styled.div`
  img {
    height: 600px;
    margin-left: 15%;
  }
`;
const LoginMedia = () => {
  return (
    <LoginMediaStyles>
      <BigText>
        IMPILO ADMIN <br></br>PORTAL
      </BigText>
      <LoginImage>
        <img src={hero} alt="2d iamge of patients with doctor" />
      </LoginImage>
    </LoginMediaStyles>
  );
};

export default LoginMedia;
