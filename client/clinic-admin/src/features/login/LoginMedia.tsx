import styled from "styled-components";
import {
  MediumText,
  SmallText,
} from "../../components/ui/typography/Typography";
import { Spacer } from "../../components/atoms/Spacer";
import { useTheme } from "styled-components";
import { Box } from "../../components/atoms/Box";
import hero from "../login/assets/hero.png";

export const LoginMediaStyles = styled.div`
  min-height: 100vh;
  width: 50%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const LoginTypography = styled.div``;

export const ImageAndBubbles = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
`;

export const LoginImage = styled.div`
  img {
    height: 350px;
  }
`;

export const Bubbles = styled.div``;

export const BubbleA = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  height: 300px;
  width: 300px;
  border-radius: 50%;
  margin-left: -150px;
`;

export const BubbleB = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  height: 90px;
  width: 90px;
  border-radius: 50%;
  position: absolute;
  margin-top: -200px;
  margin-left: 100px;
`;

export const BubbleC = styled.div`
  background-color: rgba(255, 90, 90, 0.7);
  height: 90px;
  width: 90px;
  border-radius: 50%;
  position: absolute;
  margin-top: -400px;
  margin-left: -50px;
`;

export const BubbleD = styled.div`
  background-color: rgba(255, 90, 90, 0.8);
  height: 60px;
  width: 60px;
  border-radius: 50%;
  position: absolute;
  margin-top: -500px;
  margin-left: 100px;
`;

export const BubbleE = styled.div`
  background-color: rgba(255, 90, 90, 0.9);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  position: absolute;
  margin-top: -300px;
  margin-left: 200px;
`;

const LoginMedia = () => {
  const theme = useTheme(); // Access the global theme

  return (
    <LoginMediaStyles>
      <LoginTypography>
        <Spacer $mt={theme.spacing.xxl} $p="0rem">
          <MediumText>IMPILO ADMIN</MediumText>
        </Spacer>

        <MediumText>PORTAL</MediumText>

        <Box $w={"400px"}>
          <Spacer $mt={theme.spacing.md} $p="0rem">
            <SmallText>
              Welcome back. Your role is the heartbeat of this community. We’ve
              built the tools, but you provide the heart. Approach every task
              today with the intent to help, the courage to lead, and the love
              that turns a simple service into a transformative experience.
            </SmallText>
          </Spacer>
        </Box>
      </LoginTypography>
      <ImageAndBubbles>
        <Bubbles>
          <BubbleA />
          <BubbleB />
          <BubbleC />
          <BubbleD />
          <BubbleE />
        </Bubbles>
        <LoginImage>
          <Spacer $mt={theme.spacing.none} $p="0rem">
            <img src={hero} alt="2d iamge of patients with doctor" />
          </Spacer>
        </LoginImage>
      </ImageAndBubbles>
    </LoginMediaStyles>
  );
};

export default LoginMedia;
