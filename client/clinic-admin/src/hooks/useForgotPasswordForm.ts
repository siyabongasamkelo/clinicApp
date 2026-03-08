import { useFormik } from "formik";
import { verifyEmailRequestSchema } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../utils/toast";

export const useForgotPasswordForm = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: verifyEmailRequestSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);
        await forgotPassword({ email: values.email });
        notify.success(`Reset link sent to email.`);
        setSubmitting(false);
        // navigate("/dashboard");
      } catch (err: any) {
        setServerError(
          err.response?.data?.message || "Failed to create reset link.",
        );
        notify.error(
          err.response?.data?.message || "Failed to create reset link.",
        );
      }
    },
  });

  return { formik, serverError };
};
