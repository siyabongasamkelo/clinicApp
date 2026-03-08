import { useFormik } from "formik";
import { verifyEmailRequestSchema } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../utils/toast";

export const useVerifyEmailRequestForm = () => {
  const { verifyEmailRequest } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: verifyEmailRequestSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);
        await verifyEmailRequest({ email: values.email });
        notify.success(`Email verification request successfully sent`);
        setSubmitting(false);
        // navigate("/dashboard");
      } catch (err: any) {
        setServerError(
          err.response?.data?.message || "Email verification request failed",
        );
        notify.error(
          err.response?.data?.message || "Email verification request failed",
        );
      }
    },
  });

  return { formik, serverError };
};
