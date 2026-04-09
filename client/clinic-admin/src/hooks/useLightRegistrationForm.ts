import { useFormik } from "formik";
import { lightRegisterSchema } from "../schemas/auth.schema";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import type { AuthError } from "../types/auth.type";

export const useLightRegisterForm = () => {
  const { register, setLoadingError } = useAuth();
  // const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: "", password: "", role: "", fullName: "" },
    validationSchema: lightRegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);

        const results = await register({
          email: values.email,
          password: values.password,
          role: values.role,
          fullName: values.fullName,
        });

        if (results?.status === "fail") {
          notify.error(results?.message);
          setLoadingError(results?.message);
          setServerError(results?.message);
        }

        if (results?.status === "success")
          notify.success(`User successfully registered!`);

        setSubmitting(false);
        // navigate("/dashboard");

        setSubmitting(false);
        // navigate("/dashboard");
      } catch (err: AuthError) {
        setServerError(err.response?.message || "Registration failed");
        notify.error(err.response?.message || "Registration failed");
      }
    },
  });

  return { formik, serverError };
};
