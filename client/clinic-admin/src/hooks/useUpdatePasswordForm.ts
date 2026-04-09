import { useFormik } from "formik";
import { updatePasswordSchema } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { notify } from "../utils/toast";
import { useParams } from "react-router-dom";

export const useUpdatePasswordForm = () => {
  const { resetPassword, setLoadingError } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const { id, token } = useParams();

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: updatePasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);
        const passwordReset = await resetPassword({
          password: values.password,
          id,
          token,
        });

        if (passwordReset?.status === "fail") {
          notify.error(passwordReset?.message);
          setLoadingError(passwordReset?.message);
          setServerError(passwordReset?.message);
        }

        if (passwordReset?.status === "success") {
          notify.success(passwordReset?.message);
          setLoadingError(null);
          setServerError(null);
        }

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
