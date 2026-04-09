import { Box } from "../components/atoms/Box";
import { Button } from "../components/atoms/Button";
import { Spacer } from "../components/atoms/Spacer";
import AuthShell from "../components/AuthShell";
import { MediumText } from "../components/ui/typography/Typography";
import { useTheme } from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notify } from "../utils/toast";
import ErrorBox from "../components/atoms/ErrorBox";
import { useState } from "react";
import { Link } from "react-router-dom";

const VerifyAccountPage = () => {
  const { verifyEmail } = useAuth();
  const [isSuccessful, setIsSuccessful] = useState<any | null>(true);
  const [loading, setLoading] = useState<any | null>(false);

  const theme = useTheme();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const verifyAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailVerify = await verifyEmail({ email, token });

    if (emailVerify?.status === "success") {
      notify.success(emailVerify?.message);
      notify.success("Verification Successful");
      setIsSuccessful(true);
      setLoading(false);
    }

    if (emailVerify?.status === "fail") {
      notify.error(emailVerify?.message);
      notify.error("Verification Faild");
      setIsSuccessful(false);
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Box $w={"45%"}>
        <Spacer $mt={theme.spacing.xxl} $p="0rem">
          <MediumText>Verify Account</MediumText>
        </Spacer>
        <Spacer $mt={theme.spacing.md} $p="0rem">
          {isSuccessful && (
            <Button
              onClick={verifyAccount}
              disabled={loading}
              $isLoading={loading}
            >
              {loading
                ? "Verifying Account, please waiting..."
                : "Verify Account"}
            </Button>
          )}
        </Spacer>
        {!isSuccessful && (
          <Spacer $mt={theme.spacing.md} $p="0rem">
            <ErrorBox
              width="100%"
              color="error"
              text={
                "The was a problem verifying your account please request new email verification link"
              }
            />
          </Spacer>
        )}

        {!isSuccessful && (
          <Spacer $mt={theme.spacing.md} $p="0rem">
            <Link to={"/verify Account"}>
              <Button disabled={loading} $isLoading={loading}>
                {loading
                  ? "Verifying Account, please waiting..."
                  : "Request New Verification Link"}
              </Button>
            </Link>
          </Spacer>
        )}
      </Box>
    </AuthShell>
  );
};

export default VerifyAccountPage;
