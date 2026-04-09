import { Box } from "../components/atoms/Box";
import { Spacer } from "../components/atoms/Spacer";
import AuthShell from "../components/AuthShell";
import { MediumText, SmallText } from "../components/ui/typography/Typography";
import { useTheme } from "styled-components";

const VerifyYourAccountPage = () => {
  const theme = useTheme();

  return (
    <AuthShell>
      <Box $w={"45%"}>
        <Spacer $mt={theme.spacing.xxl} $p="0rem">
          <MediumText>Verification Email Sent To Your Account</MediumText>
        </Spacer>
        <Spacer $mt={theme.spacing.md} $p="0rem">
          <SmallText>
            Please check your email for a verification link.
          </SmallText>
        </Spacer>
      </Box>
    </AuthShell>
  );
};

export default VerifyYourAccountPage;
