import AuthShell from "../components/AuthShell";
import VerifyEmailRequestForm from "../features/verifyEmailRequest/VerifyEmailRequestForm";

const VerifyEmailRequestPage = () => {
  return (
    <AuthShell>
      <VerifyEmailRequestForm />
    </AuthShell>
  );
};

export default VerifyEmailRequestPage;
